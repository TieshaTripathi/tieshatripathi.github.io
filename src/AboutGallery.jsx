import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";

const photos = [
  {
    base: "about-campus-portrait",
    alt: "Tiesha in a purple shirt outdoors on campus",
    label: "Campus portrait",
    heading: "A little more than a title.",
    description:
      "Somewhere between figuring things out and trying everything that interests me.",
    position: "50% 48%",
  },
  {
    base: "about-moment",
    alt: "Tiesha sitting in front of the TEDx letters",
    label: "TEDx moment",
    heading: "Beyond the classroom.",
    description:
      "Some of my favourite experiences have come from bringing ideas, events, and people together.",
    full: true,
    position: "center",
  },
  {
    base: "about-podium",
    alt: "Tiesha speaking at a podium with a microphone",
    label: "Podium speech",
    heading: "Learning to take the mic.",
    description:
      "From working behind the scenes to standing in front of a room, every experience teaches me something.",
    position: "57% 42%",
  },
];
const ease = [0.22, 1, 0.36, 1];

function StoryPhoto({ photo, direction, paused, settled }) {
  const present = useIsPresent();
  return (
    <motion.div
      className="gallery-slide"
      aria-hidden={!present}
      custom={direction}
      variants={{
        enter: (d) => ({
          x: paused ? 0 : `${d * 72}%`,
          rotate: paused ? 0 : d * 9,
          scale: paused ? 1 : 0.88,
          clipPath: paused
            ? "inset(0)"
            : `inset(0 ${d < 0 ? 45 : 0}% 0 ${d > 0 ? 45 : 0}% round 12px)`,
        }),
        settled: {
          x: 0,
          rotate: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 12px)",
        },
        exit: (d) => ({
          x: paused ? 0 : `${-d * 45}%`,
          rotate: paused ? 0 : -d * 12,
          scale: paused ? 1 : 0.84,
          opacity: 0,
        }),
      }}
      initial="enter"
      animate="settled"
      exit="exit"
      transition={{ duration: paused ? 0 : 0.85, ease }}
      onAnimationComplete={(name) => {
        if (name === "settled" && present) settled();
      }}
    >
      {photo.full && (
        <div
          className="gallery-atmosphere"
          style={{ backgroundImage: `url(/${photo.base}-640.webp)` }}
        />
      )}
      <div className="gallery-photo-surface">
        <img
          className={`gallery-image${photo.full ? " full-photo" : ""}`}
          style={{ objectPosition: photo.position }}
          src={`/${photo.base}-1280.webp`}
          srcSet={`/${photo.base}-640.webp 640w, /${photo.base}-1280.webp 1280w`}
          sizes="(max-width:700px) 90vw, 40vw"
          alt={photo.alt}
          loading="eager"
          decoding="async"
          width="1280"
          height="1600"
        />
      </div>
    </motion.div>
  );
}
function StoryCaption({ photo, direction, paused }) {
  const present = useIsPresent();
  return (
    <motion.div
      className="gallery-caption"
      aria-hidden={!present}
      custom={direction}
      variants={{
        enter: (d) => ({
          y: paused ? 0 : d * 36,
          opacity: paused ? 1 : 0,
          clipPath: "inset(0 0 100% 0)",
        }),
        settled: { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)" },
        exit: (d) => ({
          y: paused ? 0 : -d * 24,
          opacity: 0,
          clipPath: "inset(100% 0 0 0)",
        }),
      }}
      initial="enter"
      animate="settled"
      exit="exit"
      transition={{
        duration: paused ? 0 : 0.55,
        delay: paused ? 0 : 0.12,
        ease,
      }}
    >
      <h3>{photo.heading}</h3>
      <p>{photo.description}</p>
    </motion.div>
  );
}
export default function AboutGallery({ paused }) {
  const [view, setView] = useState({ index: 0, direction: 1 });
  const current = useRef(0),
    busy = useRef(false),
    queued = useRef(null),
    gesture = useRef(null),
    gallery = useRef(null),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        for (const photo of photos) {
          const image = new Image();
          image.src = `/${photo.base}-1280.webp`;
        }
        observer.disconnect();
      },
      { rootMargin: "150px" },
    );
    observer.observe(gallery.current);
    return () => {
      mounted.current = false;
      observer.disconnect();
    };
  }, []);
  function choose(index, direction) {
    const next = (index + photos.length) % photos.length;
    if (busy.current) {
      queued.current = { index: next, direction };
      return;
    }
    if (next === current.current) return;
    busy.current = true;
    const previous = current.current;
    current.current = next;
    const image = new Image();
    image.src = `/${photos[next].base}-1280.webp`;
    image
      .decode()
      .catch(() => {})
      .then(() => {
        if (mounted.current)
          setView({
            index: next,
            direction: direction || (next > previous ? 1 : -1),
          });
      });
  }
  function settled() {
    busy.current = false;
    const pending = queued.current;
    queued.current = null;
    if (pending) choose(pending.index, pending.direction);
  }
  const photo = photos[view.index];
  return (
    <div
      ref={gallery}
      className="about-photo about-gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label="A little more about me: photo gallery"
      tabIndex={0}
      onKeyDown={(e) => {
        if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
          e.preventDefault();
          const d = e.key === "ArrowLeft" ? -1 : 1;
          choose(
            e.key === "Home" ? 0 : e.key === "End" ? 2 : current.current + d,
            d,
          );
        }
      }}
    >
      <span>A LITTLE MORE ME</span>
      <figure
        className="about-moment"
        aria-label="Personal photographs"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") return;
          gesture.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          gesture.current = null;
        }}
        onPointerUp={(e) => {
          const start = gesture.current;
          gesture.current = null;
          if (!start) return;
          const x = e.clientX - start.x,
            y = e.clientY - start.y;
          if (Math.abs(x) > 44 && Math.abs(x) > Math.abs(y) * 1.3) {
            const d = x < 0 ? 1 : -1;
            choose(current.current + d, d);
          }
        }}
      >
        {[-1, 1].map((offset) => (
          <motion.div
            key={`${view.index}-${offset}`}
            className={`gallery-back-card ${offset < 0 ? "back-one" : "back-two"}`}
            aria-hidden="true"
            style={{
              backgroundImage: `linear-gradient(#19271e66, #19271e66), url(/${photos[(view.index + offset + photos.length) % photos.length].base}-640.webp)`,
            }}
            initial={false}
            animate={{
              rotate: paused ? 0 : [offset * 2, offset * 9, offset * 5],
              scale: paused ? 0.96 : [0.94, 0.91, 0.96],
            }}
            transition={{ duration: paused ? 0 : 1.05, ease }}
          />
        ))}
        <AnimatePresence initial={false} custom={view.direction}>
          <StoryPhoto
            key={photo.base}
            photo={photo}
            direction={view.direction}
            paused={paused}
            settled={settled}
          />
        </AnimatePresence>
      </figure>
      <div
        className="gallery-caption-stage"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence initial={false} custom={view.direction}>
          <StoryCaption
            key={photo.base}
            photo={photo}
            direction={view.direction}
            paused={paused}
          />
        </AnimatePresence>
      </div>
      <div className="gallery-controls">
        <button
          type="button"
          className="gallery-arrow"
          aria-label="Previous About photo"
          onClick={() => choose(current.current - 1, -1)}
        >
          ←
        </button>
        <div
          className="gallery-thumbnails"
          role="group"
          aria-label="Choose an About photo"
        >
          {photos.map((p, i) => (
            <button
              key={p.base}
              type="button"
              aria-label={p.label}
              aria-pressed={view.index === i}
              onClick={() => choose(i)}
            >
              <img src={`/${p.base}-640.webp`} alt="" loading="lazy" />
              <span className="gallery-dot" />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="gallery-arrow"
          aria-label="Next About photo"
          onClick={() => choose(current.current + 1, 1)}
        >
          →
        </button>
      </div>
      <p className="gallery-counter">
        {String(view.index + 1).padStart(2, "0")} / 03
      </p>
    </div>
  );
}
