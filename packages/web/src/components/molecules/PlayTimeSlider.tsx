import React, { FC } from "react";

import Slider from "rc-slider";

interface Props {
  min: number;
  max: number;
  current: number;
  onStartChange: () => void;
  onChange: (newValue: number) => void;
  onFixed: (newValue: number) => void;
}

const PlayTimeSlider: FC<Props> = props => {
  const { min, max, current, onStartChange, onChange, onFixed } = props;

  return (
    <Slider
      style={{ padding: 0 }}
      min={min}
      max={max}
      value={current}
      onBeforeChange={onStartChange}
      onChange={onChange}
      onAfterChange={onFixed}
    />
  );
};

export default PlayTimeSlider;
