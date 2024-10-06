import * as React from 'react';
import { SelectButton } from 'primereact/selectbutton';

export interface ITimeIntervalSelectionProps {
  timeInterval: number;
  setTimeInterval: Function;
}

export const timeIntervals = [
  { name: '1 hour', value: 1, actualValue: 0.0416 },
  { name: '6 hours', value: 2, actualValue: 0.25 },
  { name: '1 day', value: 3, actualValue: 1 },
  { name: '1 week', value: 4, actualValue: 5 },
  { name: '1 month', value: 5, actualValue: 25 },
];

export function TimeIntervalSelection(props: ITimeIntervalSelectionProps) {
  return (
    <div className="mt-1 flex w-full flex-col items-start gap-2">
      <span className="text-md font-light opacity-85">Time Interval</span>
      <SelectButton
        className="w-full"
        value={props.timeInterval}
        onChange={(e) => props.setTimeInterval(e.value)}
        optionLabel="name"
        options={timeIntervals}
      />
    </div>
  );
}
