"use strict";

import { TIME_STEP } from "./utils.js";

const magnus_tetens_formula = (temperature_c) => 6.1078 * 10 ** ((7.5 * temperature_c) / (temperature_c + 237.3));

const ideal_gas_law = (humidity_rel, pressure_pa, temperature_k) => {
  const r_dry = 287.05; //gas constant for dry air
  const r_vapor = 461.5; //gas constant for water vapor

  const p_sat_hpa = magnus_tetens_formula(temperature_k - 273.15);
  const p_vapor_hpa = p_sat_hpa * humidity_rel;
  const p_vapor_pa = p_vapor_hpa * 100;
  const p_dry_pa = pressure_pa - p_vapor_pa;

  return p_dry_pa / (r_dry * temperature_k) + p_vapor_pa / (r_vapor * temperature_k);
};

const simulate = ({ draw_weight_lb, height_in, humidity_rel, pressure_pa, temperature_k, vertical_angle_deg }) => {
  const arrow_mass_gr = Math.max(300, draw_weight_lb * 7.5); //estimate arrow mass based on draw weight
  const draw_length_in = height_in * 0.4; //estimate draw length based on height
  const height_m = height_in / 39.37;

  const arrow_height_m = height_m * 0.85;
  const arrow_mass_kg = arrow_mass_gr / 15430;
  const bow_efficiency = 0.75 + 0.005 * (draw_weight_lb - 30) + 0.01 * (draw_length_in - 26) + 0.05 * (300 / arrow_mass_gr); //estimate bow efficiency based on draw weight, draw length, and arrow mass
  const draw_length_m = draw_length_in / 39.37;
  const draw_weight_n = draw_weight_lb * 4.448;
  const vertical_angle_rad = vertical_angle_deg * Math.PI / 180;

  const gravity_ms2 = 9.807;
  const velocity_ms = Math.sqrt(2 * draw_weight_n * draw_length_m * bow_efficiency / arrow_mass_kg); //work-energy theorem and kinetic energy principle
  const velocity_ms_x = velocity_ms * Math.cos(vertical_angle_rad);
  const velocity_ms_y = velocity_ms * Math.sin(vertical_angle_rad);

  const air_density_kgm3 = ideal_gas_law(humidity_rel, pressure_pa, temperature_k);
  const arrow_radius_m = 3.25 / 1000; //estimate
  const arrow_area_m2 = Math.PI * arrow_radius_m ** 2;
  const drag_coefficient = 2.6; //estimate

  return function * () {
    let t_s = 0, x_m = 0, y_m = arrow_height_m;

    let velocity_ms_x_next = velocity_ms_x;
    let velocity_ms_y_next = velocity_ms_y;

    yield { t: t_s, x: x_m, y: y_m };

    do {
      const velocity_ms = Math.sqrt(velocity_ms_x_next ** 2 + velocity_ms_y_next ** 2);
      const drag_force_n = 0.5 * air_density_kgm3 * velocity_ms ** 2 * drag_coefficient * arrow_area_m2;

      const drag_ms2_x = -(drag_force_n / arrow_mass_kg) * (velocity_ms_x_next / velocity_ms);
      const drag_ms2_y = -(drag_force_n / arrow_mass_kg) * (velocity_ms_y_next / velocity_ms);

      velocity_ms_x_next += drag_ms2_x * TIME_STEP;
      velocity_ms_y_next += (drag_ms2_y - gravity_ms2) * TIME_STEP;

      x_m += velocity_ms_x_next * TIME_STEP;
      y_m += velocity_ms_y_next * TIME_STEP;

      yield { t: t_s, x: x_m, y: y_m };

      t_s += TIME_STEP;
    } while (y_m > 0);
  };
};

export { simulate };
