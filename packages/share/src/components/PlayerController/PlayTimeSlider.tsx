/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { ChangeEvent, FC } from "react";
import { Slider } from "@material-ui/core";

interface Props {
  min: number;
  max: number;
  current: number;
  onSlide: (newValue: number) => void;
  onSlideFixed: (newValue: number) => void;
}

const PlayTimeSlider: FC<Props> = props => {
  const { min, max, current, onSlide, onSlideFixed } = props;

  const onChange = (event: ChangeEvent<{}>, newValue: number | number[]) => {
    onSlide(newValue as number);
  };

  const onChangeCommitted = (
    event: ChangeEvent<{}>,
    newValue: number | number[]
  ) => {
    onSlideFixed(newValue as number);
  };

  return (
    <Slider
      css={css``}
      min={min}
      max={max}
      value={current}
      onChange={onChange}
      onChangeCommitted={onChangeCommitted}
    />
  );
};

export default PlayTimeSlider;
