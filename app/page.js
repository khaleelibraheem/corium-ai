"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Beaker,
  FlaskConical,
  ScanFace,
  Database,
  BrainCircuit,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Improved Typewriter Hook ---
const useTypewriter = (text, speed = 20, start = false, onComplete) => {
  const [displayedText, setDisplayedText] = useState("");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!start || !text) return;
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, start]);

  return displayedText;
};

export default function SkincareApp() {
  const [view, setView] = useState("consultation"); // 'consultation' | 'science'
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skinType: "",
    concerns: [],
    products: "",
  });
  const [result, setResult] = useState(null);

  // Configuration
  const skinTypes = [
    { id: "oily", label: "Oily", desc: "Visible shine, enlarged pores" },
    { id: "dry", label: "Dry", desc: "Tightness, flaky patches" },
    { id: "combo", label: "Combination", desc: "Oily T-zone, dry cheeks" },
    {
      id: "sensitive",
      label: "Sensitive",
      desc: "Redness, reactive, delicate",
    },
    { id: "normal", label: "Normal", desc: "Balanced, no major issues" },
  ];

  const concernsList = [
    "Acne",
    "Fine Lines",
    "Dark Spots",
    "Redness",
    "Texture",
    "Dullness",
  ];

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  const toggleConcern = (c) => {
    setFormData((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(c)
        ? prev.concerns.filter((x) => x !== c)
        : [...prev.concerns, c],
    }));
  };

  const generateRoutine = async () => {
    setLoading(true);
    setStep(4); // Loading View
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
      // Min 1 second load time to show off the animation
      setTimeout(() => {
        setLoading(false);
        setStep(5);
      }, 1000);
    } catch (error) {
      console.error(error);
      setStep(3); // Go back if error
      setLoading(false);
    }
  };

  const isOnboarding = step > 0 && step < 5 && view === "consultation";

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col font-sans selection:bg-[var(--color-primary)] selection:text-white">
      <style jsx global>{`
        :root {
          --color-primary: #d4a373;
          --color-primary-dark: #a97c50;
        }
      `}</style>

      {/* Navbar */}
      <header className="w-full fixed top-0 left-0 z-50 transition-all duration-300">
        <div className="bg-[#FAFAF9]/90 backdrop-blur-md border-b border-stone-200/50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative">
            {/* --- LEFT: BRAND --- */}
            <div
              className="group cursor-pointer z-20"
              onClick={() => {
                setView("consultation");
                setStep(0);
              }}
            >
              <span className="font-serif font-bold text-2xl tracking-tight text-stone-900 leading-none group-hover:text-stone-700 transition-colors cursor-pointer">
                corium.ai
              </span>
            </div>

            {/* --- RIGHT: ACTIONS --- */}
            <div className="flex items-center justify-end gap-4 z-20 min-w-[120px]">
              {/* CASE 1: SCIENCE VIEW OPEN */}
              {view === "science" ? (
                <button
                  onClick={() => setView("consultation")}
                  className="group flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-600 hover:border-stone-800 hover:text-stone-900 bg-white transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <X size={14} />{" "}
                  <span className="hidden sm:inline">Close</span>
                </button>
              ) : /* CASE 2: ONBOARDING (STEPS 1-4) */
              isOnboarding ? (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="hidden sm:block text-[10px] font-bold tracking-widest uppercase text-stone-400">
                    STEP
                  </div>
                  <div className="h-1 w-16 sm:w-24 bg-stone-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--color-primary-dark)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(step / 3) * 100}%` }}
                      transition={{ type: "spring", stiffness: 50 }}
                    />
                  </div>
                  <div className="w-6 text-xs text-stone-900">
                    {step < 4 ? step : 3}
                    <span className="text-stone-400">/3</span>
                  </div>
                </div>
              ) : /* CASE 3: RESULT VIEW (STEP 5) - PILL BUTTON REDESIGN */
              step === 5 && result ? (
                <nav className="flex items-center gap-5 animate-in fade-in duration-500">
                  {/* Button: Start Over (Pill Shape) */}
                  <button
                    onClick={() => {
                      setStep(0);
                      setFormData({ skinType: "", concerns: [], products: "" });
                    }}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw
                      size={12}
                      className="group-hover:-rotate-180 transition-transform duration-500"
                    />
                    <span>Start Over</span>
                  </button>
                </nav>
              ) : (
                /* CASE 4: LANDING PAGE (STEP 0) */
                <nav className="flex items-center">
                  <button
                    onClick={() => setView("science")}
                    className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors px-2 py-2 cursor-pointer"
                  >
                    The Science
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col pt-24 relative z-0">
        <AnimatePresence mode="wait">
          {/* VIEW: SCIENCE PAGE */}
          {view === "science" ? (
            <ScienceView key="science" />
          ) : (
            /* VIEW: CONSULTATION */
            <div className="w-full max-w-3xl mx-auto px-6 md:px-0 flex flex-col justify-center flex-1 py-10">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center space-y-8"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-white mb-8">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                        Clinical Intelligence
                      </span>
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl text-stone-900 leading-[1.1]">
                      Your skin, <br />
                      <span className="italic text-[var(--color-primary)]">
                        decoded.
                      </span>
                    </h1>

                    <p className="text-lg md:text-xl text-stone-500 max-w-lg mx-auto leading-relaxed">
                      Generate a hyper-personalized regimen based on your unique
                      biometric markers and Corium&apos;s conflict-check engine.
                    </p>

                    <div className="pt-8">
                      <button
                        onClick={nextStep}
                        className="group bg-stone-900 text-white px-10 py-5 rounded-full text-lg font-medium transition-all hover:bg-stone-800 hover:shadow-xl hover:shadow-[var(--color-primary)]/20 inline-flex items-center gap-2 cursor-pointer"
                      >
                        Start Consultation
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <StepWrapper
                    title="Skin Profile"
                    subtitle="Select the description that best fits your skin in its natural state."
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skinTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() =>
                            setFormData({ ...formData, skinType: type.id })
                          }
                          className={cn(
                            "group p-6 rounded-xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer",
                            formData.skinType === type.id
                              ? "border-[var(--color-primary)] bg-white shadow-lg ring-1 ring-[var(--color-primary)]"
                              : "border-stone-200 bg-white hover:border-[var(--color-primary-dark)] hover:shadow-md"
                          )}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-serif text-xl text-stone-900 font-medium">
                              {type.label}
                            </span>
                            {formData.skinType === type.id && (
                              <CheckCircle2 className="text-[var(--color-primary)] w-5 h-5" />
                            )}
                          </div>
                          <p className="text-sm text-stone-500 leading-relaxed">
                            {type.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                    <ActionButtons
                      canNext={!!formData.skinType}
                      onNext={nextStep}
                      onBack={prevStep}
                    />
                  </StepWrapper>
                )}

                {step === 2 && (
                  <StepWrapper
                    title="Primary Concerns"
                    subtitle="What are you looking to target? Select all that apply."
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {concernsList.map((concern) => (
                        <button
                          key={concern}
                          onClick={() => toggleConcern(concern)}
                          className={cn(
                            "px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 border flex flex-col items-center justify-center gap-2 text-center h-24 cursor-pointer",
                            formData.concerns.includes(concern)
                              ? "bg-stone-900 text-white border-stone-900 shadow-md scale-[1.02]"
                              : "bg-white text-stone-600 border-stone-200 hover:border-[var(--color-primary)] hover:shadow-sm"
                          )}
                        >
                          {concern}
                        </button>
                      ))}
                    </div>
                    <ActionButtons
                      canNext={formData.concerns.length > 0}
                      onNext={nextStep}
                      onBack={prevStep}
                    />
                  </StepWrapper>
                )}

                {step === 3 && (
                  <StepWrapper
                    title={
                      <div className="flex items-center gap-3 justify-center">
                        Current Ritual
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-stone-500 px-3 py-1 rounded-full border border-stone-200">
                          Optional
                        </span>
                      </div>
                    }
                    subtitle={
                      <span>
                        List products you use to check for conflicts, or{" "}
                        <span className="text-stone-800 font-medium">
                          leave blank
                        </span>{" "}
                        if you are starting fresh.
                      </span>
                    }
                  >
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-stone-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                      <div className="relative bg-white p-2 rounded-2xl border border-stone-200 shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent transition-all">
                        <textarea
                          value={formData.products}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              products: e.target.value,
                            })
                          }
                          placeholder="e.g. Cerave Cleanser, Just water… (optional)"
                          className="w-full h-40 p-4 bg-transparent focus:outline-none resize-none text-lg text-stone-800 placeholder:text-stone-300 leading-relaxed"
                        />
                        {!formData.products && (
                          <div className="absolute bottom-4 right-4 pointer-events-none">
                            <span className="text-xs text-stone-300 italic">
                              (It&apos;s okay to skip this!)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-12">
                      <button
                        onClick={prevStep}
                        className="text-stone-400 hover:text-stone-900 font-medium px-4 py-2 transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={generateRoutine}
                        className="bg-[var(--color-primary)] text-white pl-8 pr-6 py-4 rounded-full font-medium shadow-lg hover:bg-[var(--color-primary-dark)] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 group cursor-pointer"
                      >
                        <span>
                          {formData.products.trim().length > 0
                            ? "Analyze & Generate"
                            : "Skip & Generate"}
                        </span>
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                          <Sparkles
                            size={16}
                            className="text-white"
                            fill="currentColor"
                          />
                        </div>
                      </button>
                    </div>
                  </StepWrapper>
                )}

                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-20"
                  >
                    <div className="relative w-24 h-24 mx-auto mb-10">
                      <div className="absolute inset-0 border-4 border-stone-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Beaker
                          className="text-[var(--color-primary)] animate-pulse"
                          size={28}
                        />
                      </div>
                    </div>
                    <h3 className="font-serif text-2xl text-stone-900 mb-2">
                      Analyzing Profile
                    </h3>
                    <LoadingMessages />
                  </motion.div>
                )}

                {step === 5 && result && (
                  <ResultView
                    result={result}
                    reset={() => {
                      setStep(1);
                      setFormData({ skinType: "", concerns: [], products: "" });
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* --- GLOBAL FOOTER --- */}
      <GlobalFooter />
    </div>
  );
}

// --- NEW COMPONENT: GLOBAL FOOTER ---
function GlobalFooter() {
  return (
    <footer className="w-full py-6 border-t border-stone-200/60 bg-[#FAFAF9] relative z-10 text-xs md:text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand / Copyright */}
        <div className="flex items-center gap-3 opacity-80">
          <span className="font-serif font-bold text-stone-600">corium.ai</span>
          <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
          <span className="font-medium tracking-wide text-stone-400 uppercase">
            © 2025
          </span>
        </div>

        {/* Founder Credit */}
        <div className="flex items-center gap-1.5 opacity-80">
          <span className="text-stone-400 font-light">Engineered by</span>
          <a
            href="https://khaleelalhaji.info"
            target="_blank"
            className="font-medium italic text-stone-700 hover:text-[var(--color-primary)] transition-colors border-b border-stone-200 hover:border-[var(--color-primary)] pb-0.5 cursor-pointer"
          >
            Khaleel Alhaji
          </a>
        </div>
      </div>
    </footer>
  );
}

// --- SCIENCE VIEW ---

function ScienceView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-7xl mx-auto px-6 py-12"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-white mb-8">
          <BrainCircuit size={14} className="text-[var(--color-primary)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Methodology
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6 leading-tight">
          Precision Dermatology meets <br />
          <span className="italic text-stone-500">
            Computational Intelligence.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-stone-500 leading-relaxed max-w-2xl mx-auto">
          Corium.ai doesn&apos;t guess. We utilize logic pathways derived from
          12,000+ clinical studies to bridge the gap between your biology and
          active ingredients.
        </p>
      </motion.div>

      {/* The Pillars (Grid) */}
      <motion.div
        variants={itemVariants}
        className="grid md:grid-cols-3 gap-6 mb-16"
      >
        <ScienceCard
          icon={<ScanFace size={24} />}
          title="Profile Analysis"
          desc="We map your reported skin state against 5 distinct dermatological phenotypes to identify barrier integrity and sensitivity thresholds."
        />
        <ScienceCard
          icon={<Database size={24} />}
          title="Ingredient Logic"
          desc="Our Conflict Engine ensures active ingredients (like Retinol and AHAs) are layered safely, preventing chemical burns or neutralization."
        />
        <ScienceCard
          icon={<FlaskConical size={24} />}
          title="Clinical Validation"
          desc="Every protocol generated is based on peer-reviewed dermatological standards. We prioritize barrier health above all else."
        />
      </motion.div>

      {/* Deep Dive Section (Dark Mode Style) */}
      <motion.div
        variants={itemVariants}
        className="bg-[#1c1917] rounded-[2.5rem] overflow-hidden text-stone-300 shadow-2xl shadow-stone-900/20"
      >
        <div className="grid lg:grid-cols-2">
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5">
              <Sparkles className="text-white" size={24} />
            </div>
            <h3 className="text-3xl font-serif text-white mb-6">
              The Conflict Engine
            </h3>
            <p className="leading-relaxed text-stone-400 mb-8">
              Skin care is chemistry. Many popular products destabilize each
              other when mixed. Corium calculates pH variance and molecular
              weight to sequence your routine correctly.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10"></div>
                <span className="text-xs font-bold tracking-widest uppercase text-stone-600">
                  Safety Checks
                </span>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>
              <ul className="grid grid-cols-2 gap-4 text-sm font-medium text-stone-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  pH Balance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  Photosensitivity
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  Barrier Load
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  Active Saturation
                </li>
              </ul>
            </div>
          </div>

          {/* Visual Abstract Art */}
          <div className="relative min-h-[300px] bg-gradient-to-br from-stone-900 to-[#0c0a09] flex items-center justify-center p-12">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            ></div>

            {/* Abstract Molecule Graphic */}
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center backdrop-blur-sm">
                  <span className="font-serif text-xl text-white">A</span>
                </div>
                <div className="h-px w-12 bg-indigo-500/50 relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-indigo-400 bg-[#0c0a09] px-2">
                    Safe
                  </div>
                </div>
                <div className="w-16 h-16 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center backdrop-blur-sm">
                  <span className="font-serif text-xl text-white">B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- REST OF YOUR COMPONENTS (LoadingMessages, StepWrapper, ActionButtons, ResultView) ---

function LoadingMessages() {
  const messages = [
    "Analyzing lipid barrier...",
    "Calculating ingredient conflicts...",
    "Structuring protocol...",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <p className="text-stone-500 h-6 transition-all duration-300">
      {messages[index]}
    </p>
  );
}

function StepWrapper({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="font-serif text-4xl text-stone-900 mb-3">{title}</h2>
        <p className="text-stone-500 text-lg leading-relaxed max-w-md mx-auto">
          {subtitle}
        </p>
      </div>
      {children}
    </motion.div>
  );
}

function ActionButtons({ canNext, onNext, onBack }) {
  return (
    <div className="flex items-center justify-between mt-12 pt-6 border-t border-stone-100">
      <button
        onClick={onBack}
        className="text-stone-400 hover:text-stone-900 font-medium px-4 py-2 transition-colors cursor-pointer"
      >
        Back
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
          canNext
            ? "bg-stone-900 text-white hover:bg-black hover:scale-110 cursor-pointer"
            : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
        )}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

function ResultView({ result, reset }) {
  const [typingFinished, setTypingFinished] = useState(false);
  const scrollRef = useRef(null);

  // typewriter logic
  const analysisText = useTypewriter(result.analysis, 10, true, () => {
    setTypingFinished(true);
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-4 font-sans text-stone-900">
      {/* --- SECTION 1: THE DIAGNOSIS (Hero Card) --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-stone-200/40 border border-stone-100 mb-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3 text-[var(--color-primary-dark)]">
              <Sparkles size={20} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                Dermatological Analysis
              </span>
            </div>
          </div>

          <div className="prose prose-stone prose-lg text-stone-600 font-light leading-relaxed min-h-[120px]">
            {analysisText}
            {!typingFinished && (
              <span className="inline-block w-1.5 h-5 ml-1 bg-[var(--color-primary)] animate-pulse align-middle" />
            )}
          </div>
        </div>
      </motion.div>

      {/* --- SECTION 2: THE ROUTINE --- */}
      {typingFinished && (
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* NEW HEADER TEXT: The Bridge between Diagnosis and Action */}
          <div className="flex flex-col items-center max-w-2xl mx-auto mt-16 mb-10">
            <div className="flex items-center gap-3 text-[var(--color-primary-dark)]">
              <FlaskConical size={20} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                Your Curated Protocol
              </span>
            </div>
          </div>

          {/* THE GRID */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* MORNING RITUAL */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-stone-200 shadow-lg shadow-stone-200/30 flex flex-col h-full">
              <header className="flex items-center justify-between mb-10 pb-6 border-b border-stone-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Sun size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl text-stone-900">
                      Morning
                    </h3>
                    <p className="text-sm font-medium text-stone-400 uppercase tracking-wider mt-1">
                      Protect & Prevent
                    </p>
                  </div>
                </div>
              </header>

              <div className="space-y-0 flex-1">
                {result.am_routine.map((item, idx) => (
                  <RoutineRow
                    key={idx}
                    item={item}
                    number={idx + 1}
                    isLast={idx === result.am_routine.length - 1}
                    theme="light"
                  />
                ))}
              </div>
            </div>

            {/* EVENING RITUAL */}
            <div className="bg-[#1c1917] rounded-[2rem] p-8 md:p-10 border border-stone-800 shadow-2xl shadow-stone-900/20 flex flex-col h-full text-stone-200">
              <header className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-900/30 text-indigo-300 flex items-center justify-center border border-white/5">
                    <Moon size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl text-white">Evening</h3>
                    <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mt-1">
                      Repair & Restore
                    </p>
                  </div>
                </div>
              </header>

              <div className="space-y-0 flex-1">
                {result.pm_routine.map((item, idx) => (
                  <RoutineRow
                    key={idx}
                    item={item}
                    number={idx + 1}
                    isLast={idx === result.pm_routine.length - 1}
                    theme="dark"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* --- SECTION 3: SUMMARY FOOTER --- */}
          <div className="mt-8 mb-8">
            <div className="bg-stone-200/50 rounded-2xl p-8 border border-stone-200">
              <h4 className="font-serif text-xl text-stone-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={20} />
                Dermatologist Notes
              </h4>
              <ul className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                {result.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-stone-600 text-sm leading-relaxed"
                  >
                    <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-stone-400 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function RoutineRow({ item, number, isLast, theme }) {
  const isDark = theme === "dark";

  return (
    <div className="relative pl-12 group">
      {!isLast && (
        <div
          className={cn(
            "absolute left-[15px] top-10 bottom-0 w-px",
            isDark ? "bg-white/10" : "bg-stone-200"
          )}
        />
      )}

      <div
        className={cn(
          "absolute left-0 top-1 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold z-10 transition-colors",
          isDark
            ? "bg-[#1c1917] border-stone-700 text-stone-500 group-hover:border-indigo-400 group-hover:text-indigo-400"
            : "bg-white border-stone-200 text-stone-400 group-hover:border-orange-400 group-hover:text-orange-500"
        )}
      >
        {number}
      </div>

      <div className="pb-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
          <div className="flex flex-col">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider mb-1",
                isDark ? "text-indigo-300/80" : "text-orange-600/80"
              )}
            >
              {item.type}
            </span>
            <h4
              className={cn(
                "text-lg font-medium",
                isDark ? "text-white" : "text-stone-900"
              )}
            >
              {item.name}
            </h4>
          </div>
        </div>

        <p
          className={cn(
            "text-sm leading-relaxed mb-3 max-w-md",
            isDark ? "text-stone-400" : "text-stone-500"
          )}
        >
          {item.note}
        </p>

        {item.example && (
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer",
              isDark
                ? "bg-white/5 text-stone-300 hover:bg-white/10"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            <ArrowRight size={12} className="opacity-50" />
            <span>
              Try: <span className="font-semibold">{item.example}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ScienceCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-lg shadow-stone-200/40 hover:shadow-xl hover:border-stone-200 transition-all duration-300 group h-full">
      <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900 mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="font-serif text-xl text-stone-900 mb-3">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
