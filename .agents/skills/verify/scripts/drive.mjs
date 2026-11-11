#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  encoding: 'utf8',
}).trim();
const stateDir = path.join(root, 'tmp', 'verify');

const viewports = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 390, height: 844 },
};

const readServerUrl = async () => {
  const env = await readFile(path.join(stateDir, 'server.env'), 'utf8').catch(
    () => ''
  );
  const match = env.match(/^URL=(.+)$/m);
  if (!match) {
    throw new Error(
      'No running instance: run launch.sh first or pass --url <base url>.'
    );
  }
  return match[1];
};

const readHomeLinks = async () => {
  const source = await readFile(
    path.join(root, 'src', 'pages', 'index.astro'),
    'utf8'
  );
  const blocks = source.match(/\{\s*first:[\s\S]*?\}/g) ?? [];
  return blocks.map((block) => ({
    href: block.match(/href:\s*['"](.+?)['"]/)?.[1],
    text: block.match(/buttonText:\s*['"](.+?)['"]/)?.[1],
    icon: /iconName:/.test(block),
  }));
};

const readProjects = async () => {
  const dir = path.join(root, 'src', 'content', 'projects');
  const files = (await readdir(dir)).filter((file) => file.endsWith('.mdx'));
  const projects = await Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(dir, file), 'utf8');
      const field = (name) =>
        source.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1].trim();
      return {
        slug: file.replace(/\.mdx$/, ''),
        title: field('title'),
        order: Number(field('order')),
        url: field('url'),
        repo: field('repo'),
      };
    })
  );
  return projects.sort((a, b) => a.order - b.order);
};

const imageLoaded = (locator) =>
  locator.evaluate((img) => img.complete && img.naturalWidth > 0);

