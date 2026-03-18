const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const upload = multer({ dest: 'uploads/' });

router.post('/', authMiddleware, upload.single('file'), uploadController.uploadCSV);
router.get('/', authMiddleware, uploadController.getDatasets);

module.exports = router;
