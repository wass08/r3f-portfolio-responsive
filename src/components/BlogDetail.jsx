import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { blogPosts } from "./Blog";
import { useEffect } from "react";

export const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <button 
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative z-20 w-full max-w-4xl mx-auto px-4 py-20 min-h-screen"
    >
      <button 
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-indigo-400 mb-8 hover:text-indigo-300 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Portfolio
      </button>
      
      <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10">
        <img src={post.image} alt={post.title} className="w-full h-[400px] object-cover" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/30">
          {post.category}
        </span>
        <span className="text-neutral-400 text-sm">{post.date}</span>
        <span className="text-neutral-400">•</span>
        <span className="text-neutral-400 text-sm">{post.readTime}</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
        {post.title}
      </h1>

      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-neutral-300 leading-relaxed mb-10 italic border-l-4 border-indigo-500 pl-6">
          {post.excerpt}
        </p>
        
        <div className="text-neutral-300 space-y-8 text-lg leading-relaxed">
          <p>
            In today's rapidly evolving digital landscape, mastering {post.category} is more than just a skill—it's a necessity for creating impactful user experiences. This post dives deep into the core principles that drive innovation in this field.
          </p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-6">The Core Philosophy</h2>
          <p>
            Whether you're building a complex web application or designing a simple landing page, the fundamental goal remains the same: solving user problems effectively. We explore how modern tools and frameworks help us achieve this goal with greater efficiency and precision.
          </p>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 my-12">
            <h3 className="text-xl font-bold text-white mb-4">Key Takeaways</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">✦</span>
                <span>Deep understanding of {post.category} fundamentals and modern patterns.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">✦</span>
                <span>Implementing performance-first architectures for better scalability.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1">✦</span>
                <span>Prioritizing accessibility and inclusive design in every project.</span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mt-12 mb-6">Future Outlook</h2>
          <p>
            As we look toward the future, the integration of AI and more immersive 3D experiences will continue to reshape how we interact with the web. Staying ahead of these trends is crucial for any developer or designer looking to make a mark.
          </p>
          
          <p>
            Thank you for reading! If you have any questions or want to discuss these topics further, feel free to reach out through the contact section.
          </p>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            AA
          </div>
          <div>
            <p className="text-white font-medium">Arhan Ansari</p>
            <p className="text-neutral-400 text-sm">Full Stack Developer</p>
          </div>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="text-indigo-400 hover:underline"
        >
          Back to all posts
        </button>
      </div>
    </motion.div>
  );
};