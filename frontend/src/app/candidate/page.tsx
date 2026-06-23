"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Target, Zap, ChevronRight, PlayCircle, Trophy,
  TrendingUp, Clock, Star, CheckCircle2, ArrowRight,
  Flame, Brain, Code2, Layers, GitBranch, Sparkles,
  BarChart3, Activity, Rocket, Eye, Lock, ChevronUp,
  Calendar, Download, Settings, Bell
} from "lucide-react";
import { useState, useEffect } from "react";

// ─── Animated Counter ────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display}{suffix}</span>;
}

// ─── Circular Score Ring ──────────────────────────────────────────────
function ScoreRing({ score, color, size = 120, strokeWidth = 8, label }: {
  score: number; color: string; size?: number; strokeWidth?: number; label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black tabular-nums">{score}</span>
        </div>
      </div>
      {label && <p className="text-xs text-gray-400 font-medium tracking-wide">{label}</p>}
    </div>
  );
}

// ─── Skill Hexagon Grid ───────────────────────────────────────────────
function SkillHex({ skill, level, color }: { skill: string; level: number; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="flex flex-col items-center gap-1.5 cursor-pointer group"
    >
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 60 52" className="absolute inset-0 w-full h-full">
          <polygon
            points="30,2 58,17 58,35 30,50 2,35 2,17"
            fill={`${color}22`}
            stroke={`${color}66`}
            strokeWidth="1.5"
            className="group-hover:fill-[currentColor] transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white/80">{level}%</span>
        </div>
      </div>
      <span className="text-[10px] text-gray-400 font-medium text-center leading-tight">{skill}</span>
    </motion.div>
  );
}

// ─── Timeline Item ─────────────────────────────────────────────────────
function TimelineItem({ icon, title, desc, time, accent, last }: any) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
          {icon}
        </div>
        {!last && <div className="w-px flex-1 mt-2 bg-white/5" />}
      </div>
      <div className={`pb-5 ${last ? "" : ""}`}>
        <p className="text-sm font-semibold text-white/90">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 font-inter">{desc}</p>
        <p className="text-[10px] text-gray-600 mt-1 font-mono">{time}</p>
      </div>
    </div>
  );
}

// ─── Challenge Option ──────────────────────────────────────────────────
function ChallengeOption({ text, correct, revealed }: any) {
  const [selected, setSelected] = useState(false);

  return (
    <motion.div
      onClick={() => !revealed && setSelected(!selected)}
      whileHover={!revealed ? { x: 4 } : {}}
      whileTap={!revealed ? { scale: 0.99 } : {}}
      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
        revealed && correct
          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-100"
          : revealed && selected && !correct
          ? "bg-red-500/10 border-red-500/40 text-red-200 opacity-70"
          : selected
          ? "bg-cyan-500/10 border-cyan-500/60 text-cyan-50"
          : "bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.06] hover:border-white/20"
      }`}
    >
      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        revealed && correct ? "border-emerald-400 bg-emerald-400"
        : revealed && selected && !correct ? "border-red-400 bg-red-400"
        : selected ? "border-cyan-400 bg-cyan-400"
        : "border-gray-600"
      }`}>
        {(selected || (revealed && correct)) && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
      <p className="text-sm leading-relaxed font-inter">{text}</p>
      {revealed && correct && (
        <CheckCircle2 size={16} className="text-emerald-400 ml-auto flex-shrink-0 mt-0.5" />
      )}
    </motion.div>
  );
}

// ─── Role Match Card ───────────────────────────────────────────────────
function RoleCard({ role, match, time, index }: any) {
  const matchNum = parseInt(match);
  const color = matchNum >= 90 ? "#22d3ee" : matchNum >= 75 ? "#a78bfa" : "#f472b6";
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.5 }}
      whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
      className="flex items-center justify-between p-3 rounded-2xl border border-white/5 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
        <div>
          <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{role}</p>
          <p className="text-[11px] text-gray-500 font-inter mt-0.5">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold font-mono" style={{ color }}>{match}</span>
        <ChevronRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
      </div>
    </motion.div>
  );
}

