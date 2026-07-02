"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Star, Sparkles, BrainCircuit, Target, ArrowUpRight,
  TrendingUp, Activity, Zap, Clock, MessageSquare,
  ChevronRight, Briefcase, LayoutGrid, List,
  Bell, X,
  Brain, Globe,
  Plus, ArrowRight, Download, RefreshCw, ShieldCheck, Layers,
  FileSpreadsheet, Share2, CheckCircle2, Eye,
  Calendar,
} from "lucide-react";
import { useState, useCallback } from "react";
import ExportReportModal, { ExportReportButton } from "@/components/ExportReportModal";
import type { ExportCandidate } from "@/lib/exportHiringReport";

// ─── Types ────────────────────────────────────────────────────────────────
interface Candidate {
  id: string;
  name: string;
  role: string;
  isHiddenGem: boolean;
  dnaScore: number;
  potentialScore: number;
  authenticityScore: number;
  experience: string;
  location: string;
  insight: string;
  skills: string[];
  status: "new" | "reviewed" | "shortlisted" | "interviewing";
  appliedDays: number;
  avatar: string;
  availableIn: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────
const mockCandidates: Candidate[] = [
  {
    id: "1", name: "Alex Chen", role: "Frontend Engineer", isHiddenGem: true,
    dnaScore: 98, potentialScore: 95, authenticityScore: 100,
    experience: "1.5 yrs", location: "San Francisco, CA",
    insight: "Writes React like a Staff Engineer. Exceptional component architecture and design system thinking.",
    skills: ["React", "TypeScript", "Framer Motion", "GraphQL"],
    status: "new", appliedDays: 1, avatar: "AC", availableIn: "Immediate"
  },
  {
    id: "2", name: "Sarah Jenkins", role: "Full Stack Developer", isHiddenGem: false,
    dnaScore: 88, potentialScore: 82, authenticityScore: 95,
    experience: "5 yrs", location: "Austin, TX",
    insight: "Strong overall performer with excellent system design instincts. Proven track record at scale.",
    skills: ["Node.js", "PostgreSQL", "Next.js", "Docker"],
    status: "shortlisted", appliedDays: 3, avatar: "SJ", availableIn: "2 weeks"
  },
  {
    id: "3", name: "Marcus Rodriguez", role: "UI/UX Developer", isHiddenGem: true,
    dnaScore: 94, potentialScore: 99, authenticityScore: 90,
    experience: "Bootcamp Grad", location: "Remote — Mexico",
    insight: "Unprecedented learning velocity. Mastered Three.js in 2 weeks. Creative and technically rigorous.",
    skills: ["Three.js", "WebGL", "CSS", "Figma"],
    status: "new", appliedDays: 0, avatar: "MR", availableIn: "Immediate"
  },
  {
    id: "4", name: "Priya Nair", role: "Backend Engineer", isHiddenGem: false,
    dnaScore: 91, potentialScore: 87, authenticityScore: 98,
    experience: "3.5 yrs", location: "Bangalore, India",
    insight: "Deep Rust expertise and distributed systems knowledge. Security-first mindset throughout.",
    skills: ["Rust", "Kafka", "k8s", "Go"],
    status: "interviewing", appliedDays: 7, avatar: "PN", availableIn: "4 weeks"
  },
  {
    id: "5", name: "Jordan Kim", role: "ML Engineer", isHiddenGem: true,
    dnaScore: 96, potentialScore: 93, authenticityScore: 92,
    experience: "2 yrs", location: "Seattle, WA",
    insight: "Top 0.1% ML practitioner relative to experience. Published researcher with 3 papers on NLP.",
    skills: ["PyTorch", "Python", "LLMs", "MLOps"],
    status: "reviewed", appliedDays: 5, avatar: "JK", availableIn: "1 month"
  },
  {
    id: "6", name: "Lena Müller", role: "DevOps Engineer", isHiddenGem: false,
    dnaScore: 84, potentialScore: 79, authenticityScore: 96,
    experience: "6 yrs", location: "Berlin, Germany",
    insight: "Infrastructure automation expert. Reduced deployment time by 80% at previous company.",
    skills: ["Terraform", "AWS", "GitHub Actions", "Prometheus"],
    status: "shortlisted", appliedDays: 2, avatar: "LM", availableIn: "3 weeks"
  },
];

// ─── Status config ─────────────────────────────────────────────────────────
const statusConfig = {
  new: { label: "New", color: "#22d3ee", bg: "bg-cyan-500/15", border: "border-cyan-500/30" },
  reviewed: { label: "Reviewed", color: "#a78bfa", bg: "bg-violet-500/15", border: "border-violet-500/30" },
  shortlisted: { label: "Shortlisted", color: "#34d399", bg: "bg-emerald-500/15", border: "border-emerald-500/30" },
  interviewing: { label: "Interviewing", color: "#fb923c", bg: "bg-orange-500/15", border: "border-orange-500/30" },
};

// ─── Avatar ────────────────────────────────────────────────────────────────
function CandidateAvatar({ initials, gem }: { initials: string; gem: boolean }) {
  return (
    <div className="relative flex-shrink-0">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm ${
        gem ? "bg-gradient-to-br from-cyan-400 to-violet-600 text-white"
              : "bg-white/8 border border-white/10 text-gray-300"
      }`}>
        {initials}
      </div>
      {gem && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 border-2 border-[#06050f] flex items-center justify-center">
          <Star size={7} className="text-black fill-black" />
        </div>
      )}
    </div>
  );
}

// ─── Score Badge ───────────────────────────────────────────────────────────
function ScorePill({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-gray-500">{label}</span>
        <span className="font-bold" style={{ color }}>{score}</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
}

// ─── Candidate Card ────────────────────────────────────────────────────────
function CandidateCard({ candidate, index }: { candidate: Candidate; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[candidate.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`bg-white/[0.03] border rounded-3xl overflow-hidden transition-all duration-300 hover:border-white/15 ${
        candidate.isHiddenGem ? "border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.05)]" : "border-white/6"
      }`}
    >
      {/* Card Top Accent */}
      {candidate.isHiddenGem && (
        <div className="h-0.5 bg-gradient-to-r from-cyan-500/60 via-violet-500/60 to-transparent" />
      )}

      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <CandidateAvatar initials={candidate.avatar} gem={candidate.isHiddenGem} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">{candidate.name}</h3>
                {candidate.isHiddenGem && (
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-300 tracking-wider flex items-center gap-1">
                    <Sparkles size={7} /> GEM
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-inter">{candidate.role} · {candidate.experience}</p>
              <div className="flex items-center gap-1 mt-1">
                <Globe size={9} className="text-gray-600" />
                <span className="text-[10px] text-gray-600">{candidate.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${status.bg} ${status.border}`} style={{ color: status.color }}>
              {status.label}
            </span>
            {candidate.appliedDays === 0 && (
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 animate-pulse">NEW</span>
            )}
          </div>
        </div>

        {/* DNA + Potential Scores */}
        <div className="space-y-2 mb-4">
          <ScorePill label="Candidate DNA" score={candidate.dnaScore} color="#22d3ee" />
          <ScorePill label="True Potential" score={candidate.potentialScore} color="#a78bfa" />
        </div>

        {/* AI Insight */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 mb-4">
          <div className="flex items-start gap-2">
            <Brain size={12} className="text-violet-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-400 font-inter leading-relaxed">{candidate.insight}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {candidate.skills.map(skill => (
            <span key={skill} className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 border border-white/8 text-gray-400 font-medium">
              {skill}
            </span>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3 text-[10px] text-gray-600">
            <span className="flex items-center gap-1"><Clock size={9} />{candidate.appliedDays === 0 ? "Today" : `${candidate.appliedDays}d ago`}</span>
            <span className="flex items-center gap-1"><Calendar size={9} />{candidate.availableIn}</span>
            <span className="flex items-center gap-1"><ShieldCheck size={9} className="text-emerald-500" />{candidate.authenticityScore}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/8">
              <MessageSquare size={11} className="text-gray-400" />
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/80 to-violet-600/80 hover:from-cyan-500 hover:to-violet-600 text-[10px] font-bold text-white flex items-center gap-1 transition-all"
            >
              View Profile <ArrowUpRight size={10} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Metric Card ───────────────────────────────────────────────────────────
function MetricCard({ icon, label, value, sub, trend, color, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/[0.03] border border-white/8 rounded-3xl p-5 relative overflow-hidden group hover:border-white/15 transition-all"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at 20% 50%, ${color}08 0%, transparent 70%)` }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
            <span style={{ color }}>{icon}</span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              trend.startsWith("+") ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-gray-500 border border-white/8"
            }`}>
              <TrendingUp size={8} />{trend}
            </div>
          )}
        </div>
        <p className="text-2xl font-black tracking-tight mb-0.5">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        {sub && <p className="text-[10px] text-gray-600 mt-1 font-inter">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── Pipeline Kanban ───────────────────────────────────────────────────────
function PipelineBar() {
  const stages = [
    { label: "Applied", count: 1248, color: "#4b5563" },
    { label: "Screened", count: 342, color: "#22d3ee" },
    { label: "Shortlisted", count: 89, color: "#a78bfa" },
    { label: "Interviewing", count: 24, color: "#fb923c" },
    { label: "Offer", count: 6, color: "#34d399" },
  ];
  const max = 1248;
  return (
    <div className="space-y-2.5">
      {stages.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 w-20 flex-shrink-0 font-medium">{s.label}</span>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(s.count / max) * 100}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}55` }}
            />
          </div>
          <span className="text-xs font-bold tabular-nums w-12 text-right" style={{ color: s.color }}>{s.count.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Mini Spark Chart ──────────────────────────────────────────────────────
function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`${points} ${w},${h} 0,${h}`} fill={`${color}15`} stroke="none" />
    </svg>
  );
}

// ─── Active Roles ──────────────────────────────────────────────────────────
function ActiveRoleRow({ title, count, urgency, match }: any) {
  const urgencyColor = urgency === "High" ? "#f87171" : urgency === "Medium" ? "#fb923c" : "#34d399";
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate">{title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-500">{count} candidates</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: urgencyColor, background: `${urgencyColor}18` }}>{urgency}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs font-black text-cyan-400">{match}%</p>
        <p className="text-[10px] text-gray-600">avg match</p>
      </div>
    </div>
  );
}

