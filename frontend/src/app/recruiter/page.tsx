"use client";

import { motion } from "framer-motion";
import { Search, Filter, Star, Sparkles, BrainCircuit, Target, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const mockCandidates = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Frontend Engineer",
    isHiddenGem: true,
    dnaScore: 98,
    potentialScore: 95,
    authenticityScore: 100,
    experience: "1.5 yrs",
    insight: "Writes React like a Staff Engineer. Exceptional component architecture.",
    skills: ["React", "TypeScript", "Framer Motion"]
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    role: "Full Stack Developer",
    isHiddenGem: false,
    dnaScore: 88,
    potentialScore: 82,
    authenticityScore: 95,
    experience: "5 yrs",
    insight: "Strong overall performer. Excellent system design.",
    skills: ["Node.js", "PostgreSQL", "Next.js"]
  },
  {
    id: "3",
    name: "Marcus Rodriguez",
    role: "UI/UX Developer",
    isHiddenGem: true,
    dnaScore: 94,
    potentialScore: 99,
    authenticityScore: 90,
    experience: "Bootcamp Grad",
    insight: "Unprecedented learning velocity. Mastered Three.js in 2 weeks.",
    skills: ["Three.js", "WebGL", "CSS"]
  }
];

export default function RecruiterDashboard() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 font-outfit max-w-7xl mx-auto">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Talent <span className="text-gradient">Intelligence</span></h1>
          <p className="text-gray-400 font-inter">Analyzing 1,248 candidates across 5 active roles.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative glass rounded-full px-4 py-2 flex items-center gap-2">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by skill or intent..." 
              className="bg-transparent border-none outline-none text-sm w-48 font-inter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="glass p-3 rounded-full hover:bg-white/10 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Intelligence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          icon={<Sparkles className="text-cyan-400" />}
          label="Hidden Gems Found"
          value="42"
          trend="+12 this week"
        />
        <StatCard 
          icon={<Target className="text-violet-400" />}
          label="Avg Authenticity Score"
          value="94%"
          trend="Highly Verified"
        />
        <StatCard 
          icon={<BrainCircuit className="text-pink-400" />}
          label="Avg Intent Match"
          value="88%"
          trend="Strong Alignment"
        />
      </div>

      {/* Pipeline View */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold">Top Recommendations</h2>
          <div className="flex gap-4 text-sm font-medium">
            <button className="text-cyan-400 border-b-2 border-cyan-400 pb-4 -mb-[17px]">Hidden Gems First</button>
            <button className="text-gray-500 hover:text-white transition-colors pb-4">Highest DNA</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {mockCandidates.map((candidate, i) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl hover:-translate-y-1 transition-transform border border-white/5 hover:border-white/20 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black/50" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{candidate.name}</h3>
                    <p className="text-xs text-gray-400">{candidate.role} • {candidate.experience}</p>
                  </div>
                </div>
                {candidate.isHiddenGem && (
                  <div className="bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-bold px-2 py-1 rounded border border-cyan-500/30 flex items-center gap-1">
                    <Sparkles size={10} /> Gem
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-300 font-inter mb-6 flex-1">
                "{candidate.insight}"
              </p>

              <div className="space-y-3 mb-6">
                <ScoreBar label="Candidate DNA" score={candidate.dnaScore} color="bg-cyan-400" />
                <ScoreBar label="True Potential" score={candidate.potentialScore} color="bg-violet-400" />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {candidate.skills.map(skill => (
                  <span key={skill} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/10">
                    {skill}
                  </span>
                ))}
              </div>

              <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-white/10">
                View DNA Profile <ArrowUpRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-2xl bg-white/5">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
      </div>
      <p className="text-xs font-medium text-gray-500">{trend}</p>
    </div>
  );
}

function ScoreBar({ label, score, color }: any) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{score}</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}
