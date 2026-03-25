import {
  animate,
  hover,
  press,
} from "https://cdn.jsdelivr.net/npm/motion@12.38.0/+esm";

gsap.registerPlugin(ScrambleTextPlugin, SplitText);

/* Using Motion.Js to add a hover & press effect on the nav bar */

hover(".album_c", (element) => {
  animate(element, { scale: 0.9 });
  return () => animate(element, { scale: 1 });
});

press(".album_c", (element) => {
  animate(element, { scale: 0.6 }, { type: "spring", stiffness: 800 });

  return () =>
    animate(element, { scale: 1 }, { type: "spring", stiffness: 500 });
});

/* Cursor Driven Perspective when moving around the album cover in the album page */

const main = document.querySelector("main");

gsap.set("main", { perspective: 650 });

const outerRX = gsap.quickTo(".a-c", "rotationX", { ease: "power3" });
const outerRY = gsap.quickTo(".a-c", "rotationY", { ease: "power3" });
const innerX = gsap.quickTo(".a", "x", { ease: "power3" });
const innerY = gsap.quickTo(".a", "y", { ease: "power3" });

main.addEventListener("pointermove", (e) => {
  outerRX(gsap.utils.interpolate(15, -15, e.y / window.innerHeight));
  outerRY(gsap.utils.interpolate(-15, 15, e.x / window.innerWidth));
  innerX(gsap.utils.interpolate(-30, 30, e.x / window.innerWidth));
  innerY(gsap.utils.interpolate(-30, 30, e.y / window.innerHeight));
});

main.addEventListener("pointerleave", (e) => {
  outerRX(0);
  outerRY(0);
  innerX(0);
  innerY(0);
});

/* Split Text Library Functions for the album info in the album page */

let split, animation;

function splitTextChars() {
  split = SplitText.create(".album-text", { type: "chars,words,lines" });
  return split;
}
splitTextChars();
gsap.from(split.chars, {
  x: 150,
  opacity: 0,
  duration: 1.5,
  ease: "power4",
  stagger: 0.02,
});

// gsap.from(split.lines, {
//   rotationX: -100,
//   transformOrigin: "50% 50% -160px",
//   opacity: 0,
//   duration: 2.5,
//   ease: "power3",
//   stagger: 1.7,
// });

// gsap.from(split.words, {
//   y: -100,
//   opacity: 0,
//   rotation: "random(-80, 80)",
//   duration: 0.5,
//   ease: "back",
//   stagger: 0.15,
// });
