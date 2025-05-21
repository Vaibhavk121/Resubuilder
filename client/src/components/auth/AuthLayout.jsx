import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, subtitleLink, subtitleText }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200 dark:bg-indigo-900 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full filter blur-3xl"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold text-indigo-600">ResuBuilder</h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {subtitleText}{' '}
              <Link to={subtitleLink} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                {subtitle}
              </Link>
            </p>
          </div>
          
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;