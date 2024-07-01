const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 配置 Multer上传文件
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
//处理上传照片
app.post('/upload', upload.array('photos'), (req, res) => {
    const albumTitle = req.body.albumTitle;
    const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        path: file.path
    }));
    const album = albums.find(album => album.title === albumTitle);
    if (album) {
        album.photos.push(...uploadedFiles.map(file => `/uploads/${file.filename}`));
        saveAlbumData(albumTitle, album.photos);
        res.status(200).send('Photos uploaded successfully.');
    } else {
        res.status(404).send('Album not found.');
    }
});
//获取图片数据
app.get('/albums', (req, res) => {
    res.json(albums);
});
//保存相册数据的函数，保存Album Data相册标题、照片
function saveAlbumData(albumTitle, photos) {
    const dataFilePath = path.join(__dirname, 'data.json');
    fs.writeFileSync(dataFilePath, JSON.stringify(albums, null, 2));
}
//从JSON加载所有数据
let albums = [];
const dataFilePath = path.join(__dirname, 'data.json');
if (fs.existsSync(dataFilePath)) {
    albums = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}
//启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
