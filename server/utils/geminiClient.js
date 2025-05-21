const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Function to generate resume objective using Gemini 2.5 Flash
const generateObjective = async (name, role, skills, experience = [], education = [], singleOption = false) => {
  try {
    // Get the generative model (Gemini 1.5 Flash)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Format the skills as a comma-separated string
    const skillsString = Array.isArray(skills) ? skills.join(', ') : skills;
    
    // Format experience details
    let experienceString = '';
    if (experience && experience.length > 0) {
      experienceString = experience.map(exp => 
        `${exp.title || 'Role'} at ${exp.company || 'Company'}: ${exp.description || 'No description'}`
      ).join('; ');
    }
    
    // Format education details
    let educationString = '';
    if (education && education.length > 0) {
      educationString = education.map(edu => 
        `${edu.degree || ''} in ${edu.field || ''} from ${edu.institution || ''}`
      ).join('; ');
    }
    
    // Create the prompt for generating the objective
    const prompt = `
      Generate a professional and concise resume objective statement for ${name} who is a ${role}.
      
      Their key skills include: ${skillsString}.
      
      Experience: ${experienceString || 'Not provided'}
      
      Education: ${educationString || 'Not provided'}
      
      The objective should be 2-3 sentences long, highlight their expertise, and be tailored for job applications.
      Focus on being specific, achievement-oriented, and professional.
      Do not use first-person pronouns.
      Do not include any placeholder text like [mention skill] or [insert accomplishment].
      Use the actual information provided to create a personalized objective.
      ${singleOption ? 'Provide only ONE single objective statement, not multiple options or numbered alternatives.' : ''}
      Do not include "Option 1", "Option 2", etc. Just provide the final objective statement directly.
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      objective: text.trim()
    };
  } catch (error) {
    console.error('Error generating objective with Gemini API:', error);
    return {
      success: false,
      error: 'Failed to generate objective. Please try again later.'
    };
  }
};

module.exports = {
  generateObjective
};