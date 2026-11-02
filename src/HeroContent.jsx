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
}) {
  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-atmosphere" aria-hidden="true"></div>
      <div className="hero-top">
        <span>A portfolio, and a work in progress.</span>
        <span className="status">Open to learning. Open to possibilities.</span>
      </div>
      <h1 className="giant" aria-label="Tiesha">
        <span className="name-word" aria-hidden="true">
          Tiesha
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
        </div>
        <div className="portrait-wrap">
          <span className="float-card card-code" aria-hidden="true">
            <b>&lt;/&gt;</b>
            <span>ideas → experiments</span>
          </span>
          <span className="float-card card-github" aria-hidden="true">
            <b>↗</b>
            <span>learning in public</span>
          </span>
          <div className="portrait">
            <div className="portrait-empty" aria-hidden="true">
              <div className="outline-head"></div>
            </div>
            <img
              className="cutout"
              id="portrait-image"
              alt="Tiesha Tripathi"
              src={photo || "/hero-portrait-1280.webp"}
              srcSet={
                photo
                  ? undefined
                  : "/hero-portrait-640.webp 640w, /hero-portrait-1280.webp 1280w"
              }
              sizes="(max-width:900px) 360px, 40vw"
              width="1280"
              height="1536"
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
        </div>
      </div>
      <div className="hero-pillars" aria-label="My areas of interest">
        <div>
          <span>01 / EXPLORE</span>
          <strong>Technology</strong>
          <p>Building, testing and learning.</p>
        </div>
        <div>
          <span>02 / DISCOVER</span>
          <strong>Products</strong>
          <p>Curious about the experience.</p>
        </div>
        <div>
          <span>03 / CONNECT</span>
          <strong>People</strong>
          <p>Bringing ideas together.</p>
        </div>
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
