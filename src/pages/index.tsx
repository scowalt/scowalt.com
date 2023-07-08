import clsx from 'clsx';
import Image from 'next/image';
import * as React from 'react';
import {
  FaAt,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaPen,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

import styles from './index.module.scss';

import { FancyLine, FancyLineProps } from '@/components/FancyLine';
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
    last: '.',
    href: 'https://www.youtube.com/channel/UCPnjpoktsIYahNqnTAVPagA',
  },
  {
    first: 'I infrequently use',
    href: 'https://twitter.com/scowalt',
    buttonText: 'Twitter',
    last: ',',
    Icon: FaTwitter,
  },
  {
    first: '(and now ',
    href: 'https://www.threads.net/@scowalt',
    buttonText: 'Threads',
    last: '),',
    Icon: FaAt,
  },
  {
    first: "but it's better to use",
    href: 'mailto:me@scowalt.com',
    buttonText: 'Email',
    last: 'to contact me.',
    Icon: FaEnvelope,
  },
];

export default function HomePage() {
  const [readyCount, setReadyCount] = React.useState(0);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const isReady = imageLoaded && readyCount === lines.length;

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main className={clsx(styles.Page)}>
        <Image
          className={clsx(styles.Avatar, !isReady && '!opacity-0')}
          src='/images/DSC07379-square.webp'
          width={2238}
          height={2338}
          alt='Scott Walters'
          onLoadingComplete={() => setImageLoaded(true)}
        />
        <h3 className={styles.H3}>Scott Walters</h3>
        <div className={styles.SubTitle}>
          Software Engineer from the Greater Seattle Area
        </div>
        <hr className={styles.Line} />
        <div className={clsx(styles.LineContainer, !isReady && '!opacity-0')}>
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
