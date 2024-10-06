// components/Charts/AveragePriceChart.tsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

interface AveragePriceDataPoint {
  simulation: number;
  gbmAverage: number;
  blackScholesAverage: number;
}

interface AveragePriceChartProps {
  progress: number;
}

function AveragePriceChart({ progress }: AveragePriceChartProps): JSX.Element {
  const [data, setData] = useState<AveragePriceDataPoint[]>([]);
  const maxDataPoints = 500;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initialGBMAverage = 120;
  const initialBlackScholesAverage = 120;

  const targetAverage = 100;

  const convergenceRate = 0.5;

  useEffect(() => {
    let simulationStep = 0;
    let gbmAverage = initialGBMAverage;
    let blackScholesAverage = initialBlackScholesAverage;

    intervalRef.current = setInterval(() => {
      simulationStep += 1;
      const gbmFluctuation = (Math.random() * 2 - 1) * 2;
      const bsFluctuation = (Math.random() * 2 - 1) * 1.5;

      gbmAverage +=
        (targetAverage - gbmAverage) * (convergenceRate / 100) + gbmFluctuation;

      blackScholesAverage +=
        (targetAverage - blackScholesAverage) * (convergenceRate / 100) +
        bsFluctuation;

      const dataPoint: AveragePriceDataPoint = {
        simulation: simulationStep,
        gbmAverage: parseFloat(gbmAverage.toFixed(2)),
        blackScholesAverage: parseFloat(blackScholesAverage.toFixed(2)),
      };

      // Update chart data
      setData((prevData) => {
        const newData = [...prevData, dataPoint];
        return newData.length > maxDataPoints
          ? newData.slice(-maxDataPoints)
          : newData;
      });

      // Stop simulation if max data points reached
      if (simulationStep >= maxDataPoints) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        intervalRef.current = null;
        console.log(
          'AveragePriceChart: Simulation stopped after reaching max data points.'
        );
      }
    }, 100); // Update every 100 ms

    return () => {
      // Cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    initialGBMAverage,
    initialBlackScholesAverage,
    convergenceRate,
    maxDataPoints,
  ]);

  // Monitor progress and stop simulation when progress >= 100%
  useEffect(() => {
    if (progress >= 100 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log(
        'AveragePriceChart: Stopped simulation due to progress completion.'
      );
    }
  }, [progress]);

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>
        Average Price Prediction: GBM vs Black-Scholes
      </h3>
      <ResponsiveContainer width="100%" height={430}>
        <LineChart data={data}>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
          <XAxis
            dataKey="simulation"
            label={{
              value: 'Number of Simulations (N)',
              position: 'insideBottom',
              dy: 10,
            }}
          />
          <YAxis
            domain={['auto', 'auto']}
            label={{
              value: 'Average Price',
              angle: -90,
              position: 'insideLeft',
              dx: -10,
            }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="gbmAverage"
            name="GBM Average"
            stroke="#8884d8"
            strokeWidth={2}
            isAnimationActive={false}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="blackScholesAverage"
            name="Black-Scholes Average"
            stroke="#82ca9d"
            strokeWidth={2}
            isAnimationActive={false}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AveragePriceChart;
