import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiShare2, FiUser, FiLogOut, FiFileText } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard');
        setResumes(res.data.resumes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setError('Failed to load your resumes');
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // Get recent and older resumes
  const recentResumes = resumes.filter(resume => {
    const updatedDate = new Date(resume.updatedAt);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return updatedDate > oneWeekAgo;
  });

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await axios.delete(`http://localhost:5000/api/dashboard/resume/${id}`);
        setResumes(resumes.filter(resume => resume._id !== id));
        toast.success('Resume deleted successfully');
      } catch (err) {
        console.error('Error deleting resume:', err);
        setError('Failed to delete resume');
        toast.error('Failed to delete resume');
      }
    }
  };

  const handleDownloadResume = async (id, title) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/dashboard/resume/${id}/download`, {
        responseType: 'blob'
      });
      
      // Use file-saver to save the PDF
      const fileName = `${title.replace(/\s+/g, '_')}_resume.pdf`;
      saveAs(new Blob([response.data], { type: 'application/pdf' }), fileName);
      
      setLoading(false);
      toast.success('Resume downloaded successfully!');
    } catch (err) {
      console.error('Error downloading resume:', err);
      setError('Failed to download resume');
      setLoading(false);
      toast.error('Failed to download resume');
    }
  };

  const handleShareResume = async (id) => {
    setCurrentResumeId(id);
    setShareLoading(true);
    
    try {
      const response = await axios.post(`http://localhost:5000/api/dashboard/resume/${id}/share`);
      setShareLink(response.data.shareLink);
      setShareModalOpen(true);
      setShareLoading(false);
    } catch (err) {
      console.error('Error sharing resume:', err);
      toast.error('Failed to generate share link');
      setShareLoading(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Share link copied to clipboard!');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getTemplateColor = (template) => {
    switch(template) {
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'creative': return 'bg-purple-100 text-purple-800';
      case 'minimal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-6 text-indigo-600 text-xl font-medium">Loading your creative journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-500 opacity-5"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0, 20, 0],
              x: [0, 15, 0, -15, 0],
              scale: [1, 1.1, 1, 0.9, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <nav className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  ResuBuilder
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{user?.name}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10"
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
                      >
                        <FiLogOut className="mr-2" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name.split(' ')[0]}!</h1>
              <p className="text-gray-600 mt-1">Manage your professional journey with these resume tools</p>
            </div>
            <Link
              to="/create-resume"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
            >
              <FiPlus className="mr-2" /> Create New Resume
            </Link>
          </div>
          
          <div className="mt-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`${
                    activeTab === 'all'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  All Resumes ({resumes.length})
                </button>
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`${
                    activeTab === 'recent'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Recent ({recentResumes.length})
                </button>
              </nav>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
            <p className="font-medium">Oops!</p>
            <p>{error}</p>
          </div>
        )}

        {resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <FiFileText className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Create your first resume to kickstart your professional journey. It only takes a few minutes!</p>
            <Link
              to="/create-resume"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              <FiPlus className="mr-2" /> Create Your First Resume
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'all' ? resumes : recentResumes).map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 truncate">{resume.title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTemplateColor(resume.template)}`}>
                      {resume.template}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6m-6 0v10a2 2 0 002 2h2a2 2 0 002-2V7m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2H6z" />
                    </svg>
                    Last updated: {new Date(resume.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/edit-resume/${resume._id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium transition-colors"
                    >
                      <FiEdit2 className="mr-1" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDownloadResume(resume._id, resume.title)}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm font-medium transition-colors"
                    >
                      <FiDownload className="mr-1" /> Download
                    </button>
                    <button 
                      onClick={() => handleShareResume(resume._id)}
                      disabled={shareLoading}
                      className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-full text-sm font-medium transition-colors"
                    >
                      <FiShare2 className="mr-1" /> Share
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume._id)}
                      className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-full text-sm font-medium transition-colors"
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShareModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md m-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Resume</h3>
              <p className="text-gray-600 mb-4">
                Anyone with this link can view your resume:
              </p>
              <div className="flex mb-6">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={copyShareLink}
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded-r-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Copy
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;