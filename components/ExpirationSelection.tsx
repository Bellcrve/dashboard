import * as React from 'react';

export interface IExpirationSelectionProps {
  expirationTime: number;
  setExpirationTime: Function;
}

export function ExpirationSelection(props: IExpirationSelectionProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <span className="text-md font-light opacity-85">Expiration (years)</span>
      <input
        className="text-secondary-text rounded px-3 py-2 text-lg outline-none"
        value={props.expirationTime}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.setExpirationTime(e.target.value)
        }
      />
    </div>
  );
}
