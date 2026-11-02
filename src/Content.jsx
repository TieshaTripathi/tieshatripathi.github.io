import Heading from "./Heading";
import { Hero, Projects, Leadership, Experience } from "./components";
import { experienceRoles } from "./data";
export default function Content({ paused, toggleMotion }) {
  return (
    <main id="top">
      <div className="shell">
        <Hero paused={paused} toggleMotion={toggleMotion} />
      </div>
      <div className="ribbon" aria-hidden="true">
        <div className="ribbon-track">
          <span>
            TECHNOLOGY <b>✳</b> PRODUCT THINKING <b>✳</b> TEAMWORK <b>✳</b>{" "}
            LEARNING BY DOING <b>✳</b> ALWAYS EXPLORING <b>✳</b>
          </span>
          <span>
            TECHNOLOGY <b>✳</b> PRODUCT THINKING <b>✳</b> TEAMWORK <b>✳</b>{" "}
            LEARNING BY DOING <b>✳</b> ALWAYS EXPLORING <b>✳</b>
          </span>
        </div>
      </div>
      <div className="shell">
        <section id="about" className="about reveal">
          <svg
            className="chapter-watermark"
            aria-hidden="true"
            viewBox="0 0 260 240"
          >
            <text x="0" y="210">
              01
            </text>
          </svg>
          <div>
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
              I enjoy testing ideas, spotting what could work better, and
              bringing teams together. I’m still exploring where I’d like to go
              deeper—and learning as I go.
            </p>
            <div className="tags">
              <span className="tag">Technology</span>
              <span className="tag">Products & testing</span>
              <span className="tag">People & teams</span>
            </div>
          </div>
          <div className="about-photo" aria-label="A moment at TEDxSIESGST">
            <span>A LITTLE MORE ME</span>
            <figure className="about-moment">
              <img
                src="/about-moment-1280.webp"
                srcSet="/about-moment-640.webp 640w, /about-moment-1280.webp 1280w"
                sizes="(max-width:700px) 90vw, 40vw"
                width="1280"
                height="1600"
                decoding="async"
                loading="lazy"
                alt="Tiesha at TEDxSIESGST"
              />
              <figcaption>A moment worth sharing.</figcaption>
            </figure>
          </div>
        </section>
        <section id="projects" className="reveal">
          <svg
            className="chapter-watermark"
            aria-hidden="true"
            viewBox="0 0 260 240"
          >
            <text x="0" y="210">
              02
            </text>
          </svg>
          <div className="section-heading">
            <div>
              <p className="kicker">
                <b>02 /</b> Selected projects
              </p>
              <Heading>Learning, in practice.</Heading>
            </div>
            <p>
              Two selected projects. Different problems.
              <br />A focused look at what I’ve been exploring.
              <br />
              Choose a project to take a closer look ↗
            </p>
          </div>
          <Projects paused={paused} />
          <a
            className="more-work"
            href="https://github.com/TieshaTripathi"
            target="_blank"
            rel="noopener noreferrer"
          >
            More experiments on GitHub <span>↗</span>
          </a>
        </section>
        <section id="experience" className="experience reveal">
          <svg
            className="chapter-watermark"
            aria-hidden="true"
            viewBox="0 0 260 240"
          >
            <text x="0" y="210">
              03
            </text>
          </svg>
          <div>
            <p className="kicker">
              <b>03 /</b> Experience
            </p>
            <Heading>
              Different roles.
              <br />
              New perspectives.
            </Heading>
            <p className="aside-copy">
              From marketing and outreach to cybersecurity fundamentals — a
              chance to see how different kinds of work come together.
            </p>
          </div>
          <Experience roles={experienceRoles} paused={paused} />
        </section>
        <section id="leadership" className="leadership reveal">
          <svg
            className="chapter-watermark"
            aria-hidden="true"
            viewBox="0 0 260 240"
          >
            <text x="0" y="210">
              04
            </text>
          </svg>
          <div className="section-heading">
            <div>
              <p className="kicker">
                <b>04 /</b> Leadership
              </p>
              <Heading>
                Making things happen,
                <br />
                <em>together.</em>
              </Heading>
            </div>
            <p>
              From campus events to community building,
              <br />
              these are the teams I’ve been part of.
            </p>
          </div>
          <Leadership paused={paused} />
        </section>
        <aside className="recognition reveal">
          <span className="award" aria-hidden="true">
            ✧
          </span>
          <p>
            <strong>A small milestone I’m proud of.</strong>
            <br />
            1st place in the TECH लेख technical writing competition, organized
            by GDG — a chance to practice making technical ideas easier to
            understand.
          </p>
        </aside>
        <section id="contact" className="contact reveal">
          <svg
            className="chapter-watermark"
            aria-hidden="true"
            viewBox="0 0 260 240"
          >
            <text x="0" y="210">
              05
            </text>
          </svg>
          <div>
            <p className="kicker">
              <b>05 /</b> Let’s connect
            </p>
            <Heading>
              Something interesting
              <br />
              in mind<span>?</span>
            </Heading>
            <p>
              An opportunity, a project, or a good conversation. I’d love to
              hear what you’re working on.
            </p>
            <span className="status">Open to exploring what’s next</span>
          </div>
          <div className="contact-links">
            <a
              className="contact-link"
              href="https://github.com/TieshaTripathi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.12.68-3.78-1.32-3.78-1.32-.51-1.31-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.71 2.62 1.21 3.26.92.1-.72.4-1.21.72-1.49-2.49-.28-5.11-1.24-5.11-5.54 0-1.23.44-2.23 1.15-3.02-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15A10.7 10.7 0 0 1 12 6.15c.95 0 1.9.13 2.8.38 2.13-1.44 3.07-1.15 3.07-1.15.61 1.55.23 2.7.11 2.98.72.79 1.15 1.79 1.15 3.02 0 4.31-2.62 5.25-5.12 5.53.4.35.76 1.04.76 2.1v3.08c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"></path>
                </svg>
              </span>
              GitHub / TieshaTripathi<b>↗</b>
            </a>
            <a
              className="contact-link"
              href="mailto:tieshatripathiwork14@gmail.com"
            >
              <span className="social-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M3 5h3v15H3z"></path>
                  <path fill="#34A853" d="M18 5h3v15h-3z"></path>
                  <path fill="#EA4335" d="M3 5 12 12 21 5v4l-9 7-9-7z"></path>
                  <path fill="#FBBC04" d="m18 7 3-2v5l-3 2z"></path>
                </svg>
              </span>
              tieshatripathiwork14@gmail.com<b>↗</b>
            </a>
            <a
              className="contact-link"
              href="https://www.linkedin.com/in/tieshatripathi14"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M5.2 3a2.2 2.2 0 1 1 0 4.4A2.2 2.2 0 0 1 5.2 3ZM3.4 9h3.6v12H3.4zm5.8 0h3.5v1.6h.1A3.8 3.8 0 0 1 16.2 8.6c3.6 0 4.4 2.3 4.4 5.3V21H17v-6.3c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21H9.2z"></path>
                </svg>
              </span>
              LinkedIn<b>↗</b>
            </a>
            <a
              className="contact-link"
              href="https://x.com/Tieshaaaah"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L5.5 22H2.4l7.3-8.4L1 2h6.5l4.4 6.7zm-1.1 18h1.7L6.5 3.9H4.7z"></path>
                </svg>
              </span>
              X / @Tieshaaaah<b>↗</b>
            </a>
          </div>
          <section className="message-panel" aria-label="Send a message">
            <div>
              <p className="kicker">A NOTE, AN IDEA, A HELLO.</p>
              <h3>Leave me a message.</h3>
              <p>Tell me a little about what you have in mind.</p>
            </div>
            <form
              action="https://formsubmit.co/tieshatripathiwork14@gmail.com"
              method="POST"
            >
              <input
                type="hidden"
                name="_subject"
                value="New message from Tiesha’s portfolio"
              />
              <input type="hidden" name="_template" value="table" />
              <input
                type="text"
                name="_honey"
                className="form-trap"
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="form-row">
                <label>
                  Your name
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength="120"
                  />
                </label>
                <label>
                  Your email
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    maxLength="254"
                  />
                </label>
              </div>
              <label>
                Your message
                <textarea
                  name="message"
                  rows="4"
                  required
                  maxLength="5000"
                  placeholder="An opportunity, a collaboration, or just a hello…"
                ></textarea>
              </label>
              <div className="form-bottom">
                <small>Sent to my inbox via FormSubmit.</small>
                <button type="submit">
                  Send message <span aria-hidden="true">↗</span>
                </button>
              </div>
            </form>
          </section>
        </section>
        <footer>
          <span>
            © <span id="year">{new Date().getFullYear()}</span> Tiesha Tripathi
          </span>
          <span>A work in progress. Just like me.</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
