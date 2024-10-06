import * as React from 'react';

export function Logo({ color }: { color: string }) {
  const classNames = `absolute left-24 top-8 text-3xl font-semibold text-primary-text drop-shadow-2xl`;
  return <h1 className={classNames}>bellcrve.</h1>;
}
