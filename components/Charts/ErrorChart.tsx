// components/Charts/ErrorChart.tsx
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

interface ErrorDataPoint {
  simulation: number;
  error: number;
}

interface ErrorChartProps {
  progress: number;
}

function ErrorChart({ progress }: ErrorChartProps): JSX.Element {
  const [data, setData] = useState<ErrorDataPoint[]>([]);
  const maxDataPoints = 500;
  const initialError = 100;
  const decayRate = 0.3;
  const noiseAmplitude = 4.5;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let simulation = 0;
    let currentError = initialError;

    intervalRef.current = setInterval(() => {
      simulation += 1;

      const noise = (Math.random() - 0.5) * 2 * noiseAmplitude;

      currentError = currentError - decayRate + noise;

      currentError = Math.max(currentError, 0);

      const dataPoint: ErrorDataPoint = {
        simulation,
        error: parseFloat(currentError.toFixed(2)),
      };

      setData((prevData) => {
        const newData = [...prevData, dataPoint];
        return newData.length > maxDataPoints
          ? newData.slice(-maxDataPoints)
          : newData;
      });

      if (currentError === 0) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        intervalRef.current = null;
        console.log('ErrorChart: Simulation stopped - Error reached zero.');
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [decayRate, noiseAmplitude]);

  useEffect(() => {
    if (progress >= 100 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('ErrorChart: Stopped simulation due to progress completion.');
    }
  }, [progress]);

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Error Over Simulations</h3>
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
            domain={[0, 'auto']}
            label={{
              value: 'Error',
              angle: -90,
              position: 'insideLeft',
              dx: -10,
            }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="error"
            name="Error"
            stroke="#ff7300"
            strokeWidth={2}
            isAnimationActive={false}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ErrorChart;
