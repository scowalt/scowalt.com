import Image from 'next/image';
import * as React from 'react';

import styles from './index.module.scss';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className={styles.Page}>
          <Image
            className={styles.Avatar}
            src='/images/DSC07379-square.webp'
            width={2238}
            height={2338}
            alt='Scott Walters'
          />
        </div>
      </main>
    </Layout>
  );
}
