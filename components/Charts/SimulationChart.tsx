// components/Charts/SimulationChart.tsx
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
} from 'recharts';

interface CombinedDataPoint {
  step: number;
  [simulationId: string]: number;
}

interface SimulationChartProps {
  progress: number;
}

function SimulationChart({ progress }: SimulationChartProps): JSX.Element {
  const [data, setData] = useState<CombinedDataPoint[]>([]);
  const numSimulations = 100;
  const simulationIds = useRef<string[]>([]);
  const startingPrice = 100;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    simulationIds.current = Array.from(
      { length: numSimulations },
      (_, i) => `sim${i + 1}`
    );
  }, [numSimulations]);

  useEffect(() => {
    let currentStep = 0;
    const lastPrices: { [simulationId: string]: number } = {};

    simulationIds.current.forEach((simulationId) => {
      lastPrices[simulationId] = startingPrice;
    });

    intervalRef.current = setInterval(() => {
      currentStep += 1;

      const dataPoint: CombinedDataPoint = { step: currentStep };

      simulationIds.current.forEach((simulationId) => {
        const lastPrice = lastPrices[simulationId];

        const volatility = 0.02;
        const drift = 0.0005;
        const randomShock = volatility * lastPrice * (Math.random() * 2 - 1);
        const nextPrice = lastPrice + drift * lastPrice + randomShock;

        lastPrices[simulationId] = nextPrice;

        dataPoint[simulationId] = parseFloat(nextPrice.toFixed(2));
      });

      setData((prevData) => {
        const newData = [...prevData, dataPoint];
        return newData.length > 500 ? newData.slice(-500) : newData;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startingPrice]);

  useEffect(() => {
    if (progress >= 100 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log(
        'SimulationChart: Stopped simulation due to progress completion.'
      );
    }
  }, [progress]);

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>
        Monte Carlo Simulation ({numSimulations} paths)
      </h3>
      <ResponsiveContainer width="100%" height={430}>
        <LineChart data={data}>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
          <XAxis
            dataKey="step"
            label={{ value: 'Time Step', position: 'insideBottom', dy: 10 }}
          />
          <YAxis
            domain={['auto', 'auto']}
            label={{
              value: 'Price',
              angle: -90,
              position: 'insideLeft',
              dx: -12,
            }}
          />
          <Tooltip />
          {simulationIds.current.map((simulationId, index) => (
            <Line
              key={simulationId}
              type="monotone"
              dataKey={simulationId}
              stroke={`hsl(${(index * 360) / numSimulations}, 70%, 50%)`}
              strokeWidth={1}
              isAnimationActive={false}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SimulationChart;
