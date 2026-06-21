"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Target, Zap, ChevronRight, Lock, Unlock, PlayCircle, Trophy } from "lucide-react";
import { useState } from "react";

export default function CandidateDashboard() {
  const [challengeState, setChallengeState] = useState<"IDLE" | "ACTIVE" | "COMPLETED">("IDLE");

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 font-outfit max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Left Column: DNA & Potential */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="glass-strong p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-violet-600 animate-spin-slow opacity-50 blur-md" />
            <div className="w-full h-full rounded-full bg-black border-2 border-white/20 p-1 relative z-10">
              <div className="w-full h-full rounded-full bg-white/10" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-1">Alex Chen</h2>
          <p className="text-cyan-400 text-sm font-medium mb-6">Frontend Engineer</p>

          <div className="w-full space-y-4 font-inter text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-xs text-gray-400 mb-1">Talent DNA Score</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">98</span>
                <span className="text-sm text-gray-500 mb-1">/ 100</span>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-xs text-gray-400 mb-1">True Potential Score</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-violet-400">95</span>
                <span className="text-sm text-gray-500 mb-1">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Future Role Predictions */}
        <div className="glass p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-pink-400" size={24} />
            <h3 className="text-xl font-bold">Future Matches</h3>
          </div>
          
          <div className="space-y-4">
            <RoleCard role="Senior Frontend Eng" match="98%" time="Ready Now" />
            <RoleCard role="Solutions Architect" match="85%" time="6-12 Months" />
            <RoleCard role="Developer Advocate" match="70%" time="1-2 Years" />
          </div>
        </div>
      </div>

      {/* Right Column: Authenticity & Roadmap */}
      <div className="lg:w-2/3 flex flex-col gap-6">
        
        {/* Authenticity Challenge Header */}
        <div className="glass-strong p-8 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className={challengeState === "COMPLETED" ? "text-green-400" : "text-cyan-400"} size={28} />
                <h2 className="text-2xl font-bold">Authenticity Challenge</h2>
              </div>
              <p className="text-gray-400 font-inter max-w-md">
                Prove your resume is real. Complete AI-generated micro-challenges based on your claimed skills to earn the Verified badge.
              </p>
            </div>
            
            {challengeState === "IDLE" && (
              <button 
                onClick={() => setChallengeState("ACTIVE")}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <PlayCircle size={20} /> Start Challenge
              </button>
            )}
            
            {challengeState === "COMPLETED" && (
              <div className="px-6 py-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 font-bold flex items-center gap-2">
                <Trophy size={20} /> Verified (100%)
              </div>
            )}
          </div>

          {/* Active Challenge UI */}
          {challengeState === "ACTIVE" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-8 pt-8 border-t border-white/10"
            >
              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-violet-400 uppercase tracking-wider">
                <Zap size={16} /> Skill: REST APIs
              </div>
              <h3 className="text-xl font-bold mb-6">What is the difference between PUT and PATCH?</h3>
              
              <div className="space-y-3 font-inter">
                <ChallengeOption text="PUT replaces the entire resource, PATCH applies partial updates." correct />
                <ChallengeOption text="PUT is for creating, PATCH is for deleting." />
                <ChallengeOption text="They are exactly the same, just different naming conventions." />
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setChallengeState("COMPLETED")}
                  className="px-6 py-2 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform"
                >
                  Submit Answer
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Intent Analysis / Motivation */}
        <div className="glass p-8 rounded-3xl border border-white/5">
          <h2 className="text-2xl font-bold mb-6">Intent Analysis</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <IntentBar label="Career Alignment" score={92} />
              <IntentBar label="Growth Velocity" score={88} />
              <IntentBar label="Motivation Fit" score={96} />
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 font-inter text-sm text-gray-300 leading-relaxed relative">
              <div className="absolute top-4 left-4 text-4xl text-white/10 font-serif">"</div>
              <p className="relative z-10 pt-2">
                AI Analysis indicates Alex is deeply motivated by complex architectural challenges. The transition from Bootcamp to Senior roles aligns with observed rapid learning patterns. High probability of long-term retention if provided with architectural autonomy.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function RoleCard({ role, match, time }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
      <div>
        <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{role}</p>
        <p className="text-xs text-gray-500 font-inter mt-1">{time}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-violet-400">{match}</span>
        <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}

function ChallengeOption({ text, correct }: any) {
  const [selected, setSelected] = useState(false);
  
  return (
    <div 
      onClick={() => setSelected(!selected)}
      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
        selected 
          ? "bg-cyan-500/10 border-cyan-500 text-cyan-50" 
          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
      }`}
    >
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected ? "border-cyan-500 bg-cyan-500" : "border-gray-500"}`}>
        {selected && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
      <p>{text}</p>
    </div>
  );
}

function IntentBar({ label, score }: any) {
  return (
    <div className="space-y-2 font-inter">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{score}%</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400" 
        />
      </div>
    </div>
  );
}
