const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateObjective } = require('../utils/geminiClient');

// Generate AI objective
router.post('/generate-objective', auth, async (req, res) => {
  try {
    const { name, role, skills, experience, education, singleOption } = req.body;
    
    // Validate input
    if (!name || !role) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and role are required' 
      });
    }
    
    // Call the Gemini API through our utility function
    const result = await generateObjective(name, role, skills, experience, education, singleOption);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in generate-objective route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while generating objective' 
    });
  }
});

module.exports = router;