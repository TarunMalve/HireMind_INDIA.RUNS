"use client";

/**
 * ExportReportModal.tsx
 *
 * Premium multi-stage export modal for HireMind AI Hiring Reports.
 *
 * Stage 1 — Configuration: scope, filters, sort order
 * Stage 2 — Progress animation: 5-step generation sequence
 * Stage 3 — Download ready & success state
 *
 * Post-download: animated toast notification.
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, FileSpreadsheet, Download, CheckCircle2, Loader2,
  ChevronDown, Filter, SortAsc, Users, Sparkles,
  Clock, ShieldCheck, TrendingUp, Target, Zap,
  FileCheck, Database, Cpu, TableProperties,
} from "lucide-react";
import {
  generateHiringReportXLSX,
  triggerXLSXDownload,
  buildReportFilename,
  type ExportCandidate,
} from "@/lib/exportHiringReport";

// ─── Types ────────────────────────────────────────────────────────────────

export type ExportScope = "top10" | "top25" | "top50" | "top100" | "all";
export type ExportFilter =
  | "hiddenGems"
  | "immediateJoiners"
  | "above90"
  | "verified"
  | "recommended"
  | "interviewReady";
export type ExportSort =
  | "highestMatch"
  | "hireProbability"
  | "etvRave"
  | "lowestNotice"
  | "careerVelocity";

export interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  candidates: ExportCandidate[];
  jobTitle: string;
  department?: string;
  recruiterName?: string;
  totalEvaluated?: number;
  topMatchScore?: number;
  averageMatchScore?: number;
  confidenceScore?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────

const SCOPE_OPTIONS: { value: ExportScope; label: string; desc: string }[] = [
  { value: "top10",  label: "Top 10",   desc: "Best 10 candidates" },
  { value: "top25",  label: "Top 25",   desc: "Best 25 candidates" },
  { value: "top50",  label: "Top 50",   desc: "Best 50 candidates" },
  { value: "top100", label: "Top 100",  desc: "Best 100 candidates" },
  { value: "all",    label: "Entire Dataset", desc: "All evaluated candidates" },
];

const FILTER_OPTIONS: { value: ExportFilter; label: string; icon: React.ReactNode }[] = [
  { value: "hiddenGems",      label: "Only Hidden Gems",       icon: <Sparkles size={11} /> },
  { value: "immediateJoiners",label: "Only Immediate Joiners", icon: <Clock size={11} /> },
  { value: "above90",         label: "Only Above 90%",         icon: <TrendingUp size={11} /> },
  { value: "verified",        label: "Only Verified Profiles", icon: <ShieldCheck size={11} /> },
  { value: "recommended",     label: "Only Recommended",       icon: <Target size={11} /> },
  { value: "interviewReady",  label: "Only Interview Ready",   icon: <Zap size={11} /> },
];

const SORT_OPTIONS: { value: ExportSort; label: string }[] = [
  { value: "highestMatch",    label: "Highest Match Score" },
  { value: "hireProbability", label: "Highest Hire Probability" },
  { value: "etvRave",         label: "Highest ETV-RAVE Score" },
  { value: "lowestNotice",    label: "Lowest Notice Period" },
  { value: "careerVelocity",  label: "Highest Career Velocity" },
];

const PROGRESS_STEPS = [
  { icon: <Database size={14} />,       label: "Preparing Hiring Report",   duration: 600 },
  { icon: <Cpu size={14} />,            label: "Collecting AI Scores",      duration: 700 },
  { icon: <TableProperties size={14} />,label: "Generating Excel Workbook", duration: 900 },
  { icon: <FileCheck size={14} />,      label: "Formatting Worksheets",     duration: 800 },
  { icon: <CheckCircle2 size={14} />,   label: "Download Ready",            duration: 400 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function noticePeriodDays(available: string): number {
  if (!available || available.toLowerCase().includes("immediate")) return 0;
  const w = available.match(/(\d+)\s*week/i);
  const m = available.match(/(\d+)\s*month/i);
  if (w) return parseInt(w[1]) * 7;
  if (m) return parseInt(m[1]) * 30;
  return 30;
}

function applySortAndFilter(
  candidates: ExportCandidate[],
  scope: ExportScope,
  filters: ExportFilter[],
  sort: ExportSort
): ExportCandidate[] {
  let result = [...candidates];

  // Apply filters
  filters.forEach(f => {
    switch (f) {
      case "hiddenGems":
        result = result.filter(c => c.isHiddenGem);
        break;
      case "immediateJoiners":
        result = result.filter(c => noticePeriodDays(c.availableIn) === 0);
        break;
      case "above90":
        result = result.filter(c => c.dnaScore >= 90);
        break;
      case "verified":
        result = result.filter(c => c.authenticityScore >= 90);
        break;
      case "recommended":
        result = result.filter(c => c.dnaScore >= 75);
        break;
      case "interviewReady":
        result = result.filter(c => c.dnaScore >= 70 && c.authenticityScore >= 70);
        break;
    }
  });

  // Apply sort
  switch (sort) {
    case "highestMatch":    result.sort((a, b) => b.dnaScore - a.dnaScore); break;
    case "hireProbability": result.sort((a, b) => b.potentialScore - a.potentialScore); break;
    case "etvRave":         result.sort((a, b) => b.dnaScore - a.dnaScore); break;
    case "lowestNotice":    result.sort((a, b) => noticePeriodDays(a.availableIn) - noticePeriodDays(b.availableIn)); break;
    case "careerVelocity":  result.sort((a, b) => b.potentialScore - a.potentialScore); break;
  }

  // Apply scope
  const limitMap: Record<ExportScope, number> = {
    top10: 10, top25: 25, top50: 50, top100: 100, all: Infinity,
  };
  const limit = limitMap[scope];
  return result.slice(0, limit);
}

// ─── Sub-components ───────────────────────────────────────────────────────

function ScopeSelector({ value, onChange }: { value: ExportScope; onChange: (v: ExportScope) => void }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {SCOPE_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl border text-center transition-all text-[10px] font-semibold ${
            value === opt.value
              ? "bg-blue-600/20 border-blue-500/60 text-blue-300"
              : "bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200"
          }`}
        >
          <span className="font-black text-xs">{opt.label}</span>
          <span className={`font-normal opacity-70 ${value === opt.value ? "text-blue-400" : ""}`}>{opt.desc}</span>
        </button>
      ))}
    </div>
  );
}

function FilterGrid({
  selected,
  onToggle,
}: {
  selected: ExportFilter[];
  onToggle: (f: ExportFilter) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {FILTER_OPTIONS.map(opt => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-medium transition-all ${
              active
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-white/[0.03] border-white/8 text-gray-400 hover:border-white/20 hover:text-gray-200"
            }`}
          >
            <span className={active ? "text-emerald-400" : "text-gray-500"}>{opt.icon}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function SortSelector({ value, onChange }: { value: ExportSort; onChange: (v: ExportSort) => void }) {
  return (
    <div className="relative">
      <SortAsc size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <select
        value={value}
        onChange={e => onChange(e.target.value as ExportSort)}
        className="w-full appearance-none bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-8 py-2.5 text-xs text-gray-200 outline-none focus:border-blue-500/50 transition-all cursor-pointer"
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
}

function ProgressModal({
  currentStep,
  totalSteps,
  filename,
  onDone,
}: {
  currentStep: number;
  totalSteps: number;
  filename: string;
  onDone: () => void;
}) {
  const progress = Math.round((currentStep / totalSteps) * 100);
  const isDone = currentStep >= totalSteps;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Animated icon */}
      <div className="relative">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
          isDone
            ? "bg-emerald-500/20 border-2 border-emerald-500/40"
            : "bg-blue-500/15 border-2 border-blue-500/30"
        }`}>
          {isDone ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <CheckCircle2 size={36} className="text-emerald-400" />
            </motion.div>
          ) : (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Loader2 size={32} className="text-blue-400" />
            </motion.div>
          )}
        </div>
        {/* Outer pulse ring */}
        {!isDone && (
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-blue-500/20"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
      </div>

      {/* Status text */}
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm font-semibold text-white mb-1"
          >
            {isDone ? "Download Ready" : PROGRESS_STEPS[Math.min(currentStep, totalSteps - 1)]?.label + "…"}
          </motion.p>
        </AnimatePresence>
        {isDone && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400 font-mono mt-1 break-all px-2"
          >
            {filename}
          </motion.p>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="flex justify-between text-[10px] text-gray-500 mb-2">
          <span>Generating report</span>
          <span className="font-mono text-blue-400">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step checklist */}
      <div className="w-full space-y-2">
        {PROGRESS_STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep - 1 && !isDone;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${
                done ? "bg-emerald-500/8 border border-emerald-500/20"
                : active ? "bg-blue-500/10 border border-blue-500/25"
                : "opacity-40"
              }`}
            >
              <span className={done ? "text-emerald-400" : active ? "text-blue-400" : "text-gray-600"}>
                {done ? <CheckCircle2 size={13} /> : step.icon}
              </span>
              <span className={done ? "text-emerald-300" : active ? "text-blue-200" : "text-gray-500"}>
                {step.label}
              </span>
              {active && (
                <motion.div
                  className="ml-auto w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
              )}
              {done && <span className="ml-auto text-emerald-500 font-mono text-[9px]">✓</span>}
            </motion.div>
          );
        })}
      </div>

      {isDone && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onDone}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <Download size={15} /> File Downloaded Successfully
        </motion.button>
      )}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────

