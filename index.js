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
        //   // Crop the input video to a square
        //   "[0:v]crop=ih:ih:(iw-ih)/2:0[cropped]",
        //   // Create a circular mask and apply it to the cropped video
        //   "[cropped]geq='if(lt(sqrt(pow(X-(W/2),2)+pow(Y-(H/2),2)),(H/2)),255,0)*255:128:128,format=yuv444p[circle]",
        //   // Overlay the circular masked video onto the second input
        //   "[1:v][circle]overlay=" + videoPosition + "[outv]",

        "[0:v]scale=1920x1080,setsar=1[v]",
        "[1:v]scale=" + videoSize + ",setsar=1[fg]",
        "[v][fg]overlay=" + videoPosition + "[outv]",
      ])
      .output(outputFilePath)
      .outputOptions(
        "-map",
        "[outv]",
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

// ffmpeg -i output_video.mov -filter_complex "[0:v]crop=ih:ih:(iw-ih)/2:0[cropped];[cropped]geq='if(lt(sqrt(pow(X-(W/2),2)+pow(Y-(H/2),2)),(H/2)),255,0)*p(X,Y)':a=0[circle]" -c:v qtrle circle_temp.mov
