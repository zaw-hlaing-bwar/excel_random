const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadToS3 = require('../utils/aws');
const processExcelFile = require('../utils/random');

// Configure multer
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function(req, file, cb) {
      if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.mimetype !== 'text/csv') {
        return cb(new Error('Only .xlsx and .csv formats allowed!'));
      }
      cb(null, true);
    }
  });
  
router.post('/api/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

router.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      const data = await uploadToS3(req.file);
      res.json({ message: 'File uploaded successfully', data });
    } catch (err) {
      res.status(500).send(err);
    }
});

router.post('/api/generate', async (req, res) => {
    try {
      const data = await processExcelFile(req.body.filename, req.body.size);
      res.json({ message: 'Successful', data });
    } catch (err) {
      res.status(500).send(err);
    }
});

module.exports = router;