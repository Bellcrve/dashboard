// pages/metrics.tsx
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
  const [simulationData, setSimulationData] = React.useState<number[]>([]);
  const [optionsTable, setOptionsTable] = React.useState<
    { strikePrice: number; callPrice: number; putPrice: number }[]
  >([]);

  const strikePrices = [95, 100, 105, 110, 115];
  const numSimulations = 1000;
  const riskFreeRate = 0.01; // Example risk-free rate
  const timeToExpiration = 1; // 1 year

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

  React.useEffect(() => {
    if (simulationProgress >= 100 && simulationData.length === 0) {
      const generateEndPrices = (
        num: number,
        mean: number,
        stdDev: number
      ): number[] => {
        const prices: number[] = [];
        for (let i = 0; i < num; i++) {
          let u = 0,
            v = 0;
          while (u === 0) u = Math.random();
          while (v === 0) v = Math.random();
          const numGenerated =
            Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
          const price = mean + numGenerated * stdDev;
          prices.push(parseFloat(price.toFixed(2)));
        }
        return prices;
      };

      const endPrices = generateEndPrices(numSimulations, 100, 10);
      setSimulationData(endPrices);
    }
  }, [simulationProgress, simulationData.length]);

  React.useEffect(() => {
    if (simulationData.length > 0 && optionsTable.length === 0) {
      const discountFactor = Math.exp(-riskFreeRate * timeToExpiration);

      const tableData = strikePrices.map((strike) => {
        // Calculate payoffs for calls and puts
        const callPayoffs = simulationData.map((price) =>
          Math.max(price - strike, 0)
        );
        const putPayoffs = simulationData.map((price) =>
          Math.max(strike - price, 0)
        );

        // Calculate average payoff
        const averageCallPayoff =
          callPayoffs.reduce((acc, curr) => acc + curr, 0) / numSimulations;
        const averagePutPayoff =
          putPayoffs.reduce((acc, curr) => acc + curr, 0) / numSimulations;

        // Discount to present value
        const callPrice = parseFloat(
          (averageCallPayoff * discountFactor).toFixed(2)
        );
        const putPrice = parseFloat(
          (averagePutPayoff * discountFactor).toFixed(2)
        );

        return { strikePrice: strike, callPrice, putPrice };
      });
      setOptionsTable(tableData);
    }
  }, [
    simulationData,
    optionsTable.length,
    strikePrices,
    numSimulations,
    riskFreeRate,
    timeToExpiration,
  ]);

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

            {simulationProgress >= 100 && optionsTable.length > 0 && (
              <div className="mt-16 flex flex-col items-center justify-center gap-6 p-8">
                <h3 className="text-secondary-text mb-4 text-center text-xl font-semibold">
                  Options Pricing Results
                </h3>
                <div className="text-secondary-text overflow-x-auto">
                  <table className="min-w-full border border-gray-200 bg-white">
                    <thead>
                      <tr>
                        <th className="border-b px-4 py-2">Strike Price</th>
                        <th className="border-b px-4 py-2">Call Price</th>
                        <th className="border-b px-4 py-2">Put Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optionsTable.map((row) => (
                        <tr key={row.strikePrice}>
                          <td className="border-b px-4 py-2 text-center">
                            {row.strikePrice}
                          </td>
                          <td className="border-b px-4 py-2 text-center">
                            {row.callPrice}
                          </td>
                          <td className="border-b px-4 py-2 text-center">
                            {row.putPrice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MetricsPage;
