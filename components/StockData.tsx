import * as React from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { FiCopy } from 'react-icons/fi';

export interface IStockDataProps {
  data: {
    ticker: string;
    stockPrice: number;
    name: string;
    currencyName: string;
    marketCap: number;
    homepageUrl: string;
  };
}

const formatMarketCap = (marketCap: number): string => {
  let formattedMarketCap;

  if (marketCap >= 1e12) {
    formattedMarketCap = `${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    formattedMarketCap = `${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    formattedMarketCap = `${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    formattedMarketCap = (Math.round(marketCap * 100) / 100).toFixed(2);
  }

  return formattedMarketCap;
};

export function StockData({ data }: IStockDataProps) {
  return (
    <div className="text-secondary-text flex w-full flex-col items-start justify-between gap-2 bg-white px-10 py-8">
      <div className="flex w-full flex-row items-start justify-between">
        <div className="flex flex-col items-start justify-center">
          <span className="text-4xl font-bold">{data.ticker}</span>
          <span className="font-medium">{data.name}</span>
        </div>
        <div className="flex flex-col items-end justify-center">
          <span className="text-2xl font-bold">{data.stockPrice}</span>
          <span className="text-md font-bold text-green-500">
            {data.currencyName.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mt-8 flex h-full w-full grow flex-row items-center justify-between gap-20">
        <div className="flex w-full flex-col items-start justify-center bg-blue-600 px-5 py-4 text-primary-text">
          <span className="text-sm font-normal">Market Cap</span>
          <span className="flex w-full flex-row items-center justify-between text-2xl">
            ${formatMarketCap(data.marketCap)}
            <FiCopy
              onClick={() =>
                navigator.clipboard.writeText(data.marketCap.toString())
              }
              className="duration-400 h-5 w-5 cursor-pointer transition-all hover:scale-110"
            />
          </span>
        </div>
        <a
          href={data.homepageUrl}
          target="_blank"
          className="duration-400 flex cursor-pointer items-center justify-center gap-1 text-center text-xl transition-all hover:scale-110"
        >
          {data.homepageUrl.replace('https://', '')}
          <MdArrowOutward className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
}
