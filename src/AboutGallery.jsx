import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Heading from "./Heading";

const photos = [
  {
    base: "about-campus-portrait",
    alt: "Tiesha in a purple shirt outdoors on campus",
    heading: "A little more than a title.",
    description:
      "I’m still figuring things out, following my curiosity, and making time to try something new.",
    position: "50% 48%",
  },
  {
    base: "about-moment",
    alt: "Tiesha sitting in front of the TEDx letters",
    heading: "Beyond the classroom.",
    description:
      "Some of my favourite experiences have come from bringing people together around an idea or an event.",
    full: true,
    position: "center",
  },
  {
    base: "about-podium",
    alt: "Tiesha speaking at a podium with a microphone",
    heading: "Learning to take the mic.",
    description:
      "Whether I’m behind the scenes or speaking to a room, I’m learning to feel more at home in each role.",
    position: "57% 42%",
  },
];

export default function AboutGallery({ paused }) {
  const root = useRef(null),
    context = useRef(null),
    activeTimeline = useRef(null),
    current = useRef(0),
    busy = useRef(false),
    pending = useRef(null),
    gesture = useRef(null),
    request = useRef({ id: 0 });
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        for (const photo of photos) {
          const image = new Image();
          image.srcset = `/${photo.base}-640.webp 640w, /${photo.base}-1280.webp 1280w`;
          image.sizes = "(max-width:700px) 90vw, 40vw";
          image.src = `/${photo.base}-1280.webp`;
        }
        observer.disconnect();
      },
      { rootMargin: "150px" },
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    const lifecycle = request.current;
    context.current = gsap.context(() => {
      const slides = root.current.querySelectorAll(".gallery-slide"),
        captions = root.current.querySelectorAll(".gallery-caption");
      const backs = root.current.querySelectorAll(".gallery-back-card");
      gsap.set([...slides, ...captions, ...backs], { clearProps: "all" });
      activeTimeline.current = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut" },
      });
      root.current.dataset.transitioning = "false";
      gsap.set(
        [...slides].filter((_, i) => i !== current.current),
        { autoAlpha: 0 },
      );
      gsap.set(
        [...captions].filter((_, i) => i !== current.current),
        { autoAlpha: 0 },
      );
    }, root);
    return () => {
      lifecycle.id++;
      busy.current = false;
      pending.current = null;
      activeTimeline.current?.kill();
      context.current.revert();
    };
  }, [paused]);

  function choose(index, direction) {
    const next = (index + photos.length) % photos.length;
    if (busy.current) {
      pending.current = { index: next, direction };
      return;
    }
    if (next === current.current) return;
    busy.current = true;
    const ticket = ++request.current.id;
    const image = new Image();
    image.srcset = `/${photos[next].base}-640.webp 640w, /${photos[next].base}-1280.webp 1280w`;
    image.sizes = "(max-width:700px) 90vw, 40vw";
    image.src = `/${photos[next].base}-1280.webp`;
    image
      .decode()
      .catch(() => {})
      .then(() => {
        if (ticket !== request.current.id) return;
        root.current.dataset.transitioning = "true";
        const old = current.current,
          d = direction || (next > old ? 1 : -1);
        const slides = root.current.querySelectorAll(".gallery-slide"),
          captions = root.current.querySelectorAll(".gallery-caption"),
          backs = root.current.querySelectorAll(".gallery-back-card");
        current.current = next;
        setSelected(next);
        const finish = () => {
          root.current.dataset.transitioning = "false";
          busy.current = false;
          const queued = pending.current;
          pending.current = null;
          if (queued) choose(queued.index, queued.direction);
        };
        const timeline = activeTimeline.current;
        timeline.pause().clear().time(0).eventCallback("onComplete", finish);
        if (paused) {
          gsap.set([slides[old], captions[old]], { autoAlpha: 0 });
          gsap.set([slides[next], captions[next]], {
            autoAlpha: 1,
            xPercent: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 12px)",
          });
          finish();
          return;
        }
        timeline
          .set(slides[old], { zIndex: 2 })
          .set(slides[next], {
            autoAlpha: 1,
            zIndex: 3,
            xPercent: d * 80,
            rotation: d * 9,
            scale: 0.88,
            clipPath: `inset(0% ${d < 0 ? 45 : 0}% 0% ${d > 0 ? 45 : 0}% round 12px)`,
          })
          .set(captions[next], {
            autoAlpha: 1,
            y: d * 28,
            clipPath: "inset(0% 0% 100% 0%)",
          })
          .to(
            slides[old],
            {
              xPercent: -d * 42,
              rotation: -d * 10,
              scale: 0.88,
              autoAlpha: 0,
              duration: 0.78,
            },
            0,
          )
          .to(
            captions[old],
            {
              y: -d * 22,
              clipPath: "inset(100% 0% 0% 0%)",
              autoAlpha: 0,
              duration: 0.28,
              ease: "power2.in",
            },
            0,
          )
          .to(
            slides[next],
            {
              xPercent: 0,
              rotation: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 12px)",
              duration: 0.9,
              ease: "power3.out",
            },
            0.08,
          )
          .to(
            captions[next],
            {
              y: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.58,
              ease: "power3.out",
            },
            0.3,
          )
          .to(
            backs,
            { rotation: (i) => (i ? 9 : -9), scale: 0.92, duration: 0.35 },
            0,
          )
          .to(
            backs,
            {
              rotation: (i) => (i ? 5 : -5),
              scale: 0.96,
              duration: 0.6,
              ease: "power3.out",
            },
            0.35,
          );
        timeline.play(0);
      });
  }
  function keyboard(e) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const d = e.key === "ArrowLeft" ? -1 : 1;
    choose(e.key === "Home" ? 0 : e.key === "End" ? 2 : current.current + d, d);
  }
  return (
    <section id="about" className="about reveal" ref={root}>
      <svg
        className="chapter-watermark"
        aria-hidden="true"
        viewBox="0 0 260 240"
      >
        <text x="0" y="210">
          01
        </text>
      </svg>
      <div className="about-heading">
        <p className="kicker">
          <b>01 /</b> About me
        </p>
        <Heading>
          A little technical.
          <br />A little people person.
          <br />
          <em>A lot of curiosity.</em>
        </Heading>
      </div>
      <div className="about-copy">
        <p>
          I’m Tiesha, a Computer Engineering student specializing in
          Cybersecurity, IoT, and Blockchain. I’m curious about technology,
          products, and how people use them.
        </p>
        <p>
          I enjoy testing ideas, spotting what could work better, and bringing
          teams together. I’m still exploring where I’d like to go deeper—and
          learning as I go.
        </p>
        <div className="tags">
          <span className="tag">Technology</span>
          <span className="tag">Products & testing</span>
          <span className="tag">People & teams</span>
        </div>
        <div
          className="gallery-caption-stage"
          aria-live="polite"
          aria-atomic="true"
        >
          {photos.map((photo, i) => (
            <div
              className="gallery-caption"
              data-active={selected === i}
              aria-hidden={selected !== i}
              key={photo.base}
            >
              <span className="story-number" aria-hidden="true">
                0{i + 1} / 03
              </span>
              <h3>{photo.heading}</h3>
              <p>{photo.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div
        className="about-photo about-gallery"
        role="region"
        aria-roledescription="carousel"
        aria-label="A little more about me: photo gallery"
        tabIndex={0}
        onKeyDown={keyboard}
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
            const dx = e.clientX - start.x,
              dy = e.clientY - start.y;
            if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) {
              const d = dx < 0 ? 1 : -1;
              choose(current.current + d, d);
            }
          }}
        >
          {[-1, 1].map((offset, i) => (
            <div
              key={offset}
              className={`gallery-back-card ${i ? "back-two" : "back-one"}`}
              aria-hidden="true"
              style={{
                backgroundImage: `linear-gradient(#19271e66,#19271e66),url(/${photos[(selected + offset + 3) % 3].base}-640.webp)`,
              }}
            />
          ))}
          {photos.map((photo, i) => (
            <div
              key={photo.base}
              className="gallery-slide"
              data-active={selected === i}
              aria-hidden={selected !== i}
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
                  loading="lazy"
                  decoding="async"
                  width="1280"
                  height="1600"
                />
              </div>
            </div>
          ))}
        </figure>
        <div className="gallery-controls">
          <button
            type="button"
            className="gallery-arrow"
            aria-label="Previous About photo"
            onClick={() => choose(current.current - 1, -1)}
          >
            ←
          </button>
          <p className="gallery-counter" aria-live="off">
            {String(selected + 1).padStart(2, "0")} / 03
          </p>
          <button
            type="button"
            className="gallery-arrow"
            aria-label="Next About photo"
            onClick={() => choose(current.current + 1, 1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
