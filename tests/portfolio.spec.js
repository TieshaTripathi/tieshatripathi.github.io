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
  await page.getByRole("button", { name: "Motion on Ⅱ" }).click();
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
  for (const fragment of baseline.fragments)
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
    "/hero-portrait-1280.webp",
  );
  expect(errors).toEqual([]);
});

test("reduced motion and accessibility", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Motion off ▷" }),
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
