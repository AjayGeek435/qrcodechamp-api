const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const mkdirp = require('mkdirp');
const app = express();
app.use(cors());
const configData = require("./config/config");

const uploadsDir = path.join(__dirname, 'uploads');
mkdirp.sync(uploadsDir);

const generateRandomFileName = (length = 5) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
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

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
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

app.get('/test', (req, res) => {
   
    console.log("Hello TEst");
    
});

app.listen(configData.PORT, () => {
    console.log(`Server running on ${configData.BACKEND_HOST}`);
});
