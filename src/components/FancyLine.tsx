import clsx from 'clsx';
import React, { useEffect, useLayoutEffect } from 'react';
import { HTMLAttributes } from 'react';
import { IconType } from 'react-icons';

import styles from './FancyLine.module.scss';

export type FancyLineProps = HTMLAttributes<HTMLDivElement> & {
  first?: string;
  last?: string;
  buttonText: string;
  href: string;
  Icon: IconType;
};

const buttonMarginPx = 8;

export const FancyLine = ({
  first,
  last,
  buttonText,
  href,
  Icon,
  ...restOfProps
}: FancyLineProps) => {
  const firstRef = React.useRef<HTMLDivElement>(null);
  const lastRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLAnchorElement>(null);

  function updatePosition() {
    if (!buttonRef.current) {
      return;
    }
    const left =
      buttonRef.current.getBoundingClientRect().left +
      buttonRef.current.getBoundingClientRect().width +
      buttonMarginPx; // idk why +width is
    const right =
      buttonRef.current.getBoundingClientRect().right + buttonMarginPx;
    if (firstRef.current) {
      firstRef.current.style.right = `${left}px`;
    }
    if (lastRef.current) {
      lastRef.current.style.left = `${right}px`;
    }
  }

  // useLayoutEffect won't fire on the initial page load!
  useEffect(updatePosition, [
    /* run once */
  ]);

  // https://dev.to/joepurnell1/programmatically-positioning-elements-with-react-hooks-aef
  useLayoutEffect(() => {
    window.addEventListener('resize', updatePosition);
    updatePosition();
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  return (
    <div {...restOfProps} className={clsx(styles.Line, restOfProps.className)}>
      <div className={styles.IgnoreText} ref={firstRef}>
        {first}
      </div>
      <a className={styles.Button} ref={buttonRef} href={href}>
        <span className={styles.CenteredLabel}>
          <Icon /> <span className='mb-[-1px]'>{buttonText}</span>
        </span>
      </a>
      <div className={styles.IgnoreText} ref={lastRef}>
        {last}
      </div>
    </div>
  );
};
