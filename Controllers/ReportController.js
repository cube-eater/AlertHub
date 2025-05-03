import { IncidentReport, Draft } from '../Models/Report.js';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Helper function for image processing
const processImage = async (fileBuffer) => {
  const filename = `${uuidv4()}.jpg`;
  await sharp(fileBuffer)
    .jpeg({ quality: 70 })
    .toFile(`uploads/${filename}`);
  return filename;
};

// Controllers
export const submitIncident = async (req, res) => {
  try {
    const { title, description, location, category, userId } = req.body;
    const imageFilename = req.file ? await processImage(req.file.buffer) : null;

    const report = await IncidentReport.create({
      title,
      description,
      location,
      category,
      userId,
      image_filename: imageFilename,
      status: 'Submitted'
    });

    res.status(201).json({ 
      success: true,
      data: { report_id: report.id }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const saveDraft = async (req, res) => {
  try {
    const { title, description, location, category, userId } = req.body;
    const imageFilename = req.file ? await processImage(req.file.buffer) : null;

    const draft = await Draft.create({
      title,
      description,
      location,
      category,
      userId,
      image_filename: imageFilename,
      status: 'Draft'
    });

    res.status(200).json({ 
      success: true,
      data: { draft_id: draft.id }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
