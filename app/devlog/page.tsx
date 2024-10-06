'use client';
import * as React from 'react';
import { Header } from '../../components/Header';
import Markdown from 'markdown-to-jsx';
import 'github-markdown-css/github-markdown-light.css';

export interface IDevlogPageProps {}

function DevlogPage(props: IDevlogPageProps) {
  const [markdownData, setMarkdownData] = React.useState('Loading...');

  React.useEffect(() => {
    const getMarkdownFileData = async () => {
      const response = await fetch('/logs/devlog.md');
      const data = await response.text();
      setMarkdownData(data);
    };

    getMarkdownFileData();
  }, []);

  return (
    <div className="text-secondary-text mx-auto h-screen w-2/3 font-outfit text-lg">
      <main className="mt-24">
        <Header title="Developer Logs" />
        <div className="markdown-body py-24">
          <Markdown>{markdownData}</Markdown>
        </div>
      </main>
    </div>
  );
}
export default DevlogPage;
