import * as React from 'react';
import Link from 'next/link';

export interface INavItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  selected: boolean;
}

export function NavItem(props: INavItemProps) {
  const selectedClasses = `${props.selected ? 'shadow-2xl ' : 'hover:'}bg-nav-hover`;

  return (
    <Link
      href={props.title === 'Run' ? '/' : `/${props.title.toLowerCase()}`}
      className={`flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 bg-nav py-5 text-primary-text hover:bg-nav-hover ${selectedClasses}`}
    >
      <props.icon color="white" className="h-6 w-6" />
      <span className="text-sm font-light opacity-70">{props.title}</span>
    </Link>
  );
}
