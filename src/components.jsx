import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroContent } from "./HeroContent";
import { projectData, leadershipData } from "./data";

const words = [
  "Product thinking",
  "Product & testing",
  "Cybersecurity",
  "AI & blockchain",
  "People & teams",
  "IoT",
];
export function Hero({ paused, toggleMotion }) {
  const heroRef = useRef(null),
    inputRef = useRef(null),
    timeline = useRef(null);
  const [photo, setPhoto] = useState(""),
    [word, setWord] = useState(0),
    [interest, setInterest] = useState(0);
  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo);
    },
    [photo],
  );
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      if (!document.hidden) setWord((v) => (v + 1) % words.length);
    }, 4200);
    return () => clearInterval(id);
  }, [paused]);
  useLayoutEffect(() => {
    if (paused) return;
    const ctx = gsap.context(() => {
      timeline.current = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".name-word", { yPercent: 110, rotation: 5, duration: 1.3 })
        .from(
          ".hero-letter",
          { yPercent: 100, rotationX: -70, stagger: 0.08, duration: 1.2 },
          0.1,
        )
        .from(
          ".portrait-wrap",
          {
            clipPath: "inset(100% 0% 0% 0% round 45%)",
            y: 75,
            rotation: -5,
            duration: 1.25,
          },
          0.15,
        )
        .from(".portrait img", { scale: 1.35, duration: 1.5 }, 0.15)
        .from(
          ".intro > *, .hero-aside > *",
          { y: 25, opacity: 0, stagger: 0.07, duration: 0.8 },
          0.55,
        )
        .from(
          ".float-card, .photo-note",
          { scale: 0.65, opacity: 0, stagger: 0.15, duration: 0.7 },
          0.9,
        )
        .from(
          ".hero-pillars > button",
          { y: 25, opacity: 0, stagger: 0.1, duration: 0.7 },
          1,
        );
      // Persistent motion lives on separate layers from the entrance and pointer transforms.
      gsap.to(".hero-orbit", {
        rotation: 360,
        duration: 32,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".portrait-float", {
        y: -9,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-glow", {
        scale: 1.2,
        opacity: 0.72,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          })
          .to(
            ".name-word",
            { y: 90, scale: 1.08, opacity: 0.15, ease: "none" },
            0,
          )
          .to(".portrait-wrap", { y: -55, rotation: 2, ease: "none" }, 0)
          .to(".float-card", { y: -18, stagger: 0.05, ease: "none" }, 0);
      });
      mm.add("(hover:hover) and (pointer:fine)", () => {
        const scene = heroRef.current.querySelector(".portrait-interaction"),
          name = heroRef.current.querySelector(".hero-name-parallax");
        const rotateX = gsap.quickTo(scene, "rotationX", {
          duration: 0.8,
          ease: "power3.out",
        });
        const rotateY = gsap.quickTo(scene, "rotationY", {
          duration: 0.8,
          ease: "power3.out",
        });
        const photoX = gsap.quickTo(scene, "x", {
          duration: 0.8,
          ease: "power3.out",
        });
        const nameX = gsap.quickTo(name, "x", {
          duration: 1,
          ease: "power3.out",
        });
        const glowX = gsap.quickTo(".hero-glow", "x", {
          duration: 1,
          ease: "power3.out",
        });
        const move = (e) => {
          if (e.pointerType !== "mouse") return;
          const box = heroRef.current.getBoundingClientRect(),
            x = (e.clientX - box.left) / box.width - 0.5,
            y = (e.clientY - box.top) / box.height - 0.5;
          rotateX(-y * 10);
          rotateY(x * 15);
          photoX(x * 22);
          nameX(-x * 25);
          glowX(x * 65);
        };
        const reset = () => {
          rotateX(0);
          rotateY(0);
          photoX(0);
          nameX(0);
          glowX(0);
        };
        const hero = heroRef.current;
        hero.addEventListener("pointermove", move);
        hero.addEventListener("pointerleave", reset);
        return () => {
          hero.removeEventListener("pointermove", move);
          hero.removeEventListener("pointerleave", reset);
        };
      });
      return () => mm.revert();
    }, heroRef);
    return () => {
      ctx.revert();
      timeline.current = null;
    };
  }, [paused]);
  function changePhoto(e) {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) setPhoto(URL.createObjectURL(file));
  }
  function chooseInterest(index) {
    setInterest(index);
    setWord([2, 1, 4][index]);
  }
  function replay() {
    if (paused) {
      toggleMotion();
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    timeline.current?.restart();
  }
  return (
    <HeroContent
      {...{
        heroRef,
        inputRef,
        photo,
        changePhoto,
        replay,
        paused,
        toggleMotion,
        word,
        words,
        interest,
        chooseInterest,
      }}
    />
  );
}

