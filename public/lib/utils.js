"use strict";

const TIME_STEP = 0.01; //seconds

const m_to_ft = ({ x, y }) => ({
  x: x * 3.281,
  y: y * 3.281
});

export {
  TIME_STEP,
  m_to_ft
};
