import * as React from 'react';
export interface IStrikePriceSelectionProps {
  strikePriceMax: number;
  setStrikePriceMax: Function;
}

export function StrikePriceSelection(props: IStrikePriceSelectionProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <span className="text-md font-light opacity-85">
        Maximum Strike Price
      </span>
      <input
        className="text-secondary-text rounded px-3 py-2 text-lg outline-none"
        value={props.strikePriceMax}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.setStrikePriceMax(e.target.value)
        }
      />
    </div>
  );
}
