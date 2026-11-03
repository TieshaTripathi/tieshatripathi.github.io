import { AnimatePresence, LayoutGroup, motion } from "motion/react";

function RevealWords({ text }) {
  return (
    <>
      {text.split(/(\s+)/).map((word, i) =>
        /\s/.test(word) ? (
          word
        ) : (
          <span className="hero-word-mask" key={i}>
            <span className="hero-copy-word">{word}</span>
          </span>
        ),
      )}
    </>
  );
}

export function HeroContent({
  heroRef,
  inputRef,
  photo,
  changePhoto,
  paused,
  toggleMotion,
  word,
  words,
  interest,
  chooseInterest,
}) {
  return (
    <section className="hero" ref={heroRef} data-interest={interest}>
      <div className="hero-atmosphere" aria-hidden="true"></div>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-top">
        <span>A portfolio, and a work in progress.</span>
        <span className="status">Open to learning. Open to possibilities.</span>
      </div>
      <h1 className="giant" aria-label="Tiesha">
        <span className="hero-name-parallax" aria-hidden="true">
          <span className="name-word">
            {"Tiesha".split("").map((letter, i) => (
              <span className="hero-letter" key={i}>
                {letter}
              </span>
            ))}
          </span>
        </span>
      </h1>
      <div className="hero-body">
        <div className="intro">
          <span className="hand">
            <RevealWords text="Hello, I’m Tiesha." />
          </span>
          <h2 className="hero-statement">
            <RevealWords text="Curiosity" />
            <br />
            <RevealWords text="in motion." />
          </h2>
          <div className="role">
            Computer Engineering student
            <br />
            Cybersecurity / IoT / Blockchain
          </div>
          <p>
            <RevealWords text="Exploring technology, products, and people. Learning by building, testing, asking questions, and getting involved." />
          </p>
          <a className="hero-work-link" href="#projects">
            Explore my work <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="portrait-wrap">
          <div className="hero-orbit" aria-hidden="true">
            <span />
            <span />
            <i />
          </div>
          <a
            className="float-card card-code"
            href="#projects"
            aria-label="Explore projects: ideas to experiments"
          >
            <b>&lt;/&gt;</b>
            <span>ideas → experiments</span>
          </a>
          <a
            className="float-card card-github"
            href="https://github.com/TieshaTripathi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub: learning in public"
          >
            <b>↗</b>
            <span>learning in public</span>
          </a>
          <div className="portrait-interaction">
            <div className="portrait-float">
              <div className="portrait">
                <div className="portrait-empty" aria-hidden="true">
                  <div className="outline-head"></div>
                </div>
                <img
                  className="cutout"
                  id="portrait-image"
                  alt="Tiesha Tripathi"
                  src={photo || "/professional-portrait-cutout-1280.webp"}
                  srcSet={
                    photo
                      ? undefined
                      : "/professional-portrait-cutout-640.webp 640w, /professional-portrait-cutout-1280.webp 1280w"
                  }
                  sizes="(max-width:900px) 360px, 40vw"
                  width="1122"
                  height="1402"
                  fetchPriority="high"
                />
                <span className="photo-caption">
                  {photo
                    ? "Photo preview · this session only"
                    : "Tiesha Tripathi · Mumbai"}
                </span>
                <button
                  className="photo-button"
                  id="photo-picker"
                  onClick={() => inputRef.current.click()}
                >
                  Change photo ↗
                </button>
                <input
                  type="file"
                  id="photo-input"
                  ref={inputRef}
                  onChange={changePhoto}
                  accept="image/*"
                  hidden
                />
              </div>
            </div>
          </div>
        </div>
        <div className="hero-aside">
          <span className="asterisk" aria-hidden="true">
            ✳
          </span>
          <p>
            Curious about the tech.
            <br />
            Thoughtful about the experience.
            <br />
            Interested in the people.
          </p>
          <div className="exploring">
            Currently exploring
            <div
              className="interest-copy-stage"
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={interest}
                  initial={{
                    y: paused ? 0 : 20,
                    opacity: paused ? 1 : 0,
                    clipPath: "inset(0 0 100% 0)",
                  }}
                  animate={{ y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                  exit={{
                    y: paused ? 0 : -15,
                    opacity: 0,
                    clipPath: "inset(100% 0 0 0)",
                  }}
                  transition={{
                    duration: paused ? 0 : 0.24,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span className="changing">{words[word]}</span>
                  <p className="interest-description">
                    {
                      [
                        "Building, testing and learning.",
                        "Curious about the experience.",
                        "Bringing ideas together.",
                      ][interest]
                    }
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <LayoutGroup id="hero-interests">
        <div
          className="hero-pillars"
          role="group"
          aria-label="Choose an area of interest"
        >
          <button
            type="button"
            aria-pressed={interest === 0}
            onClick={() => chooseInterest(0)}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") chooseInterest(0);
            }}
            onFocus={() => chooseInterest(0)}
          >
            <span>01 / EXPLORE</span>
            <strong>Technology</strong>
            {interest === 0 && (
              <motion.span
                className="interest-indicator"
                layoutId="interest-underline"
                aria-hidden="true"
                transition={
                  paused
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 330, damping: 34 }
                }
              />
            )}
            <p>Building, testing and learning.</p>
            <span className="pillar-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
          <button
            type="button"
            aria-pressed={interest === 1}
            onClick={() => chooseInterest(1)}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") chooseInterest(1);
            }}
            onFocus={() => chooseInterest(1)}
          >
            <span>02 / DISCOVER</span>
            <strong>Products</strong>
            {interest === 1 && (
              <motion.span
                className="interest-indicator"
                layoutId="interest-underline"
                aria-hidden="true"
                transition={
                  paused
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 330, damping: 34 }
                }
              />
            )}
            <p>Curious about the experience.</p>
            <span className="pillar-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
          <button
            type="button"
            aria-pressed={interest === 2}
            onClick={() => chooseInterest(2)}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") chooseInterest(2);
            }}
            onFocus={() => chooseInterest(2)}
          >
            <span>03 / CONNECT</span>
            <strong>People</strong>
            {interest === 2 && (
              <motion.span
                className="interest-indicator"
                layoutId="interest-underline"
                aria-hidden="true"
                transition={
                  paused
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 330, damping: 34 }
                }
              />
            )}
            <p>Bringing ideas together.</p>
            <span className="pillar-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        </div>
      </LayoutGroup>
      <div className="hero-footer">
        <span>Based in Mumbai, India</span>
        <button
          className="motion-toggle motion-icon"
          type="button"
          aria-label="Pause animations"
          aria-pressed={paused}
          title={paused ? "Resume animations" : "Pause animations"}
          onClick={toggleMotion}
        >
          <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
        </button>
      </div>
    </section>
  );
}
