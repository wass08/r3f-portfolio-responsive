import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, Github, Linkedin, MapPin, Phone, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resume = () => {
  const handlePrint = () => {
    window.print();
  };

  const skills = [
    { category: "3D Development", items: ["Three.js", "React Three Fiber", "WebGL", "Blender"] },
    { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"] },
    { category: "Backend", items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "RESTful APIs"] },
    { category: "Tools & DevOps", items: ["Git", "Docker", "AWS", "Vercel", "Netlify", "Figma"] }
  ];

  const projects = [
    {
      title: "Arhan Sales",
      description: "Professional business website with modern design, contact management, and inventory tracking for a local client.",
      tech: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
      link: "https://arhan-sales.infinityfreeapp.com/",
      type: "Client"
    },
    {
      title: "RK Marketing",
      description: "Custom e-commerce platform with a comprehensive product catalog and integrated shopping cart system.",
      tech: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
      link: "https://rk-marketing.vercel.app/",
      type: "Client"
    },
    {
      title: "Aaiza Cosmetics",
      description: "Branded cosmetics shopping website featuring high-performance image loading and responsive design.",
      tech: ["HTML5", "Tailwind CSS", "JavaScript"],
      link: "https://aaizacosmetics.vercel.app/",
      type: "Client"
    },
    {
      title: "Chat to PDF (AI SaaS)",
      description: "Full-stack AI SaaS application allowing users to upload PDFs and interact with their content via LLMs.",
      tech: ["Next.js", "Langchain", "Gemini API", "Pinecone", "Clerk"],
      link: "https://arhans-chat-to-pdf.vercel.app/",
      type: "AI Original"
    },
    {
      title: "EduSync (AI Learning)",
      description: "An AI-powered online learning platform that connects students and educators with real-time collaboration.",
      tech: ["Next.js 15", "Appwrite", "TypeScript", "Shadcn/ui"],
      link: "https://edusync.appwrite.network/",
      type: "AI Original"
    },
    {
      title: "Smart ChatBot",
      description: "Intelligent conversational agent using natural language processing for contextual customer support.",
      tech: ["JavaScript", "NLP.js", "Node.js", "Express"],
      link: "https://chatbot-dun-omega.vercel.app/",
      type: "AI Original"
    }
  ];

  const education = {
    school: "Shri Rajendra High School",
    degree: "10th Class (Secondary Education)",
    year: "2025 - 2026",
    achievements: [
      "Academic Excellence Award",
      "Math Olympiad Gold Medalist",
      "Science Olympiad Gold Medalist",
      "Programming Club President"
    ]
  };

  const certifications = [
    { title: "Full Stack Web Development", issuer: "JS Mastery", date: "2025" },
    { title: "Data Structures & Algorithms Essentials", issuer: "Udemy", date: "2024" },
    { title: "Mastering Github Copilot", issuer: "Udemy", date: "2025" }
  ];

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0 relative z-[100]">
      {/* Navigation - Hidden on Print */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <Link to="/" className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Portfolio
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md"
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF
        </button>
      </div>

      {/* Main Resume Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none border border-neutral-200 print:border-none"
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white p-8 sm:p-12 print:bg-white print:text-black print:p-0 print:border-b-2 print:border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">ARHAN ANSARI</h1>
              <p className="text-primary-400 text-xl mt-2 font-medium print:text-neutral-700 uppercase tracking-widest">Full Stack Developer & 3D Artist</p>
            </div>
            <div className="space-y-2 text-neutral-400 print:text-neutral-700 text-sm sm:text-right">
              <div className="flex items-center sm:justify-end gap-2 text-sm">
                <span>arhanansari2009@gmail.com</span>
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex items-center sm:justify-end gap-2 text-sm">
                <span>www.arhanansari.me</span>
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex items-center sm:justify-end gap-2 text-sm">
                <span>github.com/ArhanAnsari</span>
                <Github className="w-4 h-4" />
              </div>
              <div className="flex items-center sm:justify-end gap-2 text-sm">
                <span>Nagpur, India</span>
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 space-y-10">
          {/* Summary */}
          <section>
            <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary-500 pb-2 mb-4 uppercase tracking-wider">Professional Summary</h2>
            <p className="text-neutral-700 leading-relaxed">
              Passionate Full Stack Developer and 3D Artist with 3+ years of experience in building interactive, high-performance web applications. 
              Specializing in the MERN stack and Three.js, I bridge the gap between technical functionality and immersive visual experiences. 
              Record of building 250+ projects and contributing to open-source communities.
            </p>
          </section>

          {/* Core Skills */}
          <section>
            <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary-500 pb-2 mb-4 uppercase tracking-wider">Technical Skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((skillGroup, i) => (
                <div key={i}>
                  <h3 className="font-bold text-neutral-800 mb-2">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {skillGroup.items.map((skill, j) => (
                      <span key={j} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded border border-neutral-200 print:border-none print:px-0 print:after:content-[','] last:print:after:content-['']">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Selected Projects */}
          <section>
            <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary-500 pb-2 mb-4 uppercase tracking-wider">Featured Projects</h2>
            <div className="grid grid-cols-1 gap-8">
              {/* Categorized Projects */}
              <div>
                <h3 className="text-sm font-bold text-primary-600 mb-4 uppercase tracking-widest">Client Solutions</h3>
                <div className="space-y-6">
                  {projects.filter(p => p.type === "Client").map((project, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-neutral-900 text-lg">{project.title}</h4>
                        <span className="text-xs text-neutral-500 print:hidden">{project.link !== '#' ? project.link.replace('https://', '') : ''}</span>
                      </div>
                      <p className="text-neutral-700 text-sm mb-2 italic">“{project.description}”</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t, j) => (
                          <span key={j} className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">#{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-primary-600 mb-4 uppercase tracking-widest text-right">Innovative AI Projects</h3>
                <div className="space-y-6">
                  {projects.filter(p => p.type === "AI Original").map((project, i) => (
                    <div key={i} className="group flex flex-col items-end text-right">
                      <div className="flex justify-between w-full items-start mb-1">
                        <span className="text-xs text-neutral-500 print:hidden">{project.link !== '#' ? project.link.replace('https://', '') : ''}</span>
                        <h4 className="font-bold text-neutral-900 text-lg">{project.title}</h4>
                      </div>
                      <p className="text-neutral-700 text-sm mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {project.tech.map((t, j) => (
                          <span key={j} className="text-[10px] font-bold text-accent-600 uppercase tracking-tighter">#{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Education & Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section>
              <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary-500 pb-2 mb-4 uppercase tracking-wider">Education</h2>
              <div>
                <h3 className="font-bold text-neutral-900">{education.school}</h3>
                <p className="text-neutral-600 text-sm">{education.degree}</p>
                <p className="text-primary-600 text-sm font-medium">{education.year}</p>
                <ul className="mt-3 space-y-1">
                  {education.achievements.map((ach, i) => (
                    <li key={i} className="text-sm text-neutral-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary-500 pb-2 mb-4 uppercase tracking-wider">Certifications</h2>
              <div className="space-y-4">
                {certifications.map((cert, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-neutral-900 text-sm">{cert.title}</h3>
                    <p className="text-neutral-600 text-xs">{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 p-6 text-center border-t border-neutral-200 text-neutral-500 text-xs print:hidden">
          Built with React & Tailwind CSS • View live version at arhanansari.me
        </div>
      </motion.div>
    </div>
  );
};

export default Resume;
