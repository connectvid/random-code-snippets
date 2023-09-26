// const puppeteer = require("puppeteer");
// const { createCanvas, loadImage } = require("canvas");
// const GIFEncoder = require("gifencoder");
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffmpeg = require("fluent-ffmpeg");
// const axios = require("axios");
// const fs = require("fs");

// async function generateOutputVideo() {
//   const imageFilePath = `./64cc98a99b8dcf33be0255d4.gif`;
//   const remoteVideoURL =
//     "https://cdn.filestackcontent.com/YWMXrVmgRnecl2NAy2Ae";
//   // set output file path.
//   const outputFilePath = `./64cc98a99b8dcf33be0255d4.mp4`;

//   const videoSize = "640x360";
//   const videoPosition = "1280:720";

//   // set FFmpeg binary path
//   ffmpeg.setFfmpegPath(ffmpegPath);

//   await new Promise((resolve, reject) => {
//     ffmpeg()
//       .input(imageFilePath)
//       .input(remoteVideoURL) // Read input video from the remote URL
//       .complexFilter([
//         "[0:v]scale=1920x1080,setsar=1[v]",
//         "[1:v]scale=" +
//           videoSize +
//           ",setsar=1,geq='if(lt(sqrt((x-320)^2+(y-180)^2),160),255,0)'[fg]",
//         "[v][fg]overlay=" + videoPosition + "[outv]",
//       ])
//       .output(outputFilePath)
//       .outputOptions(
//         "-map",
//         "[outv]",
//         "-map",
//         "1:a",
//         "-c:a",
//         "copy",
//         "-preset",
//         "ultrafast",
//         "-crf",
//         "18"
//       )
//       .on("error", (err) => {
//         console.error(`FFmpeg error: ${err.message}`);
//         reject(err);
//       })
//       .on("end", () => {
//         resolve();
//       })
//       .run();
//   });

//   const fileData = fs.readFileSync(outputFilePath);
// }
// generateOutputVideo();

const puppeteer = require("puppeteer");
const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const fs = require("fs");

async function generateOutputVideo() {
  const imageFilePath = `./64cc98a99b8dcf33be0255d4.gif`;
  const remoteVideoURL =
    "https://cdn.filestackcontent.com/YWMXrVmgRnecl2NAy2Ae";
  // set output file path.
  const outputFilePath = `./64cc98a99b8dcf33be0255d4.mp4`;

  const videoSize = "640x360";
  const videoPosition = "1280:720";

  // set FFmpeg binary path
  ffmpeg.setFfmpegPath(ffmpegPath);

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(imageFilePath)
      .input(remoteVideoURL) // Read input video from the remote URL
      .complexFilter([
        `[1:v]scale=${videoSize},setsar=1[v];[0:v][v]overlay=${videoPosition}`,
      ])
      .output(outputFilePath)
      .outputOptions(
        "-map",
        "[out]",
        "-map",
        "1:a",
        "-c:a",
        "copy",
        "-preset",
        "ultrafast",
        "-crf",
        "18"
      )
      .on("error", (err) => {
        console.error(`FFmpeg error: ${err.message}`);
        reject(err);
      })
      .on("end", () => {
        resolve();
      })
      .run();
  });

  const fileData = fs.readFileSync(outputFilePath);
}
generateOutputVideo();
