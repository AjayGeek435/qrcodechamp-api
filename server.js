const fs = require('fs');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const multer = require('multer');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const dotenv = require("dotenv");
const express = require('express');
const app = express();
app.use(cors());

dotenv.config({ path: "./config/.env" });
const configData = require("./config/config");

//Configure Path for the Image Upload

const uploadsDir = path.join(configData.BASE_PATH);
mkdirp.sync(uploadsDir);

app.use('/uploads', express.static('uploads'));

// Package for image upload

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

// Image Name Generator

const generateRandomFileName = (length = 5) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// Image Upload

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }else{
        const fileUrl = `${configData.IMAGE_HOST}${req.file.filename}`;
        return res.status(200).json({ downloadLink: fileUrl });
    }
});

// Image Download

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
