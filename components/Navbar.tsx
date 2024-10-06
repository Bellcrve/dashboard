'use client';
import * as React from 'react';
import { TbDiamondFilled } from 'react-icons/tb';
import { NavItem } from './NavItem';
import { TbMathMaxMin } from 'react-icons/tb';
import { SiBaremetrics } from 'react-icons/si';
import { IoMdDocument, IoIosHelpCircle } from 'react-icons/io';
import { usePathname } from 'next/navigation';
export const navigation = [
  {
    icon: TbMathMaxMin,
    title: 'Run',
  },
  {
    icon: SiBaremetrics,
    title: 'Metrics',
  },
  {
    icon: IoMdDocument,
    title: 'Devlog',
  },
  {
    icon: IoIosHelpCircle,
    title: 'Help',
  },
];
export interface INavbarProps {}

export function Navbar(props: INavbarProps) {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 flex h-full w-20 flex-col bg-nav shadow-inner drop-shadow-2xl">
      <a href="/">
        <TbDiamondFilled
          color="white"
          className="mx-auto mt-8 h-9 w-9 cursor-pointer transition-all duration-300 hover:scale-110"
        />
      </a>
      <div className="my-auto flex flex-col items-center justify-center">
        {navigation.map((navItem) => (
          <NavItem
            key={navItem.title}
            icon={navItem.icon}
            title={navItem.title}
            selected={
              pathname === '/' && navItem.title === 'Run'
                ? true
                : pathname
                    .toLocaleLowerCase()
                    .includes(navItem.title.toLocaleLowerCase())
            }
          />
        ))}
      </div>
    </div>
  );
}
