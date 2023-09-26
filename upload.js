const axios = require("axios");
const fs = require("fs");

const callMe = async () => {
  const apiKey = "AlboslcRdT9ag77GNc7xEz";
  const uploadUrl = `https://www.filestackapi.com/api/store/S3?key=${apiKey}`;
  let fileData = fs.readFileSync("./../output_video.mp4");

  // Upload the processed video to the specified URL
  const response = await axios.post(uploadUrl, fileData, {
    headers: {
      "Content-Type": "video/mp4",
    },
    params: {
      store: {
        location: "s3",
      },
    },
  });
  console.log("response", response);
};
callMe();
