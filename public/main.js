import {
  animate,
  hover,
  press,
} from "https://cdn.jsdelivr.net/npm/motion@12.38.0/+esm";

hover("img", (element) => {
  animate(element, { scale: 0.9 });
  console.log("hover working?");
  console.log(element);

  return () => animate(element, { scale: 1 });
});

press("img", (element) => {
  animate(element, { scale: 0.6 }, { type: "spring", stiffness: 800 });

  return () =>
    animate(element, { scale: 1 }, { type: "spring", stiffness: 500 });
});
