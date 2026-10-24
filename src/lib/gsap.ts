import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Single registration point — import gsap from here, never from "gsap" directly,
// so ScrollTrigger is always registered exactly once.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
