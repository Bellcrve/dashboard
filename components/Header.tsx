import * as React from 'react';

export interface IHeaderProps {
  title: string;
  className?: string;
}

export function Header(props: IHeaderProps) {
  return (
    <h1 className={`${props.className} text-5xl font-semibold`}>
      {props.title}
    </h1>
  );
}
