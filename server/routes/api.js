const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { generatePDF } = require('../utils/pdfGenerator');

// Get a shared resume by token
router.get('/resume/shared/:token', async (req, res) => {
  try {
    const resume = await Resume.findOne({ shareToken: req.params.token });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Download a shared resume as PDF
router.get('/resume/shared/:token/download', async (req, res) => {
  try {
    const resume = await Resume.findOne({ shareToken: req.params.token });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Generate PDF
    const pdfResult = await generatePDF(resume);
    
    if (!pdfResult.success) {
      return res.status(500).json({ message: 'Failed to generate PDF' });
    }
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${resume.title.replace(/\s+/g, '_')}_resume.pdf`);
    
    // Send the PDF data
    res.send(pdfResult.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;