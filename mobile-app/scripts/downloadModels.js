/**
 * Download real .tflite model files for development/testing.
 *
 * Run: node scripts/downloadModels.js
 *
 * Models are downloaded from their respective sources and placed
 * in the expected paths under src/ai/models/.
 *
 * Required models:
 *   - face_detection.tflite  (BlazeFace, ~2MB)
 *   - facemesh.tflite        (FaceMesh, ~5MB)
 *   - mobilefacenet.tflite   (MobileFaceNet, ~5MB)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.resolve(__dirname, '..', 'src', 'ai', 'models');

const MODEL_URLS = {
  'detection/face_detection.tflite':
    'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
  'landmarks/facemesh.tflite':
    'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.tflite',
  'recognition/mobilefacenet.tflite':
    'https://github.com/serengil/deepface_models/releases/download/v1.0/facenet512_weights.tflite',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    console.log(`Downloading ${path.basename(dest)}...`);
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          file.close();
          fs.unlinkSync(dest);
          download(response.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`HTTP ${response.statusCode} for ${url}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const size = fs.statSync(dest).size;
          console.log(`  Done: ${(size / 1024 / 1024).toFixed(1)} MB`);
          resolve();
        });
      })
      .on('error', (err) => {
        file.close();
        fs.unlinkSync(dest, () => {});
        reject(err);
      });
  });
}

async function main() {
  let count = 0;
  for (const [relativePath, url] of Object.entries(MODEL_URLS)) {
    const dest = path.join(MODELS_DIR, relativePath);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1024) {
      console.log(`Skipping ${relativePath} (already exists)`);
      continue;
    }
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    try {
      await download(url, dest);
      count++;
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
  }
  if (count === 0) {
    console.log('All models already downloaded.');
  } else {
    console.log(`\nDownloaded ${count} model(s). Restart Metro for changes to take effect.`);
  }
}

main().catch(console.error);
