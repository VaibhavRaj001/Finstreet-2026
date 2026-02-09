
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Briefcase, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

const fields = [
  {
    id: 1,
    title: "Personal Finance",
    icon: <Wallet size={48} className="text-[#D4AF37]" />,
    description: "Build practical skills to manage money, savings, and long-term financial goals.",
    link: "#"
  },
  {
    id: 2,
    title: "Corporate Strategy",
    icon: <Briefcase size={48} className="text-[#D4AF37]" />,
    description: "Understand how organizations plan, compete, and grow in dynamic markets.",
    link: "#"
  },
  {
    id: 3,
    title: "Investments",
    icon: <TrendingUp size={48} className="text-[#D4AF37]" />,
    description: "Explore financial markets, asset classes, and risk-return decision making.",
    link: "#"
  },
  {
      id: 4,
      title: "Economics",
      icon: <TrendingUp size={48} className="text-[#D4AF37]" />, 
      description: "Analyze market trends, fiscal policies, and global economic indicators.",
      link: "#"
  }
];

const OurInterest = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % fields.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + fields.length) % fields.length);
  };

  const visibleFields = [];
  for (let i = 0; i < itemsPerPage; i++) {
    visibleFields.push(fields[(currentIndex + i) % fields.length]);
  }

  return (
    <section className="relative w-full py-20 px-6 md:px-12 lg:px-20 overflow-hidden text-white bg-transparent">
        {/* Gradient Overlay for blending */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-[#0F0F12] via-transparent to-[#0F0F12] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col space-y-12">
            
            {/* Heading */}
            <div className="flex flex-col space-y-2">
                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white/90">
                    Our Field Of <span className="text-white/50">Interest</span>
                </h2>
                <div className="w-full h-px bg-white/20 mt-4"></div>
            </div>

            {/* Carousel Container */}
            <div className="relative flex items-center justify-center w-full min-h-[400px]">
                
                {/* Left Arrow (Desktop) */}
                <button 
                    onClick={handlePrev}
                    className="absolute -left-4 z-20 p-3 rounded-full border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all hidden md:flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Cards Wrapper */}
                <div className="flex gap-6 w-full justify-center px-0 md:px-12">
                    <AnimatePresence mode='popLayout'>
                        {visibleFields.map((field) => (
                             <motion.div
                                key={field.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className={`shrink-0 w-full ${itemsPerPage === 1 ? 'max-w-sm' : 'md:w-[calc(33.333%-16px)]'}`}
                            >
                                <div className="h-full border border-white/10 rounded-2xl bg-[#0B0B0D]/40 backdrop-blur-sm p-8 flex flex-col items-center text-center hover:border-[#D4AF37]/30 transition-colors duration-300 group min-h-[350px]">
                                    <div className="mb-6 p-4 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors duration-300 text-[#D4AF37]">
                                        {field.icon}
                                    </div>
                                    <h3 className="text-[#D4AF37] text-xl font-medium mb-4">{field.title}</h3>
                                    <p className="text-white/70 text-sm leading-relaxed mb-8 grow">
                                        {field.description}
                                    </p>
                                    <a href={field.link} className="text-[#D4AF37] text-sm hover:underline underline-offset-4 mt-auto">
                                        Learn More
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Right Arrow (Desktop) */}
                <button 
                    onClick={handleNext}
                    className="absolute -right-4 z-20 p-3 rounded-full border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all hidden md:flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <ChevronRight size={24} />
                </button>

            </div>

             {/* Mobile Navigation */}
             <div className="flex md:hidden justify-center gap-8 w-full mt-4">
                 <button onClick={handlePrev} className="p-3 border border-[#D4AF37]/50 rounded-full text-[#D4AF37] hover:bg-[#D4AF37]/10"><ChevronLeft size={24}/></button>
                 <button onClick={handleNext} className="p-3 border border-[#D4AF37]/50 rounded-full text-[#D4AF37] hover:bg-[#D4AF37]/10"><ChevronRight size={24}/></button>
             </div>
        </div>
    </section>
  );
};

export default OurInterest;
