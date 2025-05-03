import express from 'express';
import multer from 'multer';
import { 
  submitIncident,
  saveDraft,
  getIncidents,
  getDrafts
} from '../Controllers/ReportController.js';
import { validateReport } from '../middleware/validation.js';

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
    files: 1 // Single file upload
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Incident Reporting Routes
router.post(
  '/submit',
  upload.single('image'), // Handle file upload
  validateReport, // Request validation
  submitIncident // Controller
);

router.post(
  '/drafts',
  upload.single('image'),
  saveDraft
);

// Get Reports (with optional filters)
router.get(
  '/',
  getIncidents
);

// Get User's Drafts
router.get(
  '/drafts/:userId',
  getDrafts
);

export default router;
