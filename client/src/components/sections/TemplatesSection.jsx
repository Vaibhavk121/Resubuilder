import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const templates = [
  {
    name: "Professional",
    image: "/images/templates/professional.jpg",
    description: "Clean and professional design suitable for corporate roles"
  },
  {
    name: "Creative",
    image: "/images/templates/creative.jpg",
    description: "Modern and eye-catching design for creative industries"
  },
  {
    name: "Minimal",
    image: "/images/templates/minimal.jpg",
    description: "Simple and elegant design that focuses on content"
  }
];

const TemplatesSection = () => {
  return (
    <section id="templates" className="py-20 px-4 bg-white dark:bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-semibold mb-3">
            TEMPLATES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Professional Resume Templates</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose from our collection of professionally designed templates that will make your resume stand out
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="relative overflow-hidden">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 dark:bg-gray-700">
                    {/* Placeholder for template image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">{template.name}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{template.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{template.description}</p>
                  <Link 
                    to="/register" 
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm inline-flex items-center group"
                  >
                    Use this template
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link to="/register">
            <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium inline-flex items-center">
              View all templates
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TemplatesSection;