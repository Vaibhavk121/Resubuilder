import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResumeForm from '../components/resume/ResumeForm';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiX, FiFileText, FiArrowLeft } from 'react-icons/fi';

const CreateResumePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(id ? 2 : 1); // Step 1: Title, Step 2: Resume Form
  const [titleSuggestions] = useState([
    "Professional Software Engineer Resume",
    "Creative Marketing Portfolio",
    "Executive Leadership CV",
    "Technical Project Manager Resume",
    "Data Science Specialist CV"
  ]);

  useEffect(() => {
    // Redirect if not logged in and not loading
    if (!loading && !user) {
      navigate('/login');
    }

    // If editing an existing resume, fetch its data
    if (id) {
      const fetchResumeData = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/dashboard/resume/${id}`);
          setResumeData(res.data);
          setResumeTitle(res.data.title);
          setIsLoading(false);
          setStep(2); // Skip title step when editing
        } catch (err) {
          console.error('Error fetching resume:', err);
          setError('Failed to load resume data');
          setIsLoading(false);
        }
      };

      fetchResumeData();
    }
  }, [user, loading, navigate, id]);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (!resumeTitle.trim()) {
      toast.error('Please enter a resume title');
      return;
    }
    setStep(2);
  };

  const useSuggestion = (suggestion) => {
    setResumeTitle(suggestion);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 10, 0, -10, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="w-24 h-24 mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 bg-indigo-500 rounded-lg opacity-20 animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-indigo-700 mb-2"
          >
            Preparing Your Resume Canvas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-indigo-500"
          >
            Loading the tools for your professional masterpiece...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md mx-4"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <FiX className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
          <p className="text-gray-600 mb-6">We couldn't load your resume data. Please try again or create a new resume.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 pt-20 px-4">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FiFileText className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Name Your Resume</h2>
                <p className="text-center text-gray-600 mb-8">Give your resume a memorable title to easily find it later</p>
                
                <form onSubmit={handleTitleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="resumeTitle" className="block text-gray-700 font-medium mb-2">
                      Resume Title
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="resumeTitle"
                        value={resumeTitle}
                        onChange={(e) => setResumeTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        placeholder="e.g., Software Developer Resume"
                        required
                      />
                      {resumeTitle && (
                        <button
                          type="button"
                          onClick={() => setResumeTitle('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Need inspiration? Try one of these:</p>
                    <div className="flex flex-wrap gap-2">
                      {titleSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => useSuggestion(suggestion)}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/dashboard')}
                      className="flex items-center px-5 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      <FiArrowLeft className="mr-2" /> Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Continue <FiArrowRight className="ml-2" />
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Your resume will be automatically saved as you build it
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ResumeForm 
              initialData={resumeData} 
              resumeTitle={resumeTitle}
              isEditing={!!id}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CreateResumePage;