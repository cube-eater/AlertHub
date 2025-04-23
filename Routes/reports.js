const express = require('express');
const multer = require('multer');  // For handling image upload
const router = express.Router();
const Report = require('../models/Report');
const Category = require('../models/Category');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST - Submit a report
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, categoryId, isDraft } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Get image URL if uploaded

    const report = new Report({
      title,
      description,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: location.address
      },
      category: categoryId,
      imageUrl,
      isDraft: isDraft || false,
    });

    await report.save();
    res.status(201).json({ message: 'Report created successfully', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit report', details: err.message });
  }
});

// PUT - Update a report (for drafts)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, categoryId, isDraft } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    if (req.file) {
      // If image is uploaded, update image URL
      report.imageUrl = `/uploads/${req.file.filename}`;
    }

    report.title = title || report.title;
    report.description = description || report.description;
    report.location = location || report.location;
    report.category = categoryId || report.category;
    report.isDraft = isDraft || report.isDraft;

    await report.save();
    res.status(200).json({ message: 'Report updated successfully', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update report', details: err.message });
  }
});

// GET - Fetch all reports (including drafts)
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().populate('category').sort({ submittedAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports', details: err.message });
  }
});

// GET - Fetch draft reports
router.get('/drafts', async (req, res) => {
  try {
    const drafts = await Report.find({ isDraft: true }).populate('category');
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch drafts', details: err.message });
  }
});

module.exports = router;
