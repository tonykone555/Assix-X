import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, CheckCircle2, ShieldCheck, FileText, Building2, CreditCard, ArrowRight, Play, Pause, RotateCcw,
  Sparkles, Upload, Lock, FileSpreadsheet, Zap, UserCheck, Calculator, Download, ExternalLink, Check, ChevronRight,
  Mail, Smartphone, Monitor, Copy, Eye, Layers, FileCheck, Landmark, Shield, Award, Sparkle
} from 'lucide-react';

interface AccountantOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  isLight?: boolean;
  initialViewMode?: 'workflow' | 'email_preview' | 'roi';
}

export const AccountantOnboardingModal: React.FC<AccountantOnboardingModalProps> = ({
  isOpen,
  onClose,
  companyName = 'Cabinet Fiduciaire Exemple',
  isLight = false,
  initialViewMode = 'workflow'
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'workflow' | 'email_preview' | 'roi'>(initialViewMode);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [emailDevice, setEmailDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedEmailHtml, setCopiedEmailHtml] = useState<boolean>(false);

  // ROI Calculator state
  const [newClientsPerMonth, setNewClientsPerMonth] = useState<number>(12);
  const [cpaHourlyRate, setCpaHourlyRate] = useState<number>(90);

  // Simulated Client Form Data
  const [clientData] = useState({
    businessName: 'Société Horizon Tech SAS',
    siren: '894 302 918',
    legalStatus: 'SASU / IS',
    contactName: 'Marc Dupond',
    email: 'm.dupond@horizon-tech.fr',
    annualRevenue: '250 000 €',
    kycVerified: true,
    bankSynced: true,
    documentsUploaded: 4
  });

  // Sync initial view mode if prop changes
  useEffect(() => {
    if (initialViewMode) {
      setActiveViewMode(initialViewMode);
    }
  }, [initialViewMode, isOpen]);

  // Auto-play timer loop for workflow step simulator
  useEffect(() => {
    let timer: any;
    if (isOpen && isPlaying && activeViewMode === 'workflow') {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveStep((step) => (step >= 4 ? 1 : step + 1));
            return 0;
          }
          return prev + 2.5; // ~4 seconds per step
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, activeViewMode]);

  if (!isOpen) return null;

  const hoursSavedPerClient = 4.5;
  const monthlyHoursSaved = newClientsPerMonth * hoursSavedPerClient;
  const monthlySavingsEur = monthlyHoursSaved * cpaHourlyRate;

  const steps = [
    {
      number: 1,
      title: "Invitation & KYC Client",
      subtitle: "Collecte sécurisée d'identité & KBIS",
      icon: UserCheck,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: 2,
      title: "Ingestion Intelligente",
      subtitle: "Checklist fiscale & pièces comptables",
      icon: FileSpreadsheet,
      color: "from-indigo-500 to-purple-500"
    },
    {
      number: 3,
      title: "Synchro Banque & OCR",
      subtitle: "Connexion flux bancaire & extraits",
      icon: CreditCard,
      color: "from-emerald-500 to-teal-500"
    },
    {
      number: 4,
      title: "Lettre de Mission & Sign",
      subtitle: "Signature 1-clic & e-Portail CPA",
      icon: ShieldCheck,
      color: "from-amber-500 to-orange-500"
    }
  ];

  // Raw Email HTML Template string for copying
  const rawEmailHtmlCode = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Votre Espace Client - ${companyName}</title>
  <style>
    body { margin:0; padding:20px; background-color:#f1f5f9; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }
    .email-card { max-width:640px; margin:0 auto; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08); border:1px solid #e2e8f0; }
    .step-img-box { background:#0f172a; border-radius:12px; padding:16px; border:1px solid #334155; margin-bottom:16px; color:#ffffff; }
    .badge-ok { background-color:#10b981; color:#ffffff; font-size:10px; font-weight:800; padding:3px 8px; border-radius:12px; }
  </style>
</head>
<body>
  <div class="email-card">
    <!-- HEADER BANNER -->
    <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:32px 24px;text-align:center;color:#ffffff;">
      <div style="display:inline-block;padding:6px 14px;background-color:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.4);border-radius:20px;color:#60a5fa;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">
        🏛️ ${companyName.toUpperCase()} • ESPACE CLIENT
      </div>
      <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 6px 0;">
        Bienvenue chez ${companyName}
      </h1>
      <p style="color:#94a3b8;font-size:13px;margin:0;">
        Aperçu Visuel de votre Parcours d'Onboarding Client (3 minutes)
      </p>
    </div>

    <!-- BODY CONTENT -->
    <div style="padding:28px 24px;">
      <p style="color:#334155;font-size:15px;line-height:1.6;margin-top:0;">
        Bonjour <strong>${clientData.contactName}</strong>,
      </p>
      <p style="color:#475569;font-size:14px;line-height:1.6;">
        Découvrez ci-dessous le déroulé illustré de l'intégration de votre entreprise <strong>${clientData.businessName}</strong> (SIREN: ${clientData.siren}) au sein de notre cabinet :
      </p>

      <!-- VISUAL ONBOARDING PICTURE 1: KYC & KBIS EXTRACTION -->
      <div style="background:#0f172a;border-radius:14px;padding:16px;border:1px solid #334155;margin:20px 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
          <span style="color:#60a5fa;font-size:12px;font-weight:800;">🖼️ ÉTAPE 1 : IDENTIFICATION & KBIS AUTOMATIQUE</span>
          <span style="background-color:rgba(16,185,129,0.2);color:#34d399;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;">KYC Validé ✓</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#1e293b;padding:12px;border-radius:10px;font-size:11px;">
          <div style="color:#cbd5e1;">
            <div style="color:#94a3b8;font-size:10px;">EXTRACTION INPI / KBIS</div>
            <strong style="color:#ffffff;">${clientData.businessName}</strong><br/>
            SIREN : ${clientData.siren}
          </div>
          <div style="color:#cbd5e1;text-align:right;">
            <div style="color:#94a3b8;font-size:10px;">DIRIGEANT CONFORME</div>
            <strong style="color:#34d399;">${clientData.contactName}</strong><br/>
            PI CNI Validée eIDAS
          </div>
        </div>
      </div>

      <!-- VISUAL ONBOARDING PICTURE 2: CHECKLIST FISCALE -->
      <div style="background:#0f172a;border-radius:14px;padding:16px;border:1px solid #334155;margin:20px 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
          <span style="color:#818cf8;font-size:12px;font-weight:800;">🖼️ ÉTAPE 2 : INGESTION PIÈCES & REGIME FISCAL</span>
          <span style="background-color:rgba(99,102,241,0.2);color:#a5b4fc;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;">4/4 Fichiers Reçus ✓</span>
        </div>
        <div style="background:#1e293b;padding:10px;border-radius:10px;font-size:11px;color:#e2e8f0;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div>✓ Extrait KBIS officiel</div>
          <div>✓ RIB d'exploitation SEPA</div>
          <div>✓ Statuts constitutifs</div>
          <div>✓ Liasse fiscale antérieure</div>
        </div>
      </div>

      <!-- VISUAL ONBOARDING PICTURE 3: BANK SYNC & OCR -->
      <div style="background:#0f172a;border-radius:14px;padding:16px;border:1px solid #334155;margin:20px 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
          <span style="color:#34d399;font-size:12px;font-weight:800;">🖼️ ÉTAPE 3 : RAPPROCHEMENT BANCAIRE & OCR</span>
          <span style="background-color:rgba(52,211,153,0.2);color:#34d399;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;">DSP2 Actif ●</span>
        </div>
        <div style="background:#1e293b;padding:10px;border-radius:10px;font-size:11px;color:#cbd5e1;">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span>Facture AWS Cloud (TVA 20% auto)</span>
            <strong style="color:#f87171;">-252,00 €</strong>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>Prestation Conseil Client</span>
            <strong style="color:#34d399;">+4 500,00 €</strong>
          </div>
        </div>
      </div>

      <!-- VISUAL ONBOARDING PICTURE 4: SIGNATURE ELECTRONIQUE -->
      <div style="background:#0f172a;border-radius:14px;padding:16px;border:1px solid #334155;margin:20px 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
          <span style="color:#fbbf24;font-size:12px;font-weight:800;">🖼️ ÉTAPE 4 : LETTRE DE MISSION & SIGNATURE eIDAS</span>
          <span style="background-color:rgba(251,191,36,0.2);color:#fbbf24;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;">180 € HT / mois</span>
        </div>
        <div style="background:#1e293b;padding:12px;border-radius:10px;font-size:11px;color:#f1f5f9;text-align:center;">
          ✍️ Signature Électronique Certifiée Apposée • Dossier Validé en 3 min
        </div>
      </div>

      <!-- CTA BUTTON -->
      <div style="text-align:center;margin:32px 0 16px 0;">
        <a href="#onboarding" style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;border-radius:12px;box-shadow:0 8px 20px rgba(37,99,235,0.35);">
          👉 VALIDER MON ESPACE ET DÉBUTER (3 MIN)
        </a>
      </div>
      <p style="text-align:center;font-size:11px;color:#94a3b8;margin:0;">
        🔒 Processus 100% sécurisé et conforme à l'Ordre des Experts-Comptables
      </p>
    </div>

    <!-- FOOTER -->
    <div style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:20px;text-align:center;font-size:11px;color:#64748b;">
      ${companyName} • Expertise Comptable & Conseil
    </div>
  </div>
</body>
</html>`;

  const handleCopyEmailCode = () => {
    navigator.clipboard.writeText(rawEmailHtmlCode);
    setCopiedEmailHtml(true);
    setTimeout(() => setCopiedEmailHtml(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className={`relative w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border my-auto flex flex-col max-h-[95vh] ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 shrink-0" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wide">
                  AI CPA Onboarding Engine
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Visual Onboarding & Email Preview
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-extrabold tracking-tight mt-0.5 text-white">
                Système d'Onboarding Client AI pour {companyName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP VIEW NAVIGATION TABS */}
        <div className="px-4 sm:px-6 pt-3 pb-3 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveViewMode('email_preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'email_preview'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-extrabold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>✉️ Aperçu Email Client (Rendu Visuel)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('workflow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'workflow'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-extrabold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Simulateur Interactif 3-Min</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('roi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'roi'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 font-extrabold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>📊 Gain & ROI Cabinet</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 hidden lg:block">
            Rendu Visuel In-App • Zéro Redirection • Ordre des Experts-Comptables
          </div>
        </div>

        {/* MODAL MAIN CONTENT BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* VIEW MODE 1: WORKFLOW SIMULATION */}
          {activeViewMode === 'workflow' && (
            <div className="space-y-5">
              {/* Timeline Stepper Header */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {steps.map((s) => {
                  const Icon = s.icon;
                  const isActive = activeStep === s.number;
                  const isPast = activeStep > s.number;
                  return (
                    <button
                      key={s.number}
                      onClick={() => {
                        setActiveStep(s.number);
                        setProgress(0);
                        setIsPlaying(false);
                      }}
                      className={`relative text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/15 border-blue-500/50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                          : isPast
                          ? 'bg-zinc-900/80 border-emerald-500/30 text-emerald-400'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-blue-400' : isPast ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          Étape 0{s.number}
                        </span>
                        {isPast ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                        )}
                      </div>
                      <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                        {s.title}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                        {s.subtitle}
                      </div>

                      {/* Step Progress Bar */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 rounded-b-xl overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Animation Controls */}
              <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                    {isPlaying ? 'Pause la démo' : 'Lancer l\'animation auto'}
                  </button>
                  <button
                    onClick={() => {
                      setActiveStep(1);
                      setProgress(0);
                      setIsPlaying(true);
                    }}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 font-medium flex items-center gap-1 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Redémarrer
                  </button>
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  Temps d'incorporation client: <strong className="text-emerald-400 font-bold">3 minutes</strong> (vs 2 semaines traditionnelles)
                </div>
              </div>

              {/* Step Stage Content & ROI Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Stage Canvas */}
                <div className="lg:col-span-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 relative overflow-hidden min-h-[320px] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    {activeStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                              <UserCheck className="w-5 h-5 text-blue-400" />
                              Étape 1: Identification & Vérification KYC Automatisée
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1">
                              Le client reçoit un lien unique WhatsApp/Email pour soumettre ses informations d'entreprise en 60 secondes.
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            KYC instantané OK
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">Extraction KBIS / Registre</span>
                            <div className="text-xs font-bold text-white">{clientData.businessName}</div>
                            <div className="text-[11px] text-zinc-400 font-mono">SIREN: {clientData.siren}</div>
                            <div className="text-[11px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded w-fit border border-blue-500/20 font-semibold">
                              Forme: {clientData.legalStatus}
                            </div>
                          </div>

                          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">Dirigeant / Contact Principal</span>
                            <div className="text-xs font-bold text-white">{clientData.contactName}</div>
                            <div className="text-[11px] text-zinc-400 font-mono">{clientData.email}</div>
                            <div className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Pièce d'identité validée
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs space-y-2">
                          <div className="flex justify-between text-zinc-400 font-mono text-[11px]">
                            <span>Analyse IA des pièces justificatives</span>
                            <span className="text-emerald-400 font-bold">100% Conforme</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-full animate-pulse" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                              <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                              Étape 2: Checklist Fiscale & Collecte des Pièces
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1">
                              Formulaire dynamique auto-adaptatif selon le régime d'imposition (IS, IR, Micro, LMNP).
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-semibold">
                            4 / 4 Pièces Collectées
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between">
                            <span className="text-zinc-300">Extrait KBIS (-3 mois)</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between">
                            <span className="text-zinc-300">RIB d'Exploitation</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between">
                            <span className="text-zinc-300">Statuts constitutifs</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between">
                            <span className="text-zinc-300">Dernière Liasse Fiscale</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-emerald-400" />
                              Étape 3: Synchronisation Bancaire DSP2 & OCR Factures
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1">
                              Connexion directe aux flux bancaires professionnel & pré-rapprochement IA des dépenses.
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold">
                            Flux Actif
                          </span>
                        </div>

                        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between items-center text-zinc-400 border-b border-zinc-800 pb-2">
                            <span>Compte Pro BNP Paribas</span>
                            <span className="font-mono text-white font-bold">IBAN FR76 *** 9012</span>
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between items-center bg-zinc-900/60 p-2 rounded-lg">
                              <div>
                                <div className="font-semibold text-white">Facture AWS Cloud Infrastructure</div>
                                <div className="text-[10px] text-zinc-500">TVA 20% détectée (42,00 €) • Rapproché automatiquement</div>
                              </div>
                              <span className="font-mono text-emerald-400 font-bold">-252,00 €</span>
                            </div>
                            <div className="flex justify-between items-center bg-zinc-900/60 p-2 rounded-lg">
                              <div>
                                <div className="font-semibold text-white">Paiement Client Prestation Conseil</div>
                                <div className="text-[10px] text-zinc-500">Facture #2026-004 associée</div>
                              </div>
                              <span className="font-mono text-emerald-400 font-bold">+4 500,00 €</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                              <ShieldCheck className="w-5 h-5 text-amber-400" />
                              Étape 4: Lettre de Mission Générée & Signature Électronique
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1">
                              Génération instantanée du contrat d'honoraires et signature en ligne eIDAS.
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold">
                            Lettre de Mission Prête
                          </span>
                        </div>

                        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <div className="font-bold text-white text-sm">Contrat Annuel d'Accompagnement Comptable</div>
                            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              180 € HT / mois
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 font-mono">
                            "Entre {companyName} et {clientData.businessName}, représentée par {clientData.contactName}. Prestation comprenant la tenue comptable, déclarations de TVA, bilan annuel et télétransmissions DGFiP."
                          </p>
                          <div className="pt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" />
                              Signature Client eIDAS Apposée
                            </div>
                            <button
                              type="button"
                              onClick={() => alert("Simulation de téléchargement du contrat PDF signé en eIDAS.")}
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Télécharger PDF Signé
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom Integration Footer */}
                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>S'intègre avec Pennylane, Cegid, QuickBooks, Agiris et ACD.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveViewMode('email_preview')}
                      className="text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Aperçu Email Client <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right: Quick Side ROI Summary */}
                <div className="lg:col-span-4 bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wide">
                      <Calculator className="w-4 h-4" />
                      Résumé Gain Cabinet
                    </div>
                    <h3 className="text-sm font-extrabold text-white">
                      Rentabilité Onboarding AI
                    </h3>
                    
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Nouveaux clients / mois:</span>
                        <strong className="text-blue-400">{newClientsPerMonth}</strong>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Heures économisées:</span>
                        <strong className="text-emerald-400">{monthlyHoursSaved.toFixed(0)} h / mois</strong>
                      </div>
                      <div className="pt-1 border-t border-zinc-800 flex justify-between text-xs font-bold">
                        <span className="text-zinc-200">Valeur financière:</span>
                        <span className="text-emerald-400">{monthlySavingsEur.toLocaleString('fr-FR')} € / mois</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveViewMode('email_preview')}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    Voir l'Email Envoyé au Client
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: EMAIL PREVIEW WITH RICH VISUAL ONBOARDING CSS CARDS */}
          {activeViewMode === 'email_preview' && (
            <div className="space-y-4">
              {/* Top Controls Bar */}
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    Aperçu HTML Email avec Images Visuelles Onboarding (CSS)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    VISUAL PARCOURS INLINE
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Device Selector */}
                  <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEmailDevice('desktop')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        emailDevice === 'desktop' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" /> Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailDevice('mobile')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        emailDevice === 'mobile' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Mobile
                    </button>
                  </div>

                  {/* Copy HTML Button */}
                  <button
                    type="button"
                    onClick={handleCopyEmailCode}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-lg border border-zinc-700 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedEmailHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{copiedEmailHtml ? 'Code HTML Copié !' : 'Copier Code HTML'}</span>
                  </button>

                  {/* Launch Workflow Button */}
                  <button
                    type="button"
                    onClick={() => setActiveViewMode('workflow')}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Tester la Démo In-App</span>
                  </button>
                </div>
              </div>

              {/* SIMULATED EMAIL INBOX CONTAINER */}
              <div className="bg-[#0B0C10] border border-zinc-800 rounded-2xl p-3 sm:p-5 shadow-2xl">
                {/* Inbox Headers */}
                <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Objet de l'Email Client :
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      🔐 Espace Sécurisé Client & Collecte Fiscale
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                    [PARCOURS CPA] Votre espace d'accueil client & intégration 2026 — {clientData.businessName}
                  </h3>
                  <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <div>
                      Expéditeur: <strong className="text-white">{companyName}</strong> &lt;onboarding@cabinet-cpademo.fr&gt;
                    </div>
                    <div>
                      Destinataire: <strong className="text-white">{clientData.contactName}</strong> &lt;{clientData.email}&gt;
                    </div>
                  </div>
                </div>

                {/* CSS RENDERED EMAIL BODY FRAME */}
                <div className={`mx-auto transition-all duration-300 ${
                  emailDevice === 'mobile' ? 'max-w-[390px]' : 'max-w-[640px]'
                }`}>
                  <div className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 font-sans">
                    
                    {/* EMAIL TOP BANNER */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-center text-white relative">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-[11px] font-extrabold uppercase tracking-widest mb-3">
                        <span>🏛️</span>
                        <span>{companyName}</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
                        Bienvenue chez {companyName}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 m-0">
                        Espace Client & Parcours d'Onboarding AI Intégré
                      </p>
                    </div>

                    {/* EMAIL INNER BODY */}
                    <div className="p-5 sm:p-8 space-y-6 text-slate-800 leading-relaxed text-sm">
                      <div>
                        <p className="text-base font-bold text-slate-900 m-0">
                          Bonjour {clientData.contactName},
                        </p>
                        <p className="text-slate-600 mt-1.5 m-0">
                          Votre expert-comptable a ouvert votre espace client sécurisé pour <strong className="text-slate-900">{clientData.businessName}</strong> (SIREN: {clientData.siren}). Voici un aperçu visuel direct des 4 étapes de votre intégration :
                        </p>
                      </div>

                      {/* CLIENT SUMMARY BOX */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5 text-xs">
                        <div className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                          Récapitulatif de votre Fiche Client :
                        </div>
                        <div className="flex justify-between border-b border-slate-200/60 pb-1">
                          <span className="text-slate-600">Société :</span>
                          <strong className="text-slate-900">{clientData.businessName}</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/60 pb-1">
                          <span className="text-slate-600">SIREN :</span>
                          <strong className="font-mono text-slate-900">{clientData.siren}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Forme Juridique :</span>
                          <strong className="text-blue-600 font-bold">{clientData.legalStatus}</strong>
                        </div>
                      </div>

                      {/* SECTION: VISUAL STEP-BY-STEP PICTURE CARDS INSIDE THE EMAIL CSS */}
                      <div className="space-y-4 pt-2">
                        <div className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-between border-b border-slate-200 pb-2">
                          <span>Aperçu du Processus Onboarding (4 Étapes)</span>
                          <span className="text-blue-600 font-bold">Durée: ~3 minutes</span>
                        </div>

                        {/* VISUAL STEP 1 CARD: KYC & KBIS EXTRACTION MOCKUP */}
                        <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-800 shadow-lg space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center">1</span>
                              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wide">Identification KYC & Scan KBIS</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> KYC Validé
                            </span>
                          </div>

                          {/* Mini UI Screenshot Container */}
                          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/80 space-y-2 text-xs">
                            <div className="flex justify-between items-center text-[11px] text-slate-400">
                              <span>Registre du Commerce & des Sociétés (KBIS)</span>
                              <span className="text-emerald-400 font-mono font-bold">Inpi Verified</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-2.5 rounded border border-slate-800">
                              <div>
                                <div className="text-[10px] text-slate-500">Raison Sociale</div>
                                <div className="font-bold text-white text-xs">{clientData.businessName}</div>
                                <div className="text-[10px] text-blue-400 font-mono mt-0.5">SIREN {clientData.siren}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-[10px] text-slate-500">Représentant Légal</div>
                                <div className="font-bold text-white text-xs">{clientData.contactName}</div>
                                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">CNI Scannée 100%</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* VISUAL STEP 2 CARD: DOCUMENT INTAKE CHECKLIST MOCKUP */}
                        <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-800 shadow-lg space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center">2</span>
                              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wide">Ingestion Pièces Comptables & TVA</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                              4 / 4 Pièces Collectées
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-300 text-[11px]">Extrait KBIS (-3 mois)</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-300 text-[11px]">RIB d'Exploitation</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-300 text-[11px]">Statuts constitutifs</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-300 text-[11px]">Liasse Fiscale 2025</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                          </div>
                        </div>

                        {/* VISUAL STEP 3 CARD: BANK FEED & OCR MOCKUP */}
                        <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-800 shadow-lg space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center">3</span>
                              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wide">Synchro Bancaire DSP2 & OCR</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                              ● Sync Directe DSP2
                            </span>
                          </div>

                          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-1.5 text-xs">
                            <div className="flex justify-between items-center text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                              <span>BNP Paribas Compte Pro</span>
                              <span className="font-mono text-white">IBAN FR76 *** 9012</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded">
                              <div>
                                <div className="text-[11px] font-semibold text-white">Facture AWS Cloud Services</div>
                                <div className="text-[9px] text-slate-400">TVA 20% extrait automatiquement (42,00 €)</div>
                              </div>
                              <span className="font-mono text-emerald-400 font-bold text-xs">-252,00 €</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded">
                              <div>
                                <div className="text-[11px] font-semibold text-white">Paiement Conseil Client</div>
                                <div className="text-[9px] text-slate-400">Rapprochement facture #2026-004</div>
                              </div>
                              <span className="font-mono text-emerald-400 font-bold text-xs">+4 500,00 €</span>
                            </div>
                          </div>
                        </div>

                        {/* VISUAL STEP 4 CARD: E-SIGNATURE ENGAGEMENT LETTER MOCKUP */}
                        <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-800 shadow-lg space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-extrabold text-xs flex items-center justify-center">4</span>
                              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wide">Lettre de Mission & Signature eIDAS</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                              180 € HT / mois
                            </span>
                          </div>

                          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-2 text-xs">
                            <div className="text-[11px] font-bold text-white">Contrat Annuel d'Accompagnement Comptable & Fiscal</div>
                            <div className="p-2 bg-slate-900 rounded text-[10px] text-slate-400 font-mono leading-relaxed">
                              "Engagement entre {companyName} et {clientData.businessName}. Prestation incluant tenue de compte, TVA, bilan et télétransmissions DGFiP."
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Signature Client eIDAS Apposée
                              </div>
                              <span className="text-[9px] text-slate-500 font-mono">Horodaté 2026-08-08</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* INTERACTIVE CTA BUTTON INSIDE EMAIL PREVIEW - SAFE IN-APP SWITCH */}
                      <div className="text-center pt-3 pb-1">
                        <button
                          type="button"
                          onClick={() => setActiveViewMode('workflow')}
                          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-xl shadow-blue-600/30 transition transform active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
                        >
                          <Zap className="w-4 h-4" />
                          <span>👉 DÉMARRER LA DÉMO ET TESTER L'ONBOARDING (3 MIN)</span>
                        </button>
                        <p className="text-[10px] text-slate-500 mt-2 m-0">
                          🔒 Processus In-App • Sans redirection vers une page externe
                        </p>
                      </div>

                      <hr className="border-slate-200 my-4" />

                      <p className="text-xs text-slate-500 m-0">
                        Si vous avez des questions, contactez directement l'équipe de <strong className="text-slate-800">{companyName}</strong> au 01 42 68 00 00.
                      </p>
                    </div>

                    {/* EMAIL FOOTER */}
                    <div className="bg-slate-100 border-t border-slate-200 p-5 text-center text-xs text-slate-500 space-y-1">
                      <div className="font-bold text-slate-700">
                        {companyName} • Ordre des Experts-Comptables
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Certifié Sécurité eIDAS & RGPD • Moteur d'Ingestion CPA ASSIX AI
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: FULL ROI CALCULATOR */}
          {activeViewMode === 'roi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Calculator className="w-4 h-4" /> Paramètres du Cabinet
                </div>
                <h3 className="text-base font-extrabold text-white">
                  Ajustez vos volumes annuels
                </h3>

                <div className="space-y-4 text-xs pt-2">
                  <div>
                    <div className="flex justify-between text-zinc-300 font-medium mb-1.5">
                      <span>Nouveaux clients incorporés par mois :</span>
                      <strong className="text-blue-400 font-bold text-sm">{newClientsPerMonth} clients</strong>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="50"
                      value={newClientsPerMonth}
                      onChange={(e) => setNewClientsPerMonth(Number(e.target.value))}
                      className="w-full accent-blue-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-zinc-300 font-medium mb-1.5">
                      <span>Taux horaire moyen de facturation CPA (€/h) :</span>
                      <strong className="text-emerald-400 font-bold text-sm">{cpaHourlyRate} €/h</strong>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="250"
                      step="5"
                      value={cpaHourlyRate}
                      onChange={(e) => setCpaHourlyRate(Number(e.target.value))}
                      className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1.5 text-xs text-zinc-400">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Gain Moyen par Dossier Client :
                  </div>
                  <p>
                    L'automatisation du KYC, de la collecte KBIS, du flux bancaire et de la lettre de mission économise <strong className="text-emerald-400">4,5 heures d'assistant comptable</strong> par nouveau dossier.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4" /> Projection des Gains
                  </div>
                  <h3 className="text-base font-extrabold text-white">
                    Économies & Chiffre d'Affaires Gagné
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex justify-between items-center text-xs">
                      <span className="text-zinc-400">Temps économisé par dossier:</span>
                      <strong className="text-white font-mono">4,5 heures</strong>
                    </div>
                    <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex justify-between items-center text-xs">
                      <span className="text-zinc-400">Volume mensuel d'heures:</span>
                      <strong className="text-blue-400 font-mono font-bold text-sm">{monthlyHoursSaved.toFixed(0)} h / mois</strong>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 rounded-xl space-y-1">
                      <div className="text-xs text-zinc-300 font-bold">Valeur Financière du Temps Gagné :</div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                        {monthlySavingsEur.toLocaleString('fr-FR')} € <span className="text-xs font-normal text-zinc-400">/ mois</span>
                      </div>
                      <div className="text-[11px] text-emerald-300/80 pt-1">
                        Soit <strong className="font-bold">{(monthlySavingsEur * 12).toLocaleString('fr-FR')} € / an</strong> de valeur libérée pour votre cabinet.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setActiveViewMode('workflow')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    Tester le Workflow D'Onboarding Interactif
                  </button>
                  <p className="text-[10px] text-center text-zinc-500">
                    S'intègre sans effort avec Pennylane, Cegid, QuickBooks & Agiris
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
