import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';

const app = express();
const HTTP_PORT = 3070;
const HTTPS_PORT = 3090;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

function getNextFilename() {
  const files = fs.readdirSync(uploadDir);

  const numbers = files
    .filter(file => file.endsWith('.jpg'))
    .map(file => parseInt(path.basename(file, '.jpg'), 10))
    .filter(num => !isNaN(num));

  const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 0;
  return `${String(nextNumber).padStart(3, '0')}.jpg`;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, getNextFilename());
  }
});

const upload = multer({ storage });

app.use(express.static('public'));

app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '没有收到文件' });
  }

  res.json({
    message: '上传成功',
    file: req.file.filename
  });
});

// HTTP
http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`HTTP 服务器已启动: http://localhost:${HTTP_PORT}`);
});

// HTTPS
const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
};

https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS 服务器已启动: https://localhost:${HTTPS_PORT}`);
  console.log(`图片保存目录: ${uploadDir}`);
});