const images = ["/truth-machine-poster-1280.webp", "/veritas-vault-1280.webp"];
const summaries = [
  "Exploring a decentralized approach to validating documents and storing verifiable records.",
  "A prototype exploring biometric access control and tamper-evident audit records.",
];
function ProjectCard({ paused, children, ...props }) {
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 140, damping: 24 }),
    rotateY = useSpring(y, { stiffness: 140, damping: 24 });
  return (
    <motion.button
      {...props}
      style={{
        rotateX: paused ? 0 : rotateX,
        rotateY: paused ? 0 : rotateY,
        transformPerspective: 1100,
      }}
      onPointerMove={(e) => {
        if (paused || e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(-((e.clientY - rect.top) / rect.height - 0.5) * 7);
        y.set(((e.clientX - rect.left) / rect.width - 0.5) * 9);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.button>
  );
}
export function Projects({ paused }) {
  const [selected, setSelected] = useState(null);
  const lastFocus = useRef(null);
  function open(i, e) {
    lastFocus.current = e.currentTarget;
    setSelected(i);
  }
  const close = () => setSelected(null);
  return (
    <>
      <div className="projects-grid">
        {projectData.slice(0, 2).map((p, i) => (
          <div className="project-scene" key={p.name}>
            <ProjectCard
              paused={paused}
              className="project"
              data-project={i}
              aria-haspopup="dialog"
              aria-label={"Explore " + p.name}
              onClick={(e) => open(i, e)}
              whileHover={paused ? undefined : { y: -8 }}
              whileTap={paused ? undefined : { scale: 0.985 }}
            >
              <div className="art project-media">
                <img
                  src={images[i]}
                  srcSet={`${images[i].replace("1280", "640")} 640w, ${images[i]} 1280w`}
                  sizes="(max-width:700px) 90vw, 45vw"
                  width="1280"
                  height="800"
                  decoding="async"
                  alt={
                    i
                      ? "VERITAS Vault live checkpoint interface"
                      : "Digital Truth Machine demo preview"
                  }
                  loading="lazy"
                />
              </div>
              <div className="project-meta">
                <span className="project-number">0{i + 1}</span>
                <div>
                  <h3 className="project-title">{p.name}</h3>
                  <span className="project-type">
                    {i ? "Security prototype" : "Document verification · 2026"}
                  </span>
                </div>
                <span className="project-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
              <p className="project-desc">{summaries[i]}</p>
              <span className="project-reveal">
                <span>
                  {i
                    ? "Python · FastAPI · Cryptography"
                    : "React · Solidity · IPFS"}
                </span>
                <span className="project-cta">
                  Explore the project <b>↗</b>
                </span>
              </span>
            </ProjectCard>
          </div>
        ))}
      </div>
      <AnimatePresence onExitComplete={() => ScrollTrigger.refresh()}>
        {selected !== null && (
          <ProjectDialog
            key={selected}
            index={selected}
            paused={paused}
            onClose={close}
            trigger={lastFocus}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ProjectDialog({ index, paused, onClose, trigger }) {
  const dialog = useRef(null),
    title = useRef(null);
  const project = projectData[index];
  useLayoutEffect(() => {
    const el = dialog.current;
    const origin = trigger.current;
    el.showModal();
    document.body.classList.add("detail-open");
    title.current.focus({ preventScroll: true });
    const source = origin?.getBoundingClientRect(),
      target = el.getBoundingClientRect();
    const ctx = gsap.context(() => {
      if (!paused && source)
        gsap.fromTo(
          el,
          {
            x: source.left - target.left,
            y: source.top - target.top,
            scaleX: source.width / target.width,
            scaleY: source.height / target.height,
            opacity: 0.25,
            transformOrigin: "top left",
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            duration: 0.65,
            ease: "power3.inOut",
            clearProps: "transform,opacity,transformOrigin",
          },
        );
    });
    return () => {
      ctx.revert();
      el.close();
      document.body.classList.remove("detail-open");
      origin?.focus({ preventScroll: true });
    };
  }, [paused, trigger]);
  return (
    <motion.dialog
      ref={dialog}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const items = [
          ...event.currentTarget.querySelectorAll(
            'button,a[href],video[controls],[tabindex="0"]',
          ),
        ].filter((el) => el.getBoundingClientRect().width > 0);
        const active = document.activeElement,
          first = items[0],
          last = items.at(-1);
        if (
          !items.includes(active) ||
          (event.shiftKey && active === first) ||
          (!event.shiftKey && active === last)
        ) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        }
      }}
      initial={false}
      exit={{ opacity: 0, scale: paused ? 1 : 0.96, y: paused ? 0 : 25 }}
      transition={{ duration: paused ? 0 : 0.3 }}
      className="project-dialog"
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <motion.div
        className="dialog-surface"
        initial={false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: paused ? 0 : 0.5 }}
      >
        <div className="detail-header">
          <span>A closer look / {project.date.split(" · ")[0]}</span>
          <button className="close-modal" onClick={onClose}>
            Back to projects <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="detail-layout">
          <div className="detail-preview">
            <motion.div
              className="art detail-art"
              initial={paused ? false : { clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: paused ? 0 : 0.7 }}
            >
              {index === 0 ? (
                <video
                  controls
                  playsInline
                  preload="none"
                  poster={images[0]}
                  aria-label="Digital Truth Machine demo"
                >
                  <source src="/truth-machine-demo.mp4" type="video/mp4" />
                  Your browser does not support video.{" "}
                  <a href="/truth-machine-demo.mp4">Download the demo</a>.
                </video>
              ) : (
                <img src={images[index]} alt={project.name + " preview"} />
              )}
            </motion.div>
          </div>
          <motion.div
            className="detail-info"
            initial={paused ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: paused ? 0 : 0.15,
              duration: paused ? 0 : 0.5,
            }}
          >
            <p className="kicker">{project.date}</p>
            <h2
              className="detail-title"
              id="dialog-title"
              ref={title}
              tabIndex={-1}
            >
              {project.name}
            </h2>
            <p>{project.description}</p>
            {index === 1 && (
              <a
                className="project-repo"
                href="https://github.com/TieshaTripathi/VERITAS-Vault"
                target="_blank"
                rel="noopener noreferrer"
              >
                View repository ↗
              </a>
            )}
            <div className="modal-label">Tools used in the project</div>
            <div className="modal-tools">
              {project.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
            <p className="detail-note">{project.note}</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.dialog>
  );
}

export function Leadership({ paused }) {
  const [opened, setOpened] = useState(null);
  return (
    <div className="role-list">
      {leadershipData.map((role, i) => {
        const open = opened === i;
        return (
          <motion.div
            layout={!paused}
            className={"leadership-role " + (open ? "expanded" : "")}
            key={role.title}
          >
            <button
              className="role-card-button"
              onClick={() => setOpened(open ? null : i)}
              aria-expanded={open}
              aria-controls={"role-body-" + i}
            >
              <span className="role-summary">
                <span className="role-index">0{i + 1}</span>
                <span>
                  <strong>{role.title}</strong>
                  <small>{role.organization}</small>
                </span>
                <motion.span
                  className="role-plus"
                  aria-hidden="true"
                  animate={{ rotate: open ? 45 : 0 }}
                >
                  +
                </motion.span>
              </span>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.span
                    className="role-expansion"
                    id={"role-body-" + i}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: paused ? 0 : 0.55 }}
                    onAnimationComplete={() => ScrollTrigger.refresh()}
                  >
                    <span className="role-body">
                      <span className="role-photo">
                        {role.image ? (
                          <motion.img
                            src={role.image.replace(
                              /\.(jpg|png)$/,
                              "-1280.webp",
                            )}
                            srcSet={`${role.image.replace(/\.(jpg|png)$/, "-640.webp")} 640w, ${role.image.replace(/\.(jpg|png)$/, "-1280.webp")} 1280w`}
                            sizes="(max-width:700px) 80vw, 40vw"
                            decoding="async"
                            alt={role.alt}
                            loading="lazy"
                            initial={paused ? false : { scale: 1.12 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: paused ? 0 : 0.8 }}
                          />
                        ) : (
                          <span className="role-photo-empty">
                            <span>GDG</span>
                            <span>A space for a community moment.</span>
                          </span>
                        )}
                      </span>
                      <span className="role-description">
                        {role.description}
                      </span>
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

export function Experience({ roles, paused }) {
  return (
    <div className="experience-list">
      {roles.map((role, i) => (
        <motion.article
          className="experience-card"
          key={role.title}
          whileHover={paused ? undefined : { x: 6, backgroundColor: "#293e2d" }}
        >
          <span className="experience-track" aria-hidden="true" />
          <div className="experience-summary">
            <div className="experience-index" aria-hidden="true">
              0{i + 1}
            </div>
            <div className="timeline-top">
              <h3>{role.title}</h3>
              <small>{role.date}</small>
            </div>
            <div className="company">{role.company}</div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
