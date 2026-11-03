import {
  StrictMode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Content from "./Content";
import "./style.css";
import "./hero-about.css";
import "./gallery.css";

gsap.registerPlugin(ScrollTrigger);

function Header() {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState("");
  useEffect(() => {
    const sections = [...document.querySelectorAll("main section[id], .hero")];
    const observer = new IntersectionObserver(
      () => {
        const readingLine = innerHeight * 0.25;
        const visible = sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= readingLine && rect.bottom > readingLine;
        });
        if (visible) setActive(visible.id || "");
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    const close = (e) => {
      if (
        e.key === "Escape" ||
        (e.type === "pointerdown" && !e.target.closest(".site-header"))
      )
        setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, []);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#top">
          tiesha<span>.</span>
        </a>
        <button
          className="menu"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close −" : "Menu +"}
        </button>
        <nav
          className={"nav-links " + (open ? "open" : "")}
          id="nav-links"
          aria-label="Main navigation"
        >
          {["about", "projects", "experience", "leadership"].map((id) => (
            <a
              key={id}
              href={"#" + id}
              className={active === id ? "active" : ""}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {id[0].toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact">
          Say hello ↗
        </a>
      </div>
    </header>
  );
}

function App() {
  const reduced = useReducedMotion(),
    [manualPaused, setManualPaused] = useState(null);
  const paused = Boolean(reduced) || manualPaused === true,
    root = useRef(null);
  const toggleMotion = () =>
    setManualPaused((v) => (v === null ? !paused : !v));
  useLayoutEffect(() => {
    document.body.classList.toggle("motion-paused", paused);
    document.documentElement.classList.toggle("motion-paused", paused);
    if (paused) return;
    const mm = gsap.matchMedia();
    mm.add(
      { desktop: "(min-width: 901px)", mobile: "(max-width: 900px)" },
      (context) => {
        const desktop = context.conditions.desktop;
        gsap.to(".reading-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "max",
            scrub: true,
          },
        });
        gsap.utils.toArray("main section[id]").forEach((section) => {
          const heading = section.querySelector("h2"),
            mark = section.querySelector(".chapter-watermark");
          gsap.fromTo(
            section,
            { backgroundColor: "#293e2d00" },
            {
              backgroundColor: "#293e2d12",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top 35%",
                scrub: 0.8,
              },
            },
          );
          if (heading?.querySelector(".type-word"))
            gsap.fromTo(
              heading.querySelectorAll(".type-word"),
              { yPercent: 110, rotation: 4 },
              {
                yPercent: 0,
                rotation: 0,
                stagger: 0.055,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: heading,
                  start: "top 92%",
                  end: "top 58%",
                  scrub: 0.6,
                },
              },
            );
          if (heading)
            gsap.fromTo(
              heading,
              { clipPath: "inset(0 0 100% 0)", y: 35 },
              {
                clipPath: "inset(0 0 0% 0)",
                y: 0,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 87%",
                  end: "top 42%",
                  scrub: 0.7,
                },
              },
            );
          if (mark)
            gsap.fromTo(
              mark,
              { y: 70, rotation: -8 },
              {
                y: -25,
                rotation: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
        });
        const about = gsap.timeline({
          scrollTrigger: {
            trigger: "#about",
            start: "top 85%",
            end: "center 40%",
            scrub: 0.8,
          },
        });
        about
          .fromTo(
            ".about-moment",
            {
              clipPath: "inset(20% 12% 20% 12% round 100px)",
              rotation: desktop ? -7 : 0,
              y: 65,
            },
            { clipPath: "inset(0% 0% 0% 0% round 16px)", rotation: 0, y: 0 },
            0,
          )
          .fromTo(".about-moment img", { scale: 1.18 }, { scale: 1 }, 0)
          .fromTo(
            ".about-copy p",
            { y: 35, opacity: 0.35 },
            { y: 0, opacity: 1, stagger: 0.12 },
            0.1,
          );
        gsap.utils.toArray(".project-scene").forEach((card, i) => {
          gsap.fromTo(
            card,
            {
              y: desktop ? (i ? 90 : 45) : 35,
              rotation: desktop ? (i ? 3 : -3) : 0,
            },
            {
              y: 0,
              rotation: 0,
              scrollTrigger: {
                trigger: card,
                start: "top 95%",
                end: "top 55%",
                scrub: 0.8,
              },
            },
          );
          gsap.fromTo(
            card.querySelector(".art img"),
            { clipPath: "inset(0 100% 0 0)", scale: 1.12 },
            {
              clipPath: "inset(0 0% 0 0)",
              scale: 1,
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "top 45%",
                scrub: 0.6,
              },
            },
          );
        });
        gsap.utils.toArray(".experience-card").forEach((card) => {
          gsap.fromTo(
            card,
            { x: desktop ? 65 : 20, clipPath: "inset(0 0 0 100%)" },
            {
              x: 0,
              clipPath: "inset(0 0 0 0%)",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                end: "top 60%",
                scrub: 0.5,
              },
            },
          );
          gsap.fromTo(
            card.querySelector(".experience-track"),
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: "top",
              scrollTrigger: {
                trigger: card,
                start: "top 75%",
                end: "bottom 50%",
                scrub: 0.5,
              },
            },
          );
        });
        const refresh = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(refresh);
        document.querySelectorAll("img").forEach((img) => {
          if (!img.complete)
            img.addEventListener("load", refresh, { once: true });
        });
        return () =>
          document
            .querySelectorAll("img")
            .forEach((img) => img.removeEventListener("load", refresh));
      },
      root,
    );
    return () => mm.revert();
  }, [paused]);
  return (
    <MotionConfig
      reducedMotion={paused ? "always" : "never"}
      transition={{ duration: paused ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div ref={root}>
        <div className="reading-progress" aria-hidden="true" />
        <a className="skip-link" href="#about">
          Skip to content
        </a>
        <Header />
        <Content paused={paused} toggleMotion={toggleMotion} />
      </div>
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
