import * as React from 'react';
import { Header } from '../../components/Header';

export interface IHelpPageProps {}

function HelpPage(props: IHelpPageProps) {
  return (
    <div className="mx-auto h-screen w-2/3 font-outfit text-primary-text">
      <main className="mt-24">
        <Header title="Get Support" />
      </main>
    </div>
  );
}
export default HelpPage;
