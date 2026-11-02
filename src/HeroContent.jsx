export function HeroContent({
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
          <span className="hand">Hello, I’m Tiesha.</span>
          <h2 className="hero-statement">
            Curiosity
            <br />
            in motion.
          </h2>
          <div className="role">
            Computer Engineering student
            <br />
            Cybersecurity / IoT / Blockchain
          </div>
          <p>
            Exploring technology, products, and people. Learning by building,
            testing, asking questions, and getting involved.
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
          <span className="photo-note">hello, that’s me ↙</span>
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
            <span className="changing" key={word} aria-live="off">
              {words[word]}
            </span>
          </div>
          <p className="hero-interaction-hint">
            <span className="desktop-hint">
              Move your cursor.
              <br />
            </span>
            Choose an interest below <span aria-hidden="true">↓</span>
          </p>
        </div>
      </div>
      <div
        className="hero-pillars"
        role="group"
        aria-label="Choose an area of interest"
      >
        <button
          type="button"
          aria-pressed={interest === 0}
          onClick={() => chooseInterest(0)}
        >
          <span>01 / EXPLORE</span>
          <strong>Technology</strong>
          <p>Building, testing and learning.</p>
          <span className="pillar-arrow" aria-hidden="true">
            ↗
          </span>
        </button>
        <button
          type="button"
          aria-pressed={interest === 1}
          onClick={() => chooseInterest(1)}
        >
          <span>02 / DISCOVER</span>
          <strong>Products</strong>
          <p>Curious about the experience.</p>
          <span className="pillar-arrow" aria-hidden="true">
            ↗
          </span>
        </button>
        <button
          type="button"
          aria-pressed={interest === 2}
          onClick={() => chooseInterest(2)}
        >
          <span>03 / CONNECT</span>
          <strong>People</strong>
          <p>Bringing ideas together.</p>
          <span className="pillar-arrow" aria-hidden="true">
            ↗
          </span>
        </button>
      </div>
      <div className="motion-bar">
        <button className="replay-intro" onClick={replay} type="button">
          Replay entrance ↻
        </button>
        <a className="motion-hint" href="#about">
          Scroll to explore <span>↓</span>
        </a>
        <button
          className="motion-toggle"
          aria-pressed={paused}
          onClick={toggleMotion}
        >
          {paused ? "Motion off ▷" : "Motion on Ⅱ"}
        </button>
      </div>
      <div className="hero-footer">
        <span>Based in Mumbai, India</span>
        <span>Keep scrolling. There’s a little more to me. ↓</span>
      </div>
    </section>
  );
}
