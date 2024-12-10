"use strict";

import { TIME_STEP } from "./utils.js";

const simulate = ({ draw_weight_lb, height_in, vertical_angle_deg }) => {
  const arrow_mass_gr = Math.max(300, draw_weight_lb * 7.5);
  const draw_length_in = height_in * 0.4;
  const height_m = height_in / 39.37;

  const arrow_height_m = height_m * 0.85;
  const arrow_mass_kg = arrow_mass_gr / 15430;
  const bow_efficiency = 0.75 + 0.005 * (draw_weight_lb - 30) + 0.01 * (draw_length_in - 26) + 0.05 * (300 / arrow_mass_gr);
  const draw_length_m = height_m * 0.4;
  const draw_weight_n = draw_weight_lb * 4.448;
  const vertical_angle_rad = vertical_angle_deg * Math.PI / 180;

  const gravity_mss = 9.807;
  const velocity_ms = Math.sqrt(2 * draw_weight_n * draw_length_m * bow_efficiency / arrow_mass_kg);
  const velocity_ms_x = velocity_ms * Math.cos(vertical_angle_rad);
  const velocity_ms_y = velocity_ms * Math.sin(vertical_angle_rad);

  const distance_m_x = (t) => velocity_ms_x * t;
  const distance_m_y = (t) => velocity_ms_y * t - gravity_mss * t ** 2 / 2 + arrow_height_m;

  return function * () {
    let t = 0, x = 0, y = 0;
  
    do {
      x = distance_m_x(t);
      y = distance_m_y(t);

      yield { t, x, y };

      t += TIME_STEP;
    } while (y > 0);  
  };
};

export { simulate };