const journeys = {
  async home({ page, check, shot, goto }) {
    const links = await readHomeLinks();
    check('home links parsed from src/pages/index.astro', links.length > 0, {
      count: links.length,
    });

    const response = await goto('/');
    check('GET / is 200', response?.status() === 200, response?.status());
    check(
      'title',
      (await page.title()) === 'Scott Walters',
      await page.title()
    );
    const heading = page.getByRole('heading', { level: 1 });
    check(
      'h1 names Scott Walters',
      (await heading.textContent())?.trim() === 'Scott Walters'
    );
    check(
      'portrait image loaded',
      await imageLoaded(page.getByRole('img', { name: 'Scott Walters' }))
    );

    for (const link of links) {
      const anchor = page.getByRole('link', { name: link.text, exact: true });
      const count = await anchor.count();
      check(`link "${link.text}" present once`, count === 1, count);
      if (count !== 1) continue;
      check(
        `link "${link.text}" href`,
        (await anchor.getAttribute('href')) === link.href,
        await anchor.getAttribute('href')
      );
      if (link.href.startsWith('http')) {
        check(
          `external link "${link.text}" opens a new tab safely`,
          (await anchor.getAttribute('target')) === '_blank' &&
            (await anchor.getAttribute('rel'))?.includes('noopener')
        );
      }
      if (link.icon) {
        check(
          `link "${link.text}" renders its icon`,
          (await anchor.locator('svg').count()) === 1
        );
      }
    }
    await shot('home');

    await page
      .getByRole('link', { name: 'Working With Me', exact: true })
      .click();
    await page.waitForURL('**/working-with-me');
    check(
      'Working With Me link lands on the page',
      (await page.getByRole('heading', { level: 1 }).textContent())?.includes(
        'Working with Me'
      )
    );
    await page.goBack();
    await page.waitForURL((url) => url.pathname === '/');
    await page.getByRole('link', { name: 'Projects', exact: true }).click();
    await page.waitForURL('**/projects');
    check(
      'Projects link lands on the index',
      (await page.getByRole('heading', { level: 1 }).textContent())?.trim() ===
        'Projects'
    );
    await shot('home-to-projects');
  },

  async projects({ page, check, shot, goto }) {
    const projects = await readProjects();
    const response = await goto('/projects');
    check(
      'GET /projects is 200',
      response?.status() === 200,
      response?.status()
    );
    const cards = page.locator('main a[href^="/projects/"]');
    const titles = await cards.locator('h2').allTextContents();
    check(
      'cards listed in frontmatter order',
      JSON.stringify(titles.map((t) => t.trim())) ===
        JSON.stringify(projects.map((p) => p.title)),
      { shown: titles, expected: projects.map((p) => p.title) }
    );
    for (const project of projects) {
      check(
        `card image for ${project.slug} loaded`,
        await imageLoaded(
          page.getByRole('img', { name: `Screenshot of ${project.title}` })
        )
      );
    }
    await shot('projects');

    const first = projects[0];
    await cards.filter({ hasText: first.title }).click();
    await page.waitForURL(`**/projects/${first.slug}`);
    check(
      `clicking the ${first.slug} card opens its page`,
      (await page.getByRole('heading', { level: 1 }).textContent())?.trim() ===
        first.title
    );
    await shot(`card-to-${first.slug}`);
    await page.getByRole('link', { name: '← Back to Projects' }).click();
    await page.waitForURL('**/projects');
    check(
      'Back to Projects returns to the index',
      (await cards.count()) === projects.length
    );
  },

  async 'project-detail'({ page, check, shot, goto }) {
    for (const project of await readProjects()) {
      const response = await goto(`/projects/${project.slug}`);
      check(
        `GET /projects/${project.slug} is 200`,
        response?.status() === 200,
        response?.status()
      );
      check(
        `${project.slug} h1`,
        (
          await page.getByRole('heading', { level: 1 }).textContent()
        )?.trim() === project.title
      );
      check(
        `${project.slug} screenshot loaded`,
        await imageLoaded(
          page.getByRole('img', { name: `Screenshot of ${project.title}` })
        )
      );
      if (project.url) {
        const titleLink = page.getByRole('link', {
          name: project.title,
          exact: true,
        });
        check(
          `${project.slug} title links to ${project.url} in a new tab`,
          (await titleLink.getAttribute('href')) === project.url &&
            (await titleLink.getAttribute('target')) === '_blank'
        );
      }
      if (project.repo) {
        check(
          `${project.slug} Source Code link`,
          (await page
            .getByRole('link', { name: 'Source Code →' })
            .getAttribute('href')) === project.repo
        );
      }
      check(
        `${project.slug} renders MDX body`,
        (await page.locator('.prose h2').count()) > 0
      );
      await shot(`project-${project.slug}`);
    }

    const missing = await goto('/projects/does-not-exist', { missing: true });
    check(
      'unknown project slug serves the 404 page with status 404 in place',
      new URL(page.url()).pathname === '/projects/does-not-exist' &&
        missing?.status() === 404 &&
        (
          await page.getByRole('heading', { level: 1 }).textContent()
        )?.trim() === '404',
      { url: page.url(), status: missing?.status() }
    );
    await shot('unknown-slug');
  },

  async 'working-with-me'({ page, check, shot, goto }) {
    const response = await goto('/working-with-me');
    check(
      'GET /working-with-me is 200',
      response?.status() === 200,
      response?.status()
    );
    check(
      'title',
      (await page.title()) === 'Working with Me - Scott Walters',
      await page.title()
    );
    const anchors = page.locator('.prose a.header-anchor');
    const anchorCount = await anchors.count();
    const headingCount = await page
      .locator('.prose :is(h1,h2,h3,h4,h5,h6)')
      .count();
    check('every heading has a section link', anchorCount === headingCount, {
      anchorCount,
      headingCount,
    });
    const target = await anchors.nth(1).getAttribute('href');
    await anchors.nth(1).click();
    await page.waitForURL(`**${target}`);
    check(
      'clicking a section link updates the URL hash',
      new URL(page.url()).hash === target,
      page.url()
    );
    const footnoteRefs = page.locator('a[data-footnote-ref]');
    const refCount = await footnoteRefs.count();
    check('footnote references render', refCount > 0, refCount);
    if (refCount > 0) {
      const href = await footnoteRefs.first().getAttribute('href');
      check(
        'first footnote target exists',
        (await page.locator(`[id="${href?.slice(1)}"]`).count()) === 1,
        href
      );
    }
    await shot('working-with-me');
    await page.getByRole('link', { name: '← Home' }).click();
    await page.waitForURL((url) => url.pathname === '/');
    check(
      '← Home returns to the landing page',
      (await page.getByRole('heading', { level: 1 }).textContent())?.trim() ===
        'Scott Walters'
    );
  },

  async 'not-found'({ page, check, shot, goto }) {
    const response = await goto('/definitely-not-a-page', { missing: true });
    check(
      'unknown path returns 404',
      response?.status() === 404,
      response?.status()
    );
    check(
      '404 page renders',
      (await page.getByRole('heading', { level: 1 }).textContent())?.trim() ===
        '404'
    );
    await shot('not-found');
    await page.getByRole('link', { name: 'Back to the homepage' }).click();
    await page.waitForURL((url) => url.pathname === '/');
    check(
      'Back to the homepage returns to /',
      (await page.getByRole('heading', { level: 1 }).textContent())?.trim() ===
        'Scott Walters'
    );
  },
};

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    url: { type: 'string' },
    viewport: { type: 'string', default: 'desktop' },
    list: { type: 'boolean', default: false },
  },
});

