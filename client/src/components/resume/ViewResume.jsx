import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumePreview from './ResumePreview';

const ViewResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/resume/${id}`);
        setResume(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Resume not found or link has expired');
        setLoading(false);
      }
    };

    if (id) {
      fetchResume();
    } else {
      setError('Invalid resume link');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <p className="text-gray-600 mb-6">The resume you're looking for could not be found or the link has expired.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8">{resume.title}</h1>
          <ResumePreview 
            template={resume.template}
            content={resume.content}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewResume;