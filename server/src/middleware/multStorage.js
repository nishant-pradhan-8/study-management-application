
const multer = require("multer");

const storage = multer.memoryStorage();

const multUpload = multer({ storage: storage });

module.exports = multUpload;

