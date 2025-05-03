const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Incident Report Schema
const incidentReportSchema = new mongoose.Schema({
    id: { type: String, default: () => uuidv4(), unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        type: String,
        required: true,
        enum: ['Downtown', 'Suburb', 'Industrial Area', 'Residential Area', 'Commercial District']
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    category: {
        type: String,
        required: true,
        enum: ['Theft', 'Accident', 'Harassment', 'Vandalism', 'Suspicious Activity']
    },
    image_filename: { type: String },
    status: { 
        type: String, 
        enum: ['Draft', 'Submitted', 'Under Review', 'Resolved'], 
        default: 'Submitted' 
    },
    user_id: { type: String, required: true }, // Reference to user who submitted
    timestamp: { type: Date, default: Date.now }
});

// Draft Schema (for saving unfinished reports)
const draftSchema = new mongoose.Schema({
    id: { type: String, default: () => uuidv4(), unique: true },
    title: { type: String },
    description: { type: String },
    location: {
        type: String,
        enum: ['Downtown', 'Suburb', 'Industrial Area', 'Residential Area', 'Commercial District']
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    category: {
        type: String,
        enum: ['Theft', 'Accident', 'Harassment', 'Vandalism', 'Suspicious Activity']
    },
    image_filename: { type: String },
    user_id: { type: String, required: true }, // Reference to user who created draft
    timestamp: { type: Date, default: Date.now }
});

const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);
const Draft = mongoose.model('Draft', draftSchema);

module.exports = { IncidentReport, Draft };
