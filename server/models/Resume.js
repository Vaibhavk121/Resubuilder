const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  template: {
    type: String,
    default: 'professional'
  },
  content: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      website: String
    },
    summary: String,
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      current: Boolean
    }],
    skills: [String],
    projects: [{
      title: String,
      description: String,
      link: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  shareToken: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Resume', resumeSchema);