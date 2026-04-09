const { exec } = require("child_process");

const input = process.argv[2];
const output = "compressed.mp4";

const maxSizeBits = 10 * 1024 * 1024 * 8;

exec(
  `ffprobe -v error -show_entries format=duration -of csv="p=0" "${input}"`,
  (err, stdout) => {
    if (err) {
      console.error("❌ ffprobe error:", err);
      return;
    }

    const duration = parseFloat(stdout.trim());
    if (!duration) {
      console.error("❌ Could not read duration");
      return;
    }

    const bitrate = Math.floor(maxSizeBits / duration);

    const command = `ffmpeg -y -i "${input}" -vf "scale=1920:1080" -c:v libx264 -b:v ${bitrate} -preset slow -c:a aac -b:a 128k "${output}"`;

    console.log("Running:", command);

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Compression failed:");
        console.error(stderr);
        return;
      }

      console.log("✅ Video compressed successfully!");
    });
  }
);
