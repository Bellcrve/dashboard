import * as React from 'react';
export interface ISimulationSelectionProps {
  simulations: number;
  setSimulations: Function;
}

export function SimulationsSelection(props: ISimulationSelectionProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <span className="text-md font-light opacity-85">
        Number of Simulations
      </span>
      <input
        className="text-secondary-text w-full rounded px-4 py-2 text-lg"
        value={props.simulations}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.setSimulations(e.target.value)
        }
      />
    </div>
  );
}