function DownloadToast({
  visible,
  filename,
  duration,
}: {
  visible: boolean;
  filename: string;
  duration: number;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.35 }}
          className="fixed bottom-6 right-6 z-[200] flex items-start gap-3 bg-[#0f1923] border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-[0_0_40px_rgba(16,185,129,0.15)] max-w-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-300">AI Hiring Report downloaded successfully.</p>
            <p className="text-[10px] text-gray-500 mt-0.5 truncate">{filename}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">Generated in {(duration / 1000).toFixed(1)} seconds.</p>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 rounded-b-2xl overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────

export default function ExportReportModal({
  open,
  onClose,
  candidates,
  jobTitle,
  department = "Engineering",
  recruiterName = "Recruiter",
  totalEvaluated,
  topMatchScore,
  averageMatchScore,
  confidenceScore = 96,
}: ExportModalProps) {
  const [stage, setStage] = useState<"config" | "progress" | "done">("config");
  const [scope, setScope] = useState<ExportScope>("all");
  const [filters, setFilters] = useState<ExportFilter[]>([]);
  const [sort, setSort] = useState<ExportSort>("highestMatch");
  const [progressStep, setProgressStep] = useState(0);
  const [generatedFilename, setGeneratedFilename] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [generationDuration, setGenerationDuration] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStage("config");
      setProgressStep(0);
      setFilters([]);
      setScope("all");
      setSort("highestMatch");
      setIsGenerating(false);
    }
  }, [open]);

  const toggleFilter = useCallback((f: ExportFilter) => {
    setFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }, []);

  const previewCount = applySortAndFilter(candidates, scope, filters, sort).length;
  const totalScores = candidates.map(c => c.dnaScore);
  const avgScore = totalScores.length > 0
    ? Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length)
    : 0;
  const topScore = totalScores.length > 0 ? Math.max(...totalScores) : 0;

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setStage("progress");
    setProgressStep(0);

    const startTime = Date.now();
    const filtered = applySortAndFilter(candidates, scope, filters, sort);
    const filename = buildReportFilename(jobTitle, new Date());
    setGeneratedFilename(filename);

    // Animate steps with real timing
    for (let i = 0; i < PROGRESS_STEPS.length - 1; i++) {
      await new Promise(resolve => setTimeout(resolve, PROGRESS_STEPS[i].duration));
      setProgressStep(i + 1);
    }

    try {
      const blob = await generateHiringReportXLSX({
        jobTitle,
        department,
        recruiterName,
        totalEvaluated: totalEvaluated ?? candidates.length,
        analysisDate: new Date(),
        topMatchScore: topMatchScore ?? topScore,
        averageMatchScore: averageMatchScore ?? avgScore,
        confidenceScore,
        candidates: filtered,
      });

      await new Promise(resolve => setTimeout(resolve, PROGRESS_STEPS[PROGRESS_STEPS.length - 1].duration));
      setProgressStep(PROGRESS_STEPS.length);
      setStage("done");

      triggerXLSXDownload(blob, filename);

      const elapsed = Date.now() - startTime;
      setGenerationDuration(elapsed);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 4500);
    } catch (err) {
      console.error("Export failed:", err);
      setStage("config");
      setIsGenerating(false);
    }
  }, [isGenerating, candidates, scope, filters, sort, jobTitle, department, recruiterName, totalEvaluated, topMatchScore, averageMatchScore, confidenceScore, topScore, avgScore]);

  const handleDone = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStage("config");
      setProgressStep(0);
      setIsGenerating(false);
    }, 400);
  }, [onClose]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={stage === "config" ? onClose : undefined}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-lg bg-[#0c1420] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <FileSpreadsheet size={17} className="text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">Export AI Hiring Report</h2>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{jobTitle}</p>
                    </div>
                  </div>
                  {stage === "config" && (
                    <button
                      onClick={onClose}
                      className="w-7 h-7 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="px-6 pb-6 pt-5 max-h-[75vh] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {stage === "config" && (
                      <motion.div
                        key="config"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        className="space-y-5"
                      >
                        {/* Stats summary */}
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Candidates", value: candidates.length, icon: <Users size={12} /> },
                            { label: "Avg Match", value: `${avgScore}%`, icon: <Target size={12} /> },
                            { label: "Top Score", value: `${topScore}%`, icon: <TrendingUp size={12} /> },
                          ].map(stat => (
                            <div key={stat.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-3 text-center">
                              <div className="flex items-center justify-center gap-1 text-gray-500 mb-1 text-[10px]">
                                {stat.icon} {stat.label}
                              </div>
                              <p className="text-base font-black text-white">{stat.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Export Scope */}
                        <div>
                          <div className="flex items-center gap-2 mb-2.5">
                            <Users size={12} className="text-blue-400" />
                            <span className="text-xs font-bold text-white">Export Scope</span>
                          </div>
                          <ScopeSelector value={scope} onChange={setScope} />
                        </div>

                        {/* Filters */}
                        <div>
                          <div className="flex items-center gap-2 mb-2.5">
                            <Filter size={12} className="text-violet-400" />
                            <span className="text-xs font-bold text-white">Pre-Export Filters</span>
                            {filters.length > 0 && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                                {filters.length} active
                              </span>
                            )}
                          </div>
                          <FilterGrid selected={filters} onToggle={toggleFilter} />
                        </div>

                        {/* Sort */}
                        <div>
                          <div className="flex items-center gap-2 mb-2.5">
                            <SortAsc size={12} className="text-cyan-400" />
                            <span className="text-xs font-bold text-white">Sort Before Export</span>
                          </div>
                          <SortSelector value={sort} onChange={setSort} />
                        </div>

                        {/* Preview count */}
                        <div className="flex items-center justify-between p-3 bg-blue-500/8 border border-blue-500/20 rounded-2xl">
                          <span className="text-xs text-gray-400">Candidates to be exported</span>
                          <span className="text-sm font-black text-blue-300">
                            {previewCount === 0 ? (
                              <span className="text-orange-400">0 — adjust filters</span>
                            ) : (
                              previewCount
                            )}
                          </span>
                        </div>

                        {/* Format badges */}
                        <div className="flex items-center gap-2">
                          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/15 transition-all">
                            <FileSpreadsheet size={13} /> Export Excel
                          </button>
                          <button disabled className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.02] border border-white/8 text-xs font-semibold text-gray-600 cursor-not-allowed">
                            Export PDF
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 text-gray-700">Soon</span>
                          </button>
                        </div>

                        {/* CTA */}
                        <motion.button
                          whileHover={{ scale: previewCount > 0 ? 1.01 : 1 }}
                          whileTap={{ scale: previewCount > 0 ? 0.98 : 1 }}
                          onClick={handleGenerate}
                          disabled={previewCount === 0}
                          className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all ${
                            previewCount > 0
                              ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)]"
                              : "bg-white/5 text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          <Download size={15} />
                          Generate Excel Report
                          {previewCount > 0 && (
                            <span className="text-[10px] opacity-70 font-normal">· {previewCount} candidates</span>
                          )}
                        </motion.button>

                        <p className="text-center text-[10px] text-gray-600 font-inter">
                          Real .xlsx file • 4 worksheets • Professional formatting
                        </p>
                      </motion.div>
                    )}

                    {(stage === "progress" || stage === "done") && (
                      <motion.div
                        key="progress"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                      >
                        <ProgressModal
                          currentStep={progressStep}
                          totalSteps={PROGRESS_STEPS.length}
                          filename={generatedFilename}
                          onDone={handleDone}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Download Toast */}
      <DownloadToast
        visible={toastVisible}
        filename={generatedFilename}
        duration={generationDuration}
      />
    </>
  );
}

// ─── Trigger Button ───────────────────────────────────────────────────────

export function ExportReportButton({
  onClick,
  variant = "primary",
}: {
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles = {
    primary:
      "px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-bold text-white flex items-center gap-2 hover:opacity-90 transition-all shadow-[0_0_16px_rgba(59,130,246,0.25)] hover:shadow-[0_0_22px_rgba(59,130,246,0.4)]",
    secondary:
      "px-4 py-2 rounded-xl bg-white/[0.06] border border-white/12 text-xs font-semibold text-gray-200 flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all",
    ghost:
      "px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-gray-300 hover:bg-white/10 transition-all flex items-center gap-2",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={styles[variant]}
    >
      <FileSpreadsheet size={13} />
      Export AI Hiring Report
    </motion.button>
  );
}
