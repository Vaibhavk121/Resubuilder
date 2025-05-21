const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { generatePDF } = require('../utils/pdfGenerator');
const crypto = require('crypto');

// Get user dashboard data
router.get('/', auth, async (req, res) => {
  try {
    // Get user with resumes
    const user = await User.findById(req.user.id).select('-password');
    const resumes = await Resume.find({ user: req.user.id }).select('title template createdAt updatedAt');
    
    res.json({ user, resumes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new resume
router.post('/resume', auth, async (req, res) => {
  try {
    const { title, template, content } = req.body;

    // Create new resume
    const resume = new Resume({
      user: req.user.id,
      title,
      template,
      content
    });

    // Save resume
    await resume.save();

    // Add resume to user's resumes
    const user = await User.findById(req.user.id);
    user.resumes.push(resume._id);
    await user.save();

    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a specific resume
router.get('/resume/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a resume
router.put('/resume/:id', auth, async (req, res) => {
  try {
    const { title, template, content } = req.body;
    const resume = await Resume.findById(req.params.id);

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update resume
    resume.title = title || resume.title;
    resume.template = template || resume.template;
    resume.content = content || resume.content;
    resume.updatedAt = Date.now();

    await resume.save();
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a resume
router.delete('/resume/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Remove resume from user's resumes
    const user = await User.findById(req.user.id);
    user.resumes = user.resumes.filter(id => id.toString() !== req.params.id);
    await user.save();

    // Delete resume
    // Update the delete resume route (around line 102)
    // Replace:
    // await resume.remove();
    // With:
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resume removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Download a resume as PDF
router.get('/resume/:id/download', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
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

// Generate a share link for a resume
router.post('/resume/:id/share', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Generate a share token if it doesn't exist
    if (!resume.shareToken) {
      const shareToken = crypto.randomBytes(16).toString('hex');
      resume.shareToken = shareToken;
      await resume.save();
    }

    // Create share link
    const shareLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/view-resume/${resume.shareToken}`;

    res.json({ shareLink });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;