import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';
import ResumePreview from './ResumePreview';

// Update the props to include resumeTitle and isEditing
const ResumeForm = ({ initialData, resumeTitle, isEditing }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState('');
  // Add reference for resume preview
  const resumePreviewRef = useRef(null);
  // Add state for preview mode
  const [previewMode, setPreviewMode] = useState(false);
  
  // Add the missing togglePreviewMode function
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };
  
  const [formData, setFormData] = useState({
    title: resumeTitle || 'My Resume', // Use the passed resumeTitle
    template: initialData ? initialData.template : 'professional',
    content: {
      personalInfo: initialData ? initialData.content.personalInfo : {
        name: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        website: ''
      },
      summary: initialData ? initialData.content.summary : '',
      experience: initialData ? initialData.content.experience : [
        {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ],
      education: initialData ? initialData.content.education : [
        {
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          current: false
        }
      ],
      skills: initialData ? initialData.content.skills : []
    }
  });

  // Handle input changes for personal info
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        personalInfo: {
          ...formData.content.personalInfo,
          [name]: value
        }
      }
    });
  };

  // Handle summary change
  const handleSummaryChange = (e) => {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        summary: e.target.value
      }
    });
  };

  // Handle experience changes
  const handleExperienceChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newExperience = [...formData.content.experience];
    newExperience[index] = {
      ...newExperience[index],
      [name]: type === 'checkbox' ? checked : value
    };

    setFormData({
      ...formData,
      content: {
        ...formData.content,
        experience: newExperience
      }
    });
  };

  // Add new experience entry
  const addExperience = () => {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        experience: [
          ...formData.content.experience,
          {
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
          }
        ]
      }
    });
  };

  // Remove experience entry
  const removeExperience = (index) => {
    const newExperience = [...formData.content.experience];
    newExperience.splice(index, 1);
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        experience: newExperience
      }
    });
  };

  // Handle education changes
  const handleEducationChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newEducation = [...formData.content.education];
    newEducation[index] = {
      ...newEducation[index],
      [name]: type === 'checkbox' ? checked : value
    };

    setFormData({
      ...formData,
      content: {
        ...formData.content,
        education: newEducation
      }
    });
  };

  // Add new education entry
  const addEducation = () => {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        education: [
          ...formData.content.education,
          {
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            current: false
          }
        ]
      }
    });
  };

  // Remove education entry
  const removeEducation = (index) => {
    const newEducation = [...formData.content.education];
    newEducation.splice(index, 1);
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        education: newEducation
      }
    });
  };

  // Handle skills changes
  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        skills
      }
    });
  };

  // Generate AI objective
  const generateAIObjective = async () => {
    try {
      setAiLoading(true);
      setMessage('Generating AI objective...');
      
      // Set auth token in headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      // Extract more comprehensive data for the AI
      const name = formData.content.personalInfo.name || 'Professional';
      const role = formData.content.experience[0]?.title || 'Professional';
      
      // Get more detailed experience information
      const experienceDetails = formData.content.experience.map(exp => ({
        title: exp.title,
        company: exp.company,
        description: exp.description
      })).filter(exp => exp.title || exp.company || exp.description);
      
      // Get education details
      const educationDetails = formData.content.education.map(edu => ({
        degree: edu.degree,
        field: edu.field,
        institution: edu.institution
      })).filter(edu => edu.degree || edu.field || edu.institution);
      
      // Get skills as an array
      const skills = formData.content.skills;
      
      // Call the backend API with enhanced data
      const res = await axios.post(
        'http://localhost:5000/api/ai/generate-objective', 
        { 
          name, 
          role, 
          skills,
          experience: experienceDetails,
          education: educationDetails,
          singleOption: true // Add this flag to request a single objective
        },
        config
      );
      
      if (res.data.success) {
        // Update the form with the generated objective
        setFormData({
          ...formData,
          content: {
            ...formData.content,
            summary: res.data.objective
          }
        });
        
        setMessage('AI objective generated successfully!');
      } else {
        setMessage('Error: ' + res.data.error);
      }
      
      setAiLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Error generating AI objective:', error);
      setAiLoading(false);
      setMessage('Error generating AI objective. Please try again.');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Save resume
  const saveResume = async () => {
    try {
      setLoading(true);
      setMessage('Saving resume...');
      
      // Set auth token in headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      // Make sure to use the correct title
      const resumeDataToSave = {
        ...formData,
        title: resumeTitle || formData.title // Ensure title is used from props or state
      };
      
      let res;
      if (isEditing && initialData?._id) {
        // Update existing resume
        res = await axios.put(
          `http://localhost:5000/api/dashboard/resume/${initialData._id}`, 
          resumeDataToSave, 
          config
        );
      } else {
        // Create new resume
        res = await axios.post('http://localhost:5000/api/dashboard/resume', resumeDataToSave, config);
      }
      
      setLoading(false);
      setMessage('Resume saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
      return res.data;
    } catch (error) {
      console.error('Error saving resume:', error);
      setLoading(false);
      setMessage('Error saving resume. Please try again.');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Download PDF using html2canvas + jsPDF
  const downloadPDF = async () => {
    try {
      setLoading(true);
      setMessage('Generating PDF...');
      
      if (!resumePreviewRef.current) {
        setMessage('Error: Could not generate PDF. Please try again.');
        setLoading(false);
        return;
      }
      
      const element = resumePreviewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${formData.title || 'resume'}.pdf`);
      
      setLoading(false);
      setMessage('PDF generated successfully!');
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setLoading(false);
      setMessage('Error generating PDF. Please try again.');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Handle template change
  const handleTemplateChange = (template) => {
    setFormData({
      ...formData,
      template
    });
  };

  // Handle print functionality using react-to-print
  const handlePrint = useReactToPrint({
    content: () => resumePreviewRef.current,
    documentTitle: `${formData.title || 'Resume'}.pdf`,
    onBeforeGetContent: () => {
      setLoading(true);
      setMessage('Preparing to print...');
      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    },
    onAfterPrint: () => {
      setLoading(false);
      setMessage('PDF printed successfully!');
      setTimeout(() => setMessage(''), 3000);
    },
    onPrintError: () => {
      setLoading(false);
      setMessage('Error printing PDF. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  });

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
      >
        {isEditing ? 'Edit Your Resume' : 'Create Your Resume'}
      </motion.h1>
      
      {/* Message notifications */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 p-4 rounded-lg shadow-sm ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-700 border-l-4 border-red-500' 
                : 'bg-green-100 text-green-700 border-l-4 border-green-500'
            }`}
          >
            <div className="flex items-center">
              {message.includes('Error') ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Preview/Edit toggle button */}
      <div className="mb-6 flex justify-end">
        {/* <button
          onClick={togglePreviewMode}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            previewMode 
              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {previewMode ? 'Back to Edit' : 'Preview Resume'}
        </button> */}
      </div>
            {/* Preview/Edit toggle button */}
            <div className="mb-6 flex justify-between">
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link>
        <button
          onClick={togglePreviewMode}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            previewMode 
              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {previewMode ? 'Back to Edit' : 'Preview Resume'}
        </button>
      </div>
      <AnimatePresence mode="wait">
        {previewMode ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Resume Preview</h2>
              <div className="flex space-x-2">
                <button
                  onClick={downloadPDF}
                  disabled={loading}
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm flex items-center"
                >
                  {loading ? 'Processing...' : 'Download PDF'}
                </button>
                <button
                  onClick={handlePrint}
                  disabled={loading}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm flex items-center"
                >
                  Print
                </button>
              </div>
            </div>
            <div className="p-6 flex justify-center">
              <div className="w-full max-w-[800px] h-[1100px] shadow-lg">
                <ResumePreview ref={resumePreviewRef} resumeData={formData} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Your existing form content */}
            <div className="space-y-6">
              
              
              {/* Personal Information Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.content.personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.content.personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="johndoe@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.content.personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.content.personalInfo.address}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="New York, NY"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">LinkedIn</label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.content.personalInfo.linkedin}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Website</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.content.personalInfo.website}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="johndoe.com"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Skills Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Skills
                </h2>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    List your skills (separated by commas)
                  </label>
                  <textarea
                    value={formData.content.skills.join(', ')}
                    onChange={handleSkillsChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="JavaScript, React, Node.js, CSS, HTML, Project Management"
                    rows="3"
                  ></textarea>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Include both technical and soft skills relevant to the position you're applying for.
                  </p>
                </div>
              </motion.div>
              
              {/* Summary/Objective Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Professional Summary
                  </h2>
                  <button
                    onClick={generateAIObjective}
                    disabled={aiLoading}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-sm flex items-center"
                  >
                    {aiLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                        </svg>
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                
                <textarea
                  value={formData.content.summary}
                  onChange={handleSummaryChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Write a professional summary that highlights your skills and experience..."
                  rows="4"
                ></textarea>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  A strong summary will grab the attention of recruiters. Keep it concise and highlight your most relevant qualifications.
                </p>
              </motion.div>
              
              {/* Experience Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    Work Experience
                  </h2>
                </div>
                
                {formData.content.experience.map((exp, index) => (
                  <div key={index} className="mb-6 border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">Position {index + 1}</h3>
                      {index > 0 && (
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
                        <input
                          type="text"
                          name="title"
                          value={exp.title}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Software Engineer"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Acme Inc."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={exp.location}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="New York, NY"
                        />
                      </div>
                      
                      <div className="flex items-center mt-6">
                        <input
                          type="checkbox"
                          id={`current-job-${index}`}
                          name="current"
                          checked={exp.current}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`current-job-${index}`} className="ml-2 block text-gray-700 dark:text-gray-300">
                          I currently work here
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      
                      {!exp.current && (
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(index, e)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Describe your responsibilities and achievements..."
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addExperience}
                  className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Another Position
                </button>
              </motion.div>
              
              {/* Education Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Education
                  </h2>
                </div>
                
                {formData.content.education.map((edu, index) => (
                  <div key={index} className="mb-6 border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">Education {index + 1}</h3>
                      {index > 0 && (
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Institution</label>
                        <input
                          type="text"
                          name="institution"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="University of Example"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Degree</label>
                        <input
                          type="text"
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Field of Study</label>
                        <input
                          type="text"
                          name="field"
                          value={edu.field}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Computer Science"
                        />
                      </div>
                      
                      <div className="flex items-center mt-6">
                        <input
                          type="checkbox"
                          id={`current-education-${index}`}
                          name="current"
                          checked={edu.current}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`current-education-${index}`} className="ml-2 block text-gray-700 dark:text-gray-300">
                          I am currently studying here
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={edu.startDate}
                          onChange={(e) => handleEducationChange(index, e)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      
                      {!edu.current && (
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            value={edu.endDate}
                            onChange={(e) => handleEducationChange(index, e)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addEducation}
                  className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Another Education
                </button>
              </motion.div>
              {/* Template Selection */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  Template Selection
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.template === 'professional' 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                    }`}
                    onClick={() => handleTemplateChange('professional')}
                  >
                    <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded mb-3 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">Professional</span>
                    </div>
                    <h3 className="font-medium text-center">Professional</h3>
                  </div>
                  
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.template === 'creative' 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                    }`}
                    onClick={() => handleTemplateChange('creative')}
                  >
                    <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded mb-3 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">Creative</span>
                    </div>
                    <h3 className="font-medium text-center">Creative</h3>
                  </div>
                  
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.template === 'minimal' 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                    }`}
                    onClick={() => handleTemplateChange('minimal')}
                  >
                    <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded mb-3 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">Minimal</span>
                    </div>
                    <h3 className="font-medium text-center">Minimal</h3>
                  </div>
                </div>
              </motion.div>
              <br />
              
            </div>
            
            {/* Action buttons */}
            {/* <div className="mt-8 flex justify-between"
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </div> */}
            
            <div className="flex space-x-4">
              <button
                onClick={saveResume}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Resume'
                )}
              </button>
              
              <button
                onClick={togglePreviewMode}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Preview
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hidden div for PDF generation */}
      <div className="hidden">
        <div ref={resumePreviewRef}>
          <ResumePreview resumeData={formData} />
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;