const puppeteer = require("puppeteer");
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const fs = require("fs");

async function takeScreenshot(url, fileName) {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 720 });

  await page.goto(url, { waitUntil: "networkidle2" });

  let height = await page.evaluate(() => document.documentElement.scrollHeight);
  const width = await page.evaluate(() => document.documentElement.scrollWidth);

  const canvas = createCanvas(width, 720);
  const ctx = canvas.getContext("2d");

  const encoder = new GIFEncoder(width, 720);
  encoder.createReadStream().pipe(fs.createWriteStream(`${fileName}.gif`));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(25);
  encoder.setQuality(10);

  const stickyContentLoadDelay = 100; // Adjust this value as needed

  // Cursor movement animation settings
  const cursorAnimationFrames = 900; // Adjust the number of frames for the cursor animation
  const startX1 = 100;
  const startY1 = 200;
  const endX1 = 1000;
  const endY1 = 700;
  const startX2 = 1000;
  const startY2 = 700;
  const endX2 = 900;
  const endY2 = 500;
  let i = 0;
  let scrollSpeed = 180; // The default scroll speed
  while (i < height - 720) {
    // Randomly slow down or speed up the scrolling
    const random = Math.random() * 10;
    if (random > 5) {
      scrollSpeed += 2;
    } else if (random < 5) {
      scrollSpeed -= 2;
    }

    if (scrollSpeed < -2) {
      scrollSpeed = 18;
    } else if (scrollSpeed > 28) {
      scrollSpeed = 18;
    }

    // Scroll the page
    await page.evaluate((y) => {
      window.scrollTo(0, y);
    }, i);

    // Delay for sticky content to load
    await page.waitForTimeout(stickyContentLoadDelay);

    // Take a screenshot
    const screenshot = await page.screenshot({
      clip: {
        x: 0,
        y: i,
        width: width,
        height: 720,
      },
    });

    const image = await loadImage(screenshot);
    ctx.drawImage(image, 0, 0);

    // Calculate the current cursor position based on the animation progress
    let cursorX, cursorY;
    if (i < cursorAnimationFrames) {
      const progress = i / cursorAnimationFrames;
      cursorX = Math.min(startX1 + progress * (endX1 - startX1), width - 1);
      cursorY = Math.min(startY1 + progress * (endY1 - startY1), 720 - 1);
    } else {
      const progress = (i - cursorAnimationFrames) / cursorAnimationFrames;
      cursorX = Math.min(startX2 + progress * (endX2 - startX2), width - 1);
      cursorY = Math.min(startY2 + progress * (endY2 - startY2), 720 - 1);
    }

    await drawCursor(ctx, cursorX, cursorY);

    encoder.addFrame(ctx);
    i += scrollSpeed;
    console.log({ i, scrollSpeed });
  }

  encoder.finish();
  await browser.close();
}

// Function to draw the cursor image on the canvas
async function drawCursor(ctx, x, y) {
  const cursorImage = await loadImage("./cursor.png"); // Replace with the actual path to your transparent cursor image
  const cursorSize = 22; // Adjust the size of the cursor image
  ctx.drawImage(
    cursorImage,
    x - cursorSize / 2,
    y - cursorSize / 2,
    cursorSize,
    cursorSize
  );
}

takeScreenshot("https://leadforest.io/", "./leadforest.mp4");
