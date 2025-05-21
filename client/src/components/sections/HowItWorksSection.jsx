import { motion } from 'framer-motion';

const steps = [
 
  {
    step: "1",
    title: "Fill in Your Details",
    description: "Enter your information . Our AI will help optimize your content for maximum impact."
  },
  {
    step: "2",
    title: "Choose a Template",
    description: "Browse our collection of professionally designed templates and select the one that best fits your style and industry."
  },
  {
    step: "3",
    title: "Download & Share",
    description: "Preview your resume, make any final adjustments, and download it in your preferred format or share directly."
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <svg className="absolute top-0 left-0 opacity-5 dark:opacity-10" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1200 800">
          <path d="M0,800 C600,500 800,300 1200,800" fill="none" stroke="currentColor" strokeWidth="120" strokeLinecap="round" />
        </svg>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-semibold mb-3">
            PROCESS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create your professional resume in just three simple steps
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-indigo-200 dark:bg-indigo-800 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 h-full">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center">{step.description}</p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-indigo-500 z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300"
          >
            Start Building Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;