// ─── Analysis Complete Card ────────────────────────────────────────────────
function AnalysisCompleteCard({
  onViewCandidates,
  onExport,
  onDismiss,
  candidates,
}: {
  onViewCandidates: () => void;
  onExport: () => void;
  onDismiss: () => void;
  candidates: Candidate[];
}) {
  const gemCount = candidates.filter(c => c.isHiddenGem).length;
  const topScore = Math.max(...candidates.map(c => c.dnaScore));

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: "spring", bounce: 0.3 }}
      className="relative bg-gradient-to-r from-emerald-500/10 via-cyan-500/8 to-violet-500/10 border border-emerald-500/25 rounded-3xl p-5 mb-6 overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-48 h-20 bg-emerald-400/10 blur-2xl pointer-events-none" />

      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
      >
        <X size={11} />
      </button>

      <div className="flex flex-col md:flex-row md:items-center gap-5">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={22} className="text-emerald-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300">Analysis Complete</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-sm text-gray-300 font-inter mb-3">
            <span className="text-white font-semibold">{candidates.length} candidates</span> evaluated — AI ranking complete
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 flex-wrap">
            {[
              { label: "Top Match", value: `${topScore}%`, color: "#22d3ee" },
              { label: "Hidden Gems", value: gemCount, color: "#fbbf24" },
              { label: "Confidence", value: "96%", color: "#a78bfa" },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-500">{stat.label}:</span>
                <span className="text-xs font-black" style={{ color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onViewCandidates}
            className="px-4 py-2.5 rounded-xl bg-white/8 border border-white/15 text-xs font-semibold text-white hover:bg-white/12 transition-all flex items-center gap-2"
          >
            <Eye size={12} /> View Ranked
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onExport}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-bold text-white flex items-center gap-2 shadow-[0_0_16px_rgba(16,185,129,0.3)] hover:opacity-90 transition-all"
          >
            <FileSpreadsheet size={12} /> Export Hiring Report
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Candidate Results Toolbar ────────────────────────────────────────────
function CandidateResultsBar({
  count,
  onExport,
}: {
  count: number;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-white/[0.025] border border-white/8 rounded-2xl">
      {/* Left: result info */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs font-bold text-white">Candidate Results</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-gray-400">
              <span className="font-semibold text-cyan-400">{count}</span> Candidates Evaluated
            </span>
            <span className="text-gray-700">·</span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <RefreshCw size={8} /> Last Analysis: <span className="text-gray-400 font-medium">2 minutes ago</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/15 border border-blue-500/30 text-[11px] font-semibold text-blue-300 hover:bg-blue-600/22 transition-all"
        >
          <FileSpreadsheet size={12} /> Export Excel
        </motion.button>
        <button
          disabled
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/8 text-[11px] font-medium text-gray-600 cursor-not-allowed"
        >
          <Download size={11} /> Export PDF
          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 text-gray-700 ml-0.5">Soon</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/8 text-[11px] font-medium text-gray-400 hover:text-gray-200 hover:bg-white/8 transition-all">
          <Share2 size={11} /> Share
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function RecruiterDashboard() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"gems" | "dna" | "recent">("gems");
  const [activeFilter, setActiveFilter] = useState<"all" | "new" | "shortlisted" | "interviewing">("all");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [showAnalysisComplete, setShowAnalysisComplete] = useState(true);

  const openExport = useCallback(() => setExportModalOpen(true), []);
  const closeExport = useCallback(() => setExportModalOpen(false), []);

  const filtered = mockCandidates
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
        || c.role.toLowerCase().includes(search.toLowerCase())
        || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = activeFilter === "all" || c.status === activeFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "gems") return (b.isHiddenGem ? 1 : 0) - (a.isHiddenGem ? 1 : 0) || b.dnaScore - a.dnaScore;
      if (sortBy === "dna") return b.dnaScore - a.dnaScore;
      return a.appliedDays - b.appliedDays;
    });

  const gemCount = mockCandidates.filter(c => c.isHiddenGem).length;

  // Convert to ExportCandidate shape
  const exportCandidates: ExportCandidate[] = mockCandidates.map(c => ({ ...c }));

  return (
    <div className="min-h-screen bg-[#06050f] text-white font-sans">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-violet-500/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-cyan-500/4 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <div className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-wide">HireMind</span>
            <span className="text-white/20 mx-2">|</span>
            <span className="text-xs text-gray-500 font-medium">Recruiter Intelligence</span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/8 rounded-xl p-1">
            {["Pipeline", "Talent Pool", "Analytics", "Settings"].map(item => (
              <button key={item} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                item === "Talent Pool" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
              }`}>{item}</button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="relative w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Bell size={14} className="text-gray-400" />
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 border border-[#06050f]" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center text-xs font-bold">HR</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex -space-x-1">
                {["#22d3ee", "#a78bfa", "#f472b6"].map(c => (
                  <div key={c} className="w-2 h-2 rounded-full border border-[#06050f]" style={{ background: c }} />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">Live Intelligence Feed</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Talent <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Intelligence</span>
            </h1>
            <p className="text-gray-500 text-sm font-inter mt-1">Analyzing <span className="text-white font-semibold">1,248 candidates</span> across <span className="text-cyan-400 font-semibold">5 active roles</span></p>
          </div>

          {/* ── INTEGRATION POINT 1: Top-right export button ── */}
          <div className="flex gap-2 items-center flex-wrap">
            {/* Demo toggle for Analysis Complete card */}
            <button
              onClick={() => setShowAnalysisComplete(v => !v)}
              className="px-3 py-2 rounded-xl border border-white/8 bg-white/[0.03] text-[10px] font-medium text-gray-500 hover:text-gray-300 hover:bg-white/6 transition-all"
            >
              {showAnalysisComplete ? "Hide" : "Show"} Analysis Card
            </button>
            <ExportReportButton onClick={openExport} variant="secondary" />
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-90 transition-all flex items-center gap-2">
              <Plus size={12} /> Post New Role
            </button>
          </div>
        </motion.div>

        {/* ── INTEGRATION POINT 3: Analysis Complete Card ── */}
        <AnimatePresence>
          {showAnalysisComplete && (
            <AnalysisCompleteCard
              onViewCandidates={() => setShowAnalysisComplete(false)}
              onExport={openExport}
              onDismiss={() => setShowAnalysisComplete(false)}
              candidates={mockCandidates}
            />
          )}
        </AnimatePresence>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-12 gap-5">

          {/* ── Left Panel (Metrics + Pipeline) ── */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <MetricCard
                icon={<Sparkles size={16} />} color="#fbbf24"
                label="Hidden Gems Found" value={`${gemCount}`}
                sub="Underrated talents surfaced" trend="+12 this week" delay={0.1}
              />
              <MetricCard
                icon={<ShieldCheck size={16} />} color="#22d3ee"
                label="Avg Authenticity" value="94%"
                sub="Verified skill accuracy" trend="+2.3%" delay={0.15}
              />
              <MetricCard
                icon={<BrainCircuit size={16} />} color="#a78bfa"
                label="Avg Intent Match" value="88%"
                sub="Career-role alignment" trend="+5%" delay={0.2}
              />
              <MetricCard
                icon={<Activity size={16} />} color="#34d399"
                label="Time to Shortlist" value="2.4h"
                sub="vs 5.2h industry avg" trend="-54%" delay={0.25}
              />
            </div>

            {/* Pipeline Funnel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.03] border border-white/8 rounded-3xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-cyan-400" />
                  <h3 className="text-sm font-bold">Hiring Funnel</h3>
                </div>
                <button className="text-[10px] text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">Details</button>
              </div>
              <PipelineBar />
            </motion.div>

            {/* Active Roles */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white/[0.03] border border-white/8 rounded-3xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-violet-400" />
                  <h3 className="text-sm font-bold">Active Roles</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 font-bold border border-violet-500/20">5 Open</span>
              </div>
              <div>
                <ActiveRoleRow title="Senior Frontend Engineer" count={342} urgency="High" match={91} />
                <ActiveRoleRow title="ML Engineer – NLP" count={187} urgency="High" match={88} />
                <ActiveRoleRow title="Full Stack Developer" count={289} urgency="Medium" match={84} />
                <ActiveRoleRow title="DevOps / Platform" count={156} urgency="Low" match={79} />
                <ActiveRoleRow title="UI/UX Developer" count={274} urgency="Medium" match={86} />
              </div>
            </motion.div>
          </div>

          {/* ── Right Panel (Candidate Grid) ── */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">

            {/* Search + Filter Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-3"
            >
              {/* Search */}
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, skill, or role..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all font-inter"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto">
                {(["all", "new", "shortlisted", "interviewing"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                      activeFilter === f
                        ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 text-cyan-300"
                        : "bg-white/5 border border-white/8 text-gray-400 hover:text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    {f === "all" ? `All (${mockCandidates.length})` : f}
                  </button>
                ))}
              </div>

              {/* Sort + View Toggle */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none cursor-pointer font-inter hover:bg-white/8 transition-all"
                >
                  <option value="gems">Hidden Gems First</option>
                  <option value="dna">Highest DNA</option>
                  <option value="recent">Most Recent</option>
                </select>

                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white/15 text-white" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <LayoutGrid size={13} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white/15 text-white" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <List size={13} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ── INTEGRATION POINT 2: Candidate Results Toolbar ── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <CandidateResultsBar count={mockCandidates.length} onExport={openExport} />
            </motion.div>

            {/* Results Count */}
            <div className="flex items-center justify-between -mt-1">
              <p className="text-xs text-gray-500 font-inter">
                Showing <span className="text-white font-semibold">{filtered.length}</span> candidates
                {search && <> matching <span className="text-cyan-400 font-semibold">"{search}"</span></>}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <RefreshCw size={9} />
                <span>Updated just now</span>
              </div>
            </div>

            {/* Candidate Grid */}
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
                    <Search size={20} className="text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-400 mb-1">No candidates found</h3>
                  <p className="text-xs text-gray-600 font-inter">Try adjusting your search or filters</p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${view}-${sortBy}-${activeFilter}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-3"}
                >
                  {filtered.map((candidate, i) => (
                    <CandidateCard key={candidate.id} candidate={candidate} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Summary Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-violet-500/10 via-cyan-500/8 to-transparent border border-violet-500/20 rounded-3xl p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <BrainCircuit size={18} className="text-violet-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">AI Cohort Insight</span>
                  <Sparkles size={10} className="text-yellow-400" />
                </div>
                <p className="text-xs text-gray-300 font-inter leading-relaxed">
                  This batch is <span className="text-cyan-300 font-semibold">23% stronger</span> than last month's pool. 3 hidden gems identified — notably <span className="text-white font-semibold">Alex Chen</span> and <span className="text-white font-semibold">Jordan Kim</span> show rare combinations of high potential and verified authenticity. Recommend fast-tracking within <span className="text-yellow-300 font-semibold">48 hours</span> before competing offers emerge.
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0 self-start">
                <button className="px-3 py-1.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-[10px] font-bold text-violet-300 hover:bg-violet-500/30 transition-colors flex items-center gap-1">
                  Full Analysis <ArrowRight size={10} className="inline ml-0.5" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={openExport}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/25 text-[10px] font-bold text-blue-300 hover:bg-blue-500/22 transition-colors flex items-center gap-1"
                >
                  <FileSpreadsheet size={10} /> Export
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Export Modal ── */}
      <ExportReportModal
        open={exportModalOpen}
        onClose={closeExport}
        candidates={exportCandidates}
        jobTitle="Senior Frontend Architect"
        department="Engineering"
        recruiterName="HR"
        totalEvaluated={mockCandidates.length}
        topMatchScore={98}
        averageMatchScore={92}
        confidenceScore={96}
      />
    </div>
  );
}
