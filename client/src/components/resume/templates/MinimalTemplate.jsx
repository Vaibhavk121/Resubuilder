import React, { forwardRef } from 'react';

const MinimalTemplate = forwardRef(({ resumeData }, ref) => {
  const { personalInfo, summary, experience, education, skills } = resumeData.content;

  return (
    <div 
      ref={ref}
      className="w-full h-full bg-white text-gray-800 p-8"
      style={{ maxWidth: '8.5in', minHeight: '11in' }}
    >
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-light text-gray-900 uppercase tracking-widest">{personalInfo.name}</h1>
        <div className="flex justify-center flex-wrap gap-4 mt-3 text-sm text-gray-600">
          {personalInfo.email && (
            <div>{personalInfo.email}</div>
          )}
          {personalInfo.phone && (
            <div>{personalInfo.phone}</div>
          )}
          {personalInfo.linkedin && (
            <div>{personalInfo.linkedin}</div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-lg font-normal text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">Profile</h2>
          <p className="text-gray-700">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-normal text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-gray-900">{exp.title}</h3>
                <span className="text-gray-600 text-sm">
                  {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                  {exp.current ? ' Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-gray-700 italic">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              <p className="text-gray-600 mt-2 text-sm whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-normal text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                <span className="text-gray-600 text-sm">
                  {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                  {edu.current ? ' Present' : edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-gray-700 italic">{edu.institution}</div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-lg font-normal text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">Skills</h2>
          <div className="text-gray-700">{skills.join(' • ')}</div>
        </section>
      )}
    </div>
  );
});

export default MinimalTemplate;