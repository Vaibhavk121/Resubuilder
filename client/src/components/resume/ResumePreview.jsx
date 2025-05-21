import React, { forwardRef } from 'react';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

const ResumePreview = forwardRef(({ resumeData }, ref) => {
  const { template } = resumeData;

  switch (template) {
    case 'creative':
      return <CreativeTemplate resumeData={resumeData} ref={ref} />;
    case 'minimal':
      return <MinimalTemplate resumeData={resumeData} ref={ref} />;
    case 'professional':
    default:
      return <ProfessionalTemplate resumeData={resumeData} ref={ref} />;
  }
});

export default ResumePreview;