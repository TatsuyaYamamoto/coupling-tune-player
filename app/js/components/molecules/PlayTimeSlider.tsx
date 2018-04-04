import * as React from "react";

import Slider from "rc-slider";

interface Props {
  min: number;
  max: number;
  current: number;
  onChange: (newValue: number) => void;
  onFixed: (newValue: number) => void;
}

const PlayTimeSlider = (props: Props) => {
  const {
    min,
    max,
    current,
    onChange,
    onFixed,
  } = props;

  return (
    <Slider
      style={{padding: 0}}
      min={min}
      max={max}
      value={current}
      onChange={onChange}
      onAfterChange={onFixed}
    />
  );
};

export default PlayTimeSlider;
