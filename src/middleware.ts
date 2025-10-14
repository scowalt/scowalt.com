import { defineMiddleware } from 'astro/middleware';

const ensureUnsafeInline = (headerValue: string | null): string => {
  if (!headerValue) {
    return "script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
  }

  const directiveMap = new Map<string, string[]>();

  for (const rawDirective of headerValue.split(';')) {
    const directive = rawDirective.trim();
    if (!directive) continue;

    const [name, ...values] = directive.split(/\s+/);
    if (name) {
      directiveMap.set(name.toLowerCase(), values);
    }
  }

  const updateDirective = (name: string) => {
    const key = name.toLowerCase();
    const existing = directiveMap.get(key) ?? [];
    if (!existing.length) {
      existing.push("'self'");
    }
    if (!existing.includes("'self'")) {
      existing.unshift("'self'");
    }
    if (!existing.includes("'unsafe-inline'")) {
      existing.push("'unsafe-inline'");
    }
    directiveMap.set(key, existing);
  };

  updateDirective('script-src');
  updateDirective('style-src');

  const serialized = Array.from(directiveMap.entries())
    .map(([name, values]) => `${name} ${values.join(' ')}`.trim())
    .filter(Boolean)
    .join('; ');

  return serialized.endsWith(';') ? serialized : `${serialized};`;
};

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();

  if (!import.meta.env.DEV) {
    return response;
  }

  const current = response.headers.get('Content-Security-Policy');
  response.headers.set('Content-Security-Policy', ensureUnsafeInline(current));
  return response;
});
