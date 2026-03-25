import {
  animate,
  hover,
} from "https://cdn.jsdelivr.net/npm/motion@12.38.0/+esm";

hover("img", (element) => {
  animate(element, { scale: 0.8 });
  console.log("hover working?");
  console.log(element);

  return () => animate(element, { scale: 1 });
});
