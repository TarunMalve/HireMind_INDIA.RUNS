"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BrainCircuit, ScanSearch, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen pt-20 px-6 flex flex-col items-center justify-center font-outfit">
      
      {/* Navbar Placeholder */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 glass">
        <div className="text-2xl font-bold tracking-tighter">
          Hire<span className="text-gradient">Mind</span>
        </div>
        <div className="flex gap-4">
          <Link href="/recruiter" className="text-sm font-medium hover:text-cyan-400 transition-colors">
            Recruiter Portal
          </Link>
          <Link href="/candidate" className="text-sm font-medium hover:text-violet-400 transition-colors">
            Candidate Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-6xl w-full flex flex-col md:flex-row items-center justify-between mt-10 md:mt-0 min-h-[80vh]">
        
        {/* Left: Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 space-y-8 z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm font-medium text-cyan-300">
            <Sparkles size={16} />
            <span>The Future of Talent Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            Don't Hire Resumes.<br />
            Discover <span className="text-gradient">Human Potential.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-xl font-inter leading-relaxed">
            Move beyond keyword matching. HireMind AI maps cognitive competencies, validates authenticity, and uncovers hidden gems traditional ATS platforms miss.
          </p>
          
          <div className="flex gap-4 pt-4">
            <Link href="/demo">
              <button className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                Try Live Demo <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/recruiter">
              <button className="px-8 py-4 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors">
                Recruiter Login
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Right: Floating 3D Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 relative w-full h-[500px] mt-16 md:mt-0 flex justify-center items-center"
        >
          {/* Glass Card representing Candidate DNA */}
          <div className="relative w-[350px] h-[450px] glass-strong rounded-3xl p-8 animate-float flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-black/50" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Alex Chen</h3>
                <p className="text-sm text-cyan-400">Hidden Gem • 98% Match</p>
              </div>
            </div>

            <div className="space-y-4 font-inter">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Technical Depth</span>
                  <span className="text-white">95/100</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[95%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">True Potential</span>
                  <span className="text-white">98/100</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-400 w-[98%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Authenticity Score</span>
                  <span className="text-white">Verified</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 w-full" />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-gray-500">HireMind AI Analysis</span>
              <BrainCircuit size={16} className="text-violet-400" />
            </div>
          </div>
          
          {/* Decorative floating elements */}
          <div className="absolute top-10 right-10 w-20 h-20 glass rounded-2xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-10 w-16 h-16 glass rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </motion.div>

      </section>

      {/* Features Grid */}
      <section className="max-w-6xl w-full py-24 space-y-16 z-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">Beyond Keywords. Beyond Bias.</h2>
          <p className="text-gray-400 font-inter">The three pillars of Talent Intelligence.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<ScanSearch size={32} className="text-cyan-400" />}
            title="Hidden Gem Engine"
            desc="Identify candidates with unconventional backgrounds but massive potential. We find the 10x engineers that standard ATS filters reject."
          />
          <FeatureCard 
            icon={<Target size={32} className="text-violet-400" />}
            title="Authenticity Challenge"
            desc="Stop guessing if a resume is real. Our AI generates dynamic, adaptive micro-challenges based on claimed skills to verify true capability."
          />
          <FeatureCard 
            icon={<BrainCircuit size={32} className="text-pink-400" />}
            title="Candidate DNA"
            desc="A multi-dimensional mapping of cognitive competencies, learning velocity, and intent analysis. See the whole human."
          />
        </div>
      </section>
      
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-white/20 group">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 font-inter leading-relaxed">{desc}</p>
    </div>
  );
}
