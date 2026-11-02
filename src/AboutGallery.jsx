import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const photos = [
  {
    base: "about-campus-portrait",
    alt: "Tiesha in a purple shirt outdoors on campus",
    label: "Campus portrait",
    caption: "A moment worth sharing.",
  },
  {
    base: "about-campus-moment",
    alt: "Tiesha in a white shirt on a tree-lined campus",
    label: "Campus moment",
    caption: "A moment worth sharing.",
    full: true,
  },
  {
    base: "about-moment",
    alt: "Tiesha at TEDxSIESGST",
    label: "TEDx moment",
    caption: "A moment worth sharing.",
  },
];

export default function AboutGallery({ paused }) {
  const [selected, setSelected] = useState(0),
    [direction, setDirection] = useState(1);
  function choose(index) {
    setDirection(index > selected ? 1 : -1);
    setSelected((index + photos.length) % photos.length);
  }
  const photo = photos[selected];
  return (
    <div
      className="about-photo about-gallery"
      aria-label="A little more about me: photo gallery"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          choose(selected + (e.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      <span>A LITTLE MORE ME</span>
      <figure className="about-moment">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={photo.base}
            className="gallery-slide"
            custom={direction}
            variants={{
              enter: (d) => ({
                x: paused ? 0 : d * 70,
                opacity: paused ? 1 : 0,
                clipPath: paused ? "inset(0)" : "inset(0 0 0 100%)",
              }),
              center: { x: 0, opacity: 1, clipPath: "inset(0)" },
              exit: (d) => ({ x: paused ? 0 : -d * 50, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: paused ? 0 : 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img
              className={
                photo.full ? "gallery-image full-photo" : "gallery-image"
              }
              src={`/${photo.base}-1280.webp`}
              srcSet={`/${photo.base}-640.webp 640w, /${photo.base}-1280.webp 1280w`}
              sizes="(max-width:700px) 90vw, 40vw"
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              width="1280"
              height="1600"
            />
          </motion.div>
        </AnimatePresence>
        <figcaption>{photo.caption}</figcaption>
      </figure>
      <div className="gallery-controls">
        <button
          type="button"
          className="gallery-arrow"
          aria-label="Previous About photo"
          onClick={() => choose(selected - 1)}
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
              aria-pressed={selected === i}
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
          onClick={() => choose(selected + 1)}
        >
          →
        </button>
      </div>
      <p className="gallery-counter" aria-live="polite">
        {String(selected + 1).padStart(2, "0")} / 03
      </p>
    </div>
  );
}
