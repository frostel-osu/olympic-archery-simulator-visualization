"use strict";

import { simulate } from "./lib/simulate.js";
import { reset_chart, visualize } from "./lib/visualize.js";

const DOMVisualization = document.querySelector(".js-visualization");

window.addEventListener("message", async ({ data: { type, data } }) => {
  switch (type) {
    case "start":
      const simulation = simulate(data);

      console.log(data, simulation());

      await visualize(DOMVisualization, data, simulation());

      parent.postMessage({ type: "done" }, "http://localhost:3000");
      break;
    case "reset":
      reset_chart(DOMVisualization, data);
      break;
  }
});
