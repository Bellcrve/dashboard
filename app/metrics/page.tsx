'use client';
import * as React from 'react';
import { Header } from '../../components/Header';
import { ProgressBar } from 'primereact/progressbar';
import SimulationChart from '@/components/Charts/SimulationChart';
import ErrorChart from '@/components/Charts/ErrorChart';
import AveragePriceChart from '@/components/Charts/AveragePriceChart';

export interface IMetricsPageProps {}

function MetricsPage(props: IMetricsPageProps) {
  const [simulationProgress, setSimulationProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSimulationProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + Math.random() * 2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-secondary-text h-screen w-screen overflow-scroll bg-white">
      <div className="mx-auto flex h-screen w-2/3 flex-col font-outfit text-primary-text">
        <main className="mt-24">
          <Header className="text-secondary-text" title="Metrics" />
          <div className="w-full pt-16">
            <span className="text-secondary-text text-lg font-light opacity-85">
              Simulation Progress
            </span>
            <div className="w-full py-4">
              <ProgressBar
                color="#03C03C"
                value={simulationProgress.toFixed(2)}
              ></ProgressBar>
            </div>
            <div className="mt-4">
              <SimulationChart progress={simulationProgress} />
            </div>
            <div className="mt-8">
              <ErrorChart progress={simulationProgress} />
            </div>
            <div className="mt-8">
              <AveragePriceChart progress={simulationProgress} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MetricsPage;
