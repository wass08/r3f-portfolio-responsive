import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Development",
    excerpt: "Exploring the latest trends in React, Three.js, and AI integration.",
    date: "March 15, 2024",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Mastering UI/UX Design",
    excerpt: "How to create immersive user experiences that captivate and engage.",
    date: "March 10, 2024",
    category: "UI/UX",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "The Power of 3D in Browser",
    excerpt: "Why WebGL and Three.js are changing the way we think about websites.",
    date: "March 5, 2024",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min read"
  }
];

const categories = ["All", "Web Development", "UI/UX", "Programming"];

export const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredPost, setHoveredPost] = useState(null);
  const navigate = useNavigate();

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="w-full">
      <motion.div 
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        whileInView={"visible"}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Blog</h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'}`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              className="bg-white bg-opacity-10 rounded-lg overflow-hidden backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5 }
              }}
              onClick={() => navigate(`/blog/${post.id}`)}
              onHoverStart={() => setHoveredPost(post.id)}
              onHoverEnd={() => setHoveredPost(null)}
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <motion.img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredPost === post.id ? 1 : 0.5 }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-indigo-400 text-sm">{post.category}</span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
                <motion.button
                  className="text-indigo-400 font-medium hover:text-indigo-300"
                  whileHover={{ x: 5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/blog/${post.id}`);
                  }}
                >
                  Read More →
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}; 