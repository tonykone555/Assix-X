import React, { useState, useEffect, useRef } from 'react';
import {
  Mail, Send, Sparkles, RefreshCw, Settings, FileText,
  Copy, Inbox, Plus, Search, Star, Trash2, CornerUpLeft,
  Wand2, Check, AlertCircle, HelpCircle, ExternalLink, ShieldCheck, Key,
  Zap, Users, Globe, Clock, Play, CheckCircle2, XCircle, CheckSquare, Square, Layers, Rocket,
  Eye, Edit3, Sliders, RotateCcw, Smartphone, Monitor, Code, StopCircle, PlusCircle
} from 'lucide-react';
import { buildNicheHtmlEmail, getNicheIntroText, formatBusinessName, NICHE_EMAIL_TEMPLATES, NicheType } from '../../services/nicheEmailTemplates';
import { AccountantOnboardingModal } from './AccountantOnboardingModal';

interface ColdEmailCampaignTabProps {
  isLight?: boolean;
  showNotification?: (msg: string) => void;
  leads?: any[];
  initialSelectedLeadIds?: string[];
  autoOpenBulkModal?: boolean;
}

export const ColdEmailCampaignTab: React.FC<ColdEmailCampaignTabProps> = ({
  isLight = false,
  showNotification = (_msg: string) => {},
  leads = [],
  initialSelectedLeadIds = [],
  autoOpenBulkModal = false
}) => {
  // Navigation Folder / View State: ONLY 'inbox' and 'sent'
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent'>('inbox');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Thread / Lead
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Email Composer / AI Prompt State
  const [aiPromptInstruction, setAiPromptInstruction] = useState<string>('Keep body short and compelling, mention our 100% ROI guarantee, and end with a soft call to action.');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSequence, setGeneratedSequence] = useState<any>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  // Campaign & Sender Options
  const [senderName, setSenderName] = useState<string>('Anthony');
  const [senderTitle, setSenderTitle] = useState<string>('Directeur des Stratégies Digitales @ ASSIX');

  // Sending Provider Config Modal
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [provider, setProvider] = useState<'gmail' | 'smtp' | 'resend' | 'sendgrid'>('gmail');
  const [fromEmail, setFromEmail] = useState<string>('');
  const [fromName, setFromName] = useState<string>('Anthony');
  const [smtpHost, setSmtpHost] = useState<string>('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState<number>(587);
  const [smtpUser, setSmtpUser] = useState<string>('');
  const [smtpPass, setSmtpPass] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  
  // Show step-by-step Gmail App Password instructions
  const [showGmailGuide, setShowGmailGuide] = useState<boolean>(true);

  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testCountdown, setTestCountdown] = useState<number | null>(null);
  const cancelTestSendRef = useRef<boolean>(false);

  // Bulk Email Campaign Modal & Dispatch State
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [bulkModalTab, setBulkModalTab] = useState<'dispatch' | 'preview' | 'edit'>('dispatch');
  const [selectedBulkLeadIds, setSelectedBulkLeadIds] = useState<string[]>([]);
  const [bulkLanguage, setBulkLanguage] = useState<'fr' | 'en'>('fr');
  const [selectedNiche, setSelectedNiche] = useState<NicheType>('general');
  const [sendIntervalSec, setSendIntervalSec] = useState<number>(2);
  const [campaignTitle, setCampaignTitle] = useState<string>('Niche Email Campaign');
  const [isBulkRunning, setIsBulkRunning] = useState<boolean>(false);
  const cancelBulkRef = useRef<boolean>(false);

  const handleCancelBulkCampaign = () => {
    cancelBulkRef.current = true;
    showNotification('Cancelling email campaign sending...');
  };

  const handleCancelTestSend = () => {
    cancelTestSendRef.current = true;
    setTestCountdown(null);
    setIsSendingTest(false);
    showNotification('Email sending cancelled!');
  };
  const [bulkProgress, setBulkProgress] = useState<{ total: number; current: number; sent: number; failed: number }>({
    total: 0,
    current: 0,
    sent: 0,
    failed: 0
  });
  const [bulkLogs, setBulkLogs] = useState<Array<{ id: string; company: string; email: string; status: 'sending' | 'sent' | 'error'; time: string; details?: string }>>([]);
  const [bulkCompleted, setBulkCompleted] = useState<boolean>(false);

  // Editable Email Template Content Fields
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customHeroTitle, setCustomHeroTitle] = useState<string>('');
  const [customHeroSubtitle, setCustomHeroSubtitle] = useState<string>('');
  const [customPrimaryCta, setCustomPrimaryCta] = useState<string>('');
  const [customSecondaryCta, setCustomSecondaryCta] = useState<string>('');
  const [customPainPoint, setCustomPainPoint] = useState<string>('');
  const [customGifUrl, setCustomGifUrl] = useState<string>(() => {
    return localStorage.getItem('assix_custom_gif_url') || '';
  });
  const [customGifBadge, setCustomGifBadge] = useState<string>('');
  const [customGifTitle, setCustomGifTitle] = useState<string>('');
  const [hideWhatsAppAnimation, setHideWhatsAppAnimation] = useState<boolean>(() => {
    return localStorage.getItem('assix_hide_whatsapp_anim') === 'true';
  });
  const [hideEmailAutoAnimation, setHideEmailAutoAnimation] = useState<boolean>(() => {
    return localStorage.getItem('assix_hide_email_auto_anim') === 'true';
  });
  const [hideQuoteAnimation, setHideQuoteAnimation] = useState<boolean>(() => {
    return localStorage.getItem('assix_hide_quote_anim') === 'true';
  });
  const [hideProofSection, setHideProofSection] = useState<boolean>(() => {
    return localStorage.getItem('assix_hide_proof_section') === 'true';
  });
  const [hideNotreMethode, setHideNotreMethode] = useState<boolean>(() => {
    return localStorage.getItem('assix_hide_notre_methode') === 'true';
  });
  const [customQuoteAmount, setCustomQuoteAmount] = useState<string>(() => {
    return localStorage.getItem('assix_custom_quote_amount') || '';
  });
  const [isUploadingGif, setIsUploadingGif] = useState<boolean>(false);

  // Bulk add custom email & web lead state
  const [customPastedEmails, setCustomPastedEmails] = useState<string>('');
  const [customLeads, setCustomLeads] = useState<Array<{ id: string; company: string; contactName: string; email: string; time: string; snippet: string; subject: string; folder: string; website?: string; phone?: string; socialLinks?: Record<string, string> }>>([]);
  const [isEnrichingCustomLeads, setIsEnrichingCustomLeads] = useState<boolean>(false);

  const handleAddCustomEmails = () => {
    if (!customPastedEmails.trim()) return;
    const cleanedText = customPastedEmails.replace(/\bs:\/\/([a-zA-Z0-9.-]+)/gi, 'https://$1');
    const linesOrTokens = cleanedText.split(/\r?\n|,|;/).map(t => t.trim()).filter(Boolean);
    if (linesOrTokens.length === 0) return;

    const newLeads: Array<{ id: string; company: string; contactName: string; email: string; time: string; snippet: string; subject: string; folder: string; website?: string; phone?: string }> = [];
    const seenItems = new Set<string>();

    linesOrTokens.forEach((token, i) => {
      const emailMatch = token.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
      const urlMatch = token.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s"',]*)?/i);

      if (emailMatch) {
        const email = emailMatch[0].toLowerCase();
        if (seenItems.has(email)) return;
        seenItems.add(email);
        const namePart = email.split('@')[0];
        const company = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const id = `custom_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`;
        newLeads.push({
          id,
          company,
          contactName: company,
          email,
          time: 'Just added',
          snippet: `Custom recipient email added`,
          subject: `Quick question for ${company}`,
          folder: 'inbox'
        });
      } else if (urlMatch) {
        let fullUrl = urlMatch[0];
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
          fullUrl = `https://${fullUrl}`;
        }
        const lowerUrl = fullUrl.toLowerCase();
        if (seenItems.has(lowerUrl)) return;
        seenItems.add(lowerUrl);

        let host = '';
        try {
          const u = new URL(fullUrl);
          host = u.hostname.replace(/^www\./i, '');
        } catch (e) {
          host = fullUrl.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
        }

        const baseDomain = host.split('.')[0];
        const company = baseDomain
          .replace(/[-_]/g, ' ')
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/\b\w/g, c => c.toUpperCase()) || 'Web Lead';
        const id = `custom_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`;

        newLeads.push({
          id,
          company,
          contactName: company,
          email: '',
          website: fullUrl,
          time: 'Just added',
          snippet: `Web lead: ${fullUrl} (Ready for enrichment)`,
          subject: `Quick question for ${company}`,
          folder: 'inbox'
        });
      }
    });

    if (newLeads.length === 0) {
      showNotification('No valid email addresses or website URLs found in input.');
      return;
    }

    setCustomLeads(prev => [...prev, ...newLeads]);
    setSelectedBulkLeadIds(prev => [...prev, ...newLeads.map(l => l.id)]);
    setCustomPastedEmails('');
    showNotification(`Added ${newLeads.length} custom lead(s) to target list!`);
  };

    const handleBatchEnrichCustomLeads = async () => {
    const leadsToEnrich = customLeads.filter(l => l.website || !l.email);
    if (leadsToEnrich.length === 0) {
      showNotification("No custom web leads found requiring contact enrichment.");
      return;
    }

    setIsEnrichingCustomLeads(true);
    showNotification(`⚡ Scraping emails & social profiles for ${leadsToEnrich.length} domain(s)...`);

    const CHUNK_SIZE = 12;
    let enrichedFound = 0;

    try {
      for (let i = 0; i < leadsToEnrich.length; i += CHUNK_SIZE) {
        const chunk = leadsToEnrich.slice(i, i + CHUNK_SIZE);
        showNotification(`⚡ Live Enriching batch ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(leadsToEnrich.length / CHUNK_SIZE)} (${i + chunk.length}/${leadsToEnrich.length} leads)...`);

        try {
          const res = await fetch("/api/lead/batch-enrich", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              leads: chunk.map(l => ({
                id: l.id,
                company: l.company,
                businessName: l.company,
                website: l.website || `https://${l.company.toLowerCase().replace(/\s+/g, "")}.com`,
                email: l.email || "",
                phone: l.phone || ""
              })),
              concurrency: 6,
              fastOnly: true
            })
          });

          const data = await res.json();
          if (data.success && Array.isArray(data.leads)) {
            const enrichedMap = new Map<string, any>();
            data.leads.forEach((el: any) => {
              if (el.id || el.leadId) enrichedMap.set(el.id || el.leadId, el);
            });

            setCustomLeads(prev => prev.map(l => {
              const enriched = enrichedMap.get(l.id);
              if (enriched) {
                if (enriched.email || enriched.phone) enrichedFound++;
                return {
                  ...l,
                  company: enriched.company || enriched.businessName || l.company,
                  email: enriched.email || l.email,
                  phone: enriched.phone || l.phone,
                  website: enriched.website || l.website,
                  socialLinks: enriched.socialLinks || l.socialLinks,
                  snippet: enriched.email 
                    ? `Verified Email: ${enriched.email} ${enriched.phone ? "• Phone: " + enriched.phone : ""}` 
                    : l.snippet
                };
              }
              return l;
            }));
          }
        } catch (chunkErr) {
          console.error("Chunk enrichment error in ColdEmailTab:", chunkErr);
        }
      }

      showNotification(`⚡ Live Web Enrichment Complete! ${enrichedFound} contact(s) enriched with verified details.`);
    } catch (err: any) {
      showNotification(`Enrichment error: ${err.message}`);
    } finally {
      setIsEnrichingCustomLeads(false);
    }
  };

  // Live Email Preview Settings
  const [previewLeadId, setPreviewLeadId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Accountant CPA Onboarding Interactive Modal State
  const [showAccountantModal, setShowAccountantModal] = useState<boolean>(false);
  const [accountantModalInitialView, setAccountantModalInitialView] = useState<'workflow' | 'email_preview' | 'roi'>('email_preview');

  // Track deleted leads locally so deleted source run leads vanish immediately
  const [deletedLeadIds, setDeletedLeadIds] = useState<string[]>([]);

  const handleDeleteLead = async (leadId: string, companyName: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      await fetch('/api/leads/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: [leadId] })
      });
      showNotification(`Deleted lead ${companyName}`);
      setDeletedLeadIds(prev => [...prev, leadId]);
      setSelectedBulkLeadIds(prev => prev.filter(id => id !== leadId));
    } catch (err: any) {
      showNotification(`Error deleting lead: ${err.message}`);
    }
  };

  const handleBatchDeleteLeads = async () => {
    if (selectedBulkLeadIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedBulkLeadIds.length} selected lead(s)?`)) return;
    try {
      await fetch('/api/leads/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: selectedBulkLeadIds })
      });
      showNotification(`Successfully deleted ${selectedBulkLeadIds.length} lead(s)!`);
      setDeletedLeadIds(prev => [...prev, ...selectedBulkLeadIds]);
      setSelectedBulkLeadIds([]);
    } catch (err: any) {
      showNotification(`Error deleting leads: ${err.message}`);
    }
  };

  const handleSaveTemplateEdits = () => {
    const templateState = {
      selectedNiche,
      bulkLanguage,
      customSubject,
      customHeroTitle,
      customHeroSubtitle,
      customPrimaryCta,
      customSecondaryCta,
      customPainPoint,
      customGifUrl,
      customGifBadge,
      customGifTitle,
      hideWhatsAppAnimation,
      hideEmailAutoAnimation,
      hideQuoteAnimation,
      hideProofSection,
      hideNotreMethode,
      customQuoteAmount
    };
    try {
      localStorage.setItem('assix_custom_template_state', JSON.stringify(templateState));
      localStorage.setItem('assix_hide_whatsapp_anim', String(hideWhatsAppAnimation));
      localStorage.setItem('assix_hide_email_auto_anim', String(hideEmailAutoAnimation));
      localStorage.setItem('assix_hide_quote_anim', String(hideQuoteAnimation));
      localStorage.setItem('assix_hide_proof_section', String(hideProofSection));
      localStorage.setItem('assix_hide_notre_methode', String(hideNotreMethode));
      localStorage.setItem('assix_custom_quote_amount', customQuoteAmount);
      showNotification('Template edits & animation toggles saved!');
    } catch (e) {
      showNotification('Template edits active for current session.');
    }
  };

  const resetTemplateToNicheDefaults = (niche: NicheType = selectedNiche, lang: 'fr' | 'en' = bulkLanguage) => {
    const tmpl = NICHE_EMAIL_TEMPLATES[niche]?.[lang] || NICHE_EMAIL_TEMPLATES.general[lang];
    setCustomSubject(tmpl.subject);
    setCustomHeroTitle(tmpl.heroTitle);
    setCustomHeroSubtitle(getNicheIntroText(niche, '{{company}}', lang === 'fr' ? 'dans votre secteur' : 'in your area', lang));
    setCustomPrimaryCta(tmpl.primaryCta);
    setCustomSecondaryCta(lang === 'fr' ? `💬 Planifier un échange avec ${senderName}` : `💬 Schedule a call with ${senderName}`);
    setCustomPainPoint(lang === 'fr' ? "Réponse instantanée 24/7 & accueil client personnalisé" : "24/7 instant response & personalized client welcome");

    const isRealEstate = niche === 'real_estate' || niche === 'real_estate_walkthrough';
    setCustomGifBadge(isRealEstate
      ? (lang === 'fr' ? 'ÉCHANTILLON VIDÉO WALKTHROUGH OFFERT' : 'FREE SAMPLE VIDEO WALKTHROUGH')
      : (lang === 'fr' ? 'CONCEPTION WEB PERSONNALISÉE UNIQUE' : 'UNIQUE PERSONALIZED WEB DESIGN')
    );
    setCustomGifTitle(isRealEstate
      ? (lang === 'fr' ? 'Aperçu de la Visite Vidéo Immersive' : 'Animated Preview of Interactive Property Walkthrough')
      : (lang === 'fr' ? 'Aperçu Animé de Votre Nouveau Site Web' : 'Animated Preview of Your New Website')
    );
  };

  // Restore saved email provider configuration on mount
  useEffect(() => {
    try {
      const savedConfigStr = localStorage.getItem('assix_email_config');
      if (savedConfigStr) {
        const parsed = JSON.parse(savedConfigStr);
        if (parsed.provider) setProvider(parsed.provider);
        if (parsed.fromEmail) setFromEmail(parsed.fromEmail);
        if (parsed.fromName) setFromName(parsed.fromName);
        if (parsed.smtpHost) setSmtpHost(parsed.smtpHost);
        if (parsed.smtpPort) setSmtpPort(Number(parsed.smtpPort) || 587);
        if (parsed.smtpUser) setSmtpUser(parsed.smtpUser);
        if (parsed.smtpPass) setSmtpPass(parsed.smtpPass);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
      }
    } catch (e) {
      console.error('Failed to parse saved email connection config:', e);
    }
  }, []);

  const handleSaveConnection = () => {
    const configToSave = {
      provider,
      fromEmail: fromEmail || smtpUser,
      fromName: fromName || senderName,
      smtpHost: provider === 'gmail' ? 'smtp.gmail.com' : smtpHost,
      smtpPort: provider === 'gmail' ? 587 : smtpPort,
      smtpUser: smtpUser || fromEmail,
      smtpPass,
      apiKey
    };
    try {
      localStorage.setItem('assix_email_config', JSON.stringify(configToSave));
      showNotification('Email connection saved & remembered in browser!');
    } catch (e) {
      showNotification('Connection saved in memory for this session.');
    }
    setShowConfigModal(false);
  };

  useEffect(() => {
    resetTemplateToNicheDefaults(selectedNiche, bulkLanguage);
  }, [selectedNiche, bulkLanguage]);

  // Default Mock Threads if database is fresh
  const defaultLeadThreads = [
    {
      id: 'mock_1',
      company: 'Evergreen Roofing',
      contactName: 'Evergreen Roofing',
      email: 'contact@evergreenroofing.com',
      time: '10:42 AM',
      snippet: 'Hello Evergreen Roofing team, noticed your business while scanning local listings. Saw that your site is missing a direct quote form...',
      subject: 'quick question re: Evergreen Roofing',
      folder: 'inbox'
    },
    {
      id: 'mock_2',
      company: 'Apex Plumbing',
      contactName: 'Apex Plumbing',
      email: 'contact@apexplumbing.com',
      time: 'Yesterday',
      snippet: 'Hello Apex Plumbing team, came across your business on Google Maps. Noticed you guys have 48 great 5-star reviews...',
      subject: 'idea for Apex Plumbing',
      folder: 'inbox'
    },
    {
      id: 'mock_3',
      company: 'Precision Auto Spa',
      contactName: 'Precision Auto Spa',
      email: 'contact@precisionautospa.io',
      time: 'Aug 5',
      snippet: 'Hello Precision Auto Spa team, saw your Instagram ad. Noticed the ad link goes to a generic homepage...',
      subject: 'quick thoughts on Precision Auto Spa',
      folder: 'sent'
    }
  ];

  // Combine custom pasted leads, scraped leads, and mock fallback
  const baseLeads = leads.length > 0 
    ? leads.map((l, i) => {
        const companyName = formatBusinessName(l.company || l.businessName || l.name || 'Target Business');
        const contactName = formatBusinessName(l.contactName || l.company || l.businessName || l.name || companyName);
        return {
          id: l.leadId || l.id || `lead_${i}`,
          company: companyName,
          contactName: contactName,
          email: l.email || `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'info'}@domain.com`,
          time: `${(i + 1) * 2}h ago`,
          snippet: `Re: ${companyName} - Custom cold email sequence generated for outreach...`,
          subject: `quick question re: ${companyName}`,
          folder: i % 3 === 2 ? 'sent' : 'inbox'
        };
      })
    : defaultLeadThreads;

  const rawLeadThreads = [...customLeads, ...baseLeads];

  const leadThreads = rawLeadThreads.filter(l => !deletedLeadIds.includes(l.id));

  // Selected thread object
  const activeLead = leadThreads.find(l => l.id === selectedLeadId) || leadThreads[0];

  useEffect(() => {
    if (leadThreads.length > 0) {
      if (!selectedLeadId) setSelectedLeadId(leadThreads[0].id);
      
      if (initialSelectedLeadIds && initialSelectedLeadIds.length > 0) {
        // Filter valid lead IDs that match available leadThreads
        const matchingIds = leadThreads
          .map(l => l.id)
          .filter(id => initialSelectedLeadIds.includes(id));
        
        if (matchingIds.length > 0) {
          setSelectedBulkLeadIds(matchingIds);
        } else {
          setSelectedBulkLeadIds(leadThreads.map(l => l.id));
        }
      } else if (selectedBulkLeadIds.length === 0) {
        setSelectedBulkLeadIds(leadThreads.map(l => l.id));
      }
    }

    if (autoOpenBulkModal) {
      setShowBulkModal(true);
    }
  }, [leads, initialSelectedLeadIds, autoOpenBulkModal]);

  // Bulk Campaign Dispatch Engine
  const handleRunBulkCampaign = async () => {
    const targetLeads = leadThreads.filter(l => selectedBulkLeadIds.includes(l.id));
    if (targetLeads.length === 0) {
      showNotification('Please select at least 1 lead for bulk campaign.');
      return;
    }

    cancelBulkRef.current = false;
    setIsBulkRunning(true);
    setBulkCompleted(false);
    setBulkProgress({ total: targetLeads.length, current: 0, sent: 0, failed: 0 });
    setBulkLogs([]);

    let sentCount = 0;
    let failedCount = 0;
    let wasCancelled = false;

    for (let i = 0; i < targetLeads.length; i++) {
      if (cancelBulkRef.current) {
        wasCancelled = true;
        break;
      }

      const lead = targetLeads[i];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setBulkLogs(prev => [
        {
          id: `log_${Date.now()}_${i}`,
          company: lead.company,
          email: lead.email,
          status: 'sending',
          time: timeStr,
          details: `Generating niche sequence in ${bulkLanguage.toUpperCase()}...`
        },
        ...prev
      ]);

      try {
        // Build customized niche HTML email directly with selected niche & custom edits
        const emailContent = buildNicheHtmlEmail(
          {
            leadId: lead.id,
            company: lead.company,
            contactName: lead.contactName,
            email: lead.email,
            city: (lead as any).city || 'votre secteur',
            niche: selectedNiche
          },
          bulkLanguage,
          {
            customNiche: selectedNiche,
            customSubject: customSubject || undefined,
            customHeroTitle: customHeroTitle || undefined,
            customHeroSubtitle: customHeroSubtitle || undefined,
            customPrimaryCta: customPrimaryCta || undefined,
            customSecondaryCta: customSecondaryCta || undefined,
            customPainPoint: customPainPoint || undefined,
            customGifUrl: customGifUrl || undefined,
            customGifBadge: customGifBadge || undefined,
            customGifTitle: customGifTitle || undefined,
            hideWhatsAppAnimation: hideWhatsAppAnimation,
            hideEmailAutoAnimation: hideEmailAutoAnimation,
            hideQuoteAnimation: hideQuoteAnimation,
            hideProofSection: hideProofSection,
            hideNotreMethode: hideNotreMethode,
            customQuoteAmount: customQuoteAmount || undefined,
            senderName: fromName || senderName,
            senderTitle: senderTitle
          }
        );

        if (cancelBulkRef.current) {
          wasCancelled = true;
          setBulkLogs(prev => prev.map((item, idx) => idx === 0 ? {
            ...item,
            status: 'error',
            details: 'Sending cancelled by user'
          } : item));
          break;
        }

        const subjectToSend = emailContent.subject;
        const bodyHtmlToSend = emailContent.html;
        const bodyTextToSend = emailContent.text;

        const sendRes = await fetch('/api/email-campaign/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toEmail: lead.email,
            subject: subjectToSend,
            bodyHtml: bodyHtmlToSend,
            bodyText: bodyTextToSend,
            leadId: lead.id,
            config: {
              provider: provider === 'gmail' ? 'smtp' : provider,
              fromEmail: fromEmail || smtpUser,
              fromName: fromName || senderName,
              smtpHost: provider === 'gmail' ? 'smtp.gmail.com' : smtpHost,
              smtpPort: provider === 'gmail' ? 587 : smtpPort,
              smtpUser: smtpUser || fromEmail,
              smtpPass,
              apiKey
            }
          })
        });

        const sendData = await sendRes.json();

        if (sendData.success) {
          sentCount++;
          setBulkLogs(prev => prev.map((item, idx) => idx === 0 ? {
            ...item,
            status: 'sent',
            details: `Delivered successfully (${sendData.result?.provider || provider})`
          } : item));
          lead.folder = 'sent';
        } else {
          failedCount++;
          setBulkLogs(prev => prev.map((item, idx) => idx === 0 ? {
            ...item,
            status: 'error',
            details: sendData.error || 'SMTP delivery failed'
          } : item));
        }
      } catch (err: any) {
        failedCount++;
        setBulkLogs(prev => prev.map((item, idx) => idx === 0 ? {
          ...item,
          status: 'error',
          details: err.message || 'Network error'
        } : item));
      }

      setBulkProgress({
        total: targetLeads.length,
        current: i + 1,
        sent: sentCount,
        failed: failedCount
      });

      if (cancelBulkRef.current) {
        wasCancelled = true;
        break;
      }

      if (i < targetLeads.length - 1 && sendIntervalSec > 0) {
        const delayMs = sendIntervalSec * 1000;
        const start = Date.now();
        while (Date.now() - start < delayMs) {
          if (cancelBulkRef.current) {
            wasCancelled = true;
            break;
          }
          await new Promise(r => setTimeout(r, 100));
        }
        if (wasCancelled || cancelBulkRef.current) {
          wasCancelled = true;
          break;
        }
      }
    }

    if (wasCancelled) {
      setBulkLogs(prev => [
        {
          id: `log_cancelled_${Date.now()}`,
          company: 'Campaign Cancelled',
          email: 'System',
          status: 'error',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          details: 'Sending stopped by user.'
        },
        ...prev
      ]);
      showNotification(`Campaign sending cancelled! (${sentCount} sent before cancellation)`);
    } else {
      setBulkCompleted(true);
      showNotification(`Bulk campaign complete! ${sentCount} sent, ${failedCount} failed.`);
    }

    setIsBulkRunning(false);
  };

  // Handle provider preset selection
  const handleProviderChange = (newProvider: 'gmail' | 'smtp' | 'resend' | 'sendgrid') => {
    setProvider(newProvider);
    if (newProvider === 'gmail') {
      setSmtpHost('smtp.gmail.com');
      setSmtpPort(587);
      setShowGmailGuide(true);
    } else if (newProvider === 'smtp') {
      setShowGmailGuide(false);
    } else {
      setShowGmailGuide(false);
    }
  };

  // AI Sequence Generator / Re-prompter
  const handleGenerateSequence = async () => {
    if (!activeLead) return;
    setIsGenerating(true);
    setGeneratedSequence(null);
    try {
      const res = await fetch('/api/email-campaign/generate-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: activeLead,
          options: {
            senderName,
            senderTitle,
            customPromptInstruction: aiPromptInstruction
          }
        })
      });

      const data = await res.json();
      if (data.success && data.sequence) {
        setGeneratedSequence(data.sequence);
        setActiveStepIdx(0);
        showNotification('Generated email sequence for ' + activeLead.company);
      } else {
        showNotification(`Generation error: ${data.error || 'Failed to generate sequence'}`);
      }
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendTestEmail = async () => {
    const recipient = activeLead?.email;
    if (!recipient || !recipient.includes('@')) {
      showNotification('Please enter a valid recipient email address.');
      return;
    }

    const activeBody = generatedSequence?.steps?.[activeStepIdx]?.bodyText || activeLead?.snippet || 'Hello, testing email connection!';
    const activeSubject = generatedSequence?.steps?.[activeStepIdx]?.subject || activeLead?.subject || 'Quick hello!';

    cancelTestSendRef.current = false;
    setIsSendingTest(true);

    // 3-second delay allowing cancellation
    for (let c = 3; c > 0; c--) {
      if (cancelTestSendRef.current) return;
      setTestCountdown(c);
      await new Promise(r => setTimeout(r, 1000));
      if (cancelTestSendRef.current) return;
    }
    setTestCountdown(null);

    if (cancelTestSendRef.current) return;

    try {
      const res = await fetch('/api/email-campaign/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: recipient,
          subject: activeSubject,
          bodyHtml: `<p>${activeBody.replace(/\n/g, '<br/>')}</p>`,
          bodyText: activeBody,
          config: {
            provider: provider === 'gmail' ? 'smtp' : provider,
            fromEmail: fromEmail || smtpUser || 'outreach@domain.com',
            fromName: fromName || senderName,
            smtpHost: provider === 'gmail' ? 'smtp.gmail.com' : smtpHost,
            smtpPort: provider === 'gmail' ? 587 : smtpPort,
            smtpUser: smtpUser || fromEmail,
            smtpPass,
            apiKey
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`Email sent successfully to ${recipient}!`);
      } else {
        showNotification(`Failed to send email: ${data.error}`);
      }
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    } finally {
      setIsSendingTest(false);
      setTestCountdown(null);
    }
  };

  // Filtered Threads by folder and search
  const filteredThreads = leadThreads.filter(l => {
    if (l.folder !== activeFolder && activeFolder === 'sent' && l.folder !== 'sent') return false;
    if (activeFolder === 'inbox' && l.folder === 'sent') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        l.company.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className={`h-[calc(100vh-100px)] flex flex-col ${
      isLight 
        ? 'bg-white text-slate-900 border-slate-200 shadow-xl' 
        : 'bg-[#181920] text-zinc-100 border-zinc-800 shadow-2xl'
    } rounded-2xl overflow-hidden border transition-colors`}>
      
      {/* --- TOP BAR: TRAFFIC LIGHT DOTS, TITLE & SMTP SETTINGS --- */}
      <div className={`h-14 px-5 border-b flex items-center justify-between shrink-0 select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1C1E29] border-zinc-800'
      }`}>
        <div className="flex items-center gap-3">
          {/* Traffic Light Dots */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-red-600/30 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-amber-600/30 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-emerald-600/30 inline-block" />
          </div>

          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${
            isLight 
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-600' 
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}>
            <Mail size={18} />
          </div>

          <div>
            <h1 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Email Client
            </h1>
            <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Cold outreach and inbox management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Rocket size={13} />
            Bulk Campaign ({selectedBulkLeadIds.length})
          </button>

          <button
            onClick={() => setShowConfigModal(!showConfigModal)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
              isLight 
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800' 
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}
          >
            <Settings size={13} className="text-emerald-500" />
            Gmail & Settings
          </button>
          
          <button
            onClick={handleGenerateSequence}
            disabled={isGenerating}
            className={`px-3.5 py-1.5 border font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            {isGenerating ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} className="text-emerald-400" />}
            {isGenerating ? 'Generating...' : 'AI Compose'}
          </button>
        </div>
      </div>

      {/* --- ACTIVE CAMPAIGN RUNNING BANNER WITH CANCEL BUTTON --- */}
      {isBulkRunning && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-5 py-2.5 flex items-center justify-between gap-3 text-xs font-bold text-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin text-amber-400 shrink-0" />
            <span>Email Campaign Active: <strong>{bulkProgress.current} / {bulkProgress.total}</strong> ({Math.round((bulkProgress.current / (bulkProgress.total || 1)) * 100)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBulkModal(true)}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-slate-200 border border-zinc-700 rounded-lg transition text-[11px] cursor-pointer"
            >
              View Progress
            </button>
            <button
              type="button"
              onClick={handleCancelBulkCampaign}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-lg transition text-[11px] flex items-center gap-1 cursor-pointer shadow animate-pulse"
            >
              <StopCircle size={13} /> Cancel Sending
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN WORKSPACE LAYOUT --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ======================================================== */}
        {/* PANE 1: LEFT NAVIGATION RAIL (INBOX & SENT ONLY) */}
        {/* ======================================================== */}
        <div className={`w-48 border-r flex flex-col shrink-0 select-none p-3 space-y-2 ${
          isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#14151C] border-zinc-800/80'
        }`}>
          <div className={`px-3 pt-2 text-[11px] font-bold uppercase tracking-wider ${
            isLight ? 'text-slate-400' : 'text-zinc-500'
          }`}>
            Mailboxes
          </div>

          <button
            onClick={() => setActiveFolder('inbox')}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              activeFolder === 'inbox'
                ? isLight 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : isLight
                  ? 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Inbox size={16} className={activeFolder === 'inbox' ? 'text-emerald-500' : 'text-slate-400'} />
              <span>Inbox</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-500 text-black px-1.5 py-0.2 rounded-full">
              {leadThreads.filter(l => l.folder !== 'sent').length}
            </span>
          </button>

          <button
            onClick={() => setActiveFolder('sent')}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              activeFolder === 'sent'
                ? isLight 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : isLight
                  ? 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Send size={16} className={activeFolder === 'sent' ? 'text-emerald-500' : 'text-slate-400'} />
              <span>Sent</span>
            </div>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
              {leadThreads.filter(l => l.folder === 'sent').length}
            </span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* PANE 2: MIDDLE THREAD LIST */}
        {/* ======================================================== */}
        <div className={`w-72 border-r flex flex-col shrink-0 overflow-hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#181920] border-zinc-800/80'
        }`}>
          
          {/* Header & Search */}
          <div className={`p-3 border-b space-y-2 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#15161E] border-zinc-800/80'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {activeFolder === 'inbox' ? 'Inbox Leads' : 'Sent Emails'} ({filteredThreads.length})
              </h2>

              <button
                onClick={handleGenerateSequence}
                className="w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition cursor-pointer"
                title="Compose AI Email"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="relative">
              <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contact or email..."
                className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none border ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-emerald-500' 
                    : 'bg-[#0E0F15] border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* Thread Cards List */}
          <div className={`flex-1 overflow-y-auto divide-y ${
            isLight ? 'divide-slate-100' : 'divide-zinc-800/50'
          }`}>
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === selectedLeadId;
              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedLeadId(thread.id)}
                  className={`p-3 transition cursor-pointer relative group ${
                    isSelected
                      ? isLight 
                        ? 'bg-emerald-50 border-l-4 border-l-emerald-600' 
                        : 'bg-emerald-500/10 border-l-4 border-l-emerald-500'
                      : isLight ? 'hover:bg-slate-50' : 'hover:bg-zinc-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold truncate max-w-[130px] ${
                      isSelected 
                        ? 'text-emerald-600 font-extrabold' 
                        : isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {thread.contactName || thread.company}
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                      {thread.time}
                    </span>
                  </div>

                  <div className={`text-[11px] font-medium truncate ${
                    isLight ? 'text-slate-600' : 'text-zinc-300'
                  }`}>
                    {thread.company}
                  </div>

                  <div className={`text-xs font-semibold mt-0.5 truncate ${
                    isLight ? 'text-slate-800' : 'text-zinc-200'
                  }`}>
                    {thread.subject}
                  </div>

                  <p className={`text-[10px] mt-1 line-clamp-2 leading-snug ${
                    isLight ? 'text-slate-500' : 'text-zinc-400'
                  }`}>
                    {thread.snippet}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PANE 3: RIGHT DETAIL EMAIL READER & SIMPLE PROMPT BAR */}
        {/* ======================================================== */}
        <div className={`flex-1 flex flex-col overflow-hidden ${
          isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#181920] text-zinc-100'
        }`}>
          
          {activeLead ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Reader Action Toolbar */}
              <div className={`h-12 px-6 border-b flex items-center justify-between shrink-0 select-none ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#1C1E29] border-zinc-800'
              }`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendTestEmail}
                    disabled={isSendingTest}
                    className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-600 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingTest ? <RefreshCw size={12} className="animate-spin" /> : <CornerUpLeft size={13} />}
                    Reply / Send
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedSequence?.steps[activeStepIdx]?.bodyText || activeLead.snippet);
                      showNotification('Email message copied to clipboard!');
                    }}
                    className={`px-2.5 py-1 border text-xs rounded-lg transition flex items-center gap-1 cursor-pointer ${
                      isLight 
                        ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' 
                        : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>

                <div className={`text-xs font-mono font-bold ${
                  isLight ? 'text-emerald-700' : 'text-emerald-400'
                }`}>
                  {activeLead.email}
                </div>
              </div>

              {/* Reader Body Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                
                {/* ACCOUNTANT ONBOARDING INTERACTIVE DEMO BANNER (Accountant Niche Only) */}
                {selectedNiche === 'accountant' && (
                  <div className="p-3.5 bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-emerald-950/60 border border-blue-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-400 shrink-0">
                        <Zap size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                          <span>AI CPA ONBOARDING ENGINE</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                        <div className="text-xs font-bold text-white mt-0.5">
                          Aperçu du parcours d'Onboarding Client & rendu Email Client
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setAccountantModalInitialView('email_preview');
                          setShowAccountantModal(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Mail size={13} />
                        <span>Aperçu Email Client (CSS)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAccountantModalInitialView('workflow');
                          setShowAccountantModal(true);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Zap size={13} />
                        <span>Tester Démo 3-min</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Contact & Email Info Card */}
                <div className={`border rounded-xl p-4 space-y-2 ${
                  isLight 
                    ? 'bg-white border-slate-200 shadow-xs' 
                    : 'bg-[#14151C] border-zinc-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {activeLead.contactName}
                      </h3>
                      <p className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                        {activeLead.company} • <span className="text-emerald-500">{activeLead.email}</span>
                      </p>
                    </div>

                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                      {activeLead.time}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 dark:border-zinc-800/80">
                    <span className={`text-[10px] uppercase font-mono block ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                      Subject Line (Editable):
                    </span>
                    <input
                      type="text"
                      value={generatedSequence?.steps[activeStepIdx]?.subject || activeLead.subject || customSubject}
                      onChange={(e) => {
                        const newSubj = e.target.value;
                        setCustomSubject(newSubj);
                        if (generatedSequence) {
                          const updated = [...generatedSequence.steps];
                          updated[activeStepIdx] = { ...updated[activeStepIdx], subject: newSubj };
                          setGeneratedSequence({ ...generatedSequence, steps: updated });
                        } else {
                          setGeneratedSequence({
                            steps: [
                              {
                                stepNumber: 1,
                                dayOffset: 0,
                                subject: newSubj,
                                bodyText: activeLead.snippet || customHeroSubtitle,
                                callToAction: 'Consulter la démo'
                              }
                            ]
                          });
                        }
                      }}
                      className={`w-full text-sm font-bold mt-1 bg-transparent border-b border-dashed border-zinc-700/80 focus:border-emerald-500 focus:outline-none ${isLight ? 'text-slate-900' : 'text-white'}`}
                      placeholder="Enter subject line..."
                    />
                  </div>
                </div>

                {/* Sequence Step Selector (If sequence generated) */}
                {generatedSequence && (
                  <div className={`flex items-center gap-2 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
                    {generatedSequence.steps.map((s: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveStepIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          activeStepIdx === idx
                            ? 'bg-emerald-500 text-black shadow-xs'
                            : isLight
                              ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        Step {s.stepNumber}
                      </button>
                    ))}
                  </div>
                )}

                {/* Email Body Editor Box */}
                <div className={`border rounded-xl p-4 space-y-2 ${
                  isLight 
                    ? 'bg-white border-slate-200 shadow-xs' 
                    : 'bg-[#14151C] border-zinc-800'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold uppercase text-[10px] tracking-wider flex items-center gap-1 ${
                      isLight ? 'text-slate-700' : 'text-zinc-300'
                    }`}>
                      <FileText size={13} className="text-emerald-500" />
                      Email Body Message (Editable)
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">Changes auto-saved</span>
                  </div>

                  <textarea
                    rows={8}
                    value={generatedSequence?.steps[activeStepIdx]?.bodyText ?? customHeroSubtitle ?? activeLead.snippet}
                    onChange={(e) => {
                      const newVal = e.target.value;
                      setCustomHeroSubtitle(newVal);
                      if (generatedSequence) {
                        const updated = [...generatedSequence.steps];
                        updated[activeStepIdx] = { ...updated[activeStepIdx], bodyText: newVal };
                        setGeneratedSequence({ ...generatedSequence, steps: updated });
                      } else {
                        setGeneratedSequence({
                          steps: [
                            {
                              stepNumber: 1,
                              dayOffset: 0,
                              subject: activeLead.subject || customSubject || `Demo interactive pour ${activeLead.company}`,
                              bodyText: newVal,
                              callToAction: 'Consulter la démo'
                            }
                          ]
                        });
                      }
                    }}
                    className={`w-full p-3 rounded-lg text-xs leading-relaxed focus:outline-none font-sans border ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 focus:bg-white' 
                        : 'bg-[#0E0F15] border-zinc-800 text-zinc-200 focus:border-emerald-500'
                    }`}
                    placeholder="Type or edit your email message..."
                  />
                </div>

              </div>

              {/* ======================================================== */}
              {/* CLEAN PROMPT BAR */}
              {/* ======================================================== */}
              <div className={`p-3 border-t space-y-1.5 shrink-0 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#14151C] border-zinc-800'
              }`}>
                <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block flex items-center gap-1">
                  <Wand2 size={12} />
                  Prompt AI Personalization Instruction:
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aiPromptInstruction}
                    onChange={(e) => setAiPromptInstruction(e.target.value)}
                    placeholder="e.g. Keep body under 60 words and focus on high conversions..."
                    className={`flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none border ${
                      isLight 
                        ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-emerald-600' 
                        : 'bg-[#0E0F15] border-zinc-800 text-white focus:border-emerald-500'
                    }`}
                  />

                  <button
                    onClick={handleGenerateSequence}
                    disabled={isGenerating}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
                  >
                    {isGenerating ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    {isGenerating ? 'Prompting...' : 'Re-Prompt AI'}
                  </button>

                  {isSendingTest ? (
                    <button
                      type="button"
                      onClick={handleCancelTestSend}
                      className="px-3.5 py-2 font-black text-xs rounded-xl bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow animate-pulse whitespace-nowrap"
                    >
                      <StopCircle size={14} />
                      Cancel Sending {testCountdown !== null ? `(${testCountdown}s)` : ''}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendTestEmail}
                      className={`px-3.5 py-2 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
                        isLight 
                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-900 text-white' 
                          : 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-zinc-200'
                      }`}
                    >
                      <Send size={13} className="text-emerald-400" />
                      Send
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2">
              <Mail size={32} className="text-slate-400" />
              <p className="text-xs text-slate-500">Select a lead thread from the inbox to read and compose emails.</p>
            </div>
          )}

        </div>

      </div>

      {/* --- CONFIG MODAL FOR GMAIL APP PASSWORD & PROVIDER SETTINGS --- */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#181920] border-zinc-800 text-white'
          }`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between border-b pb-3 shrink-0 ${
              isLight ? 'border-slate-200' : 'border-zinc-800'
            }`}>
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Settings size={15} className="text-emerald-500" />
                Connect Gmail or Outbound Email Engine
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-900 transition text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {/* Provider Selection Cards */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Choose Email Sending Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleProviderChange('gmail')}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      provider === 'gmail'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      Gmail Direct
                      {provider === 'gmail' && <Check size={12} className="text-emerald-500" />}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1">App Password (Free)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderChange('smtp')}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      provider === 'smtp'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      Custom SMTP
                      {provider === 'smtp' && <Check size={12} className="text-emerald-500" />}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1">Outlook, Hostinger, etc.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderChange('resend')}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      provider === 'resend'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      Resend API
                      {provider === 'resend' && <Check size={12} className="text-emerald-500" />}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1">API Key Integration</span>
                  </button>
                </div>
              </div>

              {/* Sender Info Inputs */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Your Email Address</label>
                  <input
                    type="email"
                    value={smtpUser || fromEmail}
                    onChange={(e) => {
                      setSmtpUser(e.target.value);
                      setFromEmail(e.target.value);
                    }}
                    placeholder="yourname@gmail.com"
                    className={`w-full border rounded-lg px-2.5 py-1.5 text-xs ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E0F15] border-zinc-800 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Sender Display Name</label>
                  <input
                    type="text"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder="Alex Vance"
                    className={`w-full border rounded-lg px-2.5 py-1.5 text-xs ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E0F15] border-zinc-800 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Gmail / App Password Form */}
              {(provider === 'gmail' || provider === 'smtp') && (
                <div className={`p-3.5 rounded-xl border space-y-2.5 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0E0F15] border-zinc-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                      <Key size={13} />
                      {provider === 'gmail' ? 'Gmail App Password Credentials' : 'SMTP Server Credentials'}
                    </span>
                    {provider === 'gmail' && (
                      <button
                        type="button"
                        onClick={() => setShowGmailGuide(!showGmailGuide)}
                        className="text-[10px] text-emerald-400 underline font-semibold cursor-pointer hover:text-emerald-300 flex items-center gap-1"
                      >
                        <HelpCircle size={12} />
                        {showGmailGuide ? 'Hide Setup Steps' : 'How to get App Password?'}
                      </button>
                    )}
                  </div>

                  {/* Gmail Step-by-Step Guide Accordion */}
                  {provider === 'gmail' && showGmailGuide && (
                    <div className={`p-3 rounded-xl border space-y-2 text-xs leading-relaxed ${
                      isLight ? 'bg-emerald-50/70 border-emerald-200 text-slate-800' : 'bg-emerald-950/30 border-emerald-500/20 text-emerald-200'
                    }`}>
                      <div className="font-bold text-[11px] uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <ShieldCheck size={13} />
                        How to Get Your Gmail App Password (2 Minutes):
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] font-medium">
                        <li>
                          Go to your Google Account at{' '}
                          <a
                            href="https://myaccount.google.com/security"
                            target="_blank"
                            rel="noreferrer"
                            className="underline font-bold text-emerald-400 inline-flex items-center gap-0.5"
                          >
                            myaccount.google.com/security <ExternalLink size={10} />
                          </a>
                        </li>
                        <li>Make sure <strong>2-Step Verification</strong> is enabled.</li>
                        <li>In the search bar at the top, type <strong>"App passwords"</strong> (or go to Security &gt; App Passwords).</li>
                        <li>Create a password with app name e.g. <code>Outreach App</code>.</li>
                        <li>Google will generate a 16-character code (e.g. <code>xxxx xxxx xxxx xxxx</code>). Copy and paste it below!</li>
                      </ol>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Gmail / User Email</label>
                      <input
                        type="text"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className={`w-full border rounded-md px-2.5 py-1.5 text-xs ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                        }`}
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                        16-Digit App Password
                      </label>
                      <input
                        type="password"
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className={`w-full border rounded-md px-2.5 py-1.5 text-xs ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                        }`}
                      />
                    </div>
                  </div>

                  {provider === 'smtp' && (
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">SMTP Host</label>
                        <input
                          type="text"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          placeholder="smtp.mail.com"
                          className={`w-full border rounded-md px-2.5 py-1.5 text-xs ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">SMTP Port</label>
                        <input
                          type="number"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(Number(e.target.value))}
                          className={`w-full border rounded-md px-2.5 py-1.5 text-xs ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resend API Key Input */}
              {provider === 'resend' && (
                <div className={`p-3.5 rounded-xl border space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0E0F15] border-zinc-800'
                }`}>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Resend API Key (RESEND_API_KEY)</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="re_123456789..."
                    className={`w-full border rounded-md px-2.5 py-1.5 text-xs ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400">Get a free key at <a href="https://resend.com" target="_blank" rel="noreferrer" className="underline text-emerald-400">resend.com</a></p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border border-zinc-700"
                >
                  {isSendingTest ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} className="text-emerald-400" />}
                  Test Connection
                </button>

                <button
                  type="button"
                  onClick={handleSaveConnection}
                  className="flex-1 py-2 bg-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition cursor-pointer"
                >
                  Save Connection
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- BULK EMAIL CAMPAIGN LAUNCHER MODAL --- */}
      {showBulkModal && (() => {
        const nicheOptions: Array<{ id: NicheType; label: string; icon: string }> = bulkLanguage === 'en' ? [
          { id: 'general', label: 'General Business', icon: '💼' },
          { id: 'real_estate', label: 'Real Estate - Automation Leads & AI Portal', icon: '🏠' },
          { id: 'real_estate_walkthrough', label: 'Real Estate - 4K Video Tour (GIF)', icon: '🎬' },
          { id: 'restaurant', label: 'Restaurant & Catering', icon: '🍽️' },
          { id: 'plumbing', label: 'Plumbing & Emergency Repair', icon: '🚰' },
          { id: 'electrical', label: 'Electrical & Power', icon: '⚡' },
          { id: 'disaster_restoration', label: 'Disaster Restoration', icon: '🛠️' },
          { id: 'locksmith', label: 'Locksmith & Security', icon: '🔑' },
          { id: 'driving_school', label: 'Driving School', icon: '🚗' },
          { id: 'law_firm', label: 'Law Firm & Attorneys', icon: '⚖️' },
          { id: 'accountant', label: 'Accountant & CPA Onboarding', icon: '📊' },
          { id: 'funeral_home', label: 'Funeral Services', icon: '🕊️' },
          { id: 'dog_groomer', label: 'Pet Grooming', icon: '🐾' },
          { id: 'photographer', label: 'Photographer & Photo Studio', icon: '📸' },
          { id: 'dentist', label: 'Aesthetic Dental Practice', icon: '🦷' },
          { id: 'ecom_clothing', label: 'E-Commerce Clothing Brands (AI Virtual Try-On)', icon: '👗' },
        ] : [
          { id: 'general', label: 'Entreprise Générale', icon: '💼' },
          { id: 'real_estate', label: 'Immobilier - Automation Leads & Portail AI', icon: '🏠' },
          { id: 'real_estate_walkthrough', label: 'Immobilier - Visite Vidéo 4K & GIF', icon: '🎬' },
          { id: 'restaurant', label: 'Restaurant & Traiteur', icon: '🍽️' },
          { id: 'plumbing', label: 'Plomberie & Chauffage (Routage Urgence)', icon: '🚰' },
          { id: 'electrical', label: 'Électricité & Énergie', icon: '⚡' },
          { id: 'disaster_restoration', label: 'Rénovation après Sinistre', icon: '🛠️' },
          { id: 'locksmith', label: 'Serrurerie & Sécurité', icon: '🔑' },
          { id: 'driving_school', label: 'Auto-École (Cycle Élève)', icon: '🚗' },
          { id: 'law_firm', label: 'Cabinet d\'Avocats', icon: '⚖️' },
          { id: 'accountant', label: 'Expert-Comptable & CPA (Onboarding Client AI)', icon: '📊' },
          { id: 'funeral_home', label: 'Pompes Funèbres', icon: '🕊️' },
          { id: 'dog_groomer', label: 'Toilettage Canin', icon: '🐾' },
          { id: 'photographer', label: 'Studio Photographie', icon: '📸' },
          { id: 'dentist', label: 'Cabinet Dentaire Esthétique', icon: '🦷' },
          { id: 'ecom_clothing', label: 'E-Commerce & Marques de Mode (Cabine Virtuelle IDM-VTON)', icon: '👗' },
        ];

        const activePreviewLead = leadThreads.find(l => l.id === (previewLeadId || selectedBulkLeadIds[0] || leadThreads[0]?.id)) || leadThreads[0];

        const previewEmailContent = activePreviewLead ? buildNicheHtmlEmail(
          {
            leadId: activePreviewLead.id,
            company: activePreviewLead.company,
            contactName: activePreviewLead.contactName,
            email: activePreviewLead.email,
            city: (activePreviewLead as any).city || 'votre secteur',
            niche: selectedNiche
          },
          bulkLanguage,
          {
            customNiche: selectedNiche,
            customSubject: customSubject || undefined,
            customHeroTitle: customHeroTitle || undefined,
            customHeroSubtitle: customHeroSubtitle || undefined,
            customPrimaryCta: customPrimaryCta || undefined,
            customSecondaryCta: customSecondaryCta || undefined,
            customPainPoint: customPainPoint || undefined,
            customGifUrl: customGifUrl || undefined,
            customGifBadge: customGifBadge || undefined,
            customGifTitle: customGifTitle || undefined,
            hideWhatsAppAnimation: hideWhatsAppAnimation,
            hideEmailAutoAnimation: hideEmailAutoAnimation,
            hideQuoteAnimation: hideQuoteAnimation,
            hideProofSection: hideProofSection,
            hideNotreMethode: hideNotreMethode,
            customQuoteAmount: customQuoteAmount || undefined,
            senderName: fromName || senderName,
            senderTitle: senderTitle
          }
        ) : { subject: '', html: '', text: '' };

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
            <div className="bg-[#F8FAFC] border border-slate-200 shadow-2xl rounded-2xl max-w-4xl w-full p-5 sm:p-6 space-y-4 overflow-hidden max-h-[94vh] flex flex-col text-slate-800">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 shrink-0 select-none">
                <div className="flex items-center gap-3">
                  {/* Traffic Light Dots */}
                  <div className="flex items-center gap-1.5 mr-1 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-red-600/30 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-amber-600/30 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-emerald-600/30 inline-block" />
                  </div>

                  <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0">
                    <Rocket size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-950 tracking-tight">Bulk Outreach Campaign</h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Choose Niche, Preview Email, Edit Content & Send Bulk Outreach
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isBulkRunning) {
                      if (!confirm('A bulk campaign is currently running. Close modal anyway?')) return;
                    }
                    setShowBulkModal(false);
                  }}
                  className="text-slate-400 hover:text-slate-900 transition text-[11px] font-extrabold tracking-wider uppercase border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Modal Sub-Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setBulkModalTab('dispatch')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    bulkModalTab === 'dispatch'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs font-extrabold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Rocket size={13} className="text-emerald-500" /> 
                  <span>1. Launch & Targets ({selectedBulkLeadIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBulkModalTab('preview')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    bulkModalTab === 'preview'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs font-extrabold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Eye size={13} className="text-emerald-500" /> 
                  <span>2. Live Email Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBulkModalTab('edit')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    bulkModalTab === 'edit'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs font-extrabold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Edit3 size={13} className="text-emerald-500" /> 
                  <span>3. Edit Content & Niche</span>
                </button>
              </div>

              {/* Modal Body Container */}
              <div className="space-y-4 overflow-y-auto pr-1 flex-1 min-h-0">

                {/* TAB 1: DISPATCH & TARGETS */}
                {bulkModalTab === 'dispatch' && (
                  <div className="space-y-4">
                    {/* Status Summary Banner */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Leads</span>
                        <div className="text-base font-black text-emerald-600 mt-0.5 flex items-center gap-1.5">
                          <Users size={16} />
                          {selectedBulkLeadIds.length} / {leadThreads.length}
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chosen Niche</span>
                        <div className="text-xs font-black text-emerald-600 mt-1 flex items-center gap-1 truncate capitalize font-mono">
                          <span>{nicheOptions.find(n => n.id === selectedNiche)?.icon || '💼'}</span>
                          {selectedNiche.replace('_', ' ')}
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sending Engine</span>
                        <div className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5 truncate font-mono">
                          <Zap size={14} className="text-emerald-500" />
                          {provider.toUpperCase()}
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Duration</span>
                        <div className="text-xs font-bold text-amber-600 mt-1 flex items-center gap-1.5">
                          <Clock size={14} />
                          ~{Math.ceil((selectedBulkLeadIds.length * sendIntervalSec) / 60)} min ({sendIntervalSec}s gap)
                        </div>
                      </div>
                    </div>

                    {/* Campaign Settings Bar */}
                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Campaign Title</label>
                          <input
                            type="text"
                            value={campaignTitle}
                            onChange={(e) => setCampaignTitle(e.target.value)}
                            disabled={isBulkRunning}
                            className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-2.5 py-1.5 text-xs font-semibold transition bg-slate-50"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Industry Niche Sector
                          </label>
                          <select
                            value={selectedNiche}
                            onChange={(e) => {
                              const n = e.target.value as NicheType;
                              setSelectedNiche(n);
                              resetTemplateToNicheDefaults(n, bulkLanguage);
                            }}
                            disabled={isBulkRunning}
                            className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-2.5 py-1.5 text-xs font-semibold transition bg-slate-50"
                          >
                            {nicheOptions.map(n => (
                              <option key={n.id} value={n.id}>
                                {n.icon} {n.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                            <Globe size={11} /> Email Language
                          </label>
                          <select
                            value={bulkLanguage}
                            onChange={(e) => setBulkLanguage(e.target.value as 'fr' | 'en')}
                            disabled={isBulkRunning}
                            className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-2.5 py-1.5 text-xs font-semibold transition bg-slate-50"
                          >
                            <option value="fr">French (Français)</option>
                            <option value="en">English</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                            <Clock size={11} /> Delay per Email
                          </label>
                          <select
                            value={sendIntervalSec}
                            onChange={(e) => setSendIntervalSec(Number(e.target.value))}
                            disabled={isBulkRunning}
                            className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-2.5 py-1.5 text-xs font-semibold transition bg-slate-50"
                          >
                            <option value={1}>1 second (Fast)</option>
                            <option value={2}>2 seconds (Balanced)</option>
                            <option value={5}>5 seconds (Safer)</option>
                            <option value={10}>10 seconds</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Progress & Live Logs Section (When running or completed) */}
                    {(isBulkRunning || bulkCompleted || bulkLogs.length > 0) && (
                      <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 text-emerald-700">
                            {isBulkRunning ? <RefreshCw size={14} className="animate-spin text-emerald-600" /> : <CheckCircle2 size={14} className="text-emerald-600" />}
                            {isBulkRunning ? 'Sending Emails in Real-time...' : bulkCompleted ? 'Bulk Campaign Finished!' : 'Dispatch Logs'}
                          </span>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-emerald-800">
                              {bulkProgress.current} / {bulkProgress.total} ({Math.round((bulkProgress.current / (bulkProgress.total || 1)) * 100)}%)
                            </span>

                            {isBulkRunning && (
                              <button
                                type="button"
                                onClick={handleCancelBulkCampaign}
                                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-[11px] font-black rounded-lg transition shadow flex items-center gap-1 cursor-pointer animate-pulse"
                                title="Stop & Cancel Bulk Email Campaign"
                              >
                                <StopCircle size={13} /> Cancel Sending
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                            style={{ width: `${Math.round((bulkProgress.current / (bulkProgress.total || 1)) * 100)}%` }}
                          />
                        </div>

                        <div className="flex items-center gap-4 text-xs font-bold">
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 size={13} /> {bulkProgress.sent} Delivered
                          </span>
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle size={13} /> {bulkProgress.failed} Failed
                          </span>
                        </div>

                        {/* Execution Log Box */}
                        <div className="p-2.5 bg-white border border-slate-200 rounded-lg max-h-36 overflow-y-auto font-mono text-[11px] space-y-1.5">
                          {bulkLogs.map((log) => (
                            <div key={log.id} className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1">
                              <div className="flex items-center gap-1.5 truncate">
                                {log.status === 'sending' && <RefreshCw size={11} className="animate-spin text-amber-500 shrink-0" />}
                                {log.status === 'sent' && <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />}
                                {log.status === 'error' && <XCircle size={11} className="text-red-500 shrink-0" />}
                                <span className="font-bold text-slate-800">{log.company}</span>
                                <span className="text-slate-500 font-sans">({log.email})</span>
                              </div>

                              <div className="text-[10px] text-right shrink-0">
                                <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                                  log.status === 'sent' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  log.status === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {log.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bulk Add Custom Email & Web Lead Recipients Input */}
                    <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                          <PlusCircle size={14} className="text-emerald-600" />
                          Add Custom Emails or Domain URLs in Bulk
                        </label>
                        <span className="text-[10px] text-emerald-800 font-semibold">Paste emails or website URLs (e.g. purrclothing.ca, otcvintageretroclothing.com.au)</span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <textarea
                          rows={2}
                          value={customPastedEmails}
                          onChange={(e) => setCustomPastedEmails(e.target.value)}
                          placeholder="e.g. https://purrclothing.ca, https://otcvintageretroclothing.com.au, contact@store.com"
                          className="flex-1 border border-emerald-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-xl px-3 py-1.5 text-xs font-mono bg-white shadow-xs"
                        />
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={handleAddCustomEmails}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <PlusCircle size={14} /> Add to Target List
                          </button>
                          {customLeads.length > 0 && (
                            <button
                              type="button"
                              onClick={handleBatchEnrichCustomLeads}
                              disabled={isEnrichingCustomLeads}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-extrabold text-[11px] rounded-xl transition shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Sparkles size={12} className={isEnrichingCustomLeads ? "animate-spin" : ""} />
                              {isEnrichingCustomLeads ? 'Crawling Websites...' : '⚡ Enrich Web Leads'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Lead Selection Checklist */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckSquare size={13} className="text-emerald-500" />
                          Select Target Leads ({selectedBulkLeadIds.length} checked)
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBulkLeadIds(leadThreads.map(l => l.id))}
                            className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                          >
                            Select All ({leadThreads.length})
                          </button>
                          <span className="text-slate-300 font-bold">•</span>
                          <button
                            type="button"
                            onClick={() => setSelectedBulkLeadIds([])}
                            className="text-[10px] font-black text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                          >
                            Deselect All
                          </button>
                          {selectedBulkLeadIds.length > 0 && (
                            <>
                              <span className="text-slate-300 font-bold">•</span>
                              <button
                                type="button"
                                onClick={handleBatchDeleteLeads}
                                className="text-[10px] font-black text-red-600 hover:text-red-700 hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 size={11} />
                                Delete Selected ({selectedBulkLeadIds.length})
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-52 overflow-y-auto bg-white shadow-xs">
                        {leadThreads.map((lead) => {
                          const isChecked = selectedBulkLeadIds.includes(lead.id);
                          return (
                            <div
                              key={lead.id}
                              onClick={() => {
                                if (isBulkRunning) return;
                                if (isChecked) {
                                  setSelectedBulkLeadIds(prev => prev.filter(id => id !== lead.id));
                                } else {
                                  setSelectedBulkLeadIds(prev => [...prev, lead.id]);
                                }
                              }}
                              className={`p-2.5 flex items-center justify-between transition cursor-pointer hover:bg-slate-50 ${
                                isChecked ? 'bg-emerald-50/20' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="text-emerald-600">
                                  {isChecked ? <CheckSquare size={16} /> : <Square size={16} className="text-slate-300" />}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    {lead.company}
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-sans">
                                      {lead.contactName}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-emerald-600 font-mono">
                                    {lead.email}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold text-slate-400 font-mono">
                                  {lead.folder === 'sent' ? '✓ Sent' : 'Inbox Lead'}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteLead(lead.id, lead.company);
                                  }}
                                  title="Delete this lead"
                                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: LIVE EMAIL PREVIEW */}
                {bulkModalTab === 'preview' && (
                  <div className="space-y-3.5">
                    {/* Top Preview Controls Bar */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                      {/* Sample Lead Picker */}
                      <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                          <Users size={12} className="text-emerald-500" /> Preview Lead:
                        </label>
                        <select
                          value={previewLeadId || activePreviewLead.id}
                          onChange={(e) => setPreviewLeadId(e.target.value)}
                          className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-2.5 py-1 text-xs font-semibold transition bg-slate-50"
                        >
                          {leadThreads.map(l => (
                            <option key={l.id} value={l.id}>
                              {l.company} ({l.contactName})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Niche Indicator */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase">
                        <span>{nicheOptions.find(n => n.id === selectedNiche)?.icon || '💼'}</span>
                        <span>{selectedNiche.replace('_', ' ')}</span>
                      </div>

                      {/* Device Switcher */}
                      <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-1 rounded-lg shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('desktop')}
                          className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                            previewDevice === 'desktop' ? 'bg-white border border-slate-200 text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Monitor size={12} /> Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('mobile')}
                          className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                            previewDevice === 'mobile' ? 'bg-white border border-slate-200 text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Smartphone size={12} /> Mobile
                        </button>
                      </div>
                    </div>

                    {/* Simulated Email Inbox Header */}
                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400">Subject Line:</span>
                        <span className="font-mono text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100">
                          {bulkLanguage.toUpperCase()} HTML TEMPLATE
                        </span>
                      </div>
                      <div className="text-sm font-black text-slate-900 tracking-tight">
                        {previewEmailContent.subject}
                      </div>
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                        <span>From: <strong className="text-slate-800">{fromName || senderName}</strong> &lt;{fromEmail || smtpUser || 'outreach@assix.app'}&gt;</span>
                        <span>•</span>
                        <span>To: <strong className="text-slate-800">{activePreviewLead.contactName}</strong> &lt;{activePreviewLead.email}&gt;</span>
                      </div>
                    </div>

                    {/* Live Rendered Email Frame */}
                    <div className={`p-2 bg-slate-100 border border-slate-200 rounded-2xl flex justify-center ${
                      previewDevice === 'mobile' ? 'max-w-[400px] mx-auto' : 'w-full'
                    }`}>
                      <iframe
                        title="Email Live Preview"
                        srcDoc={previewEmailContent.html}
                        className="w-full h-[450px] rounded-xl border border-slate-200 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: EDIT CONTENT & NICHE */}
                {bulkModalTab === 'edit' && (
                  <div className="space-y-4">
                    {/* Choose Niche Grid */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>1. Select Industry Niche Sector</span>
                        <span className="text-[10px] text-amber-600 font-extrabold">Resets content to niche defaults</span>
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {nicheOptions.map((niche) => {
                          const isSelected = selectedNiche === niche.id;
                          return (
                            <button
                              key={niche.id}
                              type="button"
                              onClick={() => {
                                setSelectedNiche(niche.id);
                                resetTemplateToNicheDefaults(niche.id, bulkLanguage);
                                showNotification(`Applied ${niche.label} email template!`);
                              }}
                              className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                                isSelected
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-xs font-black'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <div className="text-xl">{niche.icon}</div>
                              <div className="text-xs font-bold leading-snug truncate text-slate-800">{niche.label}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Content Form Overrides */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <Edit3 size={14} className="text-emerald-500" /> 2. Edit Email Content & Messaging
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            resetTemplateToNicheDefaults(selectedNiche, bulkLanguage);
                            showNotification('Template content reset to niche defaults.');
                          }}
                          className="text-[10px] font-extrabold text-slate-400 hover:text-emerald-600 flex items-center gap-1 transition cursor-pointer"
                        >
                          <RotateCcw size={11} /> Reset to Preset
                        </button>
                      </div>

                      {/* Dynamic Tag Legend */}
                      <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-600">Available Dynamic Tags:</span>
                        <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-emerald-700 font-semibold">{`{{company}}`}</span>
                        <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-emerald-700 font-semibold">{`{{contactName}}`}</span>
                        <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-emerald-700 font-semibold">{`{{city}}`}</span>
                        <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-emerald-700 font-semibold">{`{{firstName}}`}</span>
                      </div>

                      {/* Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email Subject Line</label>
                          <input
                            type="text"
                            value={customSubject}
                            onChange={(e) => setCustomSubject(e.target.value)}
                            className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-3 py-2 text-xs font-semibold bg-slate-50/50 transition"
                            placeholder="Interactive demo for {{company}}"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Hero Title (Headline)</label>
                            <input
                              type="text"
                              value={customHeroTitle}
                              onChange={(e) => setCustomHeroTitle(e.target.value)}
                              className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-3 py-2 text-xs font-semibold bg-slate-50/50 transition"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Personalized Pain Point / Hook</label>
                            <input
                              type="text"
                              value={customPainPoint}
                              onChange={(e) => setCustomPainPoint(e.target.value)}
                              className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-3 py-2 text-xs font-semibold bg-slate-50/50 transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email Body Message / Hero Intro Paragraph (Live Editable)</label>
                          <textarea
                            rows={4}
                            value={customHeroSubtitle}
                            onChange={(e) => setCustomHeroSubtitle(e.target.value)}
                            className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-3 py-2 text-xs font-semibold bg-slate-50/50 transition leading-relaxed"
                            placeholder="Type or edit your niche intro email message..."
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Sender / Organizer Name</label>
                            <input
                              type="text"
                              value={senderName}
                              onChange={(e) => {
                                const newName = e.target.value;
                                setSenderName(newName);
                                setFromName(newName);
                                setCustomSecondaryCta(bulkLanguage === 'fr' ? `💬 Planifier un échange avec ${newName}` : `💬 Schedule a call with ${newName}`);
                              }}
                              className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-3 py-2 text-xs font-semibold bg-slate-50/50 transition"
                              placeholder="Anthony"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Primary Button CTA</label>
                            <input
                              type="text"
                              value={customPrimaryCta}
                              onChange={(e) => setCustomPrimaryCta(e.target.value)}
                              className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-3 py-2 text-xs font-semibold bg-slate-50/50 transition"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Secondary Link CTA</label>
                            <input
                              type="text"
                              value={customSecondaryCta}
                              onChange={(e) => setCustomSecondaryCta(e.target.value)}
                              className="w-full border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-slate-800 focus:outline-none rounded-lg px-3 py-2 text-xs font-semibold bg-slate-50/50 transition"
                            />
                          </div>
                        </div>

                        {/* Walkthrough GIF Upload / Override Section */}
                        <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2.5 mt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                              🎬 Attached Walkthrough GIF Video (Every Email)
                            </label>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                              Auto-Embedded
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                            Upload your local walkthrough GIF/video file or paste a direct GIF link. It will automatically host and embed into all real estate outreach emails.
                          </p>

                          <div className="flex flex-col sm:flex-row items-center gap-2.5">
                            {/* File Upload Button */}
                            <label className="w-full sm:w-auto px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0">
                              <Zap size={14} />
                              {isUploadingGif ? 'Uploading File...' : '📁 Upload Local GIF / Video File'}
                              <input
                                type="file"
                                accept="image/gif,image/png,image/jpeg,video/mp4"
                                className="hidden"
                                disabled={isUploadingGif}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setIsUploadingGif(true);
                                  try {
                                    // 1. First convert file to Base64 Data URL so it is 100% persistent locally & embedded
                                    const base64Url = await new Promise<string>((resolve, reject) => {
                                      const reader = new FileReader();
                                      reader.onload = () => resolve(reader.result as string);
                                      reader.onerror = reject;
                                      reader.readAsDataURL(file);
                                    });

                                    let finalUrl = base64Url;

                                    // 2. Try uploading to ImgBB CDN for a permanent hosted URL (expires: never)
                                    try {
                                      const imgbbData = new FormData();
                                      imgbbData.append('image', file);
                                      const imgbbRes = await fetch('https://api.imgbb.com/1/upload?key=6d0029c0b04250462719213192243dbe', {
                                        method: 'POST',
                                        body: imgbbData
                                      });
                                      const imgbbJson = await imgbbRes.json();
                                      if (imgbbJson?.data?.url) {
                                        finalUrl = imgbbJson.data.url;
                                      }
                                    } catch (imgbbErr) {
                                      console.warn('ImgBB upload fallback to Base64:', imgbbErr);
                                    }

                                    // 3. Save permanent URL to state & localStorage
                                    setCustomGifUrl(finalUrl);
                                    localStorage.setItem('assix_custom_gif_url', finalUrl);
                                    showNotification('Permanent GIF link saved! It will stay forever across all sessions.');
                                  } catch (err: any) {
                                    showNotification(`Upload error: ${err.message}`);
                                  } finally {
                                    setIsUploadingGif(false);
                                  }
                                }}
                              />
                            </label>

                            {/* Direct URL Input */}
                            <div className="flex-1 w-full">
                              <input
                                type="text"
                                value={customGifUrl}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCustomGifUrl(val);
                                  localStorage.setItem('assix_custom_gif_url', val);
                                }}
                                placeholder="https://.../my_walkthrough.gif or uploaded URL"
                                className="w-full border border-emerald-300 focus:border-emerald-500 focus:bg-white text-slate-900 focus:outline-none rounded-xl px-3 py-1.5 text-xs font-mono bg-white shadow-xs"
                              />
                            </div>
                          </div>

                          {/* Active GIF Live Thumbnail Preview */}
                          {customGifUrl && (
                            <div className="flex items-center gap-3 pt-1 border-t border-emerald-200/60">
                              <img
                                src={customGifUrl}
                                alt="Walkthrough GIF Preview"
                                className="w-20 h-14 object-cover rounded-lg border border-emerald-300 shadow-xs shrink-0 bg-slate-900"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                              <div className="text-[10px] text-slate-600 font-mono truncate flex-1">
                                <span className="font-bold text-emerald-800 block font-sans text-xs">Active Embedded GIF Link:</span>
                                <span className="truncate block font-semibold text-slate-700">{customGifUrl}</span>
                              </div>
                            </div>
                          )}

                          {/* Customizable GIF Header & Category Badge Text */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 border-t border-emerald-200/80">
                            <div>
                              <label className="text-[10px] font-extrabold text-emerald-950 uppercase block mb-1">
                                🎬 GIF Category Badge Text
                              </label>
                              <input
                                type="text"
                                value={customGifBadge}
                                onChange={(e) => setCustomGifBadge(e.target.value)}
                                placeholder="e.g. CONCEPTION WEB PERSONNALISÉE UNIQUE"
                                className="w-full border border-emerald-300 focus:border-emerald-500 focus:bg-white text-slate-900 focus:outline-none rounded-xl px-3 py-1.5 text-xs font-semibold bg-white shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-extrabold text-emerald-950 uppercase block mb-1">
                                📌 GIF Headline Title Text
                              </label>
                              <input
                                type="text"
                                value={customGifTitle}
                                onChange={(e) => setCustomGifTitle(e.target.value)}
                                placeholder="e.g. Aperçu Animé de Votre Nouveau Site Web"
                                className="w-full border border-emerald-300 focus:border-emerald-500 focus:bg-white text-slate-900 focus:outline-none rounded-xl px-3 py-1.5 text-xs font-semibold bg-white shadow-xs"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Interactive Animation Toggles Section */}
                        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 mt-3 text-slate-200 shadow-xs">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                              ⚡ Interactive Section Animation Toggles
                            </label>
                            <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded border border-slate-700">
                              CSS Animations
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* WhatsApp Animation Toggle */}
                            <label className={`flex items-center gap-3 p-2.5 rounded-lg border transition cursor-pointer ${hideWhatsAppAnimation ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-emerald-950/40 border-emerald-700/50 text-slate-100'}`}>
                              <input
                                type="checkbox"
                                checked={hideWhatsAppAnimation}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setHideWhatsAppAnimation(val);
                                  localStorage.setItem('assix_hide_whatsapp_anim', String(val));
                                }}
                                className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                              />
                              <div className="text-xs font-semibold leading-tight">
                                <span className="block font-extrabold text-white">Remove WhatsApp Chatbot Animation</span>
                                <span className="text-[10px] text-slate-400 font-normal">Hides the simulated WhatsApp mobile conversation section</span>
                              </div>
                            </label>

                            {/* Auto Email Writer Animation Toggle */}
                            <label className={`flex items-center gap-3 p-2.5 rounded-lg border transition cursor-pointer ${hideEmailAutoAnimation ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-emerald-950/40 border-emerald-700/50 text-slate-100'}`}>
                              <input
                                type="checkbox"
                                checked={hideEmailAutoAnimation}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setHideEmailAutoAnimation(val);
                                  localStorage.setItem('assix_hide_email_auto_anim', String(val));
                                }}
                                className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                              />
                              <div className="text-xs font-semibold leading-tight">
                                <span className="block font-extrabold text-white">Remove Email Auto Writing Animation</span>
                                <span className="text-[10px] text-slate-400 font-normal">Hides the simulated mini inbox typewriter email block</span>
                              </div>
                            </label>

                            {/* AI Instant Quote Engine Animation Toggle */}
                            <label className={`flex items-center gap-3 p-2.5 rounded-lg border transition cursor-pointer ${hideQuoteAnimation ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-emerald-950/40 border-emerald-700/50 text-slate-100'}`}>
                              <input
                                type="checkbox"
                                checked={hideQuoteAnimation}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setHideQuoteAnimation(val);
                                  localStorage.setItem('assix_hide_quote_anim', String(val));
                                }}
                                className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                              />
                              <div className="text-xs font-semibold leading-tight">
                                <span className="block font-extrabold text-white">Remove AI Quote Generator Section</span>
                                <span className="text-[10px] text-slate-400 font-normal">Hides the simulated AI instant quote & deposit block</span>
                              </div>
                            </label>

                            {/* Proof Section Toggle */}
                            <label className={`flex items-center gap-3 p-2.5 rounded-lg border transition cursor-pointer ${hideProofSection ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-emerald-950/40 border-emerald-700/50 text-slate-100'}`}>
                              <input
                                type="checkbox"
                                checked={hideProofSection}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setHideProofSection(val);
                                  localStorage.setItem('assix_hide_proof_section', String(val));
                                }}
                                className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                              />
                              <div className="text-xs font-semibold leading-tight">
                                <span className="block font-extrabold text-white">Remove Proof Section</span>
                                <span className="text-[10px] text-slate-400 font-normal">Hides the social proof and metric showcase block</span>
                              </div>
                            </label>

                            {/* Notre Methode Section Toggle */}
                            <label className={`flex items-center gap-3 p-2.5 rounded-lg border transition cursor-pointer ${hideNotreMethode ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-emerald-950/40 border-emerald-700/50 text-slate-100'}`}>
                              <input
                                type="checkbox"
                                checked={hideNotreMethode}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setHideNotreMethode(val);
                                  localStorage.setItem('assix_hide_notre_methode', String(val));
                                }}
                                className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                              />
                              <div className="text-xs font-semibold leading-tight">
                                <span className="block font-extrabold text-white">Remove Notre Méthode Section</span>
                                <span className="text-[10px] text-slate-400 font-normal">Hides the 3-step explanation bubble section</span>
                              </div>
                            </label>
                          </div>

                          {/* Custom Quote Total Override Input */}
                          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                              <span>💰 Custom Quote Total Amount Override:</span>
                            </label>
                            <input
                              type="text"
                              value={customQuoteAmount}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomQuoteAmount(val);
                                localStorage.setItem('assix_custom_quote_amount', val);
                              }}
                              placeholder="e.g. 2,850 € TTC or $2,400"
                              className="w-full sm:w-64 border border-slate-700 bg-slate-950 focus:border-emerald-500 text-emerald-300 focus:outline-none rounded-lg px-3 py-1 text-xs font-mono font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={handleSaveTemplateEdits}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Check size={13} className="text-emerald-400" /> Save Template Edits
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleSaveTemplateEdits();
                            setBulkModalTab('preview');
                          }}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                        >
                          <Eye size={13} /> View in Live Preview ↗
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer Launch Action Bar */}
              <div className="pt-3.5 border-t border-slate-200 shrink-0 flex items-center justify-between gap-3 select-none">
                <div className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 hidden sm:block">
                  Niche: <strong className="text-emerald-600 capitalize font-mono">{selectedNiche.replace('_', ' ')}</strong> ({bulkLanguage.toUpperCase()})
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {bulkModalTab !== 'preview' && (
                    <button
                      type="button"
                      onClick={() => setBulkModalTab('preview')}
                      className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye size={13} className="text-emerald-500" /> Preview Email
                    </button>
                  )}

                  {bulkModalTab !== 'edit' && (
                    <button
                      type="button"
                      onClick={() => setBulkModalTab('edit')}
                      className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 size={13} className="text-amber-500" /> Edit Content
                    </button>
                  )}

                  {isBulkRunning ? (
                    <button
                      type="button"
                      onClick={handleCancelBulkCampaign}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-[10px] tracking-widest uppercase rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                    >
                      <StopCircle size={15} />
                      Cancel ({bulkProgress.current} / {bulkProgress.total})
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRunBulkCampaign}
                      disabled={selectedBulkLeadIds.length === 0}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] tracking-widest uppercase rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Rocket size={14} />
                      Launch Campaign ({selectedBulkLeadIds.length} Leads)
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Accountant Onboarding Interactive Modal */}
      <AccountantOnboardingModal
        isOpen={showAccountantModal}
        onClose={() => setShowAccountantModal(false)}
        companyName={activeLead?.company || 'Cabinet Fiduciaire Exemple'}
        isLight={isLight}
        initialViewMode={accountantModalInitialView}
      />

    </div>
  );
};
