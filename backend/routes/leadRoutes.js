const express = require('express');
const { createLead, getLeads, getLeadsByBDA, updateLead ,downloadProof} = require('../controllers/leadController');
const multer = require('multer');
const leadController = require('../controllers/leadController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Route to create a new lead with file uploads
router.post('/', upload.fields([
  { name: 'quotationFile', maxCount: 1 },
  { name: 'paymentProof', maxCount: 1 }
]), createLead);

// Route to get all leads
router.get('/', getLeads);

router.get('/download-proof/:filename',downloadProof);


// Route to get leads by BDA name
router.get('/bda', getLeadsByBDA);

// Route to update a lead
router.put('/:id', updateLead);

// Route to get download URL
router.get('/get-download-url', leadController.getDownloadUrl);

module.exports = router;