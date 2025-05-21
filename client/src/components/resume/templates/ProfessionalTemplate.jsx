import React, { forwardRef } from 'react';

const ProfessionalTemplate = forwardRef(({ resumeData }, ref) => {
  const { personalInfo, summary, experience, education, skills } = resumeData.content;

  return (
    <div 
      ref={ref}
      className="w-full h-full bg-white text-gray-800 p-8 shadow-lg"
      style={{ maxWidth: '8.5in', minHeight: '11in' }}
    >
      {/* Header */}
      <header className="border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{personalInfo.name}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-sm">
          {personalInfo.email && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              {personalInfo.linkedin}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Professional Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-900">{exp.title}</h3>
                <span className="text-gray-600 text-sm">
                  {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                  {exp.current ? ' Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-gray-700">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              <p className="text-gray-600 mt-1 text-sm whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                <span className="text-gray-600 text-sm">
                  {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                  {edu.current ? ' Present' : edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-gray-700">{edu.institution}</div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
});

export default ProfessionalTemplate;