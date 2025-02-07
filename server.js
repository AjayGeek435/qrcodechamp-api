const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const mkdirp = require('mkdirp');
const axios = require('axios');
const app = express();
app.use(cors());
const configData = require("./config/config");
// import { uploadFileOnServer } from './helper/fileFunction';

const uploadsDir = path.join(__dirname, 'uploads');
mkdirp.sync(uploadsDir);

const generateRandomFileName = (length = 5) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

const uploadFileOnServer = async (url, image_path) => {
    console.log("url", url);
    console.log("image_path", image_path);
    const writer = fs.createWriteStream(image_path);
    console.log("writer", writer);
    try {
        const response = await axios({
            url: 'https://qr.qrcodechamp.com/uploads/IMG_6198.jpg',
            method: 'GET',
            responseType: 'stream'
        });

        console.log("response", response);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`The file is finished downloading.`);
                resolve();
            });
            writer.on('error', (error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.log(`Something happened: ${error}`);
        throw error;
    }
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const randomFileName = generateRandomFileName(5);
        cb(null, randomFileName + ext);
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    await uploadFileOnServer(req.file.filename, `/home/sagarg/public_html/qr.qrcodechamp.com/uploads/${req.file.filename}`);

    const fileUrl = `${configData.BACKEND_HOST}uploads/${req.file.filename}`;
    return res.status(200).json({ downloadLink: fileUrl });
});

app.get('/uploads/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', fileName);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.status(404).send('File not found');
    }
});

app.listen(configData.PORT, () => {
    console.log(`Server running on ${configData.BACKEND_HOST}`);
});