// ─── Stat Chip ─────────────────────────────────────────────────────────
function StatChip({ label, value, icon, trend }: any) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-gray-600">{icon}</span>
      </div>
      <p className="text-2xl font-black tracking-tight">{value}</p>
      {trend && <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1"><ChevronUp size={10} />{trend}</p>}
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function CandidateDashboard() {
  const [challengeState, setChallengeState] = useState<"IDLE" | "ACTIVE" | "REVEALED" | "COMPLETED">("IDLE");
  const [activeTab, setActiveTab] = useState<"roadmap" | "activity" | "skills">("roadmap");
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    if (challengeState !== "ACTIVE") return;
    const t = setInterval(() => setTimer(s => {
      if (s <= 1) { clearInterval(t); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [challengeState]);

  const skills = [
    { skill: "React", level: 96, color: "#22d3ee" },
    { skill: "TypeScript", level: 89, color: "#a78bfa" },
    { skill: "Next.js", level: 84, color: "#f472b6" },
    { skill: "Node.js", level: 72, color: "#34d399" },
    { skill: "Framer", level: 91, color: "#fb923c" },
    { skill: "GraphQL", level: 65, color: "#60a5fa" },
    { skill: "AWS", level: 58, color: "#fbbf24" },
    { skill: "Docker", level: 61, color: "#4ade80" },
  ];

  const timeline = [
    { icon: <Trophy size={16} className="text-yellow-400" />, title: "Authenticity Verified", desc: "REST API challenge passed with 100% accuracy", time: "2 hours ago", accent: "bg-yellow-500/15", last: false },
    { icon: <Star size={16} className="text-cyan-400" />, title: "New Match Found", desc: "Stripe Inc. Senior Frontend Engineer — 98% fit", time: "Yesterday", accent: "bg-cyan-500/15", last: false },
    { icon: <TrendingUp size={16} className="text-violet-400" />, title: "DNA Score Updated", desc: "+3 points from React advanced quiz", time: "3 days ago", accent: "bg-violet-500/15", last: false },
    { icon: <Brain size={16} className="text-pink-400" />, title: "Intent Analysis Complete", desc: "Your career motivation profile is ready", time: "1 week ago", accent: "bg-pink-500/15", last: true },
  ];

  const roadmap = [
    { title: "Senior Frontend Engineer", status: "ready", eta: "Now", match: 98, icon: <Code2 size={14} /> },
    { title: "Lead / Staff Engineer", status: "in-progress", eta: "6 months", match: 81, icon: <Layers size={14} /> },
    { title: "Solutions Architect", status: "locked", eta: "12–18 months", match: 74, icon: <GitBranch size={14} /> },
    { title: "Engineering Manager", status: "locked", eta: "2 years", match: 62, icon: <Brain size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#06050f] text-white font-sans">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-pink-500/4 rounded-full blur-[100px]" />
      </div>

      {/* Top Nav Strip */}
      <div className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-wide">HireMind</span>
            <span className="text-white/20 mx-2">|</span>
            <span className="text-xs text-gray-500 font-medium">Candidate Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Bell size={14} className="text-gray-400" />
            </button>
            <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Settings size={14} className="text-gray-400" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center text-xs font-bold">AC</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* Header Row */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">Profile Active</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Good evening, <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Alex</span> ✦</h1>
            <p className="text-gray-500 text-sm font-inter mt-1">Your talent intelligence is updated as of today</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-gray-300 hover:bg-white/10 transition-all flex items-center gap-2">
              <Download size={12} /> Export Profile
            </button>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-xs font-bold text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2">
              <Eye size={12} /> View Public Profile
            </button>
          </div>
        </motion.div>

        {/* ─── Main Grid ─────────────────────────────── */}
        <div className="grid grid-cols-12 gap-5">

          {/* ── Left Sidebar (Col 1-3) ─── */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/8 rounded-3xl p-5 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-cyan-500/10 to-transparent" />
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 p-[2px] mb-3">
                  <div className="w-full h-full rounded-2xl bg-[#0d0b1e] flex items-center justify-center text-xl font-black">AC</div>
                </div>
                <h2 className="text-lg font-bold">Alex Chen</h2>
                <p className="text-xs text-cyan-400 font-semibold mt-0.5">Frontend Engineer</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-gray-500">Open to offers</span>
                </div>
              </div>

              <div className="relative z-10 mt-4 pt-4 border-t border-white/5 flex justify-around">
                <ScoreRing score={98} color="#22d3ee" size={72} strokeWidth={5} label="DNA" />
                <ScoreRing score={95} color="#a78bfa" size={72} strokeWidth={5} label="Potential" />
              </div>

              <div className="relative z-10 mt-4 grid grid-cols-2 gap-2">
                <StatChip label="Challenges" value="12" icon={<Trophy size={12} />} />
                <StatChip label="Rank" value="#47" icon={<Star size={12} />} />
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/[0.03] border border-white/8 rounded-3xl p-5 space-y-3"
            >
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Intelligence Scores</h3>
              {[
                { label: "Authenticity", score: 100, color: "#22d3ee" },
                { label: "Career Alignment", score: 92, color: "#a78bfa" },
                { label: "Growth Velocity", score: 88, color: "#f472b6" },
                { label: "Motivation Fit", score: 96, color: "#34d399" },
              ].map(({ label, score, color }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className="text-xs font-bold" style={{ color }}>{score}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1.4, ease: "easeOut", delay: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: `0 0 8px ${color}66` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* AI Intent Insight */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-violet-500/8 to-cyan-500/5 border border-violet-500/20 rounded-3xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain size={14} className="text-violet-400" />
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">AI Insight</span>
              </div>
              <p className="text-xs text-gray-300 font-inter leading-relaxed">
                Alex is deeply motivated by <span className="text-cyan-300 font-semibold">complex architectural challenges</span>. Rapid learning pattern suggests <span className="text-violet-300 font-semibold">90% retention probability</span> if given architectural autonomy.
              </p>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1">
                <Sparkles size={10} className="text-yellow-400" />
                <span className="text-[10px] text-gray-600 font-inter">Powered by HireMind Neural Analysis v3</span>
              </div>
            </motion.div>
          </div>

          {/* ── Center Column (Col 4-9) ─── */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-5">

            {/* Authenticity Challenge Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-white/[0.03] border border-white/8 rounded-3xl overflow-hidden"
            >
              {/* Top gradient bar */}
              <div className={`h-1 w-full ${challengeState === "COMPLETED" ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-cyan-500 to-violet-600"}`} />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${challengeState === "COMPLETED" ? "bg-emerald-500/20" : "bg-cyan-500/15"}`}>
                      <ShieldCheck size={18} className={challengeState === "COMPLETED" ? "text-emerald-400" : "text-cyan-400"} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Authenticity Challenge</h2>
                      <p className="text-xs text-gray-500 font-inter mt-0.5">AI-generated micro-tests based on your claimed skills</p>
                    </div>
                  </div>

                  {/* State Badge */}
                  {challengeState === "IDLE" && (
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-medium flex items-center gap-1.5">
                      <Lock size={10} /> Not Started
                    </div>
                  )}
                  {challengeState === "ACTIVE" && (
                    <div className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-xs text-orange-300 font-bold flex items-center gap-1.5 animate-pulse">
                      <Flame size={10} /> LIVE
                    </div>
                  )}
                  {(challengeState === "REVEALED" || challengeState === "COMPLETED") && (
                    <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                      <Trophy size={10} /> Verified 100%
                    </div>
                  )}
                </div>

                {/* Challenge Progress Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
                    <span>Challenge Progress</span>
                    <span>{challengeState === "COMPLETED" || challengeState === "REVEALED" ? "3/3" : challengeState === "ACTIVE" ? "1/3" : "0/3"} completed</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="h-full rounded-full flex-1"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          backgroundColor: (challengeState === "COMPLETED" || challengeState === "REVEALED") ? "#10b981"
                            : challengeState === "ACTIVE" && i === 0 ? "#06b6d4"
                            : "rgba(255,255,255,0.08)"
                        }}
                        transition={{ delay: i * 0.15 + 0.5 }}
                      />
                    ))}
                  </div>
                </div>

                {/* IDLE State */}
                {challengeState === "IDLE" && (
                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-500/20 flex items-center justify-center mb-4">
                      <PlayCircle size={28} className="text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-white mb-1">Ready to prove your skills?</h3>
                    <p className="text-xs text-gray-500 font-inter mb-5 max-w-xs">
                      3 AI-generated questions tailored to your claimed expertise. Takes ~5 minutes.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setChallengeState("ACTIVE"); setTimer(120); }}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-sm font-bold text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all flex items-center gap-2"
                    >
                      <Zap size={14} /> Begin Challenge
                    </motion.button>
                  </div>
                )}

                {/* ACTIVE State */}
                {challengeState === "ACTIVE" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Timer */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <div className={`w-2 h-2 rounded-full ${timer < 30 ? "bg-red-400 animate-pulse" : "bg-emerald-400"}`} />
                        <span className={timer < 30 ? "text-red-400" : "text-emerald-400"}>
                          {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
                        <Zap size={10} className="text-violet-400" />
                        <span className="text-[10px] font-bold text-violet-300">REST APIs · Q1 of 3</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold mb-4 leading-snug">
                      What is the primary difference between <span className="text-cyan-300">PUT</span> and <span className="text-violet-300">PATCH</span> HTTP methods?
                    </h3>

                    <div className="space-y-2.5 mb-5">
                      <ChallengeOption text="PUT replaces the entire resource; PATCH applies partial updates only." correct revealed={challengeState === "REVEALED"} />
                      <ChallengeOption text="PUT is idempotent for creation; PATCH is used exclusively for deletion." correct={false} revealed={challengeState === "REVEALED"} />
                      <ChallengeOption text="They are functionally identical — just different naming conventions." correct={false} revealed={challengeState === "REVEALED"} />
                    </div>

                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setChallengeState("REVEALED")}
                        className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-100 transition-colors"
                      >
                        Submit Answer
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* REVEALED State */}
                {challengeState === "REVEALED" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-3">
                      <CheckCircle2 size={24} className="text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-emerald-300 mb-1">Correct Answer!</h3>
                    <p className="text-xs text-gray-500 font-inter mb-4">+5 DNA points awarded. 2 more challenges remain.</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setChallengeState("COMPLETED")}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-bold text-white"
                    >
                      Next Challenge <ArrowRight size={14} className="inline ml-1" />
                    </motion.button>
                  </motion.div>
                )}

                {/* COMPLETED State */}
                {challengeState === "COMPLETED" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center mb-3">
                      <Trophy size={24} className="text-yellow-400" />
                    </div>
                    <h3 className="font-bold text-yellow-300 mb-1">All Challenges Passed!</h3>
                    <p className="text-xs text-gray-400 font-inter mb-3">Authenticity score updated to <span className="text-yellow-300 font-bold">100%</span></p>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                      <ShieldCheck size={12} className="text-emerald-400" />
                      <span>Verified Badge added to your profile</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Tabbed Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.03] border border-white/8 rounded-3xl overflow-hidden"
            >
              {/* Tabs */}
              <div className="flex border-b border-white/5">
                {(["roadmap", "activity", "skills"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3.5 text-xs font-semibold capitalize transition-all relative ${
                      activeTab === tab ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {tab === "roadmap" && <><Rocket size={10} className="inline mr-1" />Career Roadmap</>}
                    {tab === "activity" && <><Activity size={10} className="inline mr-1" />Activity</>}
                    {tab === "skills" && <><BarChart3 size={10} className="inline mr-1" />Skills Grid</>}
                    {activeTab === tab && (
                      <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-violet-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-5">
                <AnimatePresence mode="wait">
                  {/* Roadmap Tab */}
                  {activeTab === "roadmap" && (
                    <motion.div key="roadmap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                      {roadmap.map((item, i) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className={`p-4 rounded-2xl border flex items-center gap-4 ${
                            item.status === "ready"
                              ? "bg-cyan-500/8 border-cyan-500/30"
                              : item.status === "in-progress"
                              ? "bg-violet-500/8 border-violet-500/20"
                              : "bg-white/[0.02] border-white/5 opacity-60"
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            item.status === "ready" ? "bg-cyan-500/20 text-cyan-400"
                            : item.status === "in-progress" ? "bg-violet-500/20 text-violet-400"
                            : "bg-white/5 text-gray-600"
                          }`}>
                            {item.status === "locked" ? <Lock size={14} /> : item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{item.title}</p>
                            <p className="text-[11px] text-gray-500 font-inter">{item.eta}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-sm font-bold" style={{
                                color: item.status === "ready" ? "#22d3ee"
                                  : item.status === "in-progress" ? "#a78bfa" : "#4b5563"
                              }}>{item.match}%</p>
                              <p className="text-[10px] text-gray-600">match</p>
                            </div>
                            {item.status !== "locked" && (
                              <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                <ChevronRight size={12} className="text-gray-500" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Activity Tab */}
                  {activeTab === "activity" && (
                    <motion.div key="activity" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      {timeline.map((item, i) => (
                        <TimelineItem key={i} {...item} />
                      ))}
                    </motion.div>
                  )}

                  {/* Skills Tab */}
                  {activeTab === "skills" && (
                    <motion.div key="skills" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <div className="flex flex-wrap gap-4 justify-center">
                        {skills.map((s, i) => (
                          <motion.div key={s.skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
                            <SkillHex {...s} />
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-lg font-black text-cyan-400">8</p>
                          <p className="text-[10px] text-gray-600">Skills Verified</p>
                        </div>
                        <div>
                          <p className="text-lg font-black text-violet-400">4</p>
                          <p className="text-[10px] text-gray-600">In Progress</p>
                        </div>
                        <div>
                          <p className="text-lg font-black text-pink-400">82%</p>
                          <p className="text-[10px] text-gray-600">Avg Proficiency</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ── Right Sidebar (Col 10-12) ─── */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">

            {/* Top Matches */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/[0.03] border border-white/8 rounded-3xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-pink-400" />
                  <h3 className="text-sm font-bold">Future Matches</h3>
                </div>
                <button className="text-[10px] text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">View All</button>
              </div>
              <div className="space-y-1.5">
                <RoleCard role="Senior Frontend Eng." match="98%" time="Ready Now" index={0} />
                <RoleCard role="Lead Engineer" match="81%" time="6 months" index={1} />
                <RoleCard role="Solutions Architect" match="74%" time="12–18 months" index={2} />
                <RoleCard role="Developer Advocate" match="62%" time="2 years" index={3} />
              </div>
            </motion.div>

            {/* Interview Invites */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.03] border border-white/8 rounded-3xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={14} className="text-violet-400" />
                <h3 className="text-sm font-bold">Pending Interviews</h3>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 font-bold">2 New</span>
              </div>

              {[
                { company: "Stripe", role: "Sr. Frontend Eng.", time: "Tomorrow 2PM", logo: "S", color: "#a78bfa" },
                { company: "Vercel", role: "Staff Engineer", time: "Thu 11AM", logo: "V", color: "#22d3ee" },
              ].map((invite, i) => (
                <motion.div
                  key={invite.company}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer mb-2 last:mb-0"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0" style={{ background: `${invite.color}22`, color: invite.color }}>
                    {invite.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{invite.company}</p>
                    <p className="text-[10px] text-gray-500 truncate">{invite.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-gray-400 font-medium">{invite.time}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Unlock Premium Tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-cyan-500/10 via-violet-500/8 to-pink-500/5 border border-cyan-500/20 rounded-3xl p-5 relative overflow-hidden"
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-300">Pro Tip</span>
                </div>
                <p className="text-xs text-gray-300 font-inter leading-relaxed mb-3">
                  Complete 2 more challenges to unlock <span className="text-cyan-300 font-semibold">Elite Badge</span> and 3× more recruiter visibility.
                </p>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" style={{ boxShadow: "0 0 10px rgba(251,191,36,0.5)" }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                  <span>1 done</span>
                  <span>3 total</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
