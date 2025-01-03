// pages/index.tsx
'use client';
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { InputText } from 'primereact/inputtext';
import { StockData, IStockDataProps } from '@/components/StockData';
import {
  TimeIntervalSelection,
  timeIntervals,
} from '@/components/TimeIntervalSelection';
import { ExpirationSelection } from '@/components/ExpirationSelection';
import { StrikePriceSelection } from '@/components/StrikePriceSelection';
import { SimulationsSelection } from '@/components/SimulationSelection';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '../context/WebSocketContext';

export default function Home() {
  const router = useRouter();
  const { connect, send, isConnected } = useWebSocket();
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState<IStockDataProps>({
    data: {
      ticker: '',
      stockPrice: 0,
      name: '',
      currencyName: '',
      marketCap: 0,
      homepageUrl: '',
    },
  });
  const [timeInterval, setTimeInterval] = useState(1);
  const [expirationTime, setExpirationTime] = useState(0);
  const [strikePriceMax, setStrikePriceMax] = useState(0);
  const [simulations, setSimulations] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);

  //   const searchStock = async () => {
  //     const fetchURL = `https://142.93.55.103:8000/stocks/search?stock_symbol=${ticker}`;

  //     try {
  //       const response = await fetch(fetchURL);
  //       const data = await response.json();
  //       setStockData({
  //         data: {
  //           ...data,
  //           currencyName: data.currency_name,
  //           marketCap: data.market_cap,
  //           homepageUrl: data.homepage_url,
  //           stockPrice: data.price,
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error fetching stock data:', error);
  //     }
  //   };

  /** TEMP */
  interface StockMetadata {
    ticker: string;
    name: string;
    currency_name: string;
    market_cap: number;
    homepage_url: string;
    price: number;
  }

  const searchStock = async (): Promise<void> => {
    try {
      const stockMetadata = await fetchStockMetadata(ticker);

      if (stockMetadata) {
        const stockData: IStockDataProps = {
          data: {
            ...stockMetadata,
            currencyName: stockMetadata.currency_name,
            marketCap: stockMetadata.market_cap,
            homepageUrl: stockMetadata.homepage_url,
            stockPrice: stockMetadata.price,
          },
        };
        setStockData(stockData);
      } else {
        console.error('Error: No stock data returned');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  async function fetchStockMetadata(
    symbol: string
  ): Promise<StockMetadata | null> {
    const POLYGON_API_KEY = 'PPaigrFpVE8lYznpPC7MipDn89Lt90Rz';

    // Function to adjust the date to the last available weekday
    function getLastWorkingDate(date: Date): Date {
      let day = date.getDay();
      if (day === 0) {
        // Sunday, go back to Friday
        date.setDate(date.getDate() - 3);
      } else if (day === 6) {
        // Saturday, go back to Friday
        date.setDate(date.getDate() - 2);
      }
      return date;
    }

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 3);
    const lastWorkingDate = getLastWorkingDate(yesterdayDate);
    const formattedDate = lastWorkingDate.toISOString().split('T')[0];

    const apiUrl = `https://api.polygon.io/v3/reference/tickers/${symbol}`;
    const tickerPriceUrl = `https://api.polygon.io/v1/open-close/${symbol}/${formattedDate}`;

    const params = {
      apiKey: POLYGON_API_KEY,
    };

    try {
      const [response, priceResponse] = await Promise.all([
        fetch(`${apiUrl}?apiKey=${params.apiKey}`),
        fetch(`${tickerPriceUrl}?apiKey=${params.apiKey}`),
      ]);

      if (response.ok && priceResponse.ok) {
        const data = await response.json();
        const priceData = await priceResponse.json();

        const filterData = [
          'ticker',
          'name',
          'currency_name',
          'market_cap',
          'homepage_url',
        ];
        const metadata = filterData.reduce(
          (obj: Partial<StockMetadata>, key: string) => {
            if (data.results && data.results[key]) {
              obj[key as keyof StockMetadata] = data.results[key];
            }
            return obj;
          },
          {} as StockMetadata
        );

        metadata.price = priceData.close;
        return metadata as StockMetadata;
      } else {
        console.error('Error fetching data:', await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }

  /** TEMP END */

  const calculateStrikePrices = (
    _stockPrice: number,
    _strikePriceMax: number
  ) => {
    const delta = (_strikePriceMax - _stockPrice) / 5;

    const strikePrices = [
      _stockPrice - 2 * delta,
      _stockPrice - delta,
      _stockPrice,
      _stockPrice + delta,
      _stockPrice + 2 * delta,
    ];

    return strikePrices;
  };

  const handleSimulate = async () => {
    if (simulations <= 0) {
      console.error('Number of simulations must be greater than 0');
      return;
    }

    const simulationData = {
      ticker,
      time_interval: timeIntervals[timeInterval - 1].actualValue,
      expiration_time: expirationTime,
      strike_price: calculateStrikePrices(
        stockData.data.stockPrice,
        strikePriceMax
      ),
      simulations,
    };

    console.log('Preparing to send simulation data:', simulationData);

    setIsConnecting(true);

    try {
      // await connect('wss://142.93.55.103:8000/ws/simulate');
      // console.log('WebSocket connection established');

      // send(simulationData);
      // console.log('Simulation data sent');

      router.push(`/metrics`);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setIsConnecting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-primary">
      <div className="mx-auto mt-12 h-screen w-2/3 font-outfit text-primary-text">
        <main className="-mr-24 flex h-3/4 flex-col justify-between pt-24">
          <Header title="Run Simulations" />
          <div className="flex w-full flex-row items-start justify-between gap-12">
            <div className="flex h-full w-full flex-col items-start justify-between gap-6">
              <div className="flex w-full flex-col items-start gap-2">
                <span className="text-md font-light opacity-85">
                  Stock Ticker
                </span>
                <div className="flex w-full flex-row items-center justify-between gap-3">
                  <InputText
                    className="grow rounded px-4 py-3 text-xl text-secondary-text outline-none"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  />
                  <button
                    onClick={searchStock}
                    className="flex h-full items-center justify-center rounded bg-white px-3 font-medium text-secondary-text"
                  >
                    Search
                  </button>
                </div>
              </div>
              {stockData.data.marketCap > 0 && (
                <StockData data={stockData.data} />
              )}
            </div>
            <div className="flex w-full flex-col justify-center gap-6">
              <TimeIntervalSelection
                timeInterval={timeInterval}
                setTimeInterval={setTimeInterval}
              />
              <div className="flex flex-row items-center justify-between gap-4">
                <ExpirationSelection
                  expirationTime={expirationTime}
                  setExpirationTime={setExpirationTime}
                />
                <StrikePriceSelection
                  strikePriceMax={strikePriceMax}
                  setStrikePriceMax={setStrikePriceMax}
                />
              </div>
              <SimulationsSelection
                simulations={simulations}
                setSimulations={setSimulations}
              />
              <button
                className="ml-auto mt-6 flex flex-row items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xl font-semibold text-primary-text transition-all duration-500 hover:opacity-60 disabled:opacity-30"
                disabled={simulations <= 0 || isConnecting}
                onClick={handleSimulate}
              >
                <span>{isConnecting ? 'Connecting...' : 'Simulate!'}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
