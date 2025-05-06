import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import * as React from 'react';
import {
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPen,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

import styles from './index.module.scss';

import { usePageVisibility } from '@/hooks/usePageVisibility';

import type { FancyLineProps } from '@/components/FancyLine';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const lines: Omit<FancyLineProps, 'onReady'>[] = [
  {
    first: 'See',
    buttonText: 'LinkedIn',
    last: 'for my resume.',
    href: 'https://www.linkedin.com/in/scowalt/',
    Icon: FaLinkedin,
  },
  {
    first: 'I code side projects at',
    href: 'https://github.com/scowalt',
    buttonText: 'Github',
    Icon: FaGithub,
  },
  {
    first: 'and use my',
    href: 'https://devblog.scowalt.com/',
    buttonText: 'Dev Blog',
    last: 'to write about them.',
    Icon: FaPen,
  },
  {
    first: 'I post music on',
    buttonText: 'YouTube',
    Icon: FaYoutube,
    last: ',',
    href: 'https://www.youtube.com/channel/UCPnjpoktsIYahNqnTAVPagA',
  },
  {
    first: 'occasional thoughts on',
    href: 'https://twitter.com/scowalt',
    buttonText: 'Twitter',
    last: ',',
    Icon: FaTwitter,
  },
  // {
  //   first: '(and now ',
  //   href: 'https://www.threads.net/@scowalt',
  //   buttonText: 'Threads',
  //   last: '),',
  //   Icon: FaAt,
  // },
  {
    first: 'and pictures of food on',
    href: 'https://www.instagram.com/scowalt/',
    buttonText: 'Instagram',
    last: '.',
    Icon: FaInstagram,
  },
  {
    first: "It's best to use",
    href: 'mailto:me@scowalt.com',
    buttonText: 'Email',
    last: 'to contact me.',
    Icon: FaEnvelope,
  },
];

// Use next/dynamic to load FancyLine component dynamically
const FancyLine = dynamic(
  () => import('@/components/FancyLine').then((mod) => mod.FancyLine),
  { ssr: false, loading: () => <div className='h-6' /> }, // TODO this height could change!
);

export default function HomePage() {
  const [readyCount, setReadyCount] = React.useState(0);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const isPageVisible = usePageVisibility();
  const [isReady, setIsReady] = React.useState(false);

  // once the page is ready, it should never be unready
  React.useEffect(() => {
    if (
      !isReady &&
      imageLoaded &&
      readyCount === lines.length &&
      isPageVisible
    ) {
      setIsReady(true);
    }
  }, [imageLoaded, readyCount, isPageVisible, isReady]);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main className={clsx(styles.Page)}>
        <Image
          className={clsx(
            styles.Avatar,
            isReady ? styles['fade-in'] : '!opacity-0',
          )}
          src='/images/me-2.png'
          width={2238}
          height={2338}
          alt='Scott Walters'
          onLoadingComplete={() => setImageLoaded(true)}
        />
        <h3 className={styles.H3}>Scott Walters</h3>
        <div className={styles.SubTitle}>
          Software Engineer from the Greater Chicago Area
        </div>
        <hr className={styles.Line} />
        <div
          className={clsx(
            styles.LineContainer,
            isReady ? styles['fade-in'] : '!opacity-0',
          )}
        >
          {lines.map((line, index) => (
            <FancyLine
              className='mx-auto text-white'
              key={`button-row-${index}`}
              onReady={() => {
                setReadyCount((count) => count + 1);
              }}
              {...line}
            />
          ))}
        </div>
      </main>
    </Layout>
  );
}
