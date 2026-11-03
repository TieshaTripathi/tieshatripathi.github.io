import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
const baseline = JSON.parse(
  readFileSync(
    new URL("../scripts/content-baseline.json", import.meta.url),
    "utf8",
  ),
);

test("content, assets, layout and interactions", async ({ page }, testInfo) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Tiesha", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause animations" }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-hero.png`,
  });
  let preservedText = await page.locator("main").textContent();
  for (const role of [
    "General Secretary",
    "Co-Organizer",
    "Management & Outreach Coordinator",
  ]) {
    const button = page.getByRole("button", { name: new RegExp(role) });
    await button.click();
    preservedText += " " + (await button.textContent());
    await button.click();
  }
  const normalize = (text) => text.replace(/\s+/g, "");
  // User-requested replacements: placeholder photos/captions and leadership wording.
  const rewrittenRoles = baseline.fragments.filter((text) =>
    /^I help coordinate student council|^I helped organize our TEDx|^I helped plan CyberStorm/.test(
      text,
    ),
  );
  for (const fragment of baseline.fragments
    .map((text) => text.replace("Choose a project to take a closer look ↗", ""))
    .filter(
      (text) =>
        ![
          "A space for a community moment.",
          "A moment worth sharing.",
          ...rewrittenRoles,
        ].includes(text),
    ))
    expect(normalize(preservedText)).toContain(normalize(fragment));
  for (const id of [
    "about",
    "projects",
    "experience",
    "leadership",
    "contact",
  ]) {
    await page.locator("#" + id).scrollIntoViewIfNeeded();
    await expect(page.locator("#" + id)).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const overflowing = await page
      .locator("#" + id + " img")
      .evaluateAll((imgs) =>
        imgs
          .filter((img) => {
            const r = img.getBoundingClientRect();
            return r.width > 0 && (r.left < -2 || r.right > innerWidth + 2);
          })
          .map((img) => img.src),
      );
    expect(overflowing).toEqual([]);
    await page
      .locator("#" + id)
      .screenshot({ path: `test-results/${testInfo.project.name}-${id}.png` });
  }
  for (const href of new Set(
    baseline.links.filter((link) => !link.startsWith("#")),
  ))
    await expect(page.locator(`a[href="${href}"]`).first()).toBeAttached();
  await page
    .getByRole("button", { name: "Explore Digital Truth Machine" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Digital Truth Machine", exact: true }),
  ).toBeFocused();
  await expect(page.locator("video")).toHaveAttribute("controls", "");
  await expect(page.locator("video source")).toHaveAttribute(
    "src",
    "/truth-machine-demo.mp4",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Explore Digital Truth Machine" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Explore VERITAS Vault" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View repository ↗" }),
  ).toHaveAttribute("href", "https://github.com/TieshaTripathi/VERITAS-Vault");
  await page.getByRole("button", { name: "Back to projects" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const card = page.getByRole("button", { name: /General Secretary/ });
  await card.click();
  await expect(card).toHaveAttribute("aria-expanded", "true");
  await card.locator(".role-photo").click();
  await expect(card).toHaveAttribute("aria-expanded", "false");
  await card.press("Enter");
  await expect(card).toHaveAttribute("aria-expanded", "true");
  await page.locator("#leadership").screenshot({
    path: `test-results/${testInfo.project.name}-leadership.png`,
  });
  await page.getByRole("button", { name: /Co-Organizer/ }).click();
  await expect(card).toHaveAttribute("aria-expanded", "false");
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter((img) => img.getBoundingClientRect().width > 0)
            .every((img) => img.complete && img.naturalWidth > 0),
        ),
    )
    .toBe(true);
  const images = await page.locator("img").evaluateAll((imgs) =>
    imgs
      .filter((img) => img.getBoundingClientRect().width > 0)
      .map((img) => ({
        src: img.src,
        ok: img.complete && img.naturalWidth > 0,
      })),
  );
  expect(
    images.every((img) => img.ok),
    JSON.stringify(images),
  ).toBe(true);
  const form = page.locator("form");
  await expect(form).toHaveAttribute(
    "action",
    "https://formsubmit.co/tieshatripathiwork14@gmail.com",
  );
  await expect(page.getByLabel("Your email", { exact: true })).toHaveAttribute(
    "type",
    "email",
  );
  expect(await form.evaluate((el) => el.checkValidity())).toBe(false);
  if (testInfo.project.name.includes("mobile")) {
    await page.getByRole("button", { name: "Menu +" }).click();
    await expect(page.getByRole("navigation")).toBeVisible();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "About", exact: true })
      .click();
    await expect(page.getByRole("button", { name: "Menu +" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  }
  await page.getByRole("link", { name: "tiesha." }).click();
  await expect(page.locator(".nav-links a[aria-current]")).toHaveCount(0);
  await page
    .locator("#photo-input")
    .setInputFiles("public/leadership-portrait.jpg");
  await expect(page.locator(".photo-caption")).toHaveText(
    "Photo preview · this session only",
  );
  await expect(page.locator("#portrait-image")).toHaveAttribute(
    "src",
    /^blob:/,
  );
  await page.reload();
  await expect(page.locator("#portrait-image")).toHaveAttribute(
    "src",
    "/professional-portrait-cutout-1280.webp",
  );
  expect(errors).toEqual([]);
});

test("reduced motion and accessibility", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Pause animations" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /General Secretary/ }).click();
  const report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(report.violations).toEqual([]);
  await page
    .getByRole("button", { name: "Explore Digital Truth Machine" })
    .click();
  const modalReport = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(modalReport.violations).toEqual([]);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Back to projects" }),
  ).toBeFocused();
});

test("animated scrolling and responsive resize", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1800);
  await page
    .getByRole("link", { name: "About", exact: true })
    .first()
    .isVisible();
  for (const id of ["about", "projects", "experience", "leadership"]) {
    await page.locator("#" + id).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    expect(
      await page
        .locator("#" + id + " h2")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    ).toBe(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: /General Secretary/ }).click();
  await page.waitForTimeout(800);
  await page
    .getByRole("button", { name: /General Secretary/ })
    .locator(".role-description")
    .click();
  await page.waitForTimeout(800);
  await expect(
    page.getByRole("button", { name: /General Secretary/ }),
  ).toHaveAttribute("aria-expanded", "false");
  await page
    .getByRole("button", { name: "Explore Digital Truth Machine" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.locator("#top").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("hero interaction, clear portrait and About alignment", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.waitForTimeout(1900);
  const image = page.locator("#portrait-image");
  await expect(image).toHaveAttribute(
    "src",
    "/professional-portrait-cutout-1280.webp",
  );
  await expect
    .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
    .toBe(true);
  const orbit = page.locator(".hero-orbit");
  const first = await orbit.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(350);
  expect(await orbit.evaluate((el) => getComputedStyle(el).transform)).not.toBe(
    first,
  );
  const scene = page.locator(".portrait-interaction");
  const heroBox = await page.locator(".hero").boundingBox();
  await page.mouse.move(heroBox.x + heroBox.width * 0.2, heroBox.y + 170);
  await page.waitForTimeout(150);
  const before = await scene.evaluate((el) => getComputedStyle(el).transform);
  await page.mouse.move(heroBox.x + heroBox.width * 0.8, heroBox.y + 220);
  await expect
    .poll(() => scene.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(before);
  const rect = await image.boundingBox();
  const face = {
    left: rect.x + rect.width * 0.25,
    right: rect.x + rect.width * 0.8,
    top: rect.y + rect.height * 0.08,
    bottom: rect.y + rect.height * 0.5,
  };
  for (const selector of [".card-code", ".card-github", ".photo-button"]) {
    const box = await page.locator(selector).boundingBox();
    expect(
      box.x + box.width <= face.left ||
        box.x >= face.right ||
        box.y + box.height <= face.top ||
        box.y >= face.bottom,
      `${selector} must not cover the face`,
    ).toBe(true);
  }
  const picker = await page.locator(".photo-button").boundingBox();
  for (const selector of [".card-code", ".card-github"]) {
    const badge = await page.locator(selector).boundingBox();
    expect(
      picker.x + picker.width <= badge.x ||
        picker.x >= badge.x + badge.width ||
        picker.y + picker.height <= badge.y ||
        picker.y >= badge.y + badge.height,
      "Hero cards must leave the photo picker usable",
    ).toBe(true);
  }
  const products = page
    .locator(".hero-pillars")
    .getByRole("button", { name: /Products/ });
  await products.click();
  await expect(products).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".hero")).toHaveAttribute("data-interest", "1");
  await expect(page.locator(".changing")).toHaveText("Product & testing");
  await expect(page.locator(".interest-indicator")).toHaveCount(1);
  const people = page
    .locator(".hero-pillars")
    .getByRole("button", { name: /People/ });
  await people.press("Enter");
  await expect(people).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".hero")).toHaveAttribute("data-interest", "2");
  await page.getByRole("button", { name: "Pause animations" }).click();
  const stopped = await orbit.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(200);
  expect(await orbit.evaluate((el) => getComputedStyle(el).transform)).toBe(
    stopped,
  );
  await page.locator("#about").scrollIntoViewIfNeeded();
  const title = await page.locator("#about h2").boundingBox(),
    frame = await page.locator("#about .about-moment").boundingBox(),
    copy = await page.locator(".about-copy").boundingBox();
  if (testInfo.project.use.viewport.width > 700) {
    expect(Math.abs(title.y - frame.y)).toBeLessThan(3);
    expect(Math.abs(title.x - copy.x)).toBeLessThan(2);
  } else {
    expect(Math.abs(title.x - frame.x)).toBeLessThan(2);
    expect(frame.y).toBeGreaterThan(copy.y + copy.height);
  }
  await page.locator("#about").screenshot({
    path: `test-results/${testInfo.project.name}-about-revised.png`,
  });
});

test("synchronized About photos and existing leadership expansion", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause animations" }).click();
  const about = page.locator("#about"),
    gallery = about.locator(".about-gallery");
  await about.scrollIntoViewIfNeeded();
  const headings = [
    "A little more than a title.",
    "Beyond the classroom.",
    "Learning to take the mic.",
  ];
  const bases = ["about-campus-portrait", "about-moment", "about-podium"];
  const descriptions = [
    "I’m still figuring things out, following my curiosity, and making time to try something new.",
    "Some of my favourite experiences have come from bringing people together around an idea or an event.",
    "Whether I’m behind the scenes or speaking to a room, I’m learning to feel more at home in each role.",
  ];
  for (let i = 0; i < 3; i++) {
    await expect(gallery.locator(".gallery-counter")).toHaveText(
      `0${i + 1} / 03`,
    );
    await expect(
      about.locator(".gallery-caption[data-active=true] h3"),
    ).toHaveText(headings[i]);
    await expect(
      about.locator(".gallery-caption[data-active=true] p"),
    ).toHaveText(descriptions[i]);
    await expect(
      gallery.locator(".gallery-slide[data-active=true] img"),
    ).toHaveAttribute("src", `/${bases[i]}-1280.webp`);
    await expect(
      about.locator(".about-copy .gallery-caption[data-active=true]"),
    ).toBeVisible();
    expect(
      await gallery
        .locator(".gallery-caption-stage,.gallery-thumbnails")
        .count(),
    ).toBe(0);
    await gallery.getByRole("button", { name: "Next About photo" }).click();
  }
  await expect(gallery.locator(".gallery-counter")).toHaveText("01 / 03");
  for (const [name, src] of [
    [/General Secretary/, "general-secretary-event"],
    [/Co-Organizer/, "leadership-event"],
    [/Management & Outreach Coordinator/, "gdg-community"],
  ]) {
    const role = page.getByRole("button", { name });
    await role.click();
    await expect(role).toHaveAttribute("aria-expanded", "true");
    await expect(role.locator(".role-photo img")).toHaveAttribute(
      "src",
      `/${src}-1280.webp`,
    );
    await expect(role.locator(".role-description")).not.toBeEmpty();
    await role.locator(".role-photo").click();
    await expect(role).toHaveAttribute("aria-expanded", "false");
  }
});

test("GSAP About timeline stays synchronized and stable under rapid input", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const about = page.locator("#about"),
    gallery = about.locator(".about-gallery");
  await about.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const initialHeight = (await about.boundingBox()).height;
  for (const [key, count] of [
    ["ArrowRight", 2],
    ["ArrowRight", 3],
    ["ArrowRight", 1],
    ["ArrowLeft", 3],
    ["ArrowLeft", 2],
    ["ArrowLeft", 1],
  ]) {
    await gallery.focus();
    await gallery.press(key);
    await expect(gallery.locator(".gallery-counter")).toHaveText(
      `0${count} / 03`,
    );
    await expect(about).toHaveAttribute("data-transitioning", "false");
    await expect
      .poll(() =>
        about
          .locator(".gallery-slide[data-active=true]")
          .getAttribute("aria-hidden"),
      )
      .toBe("false");
    const photoIndex = await about
      .locator(".gallery-slide[data-active=true]")
      .evaluate((el) =>
        [...el.parentNode.querySelectorAll(".gallery-slide")].indexOf(el),
      );
    const textIndex = await about
      .locator(".gallery-caption[data-active=true]")
      .evaluate((el) => [...el.parentNode.children].indexOf(el));
    expect(textIndex).toBe(photoIndex);
    await expect(
      gallery.locator(".gallery-slide[data-active=true]"),
    ).toBeVisible();
    expect(
      Math.abs((await about.boundingBox()).height - initialHeight),
    ).toBeLessThan(2);
  }
  await gallery
    .getByRole("button", { name: "Next About photo" })
    .click({ clickCount: 6, delay: 35 });
  await gallery.focus();
  await gallery.press("End");
  await expect(gallery.locator(".gallery-counter")).toHaveText("03 / 03");
  await expect(about).toHaveAttribute("data-transitioning", "false");
  await expect(
    about.locator(".gallery-caption[data-active=true] h3"),
  ).toHaveText("Learning to take the mic.");
  await gallery.press("Home");
  await expect(gallery.locator(".gallery-counter")).toHaveText("01 / 03");
  await expect(about).toHaveAttribute("data-transitioning", "false");
  await gallery.getByRole("button", { name: "Next About photo" }).click();
  await expect(gallery.locator(".gallery-counter")).toHaveText("02 / 03");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(about).toHaveAttribute("data-transitioning", "false");
  await expect(
    about.locator(".gallery-caption[data-active=true] h3"),
  ).toHaveText("Beyond the classroom.");
  await gallery.getByRole("button", { name: "Next About photo" }).click();
  await expect(gallery.locator(".gallery-counter")).toHaveText("03 / 03");
  await about.screenshot({
    path: `test-results/${testInfo.project.name}-synchronized-about.png`,
  });
});

test("About touch swipes and natural vertical scrolling", async ({
  browser,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "Real touch behavior uses the requested mobile viewport",
  );
  const context = await browser.newContext({
    viewport: testInfo.project.use.viewport,
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5175/");
  await page.locator(".hero-pillars > button").nth(1).tap();
  await expect(page.locator(".changing")).toHaveText("Product & testing");
  const about = page.locator("#about"),
    gallery = about.locator(".about-gallery"),
    frame = gallery.locator(".about-moment");
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const cdp = await context.newCDPSession(page);
  async function swipe(dx, dy) {
    const r = await frame.boundingBox(),
      x = r.x + r.width * (dx < 0 ? 0.8 : 0.2),
      y = r.y + r.height * 0.55;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    for (let i = 1; i <= 8; i++)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x + (dx * i) / 8, y: y + (dy * i) / 8 }],
      });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  for (const count of [2, 3, 1]) {
    await swipe(-140, 5);
    await expect(gallery.locator(".gallery-counter")).toHaveText(
      `0${count} / 03`,
    );
    await expect(about).toHaveAttribute("data-transitioning", "false");
  }
  await swipe(140, 5);
  await expect(gallery.locator(".gallery-counter")).toHaveText("03 / 03");
  await expect(about).toHaveAttribute("data-transitioning", "false");
  const before = await page.evaluate(() => scrollY);
  await swipe(0, -130);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  await expect(gallery.locator(".gallery-counter")).toHaveText("03 / 03");
  await context.close();
});

test("readable hero, shared interest motion and interface cleanup", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1900);
  const name = await page.locator(".giant").boundingBox(),
    photo = await page.locator("#portrait-image").boundingBox();
  expect(name.y + name.height).toBeLessThan(photo.y + photo.height * 0.08);
  expect(await page.locator(".hero-letter").count()).toBe(6);
  expect(await page.locator(".hero-copy-word").count()).toBeGreaterThan(15);
  for (const phrase of [
    "Move your cursor",
    "Choose an interest below",
    "Replay entrance",
    "Motion on",
    "Scroll to explore",
    "Keep scrolling",
  ])
    expect(await page.locator("main").textContent()).not.toContain(phrase);
  const cards = page.locator(".hero-pillars > button");
  for (const i of [1, 2, 0, 2, 1]) {
    await cards.nth(i).focus();
    await expect(cards.nth(i)).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".changing")).toHaveText(
      ["Cybersecurity", "Product & testing", "People & teams"][i],
    );
    await expect(page.locator(".interest-indicator")).toHaveCount(1);
    await expect(cards.nth(i).locator(".interest-indicator")).toBeAttached();
  }
  await cards.evaluateAll((buttons) => {
    for (const i of [0, 2, 1, 0, 1, 2]) buttons[i].focus();
  });
  await expect(cards.nth(2)).toHaveAttribute("aria-pressed", "true");
  await cards.nth(2).hover();
  await expect(cards.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".changing")).toHaveText("People & teams");
  await page.waitForTimeout(500);
  const indicator = await page.locator(".interest-indicator").boundingBox(),
    selected = await cards.nth(2).boundingBox();
  expect(Math.abs(indicator.x - selected.x)).toBeLessThan(2);
  expect(Math.abs(indicator.width - selected.width)).toBeLessThan(2);
  await page.locator(".hero").screenshot({
    path: `test-results/${testInfo.project.name}-refined-hero.png`,
  });
});
