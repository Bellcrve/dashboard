// pages/devlog.tsx
'use client';
import * as React from 'react';
import { Header } from '../../components/Header';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown-light.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export interface IDevlogPageProps {}

function DevlogPage(props: IDevlogPageProps) {
  const [markdownData, setMarkdownData] = React.useState('Loading...');

  React.useEffect(() => {
    const getMarkdownFileData = async () => {
      try {
        const response = await fetch('/devlog.md');
        if (!response.ok) {
          throw new Error('Failed to fetch markdown file.');
        }
        const data = await response.text();
        setMarkdownData(data);
      } catch (error) {
        console.error(error);
        setMarkdownData('Failed to load developer logs.');
      }
    };

    getMarkdownFileData();
  }, []);

  return (
    <div className="text-secondary-text mx-auto h-screen w-2/3 font-outfit text-lg">
      <main className="mt-24">
        <Header title="Developer Logs" />
        <div className="markdown-body py-24">
          <ReactMarkdown
            children={markdownData}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </div>
      </main>
    </div>
  );
}

export default DevlogPage;