if (values.list) {
  console.log(Object.keys(journeys).join('\n'));
  process.exit(0);
}

const selected = positionals.length ? positionals : Object.keys(journeys);
const unknown = selected.filter((name) => !(name in journeys));
if (unknown.length || !(values.viewport in viewports)) {
  console.error(
    `unknown journey or viewport: ${[...unknown, values.viewport].join(', ')}\n` +
      `journeys: ${Object.keys(journeys).join(', ')}; viewports: ${Object.keys(viewports).join(', ')}`
  );
  process.exit(2);
}

const baseUrl = (values.url ?? (await readServerUrl())).replace(/\/$/, '');
const runDir = path.join(
  stateDir,
  'runs',
  `${new Date().toISOString().replace(/[:.]/g, '-')}-${values.viewport}`
);
await mkdir(runDir, { recursive: true });

const browser = await chromium.launch();
const report = { baseUrl, viewport: values.viewport, runDir, journeys: [] };

for (const name of selected) {
  const context = await browser.newContext({
    viewport: viewports[values.viewport],
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  const result = {
    name,
    checks: [],
    screenshots: [],
    consoleErrors: [],
    pageErrors: [],
    failedResponses: [],
  };
  const expected404 = new Set();

  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      !expected404.has(message.location().url)
    ) {
      result.consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => result.pageErrors.push(String(error)));
  page.on('response', (response) => {
    if (response.status() >= 400 && !expected404.has(response.url())) {
      result.failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  const check = (label, ok, detail) =>
    result.checks.push({ label, ok: Boolean(ok), detail });
  const goto = async (pathname, { missing = false } = {}) => {
    if (missing) {
      expected404.add(`${baseUrl}${pathname}`);
    }
    return page.goto(`${baseUrl}${pathname}`, { waitUntil: 'load' });
  };
  const shot = async (label) => {
    const file = path.join(
      runDir,
      `${name}-${String(result.screenshots.length + 1).padStart(2, '0')}-${label}.png`
    );
    await page.screenshot({ path: file, fullPage: true });
    result.screenshots.push(path.relative(root, file));
  };

  try {
    await journeys[name]({ page, check, shot, goto });
  } catch (error) {
    check('journey completed without throwing', false, String(error));
    await shot('error').catch(() => {});
  }
  check(
    'no console errors',
    result.consoleErrors.length === 0,
    result.consoleErrors
  );
  check(
    'no uncaught page errors',
    result.pageErrors.length === 0,
    result.pageErrors
  );
  check(
    'no unexpected 4xx/5xx responses',
    result.failedResponses.length === 0,
    result.failedResponses
  );
  result.ok = result.checks.every((c) => c.ok);
  report.journeys.push(result);
  await context.close();
}

await browser.close();
report.ok = report.journeys.every((journey) => journey.ok);
await writeFile(
  path.join(runDir, 'report.json'),
  JSON.stringify(report, null, 2)
);

for (const journey of report.journeys) {
  console.log(`${journey.ok ? 'PASS' : 'FAIL'} ${journey.name}`);
  for (const c of journey.checks.filter((c) => !c.ok)) {
    console.log(`  x ${c.label}: ${JSON.stringify(c.detail)}`);
  }
}
console.log(`evidence: ${path.relative(root, runDir)}/`);
process.exit(report.ok ? 0 : 1);
