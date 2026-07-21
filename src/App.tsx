import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Terminal, 
  History, 
  Eye, 
  Activity, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Sliders, 
  Database, 
  Save, 
  Zap, 
  Send, 
  Paperclip, 
  Globe, 
  Phone, 
  ShieldAlert, 
  Check, 
  FileText, 
  Instagram, 
  MessageSquare,
  EyeOff,
  Trash2,
  Video,
  LayoutGrid,
  List,
  Mail,
  Bookmark,
  Menu,
  Sparkles,
  ChevronDown,
  Briefcase,
  Sun,
  Moon
} from 'lucide-react';
import { Task, Lead, LogEntry, ChatMessage, Session } from './types';
import { io, Socket } from 'socket.io-client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { LeadCard } from './components/LeadCard';
import { SwipeableTaskItem } from './components/SwipeableTaskItem';
import { AgencyTab } from './components/AgencyTab';
import { 
  startLinkedInSession, 
  searchLinkedIn, 
  connectProfile, 
  getOutreachInbox,
  getLinkedInMe,
  searchPosts,
  getContactInfo
} from './services/linkedInOutreach';
import { runGapAnalysis, generatePitch } from './services/gapAnalysisAgent';

// Dynamic server paths for development context
const getBackendUrl = (): string => {
  if ((import.meta as any).env.VITE_SERVER_URL) {
    return (import.meta as any).env.VITE_SERVER_URL;
  }
  const saved = localStorage.getItem('assix_server_url');
  if (saved && (saved.startsWith('http://') || saved.startsWith('https://'))) {
    // If the saved URL is localhost but the current environment is remote/cloud, bypass it to avoid Failed to fetch
    const isLocalhost = saved.includes('localhost') || saved.includes('127.0.0.1');
    const isCurrentLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost || isCurrentLocal) {
      return saved;
    }
  }
  return window.location.origin;
};

const SERVER = getBackendUrl();
const getWsUrlFromUrl = (urlStr: string) => {
  try {
    const u = new URL(urlStr);
    const proto = u.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${u.host}`;
  } catch (e) {
    return (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host;
  }
};
const WS_URL = getWsUrlFromUrl(SERVER);

const TASK_TYPES = [
  { id: 'google_maps_scrape', label: 'Google Maps Scrape', desc: 'Scan local listings for website, phone, and coordinates' },
  { id: 'pages_jaunes_scrape', label: 'Pages Jaunes Scrape', desc: 'Extract Canadian/French B2B directory prospects' },
  { id: 'instagram_discovery', label: 'Instagram Discovery', desc: 'Discover niche handles, scrap post content, and extract high-intent lead comments' },
  { id: 'facebook_ads_scrape', label: 'Facebook Ads Scrape', desc: 'Scrape and analyze Facebook Ads Library for active ads' },
  { id: 'facebook_groups_scrape', label: 'Facebook Groups Scrape', desc: 'Search and extract prospect leads from Facebook Group posts' },
  { id: 'instagram_dm', label: 'Instagram DM Campaign', desc: 'Auto-pilot outreach to targeted IG influencers/brands' },
  { id: 'whatsapp_outreach', label: 'WhatsApp Outreach', desc: 'Bulk delivery of personalized WhatsApp followups' },
  { id: 'market_research', label: 'Market Research', desc: 'Scrape Reddit/Google/Yelp for customer feedback analysis' },
  { id: 'dynamic', label: 'Custom Task (AI Planned)', desc: 'AI transforms your plain English brief into browser micro-steps' },
];

const NICHES = ['plumber', 'electrician', 'roofer', 'locksmith', 'salon', 'nail salon', 'cleaning service', 'restaurant', 'landscaper', 'painter', 'traiteur'];
const CITIES_EN = ['Toronto', 'Mississauga', 'Brampton', 'Hamilton', 'Ottawa', 'London ON', 'Kitchener', 'Calgary', 'Edmonton', 'Vancouver', 'Surrey'];
const CITIES_FR = ['Montreal', 'Quebec City', 'Laval', 'Longueuil', 'Gatineau', 'Sherbrooke', 'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice'];
const PLATFORMS = ['reddit', 'google', 'youtube', 'yelp', 'trustpilot'];

let socket: Socket = io(SERVER, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

let currentSocketUrl = SERVER;
const wsUrl = getWsUrlFromUrl(SERVER);

interface LiveViewerProps {
  taskId: string;
  ws?: WebSocket | null;
  onComplete?: (data: any) => void;
  onError?: (error: string) => void;
  serverUrl?: string;
  useFirestore?: boolean;
  steelDebugUrl?: string;
}

const LiveViewer: React.FC<LiveViewerProps> = ({ taskId, onComplete, onError, serverUrl = window.location.origin, useFirestore, steelDebugUrl }) => {
  const [status, setStatus] = useState<
    'idle' | 'planning' | 'running' | 'intervention' | 'complete' | 'completed' | 'error' | 'failed' | 'reconnecting'
  >('idle');
  const [step, setStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [intervention, setIntervention] = useState<any>(null);
  const [code, setCode] = useState<string>('');
  const [liveViewUrl, setLiveViewUrl] = useState<string>('');
  const [isStealth, setIsStealth] = useState<boolean>(false);
  const [firestoreSteelDebugUrl, setFirestoreSteelDebugUrl] = useState<string>('');
  const [leadsCount, setLeadsCount] = useState<number>(0);
  const [screenshot, setScreenshot] = useState<string>('');
  const [browserId, setBrowserId] = useState<string>('');
  const [liveView, setLiveView] = useState<string>('');
  const [viewMode, setViewMode] = useState<'screenshot' | 'iframe'>('screenshot');
  const [fitMode, setFitMode] = useState<'fit' | 'full'>('fit');
  const [zoom, setZoom] = useState<number>(100);

  // AI Copilot States
  const [copilotExpanded, setCopilotExpanded] = useState<boolean>(true);
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);
  const [copilotAnalysis, setCopilotAnalysis] = useState<string>('');
  const [copilotRecommendation, setCopilotRecommendation] = useState<string>('');
  const [copilotConfidence, setCopilotConfidence] = useState<string>('');
  const [copilotError, setCopilotError] = useState<string>('');
  const [stepExecuting, setStepExecuting] = useState<boolean>(false);
  const [stepResult, setStepResult] = useState<string>('');
  
  const [copilotTab, setCopilotTab] = useState<'suggest' | 'chat'>('chat');
  const [copilotChat, setCopilotChat] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: "Hello! I am your AI Copilot. I analyze the active browser screen and suggest automated actions. Type below to ask me anything or instruct me!" }
  ]);
  const [copilotMsgInput, setCopilotMsgInput] = useState<string>('');
  const [copilotChatSending, setCopilotChatSending] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string>('');

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(prev => prev === key ? '' : prev);
    }, 1500);
  };

  const handleAnalyzePage = async () => {
    if (!taskId) return;
    setCopilotLoading(true);
    setCopilotError('');
    setCopilotAnalysis('');
    setCopilotRecommendation('');
    setCopilotConfidence('');
    setStepResult('');
    try {
      const res = await fetch(`${serverUrl}/api/task/${taskId}/analyze-screenshot`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }
      const data = await res.json();
      setCopilotAnalysis(data.analysis || 'Page analyzed.');
      setCopilotRecommendation(data.recommendation || '');
      setCopilotConfidence(data.confidence || 'medium');
      if (data.screenshot) {
        setScreenshot(`data:image/jpeg;base64,${data.screenshot}`);
      }
    } catch (err: any) {
      console.error('Failed to analyze page with Gemini:', err);
      setCopilotError(err.message || 'Failed to analyze page. Make sure the browser session is active.');
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleExecuteStep = async () => {
    if (!taskId || !copilotRecommendation) return;
    setStepExecuting(true);
    setCopilotError('');
    setStepResult('');
    try {
      const res = await fetch(`${serverUrl}/api/task/${taskId}/apply-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stepText: copilotRecommendation })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }
      const data = await res.json();
      setStepResult('Step successfully executed!');
      
      // Instantly trigger screenshot update in 2.5 seconds
      setTimeout(async () => {
        try {
          const freshRes = await fetch(`${serverUrl}/api/screenshot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ browserId, taskId })
          });
          if (freshRes.ok) {
            const freshData = await freshRes.json();
            if (freshData.screenshot) {
              setScreenshot(freshData.screenshot.startsWith('data:') ? freshData.screenshot : `data:image/png;base64,${freshData.screenshot}`);
            }
          }
        } catch (e) {}
      }, 2500);
    } catch (err: any) {
      console.error('Failed to execute guided step:', err);
      setCopilotError(err.message || 'Guided step execution failed.');
    } finally {
      setStepExecuting(false);
    }
  };

  const handleSendCopilotMessage = async () => {
    if (!taskId || !copilotMsgInput.trim() || copilotChatSending) return;
    const msgText = copilotMsgInput.trim();
    setCopilotMsgInput('');
    setCopilotChat(prev => [...prev, { role: 'user', text: msgText }]);
    setCopilotChatSending(true);

    try {
      const res = await fetch(`${serverUrl}/api/task/${taskId}/copilot-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: msgText,
          history: copilotChat
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.reply) {
        setCopilotChat(prev => [...prev, { role: 'assistant', text: data.reply }]);
      }
      if (data.suggestion) {
        setCopilotRecommendation(data.suggestion);
        setCopilotTab('suggest');
      }
    } catch (err: any) {
      console.error('Failed to chat with Copilot:', err);
      setCopilotChat(prev => [...prev, { role: 'assistant', text: `Error: ${err.message || 'Failed to send message.'}` }]);
    } finally {
      setCopilotChatSending(false);
    }
  };

  const setTaskStatus = setStatus as any;
  const appendLog = (message: string) => {
    console.log('[LiveViewer Task Update]', message);
  };

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "browserbase-disconnected") {
        if (statusRef.current === 'running') {
          setStatus("reconnecting");
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Polling screenshot every 3 seconds during active task
  useEffect(() => {
    if ((!browserId && !taskId) || (status !== 'running' && status !== 'intervention')) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${serverUrl}/api/screenshot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ browserId, taskId })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.screenshot) {
            const src = data.screenshot.startsWith('data:') 
              ? data.screenshot 
              : `data:image/png;base64,${data.screenshot}`;
            setScreenshot(src);
          }
        }
      } catch (err) {
        console.error('Failed to poll screenshot:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [browserId, taskId, status, serverUrl]);

  useEffect(() => {
    if (!taskId) return;

    setStatus('idle');
    setIntervention(null);
    setCode('');
    setStep(0);
    setTotalSteps(0);
    setDescription('');
    setLiveViewUrl('');
    setLeadsCount(0);
    setScreenshot('');
    setBrowserId('');

    if (useFirestore) {
      let unsubscribe: (() => void) | null = null;
      let pollIntervalId: any = null;

      const pollStatus = () => {
        fetch(`${serverUrl}/api/task/${taskId}/status`)
          .then(res => {
            if (res.ok) return res.json();
            throw new Error();
          })
          .then(data => {
            if (data && data.task) {
              const taskObj = data.task;
              if (taskObj.status) {
                setStatus(taskObj.status);
              }
              if (taskObj.useStealth !== undefined) {
                setIsStealth(!!taskObj.useStealth);
              } else if (taskId && taskId.toLowerCase().includes('stealth')) {
                setIsStealth(true);
              }
              if (taskObj.step !== undefined) {
                setStep(typeof taskObj.step === 'number' ? taskObj.step : parseInt(taskObj.step) || 0);
              }
              if (taskObj.description !== undefined) {
                setDescription(taskObj.description || '');
              }
              if (taskObj.screenshot) {
                const src = taskObj.screenshot.startsWith('data:') 
                  ? taskObj.screenshot 
                  : `data:image/png;base64,${taskObj.screenshot}`;
                setScreenshot(src);
                setLiveView(src);
              }
              if (taskObj.steelDebugUrl) {
                setFirestoreSteelDebugUrl(taskObj.steelDebugUrl);
                setLiveViewUrl(taskObj.steelDebugUrl);
              } else if (taskObj.liveViewUrl) {
                setLiveViewUrl(taskObj.liveViewUrl);
              }
              if (taskObj.leadsCount !== undefined) {
                setLeadsCount(taskObj.leadsCount);
              } else if (taskObj.results?.saved !== undefined) {
                setLeadsCount(taskObj.results.saved);
              } else if (taskObj.results?.leads && Array.isArray(taskObj.results.leads)) {
                setLeadsCount(taskObj.results.leads.length);
              }
            }
          })
          .catch(() => {});
      };

      pollStatus();
      pollIntervalId = setInterval(pollStatus, 3000);

      fetch(`${serverUrl}/api/firebase-config`)
        .then(res => res.json())
        .then(config => {
          let app;
          if (getApps().length === 0) {
            app = initializeApp(config);
          } else {
            app = getApp();
          }
          const db = getFirestore(app, config.firestoreDatabaseId || undefined);
          const handleDocSnap = (docSnap: any) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.status) {
                setStatus(data.status);
              }
              if (data.useStealth !== undefined) {
                setIsStealth(!!data.useStealth);
              } else if (taskId && taskId.toLowerCase().includes('stealth')) {
                setIsStealth(true);
              }
              if (data.step !== undefined) {
                setStep(typeof data.step === 'number' ? data.step : parseInt(data.step) || 0);
              }
              if (data.description !== undefined) {
                setDescription(data.description || '');
              }
              if (data.screenshot) {
                const src = data.screenshot.startsWith('data:') 
                  ? data.screenshot 
                  : `data:image/png;base64,${data.screenshot}`;
                setScreenshot(src);
                setLiveView(src);
              }
              if (data.steelDebugUrl) {
                setFirestoreSteelDebugUrl(data.steelDebugUrl);
                setLiveViewUrl(data.steelDebugUrl);
              } else if (data.liveViewUrl) {
                setLiveViewUrl(data.liveViewUrl);
              }
              if (data.leadsCount !== undefined) {
                setLeadsCount(data.leadsCount);
              } else if (data.results?.saved !== undefined) {
                setLeadsCount(data.results.saved);
              } else if (data.results?.leads && Array.isArray(data.results.leads)) {
                setLeadsCount(data.results.leads.length);
              }

              if (data.status === 'complete' || data.status === 'completed') {
                if (onComplete) onComplete(data);
              } else if (data.status === 'failed' || data.status === 'error') {
                if (onError) onError(data.description || 'Task failed');
              }
            }
          };

          const unsubAssix = onSnapshot(doc(db, 'assix_tasks', taskId), handleDocSnap);
          const unsubTasks = onSnapshot(doc(db, 'tasks', taskId), handleDocSnap);

          unsubscribe = () => {
            unsubAssix();
            unsubTasks();
          };
        })
        .catch(err => console.error("Failed to load Firebase config for LiveViewer:", err));
    } else {
      // Fetch initial task state (including liveViewUrl/browserId if it already exists)
      fetch(`${serverUrl}/api/task/${taskId}/status`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Not found');
        })
        .then(data => {
          if (data.task) {
            setStatus(data.task.status);
            if (data.task.useStealth !== undefined) {
              setIsStealth(!!data.task.useStealth);
            } else if (taskId && taskId.toLowerCase().includes('stealth')) {
              setIsStealth(true);
            }
            if (data.task.liveViewUrl) {
              setLiveViewUrl(data.task.liveViewUrl);
            }
            if (data.task.browserId) {
              setBrowserId(data.task.browserId);
            }
            if (data.task.progress) {
              setStep(data.task.progress);
            }
          }
        })
        .catch(() => {});
    }

    // Connect to WebSocket room and establish listeners unconditionally
    socket.emit('join_task', taskId);

    const onTaskStatus = (data: any) => {
      setStatus(data.status);
      setDescription(data.message || '');
      if (data.useStealth !== undefined) {
        setIsStealth(!!data.useStealth);
      } else if (taskId && taskId.toLowerCase().includes('stealth')) {
        setIsStealth(true);
      }
      if (data.liveViewUrl) {
        setLiveViewUrl(data.liveViewUrl);
      }
      if (data.browserId) {
        setBrowserId(data.browserId);
      }
    };

    const onTaskPlanned = (data: any) => {
      setTotalSteps(data.totalSteps);
      setStatus('running');
    };

    const onTaskProgress = (data: any) => {
      if (data.step !== undefined) {
        setStep(data.step);
      }
      if (data.description !== undefined) {
        setDescription(data.description || '');
      }
      setStatus('running');
      if (data.useStealth !== undefined) {
        setIsStealth(!!data.useStealth);
      } else if (data.data?.useStealth !== undefined) {
        setIsStealth(!!data.data.useStealth);
      } else if (taskId && taskId.toLowerCase().includes('stealth')) {
        setIsStealth(true);
      }
      if (data.data?.liveViewUrl) {
        setLiveViewUrl(data.data.liveViewUrl);
      }
      if (data.browserId || data.data?.browserId) {
        setBrowserId(data.browserId || data.data.browserId);
      }
      if (data.screenshot || data.data?.screenshot) {
        const rawScreenshot = data.screenshot || data.data.screenshot;
        const src = rawScreenshot.startsWith('data:') 
          ? rawScreenshot 
          : `data:image/png;base64,${rawScreenshot}`;
        setScreenshot(src);
      }
    };

    const onTaskUpdate = (update: any) => {
      if (update.message) {
        appendLog(update.message);
      }
      if (update.screenshot) {
        setLiveView(
          `data:image/png;base64,${update.screenshot}`
        );
      }
      if (update.status === 'done') {
        setStatus('complete');
      }
      if (update.status === 'failed') {
        setStatus('error');
      }
    };

    const onHumanNeeded = (data: any) => {
      setStatus('intervention');
      setIntervention(data);
    };

    const onTaskComplete = (data: any) => {
      setStatus('completed');
      if (data?.results?.saved !== undefined) {
        setLeadsCount(data.results.saved);
      } else if (data?.results?.leads && Array.isArray(data.results.leads)) {
        setLeadsCount(data.results.leads.length);
      } else if (data?.results?.results && Array.isArray(data.results.results)) {
        setLeadsCount(data.results.results.length);
      }
      if (onComplete) onComplete(data);
    };

    const onTaskError = (data: any) => {
      setStatus('failed');
      setDescription(data.error || 'Unknown error occurred');
      if (onError) onError(data.error);
    };

    socket.on('task_status', onTaskStatus);
    socket.on('task_planned', onTaskPlanned);
    socket.on('task_progress', onTaskProgress);
    socket.on('task_update', onTaskUpdate);
    socket.on('human_needed', onHumanNeeded);
    socket.on('task_complete', onTaskComplete);
    socket.on('task_error', onTaskError);

    return () => {
      socket.off('task_status', onTaskStatus);
      socket.off('task_planned', onTaskPlanned);
      socket.off('task_progress', onTaskProgress);
      socket.off('task_update', onTaskUpdate);
      socket.off('human_needed', onHumanNeeded);
      socket.off('task_complete', onTaskComplete);
      socket.off('task_error', onTaskError);
    };
  }, [taskId, onComplete, onError, serverUrl, useFirestore]);

  useEffect(() => {
    if ((status === 'complete' || status === 'completed') && taskId) {
      fetch(`${serverUrl}/api/task/${taskId}/status`)
        .then(res => res.json())
        .then(data => {
          if (data?.task?.totalFound !== undefined) {
            setLeadsCount(data.task.totalFound);
          }
        })
        .catch(() => {});
    }
  }, [status, taskId, serverUrl]);

  const handleResume = () => {
    socket.emit('resume_task', {
      taskId,
      data: intervention?.interventionType === '2fa' ? { code } : {}
    });
    setIntervention(null);
    setStatus('running');
  };

  useEffect(() => {
    if (steelDebugUrl) {
      setLiveViewUrl(steelDebugUrl);
    }
  }, [steelDebugUrl]);

  useEffect(() => {
    if (!isStealth) {
      setViewMode('screenshot');
    }
  }, [isStealth]);

  // Clear recommendations and errors when the step progresses to trigger a fresh analysis for the new page state
  useEffect(() => {
    setCopilotRecommendation('');
    setCopilotAnalysis('');
    setCopilotConfidence('');
    setCopilotError('');
  }, [step, taskId]);

  // Auto-analyze page when we don't have recommendations yet and the agent is running
  useEffect(() => {
    if (taskId && !copilotRecommendation && !copilotLoading && !copilotError && status === 'running') {
      const timer = setTimeout(() => {
        handleAnalyzePage();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [taskId, copilotRecommendation, copilotLoading, copilotError, status, step]);

  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full max-w-[1300px] mx-auto p-4 items-center lg:items-start justify-center">
      {/* Left Column: Live Browser Box */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        borderRadius: '8px',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '600px',
        aspectRatio: '1 / 1',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        alignSelf: 'flex-start',
        flexShrink: 0
      }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid #111',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: '#555',
        letterSpacing: '0.1em'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {isStealth ? (
            <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>
              🕵️‍♂️ STEALTH BROWSER
            </span>
          ) : (
            <span>LIVE BROWSER</span>
          )}
          {liveViewUrl && (
            <div style={{ display: 'inline-flex', background: '#111', borderRadius: '4px', padding: '2px', border: '1px solid #222', gap: '2px' }}>
              <button
                onClick={() => setViewMode('screenshot')}
                style={{
                  background: viewMode === 'screenshot' ? '#22c55e' : 'transparent',
                  color: viewMode === 'screenshot' ? '#000' : '#888',
                  border: 'none',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                SCREENSHOTS
              </button>
              {isStealth && (
                <button
                  onClick={() => setViewMode('iframe')}
                  style={{
                    background: viewMode === 'iframe' ? '#3b82f6' : 'transparent',
                    color: viewMode === 'iframe' ? '#fff' : '#888',
                    border: 'none',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  INTERACTIVE
                </button>
              )}
            </div>
          )}
          {liveViewUrl && (
            <a 
              href={liveViewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: '#14532d',
                color: '#4ade80',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #16a34a',
                fontSize: '9px',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover:bg-[#166534] hover:text-[#4ade80]"
            >
              OPEN SESSION IN NEW TAB ↗
            </a>
          )}
        </div>
        {status === 'planning' && (
          <span style={{ color: '#3b82f6' }}>
            ● PLANNING
          </span>
        )}
        {status === 'running' && (
          <span style={{ color: '#22c55e' }}>
            ● LIVE — Progress {step}%
          </span>
        )}
        {status === 'intervention' && (
          <span style={{ color: '#f59e0b' }}>
            ⚠️ ACTION REQUIRED
          </span>
        )}
        {(status === 'complete' || status === 'completed') && (
          <span style={{ color: '#c9a84c' }}>
            ✓ COMPLETE
          </span>
        )}
        {(status === 'error' || status === 'failed') && (
          <span style={{ color: '#ef4444' }}>
            ✗ FAILED
          </span>
        )}
        {status === 'reconnecting' && (
          <span style={{ color: '#f59e0b' }}>
            ⚡ RECONNECTING
          </span>
        )}
      </div>

      {/* Live Frame */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', width: '100%', height: '100%' }}>

        {/* Content of the Live Frame */}
        {viewMode === 'iframe' && liveViewUrl ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ 
              background: isStealth ? '#1e1b4b' : '#1c1917', 
              borderBottom: isStealth ? '1px solid #312e81' : '1px solid #292524', 
              padding: '54px 14px 10px 14px', 
              fontSize: '10px', 
              color: isStealth ? '#818cf8' : '#f59e0b', 
              textAlign: 'center', 
              fontWeight: 'bold', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              {isStealth ? (
                <>
                  <span>🕵️‍♂️ ACTIVE STEALTH SESSION: Routed securely through Stealth Browser MCP (residential fingerprint-proof proxy nodes).</span>
                  <span>If third-party platforms block direct embedded viewports, click below to open the direct secure session console!</span>
                </>
              ) : (
                <span>⚠️ Browser security blocks cookies & session data inside embedded windows. If the viewer says "Signed Out" or prompts to log in, click below to open the session directly!</span>
              )}
              <a 
                href={liveViewUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  background: isStealth ? '#4f46e5' : '#d97706', 
                  color: '#fff', 
                  textDecoration: 'none', 
                  padding: '4px 12px', 
                  borderRadius: '4px', 
                  fontSize: '9px', 
                  fontWeight: 'bold', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                {isStealth ? 'Open Secure Stealth Console in New Tab ↗' : 'Open Interactive Session in New Tab ↗'}
              </a>
            </div>
            <iframe 
              src={liveViewUrl} 
              style={{ width: '100%', height: '100%', flex: 1, minHeight: '0', border: 'none', borderRadius: '0 0 8px 8px', background: '#000' }}
              title="Live Browser"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        ) : (liveView || screenshot) ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '58px 12px 12px 12px', gap: '8px', overflowY: 'auto' }}>
            {/* Zoom & Fit Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#121214', border: '1px solid #222', padding: '4px 10px', borderRadius: '6px', width: '100%', maxWidth: '400px', justifyContent: 'space-between', marginBottom: '4px', zIndex: 10 }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setFitMode('fit')}
                  style={{
                    background: fitMode === 'fit' ? '#7C5335' : 'transparent',
                    color: fitMode === 'fit' ? '#fff' : '#888',
                    border: 'none',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  FIT SCREEN
                </button>
                <button
                  onClick={() => setFitMode('full')}
                  style={{
                    background: fitMode === 'full' ? '#7C5335' : 'transparent',
                    color: fitMode === 'full' ? '#fff' : '#888',
                    border: 'none',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  FULL SIZE (SCROLL)
                </button>
              </div>
              {fitMode === 'full' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    style={{ background: '#222', border: 'none', color: '#ccc', width: '18px', height: '18px', borderRadius: '3px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '9px', color: '#aaa', minWidth: '28px', textAlign: 'center' }}>{zoom}%</span>
                  <button
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                    style={{ background: '#222', border: 'none', color: '#ccc', width: '18px', height: '18px', borderRadius: '3px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            <img 
              src={liveView || screenshot} 
              style={{ 
                width: fitMode === 'fit' ? '100%' : `${zoom}%`, 
                maxWidth: fitMode === 'fit' ? '100%' : 'none', 
                maxHeight: fitMode === 'fit' ? 'calc(100% - 60px)' : 'none', 
                objectFit: 'contain', 
                borderRadius: '8px', 
                border: '1px solid #222' 
              }}
              alt="Live browser view"
            />
            <div style={{ fontSize: '9px', color: '#777', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '450px' }}>
              <span>Streaming live browser screenshots. No sign-in or cookies required!</span>
              {liveViewUrl && (
                <span style={{ color: '#10B981' }}>
                  Want to control the browser? click <strong>"OPEN SESSION IN NEW TAB"</strong> above!
                </span>
              )}
            </div>
          </div>
        ) : (status === 'complete' || status === 'completed') ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10B981',
            fontFamily: 'inherit',
            textAlign: 'center',
            padding: '24px',
            background: '#0c0c0c',
            width: '100%',
            height: '100%',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f5f5f5', marginBottom: '8px' }}>Task Complete</div>
            <div style={{ fontSize: '13px', color: '#a1a1aa' }}>
              {leadsCount || 0} leads found and saved securely to Firestore.
            </div>
          </div>
        ) : (status === 'error' || status === 'failed') ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
            fontFamily: 'inherit',
            textAlign: 'center',
            padding: '24px',
            background: '#0c0c0c',
            width: '100%',
            height: '100%',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✗</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f5f5f5', marginBottom: '8px' }}>Task Failed</div>
            <div style={{ fontSize: '13px', color: '#a1a1aa' }}>
              {description || 'An error occurred during task execution.'}
            </div>
          </div>
        ) : (
          /* Idle / Planning state */
          <div style={{
            width: '100%',
            height: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#444',
            fontSize: '13px',
            gap: '8px'
          }}>
            {status === 'planning' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7C5335]" />
                <span>AI is planning the automation steps...</span>
              </>
            ) : (
              <span>Enter a task to begin</span>
            )}
          </div>
        )}

        {/* Reconnecting overlay */}
        {status === 'reconnecting' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#0a0a0acc',
            border: '1px solid #1a1a1a',
            color: '#f0ece4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 60
          }}>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#c9a84c] mb-4" />
            <p style={{ fontSize: '13px', fontWeight: 'bold' }}>Reconnecting...</p>
            <p style={{ fontSize: '11px', color: '#666', marginTop: '4px', marginBottom: '16px' }}>Lost connection to the remote browser</p>
            <button
              onClick={handleResume}
              style={{
                padding: '10px 20px',
                background: '#c9a84c',
                color: '#080808',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.1em',
                cursor: 'pointer'
              }}
            >
              ▶ RESUME AGENT
            </button>
          </div>
        )}

        {/* Intervention overlay */}
        {intervention && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#000000cc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 50
          }}>
            <div style={{
              background: '#0f0f0f',
              border: '1px solid #c9a84c30',
              borderRadius: '8px',
              padding: '20px',
              width: '100%',
              maxWidth: '300px'
            }}>
              <div style={{
                fontSize: '13px',
                color: '#c9a84c',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                {intervention.interventionType === 'login' && '⚠️ Login Required'}
                {intervention.interventionType === '2fa' && '🔐 2FA Verification'}
                {intervention.interventionType === 'captcha' && '🤖 Captcha Challenge'}
                {intervention.interventionType === 'generic' && '💡 Interaction Needed'}
              </div>
              <p style={{
                fontSize: '12px',
                color: '#888',
                marginBottom: '14px',
                lineHeight: '1.4'
              }}>
                {intervention.message}
              </p>

              {intervention.interventionType === '2fa' && (
                <input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  style={{
                    width: '100%',
                    background: '#111',
                    border: '1px solid #1e1e1e',
                    borderRadius: '4px',
                    padding: '10px',
                    color: '#f5f0e8',
                    fontSize: '18px',
                    textAlign: 'center',
                    letterSpacing: '0.3em',
                    marginBottom: '10px',
                    boxSizing: 'border-box'
                  }}
                />
              )}

              <button
                onClick={handleResume}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#c9a84c',
                  color: '#080808',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  cursor: 'pointer'
                }}
              >
                ▶ RESUME AGENT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar in the left column footer */}
      {status === 'running' && description && (
        <div style={{
          padding: '8px 14px',
          borderTop: '1px solid #111',
          fontSize: '11px',
          color: '#555',
          background: '#070707'
        }}>
          {description}
        </div>
      )}
    </div>

    {/* Right Column: Gemini AI-Guided Copilot Panel */}
    <div style={{
      flex: '1 1 0%',
      width: '100%',
      maxWidth: '450px',
      height: '600px',
      background: 'rgba(9, 9, 11, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      padding: '16px',
      boxSizing: 'border-box',
      position: 'relative',
      alignSelf: 'flex-start',
      flexShrink: 0
    }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1c1917',
          paddingBottom: '8px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#e4e4e7', letterSpacing: '0.05em' }}>AI-GUIDED COPILOT</span>
            <span style={{
              fontSize: '8px',
              background: '#1c1917',
              color: '#a1a1aa',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid #27272a'
            }}>POWERED BY GEMINI</span>
          </div>
          <button
            onClick={() => setCopilotExpanded(!copilotExpanded)}
            style={{
              background: 'transparent',
              color: '#888',
              border: 'none',
              cursor: 'pointer',
              fontSize: '10px',
              padding: '2px 6px'
            }}
          >
            {copilotExpanded ? 'Hide' : 'Show Suggestion'}
          </button>
        </div>

        {copilotExpanded && (
          <div style={{ display: 'flex', gap: '4px', background: '#1c1917', padding: '3px', borderRadius: '6px', flexShrink: 0 }}>
            <button
              onClick={() => setCopilotTab('chat')}
              style={{
                flex: 1,
                background: copilotTab === 'chat' ? '#27272a' : 'transparent',
                color: copilotTab === 'chat' ? '#fff' : '#a1a1aa',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 0',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              💬 COPILOT CHAT
            </button>
            <button
              onClick={() => setCopilotTab('suggest')}
              style={{
                flex: 1,
                background: copilotTab === 'suggest' ? '#27272a' : 'transparent',
                color: copilotTab === 'suggest' ? '#fff' : '#a1a1aa',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 0',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              💡 ACTIONS & TIPS
            </button>
          </div>
        )}

        {copilotExpanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {copilotTab === 'suggest' && (
              <>
                {!copilotRecommendation && !copilotLoading && !copilotError && (
                  <div style={{ textAlign: 'center', padding: '12px 6px' }}>
                    <p style={{ fontSize: '11px', color: '#71717a', marginBottom: '12px' }}>
                      Analyze the current page state with Gemini to get smart recommendations and custom next steps.
                    </p>
                    <button
                      onClick={handleAnalyzePage}
                      disabled={status === 'idle' || status === 'planning'}
                      style={{
                        background: '#f4f4f5',
                        color: '#09090b',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 14px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: (status === 'idle' || status === 'planning') ? 'not-allowed' : 'pointer',
                        opacity: (status === 'idle' || status === 'planning') ? 0.5 : 1,
                        transition: 'all 0.2s'
                      }}
                    >
                      Analyze Current Screen
                    </button>
                  </div>
                )}

                {copilotLoading && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div className="animate-bounce" style={{ width: '6px', height: '6px', background: '#e4e4e7', borderRadius: '50%' }}></div>
                      <div className="animate-bounce" style={{ width: '6px', height: '6px', background: '#e4e4e7', borderRadius: '50%', animationDelay: '0.15s' }}></div>
                      <div className="animate-bounce" style={{ width: '6px', height: '6px', background: '#e4e4e7', borderRadius: '50%', animationDelay: '0.3s' }}></div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Gemini is analyzing page state...</span>
                  </div>
                )}

                {copilotError && (
                  <div style={{ background: '#1c1917', border: '1px solid #27272a', borderRadius: '6px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '11px', color: '#f4f4f5', margin: 0 }}>{copilotError}</p>
                    <button
                      onClick={handleAnalyzePage}
                      style={{
                        alignSelf: 'flex-start',
                        background: '#27272a',
                        color: '#e4e4e7',
                        border: '1px solid #3f3f46',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontSize: '9px',
                        cursor: 'pointer'
                      }}
                    >
                      Retry Analysis
                    </button>
                  </div>
                )}

                {copilotRecommendation && !copilotLoading && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {copilotAnalysis && (
                      <div style={{ background: '#09090b', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid #3b82f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '9px', color: '#60a5fa', fontWeight: 'bold' }}>GEMINI DIAGNOSIS:</span>
                          <button
                            onClick={() => handleCopyText(copilotAnalysis, 'diagnosis')}
                            style={{
                              background: '#18181b',
                              border: '1px solid #27272a',
                              color: '#a1a1aa',
                              fontSize: '8px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              transition: 'all 0.2s'
                            }}
                          >
                            {copiedKey === 'diagnosis' ? '✓ COPIED!' : '📋 COPY'}
                          </button>
                        </div>
                        <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>"{copilotAnalysis}"</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '9px', color: '#a1a1aa', fontWeight: 'bold' }}>EDIT & ADJUST STEP:</span>
                          <button
                            onClick={() => handleCopyText(copilotRecommendation, 'recommendation')}
                            style={{
                              background: '#18181b',
                              border: '1px solid #27272a',
                              color: '#a1a1aa',
                              fontSize: '8px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              transition: 'all 0.2s'
                            }}
                          >
                            {copiedKey === 'recommendation' ? '✓ COPIED!' : '📋 COPY'}
                          </button>
                        </div>
                        <span style={{
                          fontSize: '8px',
                          background: copilotConfidence === 'high' ? '#14532d' : copilotConfidence === 'medium' ? '#27272a' : '#7f1d1d',
                          color: copilotConfidence === 'high' ? '#4ade80' : copilotConfidence === 'medium' ? '#e4e4e7' : '#fca5a5',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          letterSpacing: '0.05em'
                        }}>
                          CONFIDENCE: {copilotConfidence.toUpperCase()}
                        </span>
                      </div>
                      <textarea
                        value={copilotRecommendation}
                        onChange={(e) => setCopilotRecommendation(e.target.value)}
                        style={{
                          width: '100%',
                          minHeight: '45px',
                          background: '#18181b',
                          border: '1px solid #27272a',
                          borderRadius: '6px',
                          color: '#f4f4f5',
                          fontSize: '11px',
                          fontFamily: 'inherit',
                          padding: '8px',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                          lineHeight: '1.4'
                        }}
                        placeholder="E.g. Click on search bar or type values..."
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button
                        onClick={handleExecuteStep}
                        disabled={stepExecuting || !copilotRecommendation}
                        style={{
                          flex: 1,
                          background: '#22c55e',
                          color: '#000',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: (stepExecuting || !copilotRecommendation) ? 'not-allowed' : 'pointer',
                          opacity: (stepExecuting || !copilotRecommendation) ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        {stepExecuting ? 'Executing Action...' : 'Apply & Execute Step'}
                      </button>
                      <button
                        onClick={handleAnalyzePage}
                        disabled={stepExecuting}
                        style={{
                          background: '#27272a',
                          color: '#e4e4e7',
                          border: '1px solid #3f3f46',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: stepExecuting ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Recalculate
                      </button>
                    </div>

                    {stepResult && (
                      <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', textAlign: 'center', marginTop: '2px' }}>
                        {stepResult}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {copilotTab === 'chat' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, justifyBetween: 'space-between', overflow: 'hidden' }}>
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '8px 4px',
                  boxSizing: 'border-box',
                  minHeight: 0
                }}>
                  {copilotChat.map((msg, idx) => (
                    <div 
                      key={idx}
                      style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.role === 'user' ? '#7C5335' : '#18181b',
                        color: msg.role === 'user' ? '#fff' : '#f4f4f5',
                        border: msg.role === 'user' ? 'none' : '1px solid #27272a',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '11px',
                        maxWidth: '85%',
                        wordBreak: 'break-word',
                        lineHeight: '1.4',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '9px', color: msg.role === 'user' ? '#ffd8a8' : '#a1a1aa', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {msg.role === 'user' ? 'You' : 'Copilot'}
                        </span>
                        <button
                          onClick={() => handleCopyText(msg.text, `chat-${idx}`)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: msg.role === 'user' ? '#ffd8a8' : '#a1a1aa',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: '1px 4px',
                            borderRadius: '4px',
                            opacity: 0.8
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
                        >
                          {copiedKey === `chat-${idx}` ? '✓ COPIED' : '📋 COPY'}
                        </button>
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                    </div>
                  ))}
                  {copilotChatSending && (
                    <div style={{ alignSelf: 'flex-start', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', color: '#a1a1aa', fontWeight: 'bold', textTransform: 'uppercase' }}>Copilot is thinking</span>
                      <div style={{ display: 'flex', gap: '2px', marginLeft: '4px' }}>
                        <div className="animate-bounce" style={{ width: '4px', height: '4px', background: '#a1a1aa', borderRadius: '50%' }}></div>
                        <div className="animate-bounce" style={{ width: '4px', height: '4px', background: '#a1a1aa', borderRadius: '50%', animationDelay: '0.15s' }}></div>
                        <div className="animate-bounce" style={{ width: '4px', height: '4px', background: '#a1a1aa', borderRadius: '50%', animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #1c1917', paddingTop: '8px', flexShrink: 0 }}>
                  <input
                    type="text"
                    value={copilotMsgInput}
                    onChange={(e) => setCopilotMsgInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendCopilotMessage();
                      }
                    }}
                    placeholder="Ask Copilot or request action..."
                    disabled={copilotChatSending || !taskId}
                    style={{
                      flex: 1,
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '6px',
                      color: '#f4f4f5',
                      fontSize: '11px',
                      fontFamily: 'inherit',
                      padding: '8px 10px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleSendCopilotMessage}
                    disabled={copilotChatSending || !copilotMsgInput.trim() || !taskId}
                    style={{
                      background: '#f4f4f5',
                      color: '#09090b',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0 12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: (copilotChatSending || !copilotMsgInput.trim() || !taskId) ? 'not-allowed' : 'pointer',
                      opacity: (copilotChatSending || !copilotMsgInput.trim() || !taskId) ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  // Navigation Tabs: 'workspace' | 'tasks' | 'leads' | 'history' | 'settings' | 'outreach' | 'sectors' | 'agency' | 'ig_discovery'
  const [tab, setTab] = useState<'workspace' | 'tasks' | 'leads' | 'history' | 'settings' | 'outreach' | 'sectors' | 'agency' | 'ig_discovery'>('workspace');
  
  // Instagram Discovery states
  const [discoverySessions, setDiscoverySessions] = useState<any[]>([]);
  const [selectedDiscoverySession, setSelectedDiscoverySession] = useState<any | null>(null);
  const [activeDiscoverySessionId, setActiveDiscoverySessionId] = useState<string>('');
  const [igNiche, setIgNiche] = useState<string>('luxury lifestyle');
  const [igMaxProfiles, setIgMaxProfiles] = useState<number>(5);
  const [igMaxPosts, setIgMaxPosts] = useState<number>(3);
  const [igMaxComments, setIgMaxComments] = useState<number>(10);
  const [isStartingDiscovery, setIsStartingDiscovery] = useState<boolean>(false);

  const fetchDiscoverySessions = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/instagram/sessions`);
      if (res.ok) {
        const data = await res.json();
        setDiscoverySessions(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch discovery sessions:", err);
    }
  };

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const res = await fetch(`${serverUrl}/api/instagram/session/${sessionId}/details`);
      if (res.ok) {
        const data = await res.json();
        setSelectedDiscoverySession(data);
      }
    } catch (err) {
      console.error("Failed to fetch discovery session details:", err);
    }
  };

  const handleStartDiscovery = async () => {
    setIsStartingDiscovery(true);
    try {
      const res = await fetch(`${serverUrl}/api/instagram/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'system',
          niche: igNiche,
          maxProfiles: igMaxProfiles,
          maxPosts: igMaxPosts,
          maxComments: igMaxComments
        })
      });
      if (res.ok) {
        showNotification("Instagram Discovery campaign launched successfully!");
        setTimeout(() => {
          fetchDiscoverySessions();
        }, 1000);
      } else {
        alert("Failed to start Instagram Discovery session.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error starting Instagram Discovery campaign: " + err.message);
    } finally {
      setIsStartingDiscovery(false);
    }
  };

  const handleUpdateLeadStage = async (sessionId: string, profile: string, shortcode: string, leadUsername: string, stage: string) => {
    try {
      const res = await fetch(`${serverUrl}/api/instagram/leads/update-stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, profile, shortcode, leadUsername, stage })
      });
      if (res.ok) {
        showNotification(`Lead stage updated to ${stage}!`);
        fetchSessionDetails(sessionId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDiscoverySession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this discovery session?")) return;
    try {
      const res = await fetch(`${serverUrl}/api/instagram/session/${sessionId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showNotification("Discovery session deleted.");
        fetchDiscoverySessions();
        if (selectedDiscoverySession?.sessionId === sessionId) {
          setSelectedDiscoverySession(null);
        }
      } else {
        alert("Failed to delete session.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('assix_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('assix_theme', theme);
  }, [theme]);

  const [extensionConnected, setExtensionConnected] = useState(false);

  useEffect(() => {
    const ping = () => {
      window.postMessage({ 
        source: 'assix-dashboard', type: 'ping' 
      }, '*');
      const timeout = setTimeout(() => 
        setExtensionConnected(false), 2000);
      window.addEventListener('message', (e: MessageEvent) => {
        if (e.data?.source === 'assix-agent' && 
            e.data?.type === 'pong') {
          clearTimeout(timeout);
          setExtensionConnected(true);
        }
      }, { once: true });
    };
    ping();
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, []);

  const appendChatMessage = (item: { role: 'user' | 'agent' | 'assistant' | 'log'; text: string; taskId?: string; streaming?: boolean }) => {
    setChat(prev => [...prev, { role: item.role, msg: item.text, taskId: item.taskId, streaming: item.streaming }]);
  };

  // Secondary toggle inside Workspace: 'operator' | 'console'
  const [subTab, setSubTab] = useState<'operator' | 'console'>('operator');

  const [executionMode, setExecutionMode] = useState<'auto' | 'live'>('auto');
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([]);

  const showNotification = (message: string) => {
    const id = Math.random().toString();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    if (executionMode === 'auto') {
      setSubTab('console');
    }
  }, [executionMode]);

  // Mobile navigation dropdown state
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const [serverUrl, setServerUrl] = useState<string>(() => {
    let url = (import.meta as any).env.VITE_SERVER_URL || localStorage.getItem('assix_server_url') || window.location.origin;
    if (url.startsWith('ws://')) {
      url = url.replace('ws://', 'http://');
    } else if (url.startsWith('wss://')) {
      url = url.replace('wss://', 'https://');
    }

    // Safety check: if current window is remote but saved/derived URL is localhost, fallback to window.location.origin
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    const isCurrentLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost && !isCurrentLocal) {
      url = window.location.origin;
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = window.location.origin;
    }
    return url;
  });

  const getWsUrl = (urlStr: string) => {
    try {
      const u = new URL(urlStr);
      const proto = u.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${proto}//${u.host}`;
    } catch (e) {
      return (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host;
    }
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const appendLog = (message: string) => {
    setLogs(prev => [...prev.slice(-150), {
      time: new Date().toLocaleTimeString(),
      msg: message,
      type: 'info',
      timestamp: Date.now()
    }]);
  };
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: 'agent', msg: 'Assix Core System ready. Start a scraping campaign or prompt me in English to plan a browser pathway.' }
  ]);
  const [screenshots, setScreenshots] = useState<Record<string, string>>({});
  const [captchaAlert, setCaptchaAlert] = useState<boolean>(false);
  const [captchaScreenshot, setCaptchaScreenshot] = useState<string | null>(null);
  const [solvingCaptcha, setSolvingCaptcha] = useState<boolean>(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [activeDynamicTaskId, setActiveDynamicTaskId] = useState<string>('');
  
  // Firebase & Browser Use Integration states
  const [firebaseConfig, setFirebaseConfig] = useState<any>(null);
  const [browserUseTasks, setBrowserUseTasks] = useState<any[]>([]);
  const [activeBrowserUseTask, setActiveBrowserUseTask] = useState<any>(null);
  const [userId, setUserId] = useState<string>('tonykone21@gmail.com');

  // Browser Connection states
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; connectedAt?: string | null; machineName?: string | null }>({ connected: false });
  const [connectionCode, setConnectionCode] = useState<string | null>(null);
  const [connectionLoading, setConnectionLoading] = useState<boolean>(false);

  const fetchConnectionStatus = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/connections/status?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setConnectionStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch connection status:", err);
    }
  };

  const generateConnectionCode = async () => {
    setConnectionLoading(true);
    try {
      const res = await fetch(`${serverUrl}/api/connections/generate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setConnectionCode(data.code);
        showNotification("Short-lived connection code generated!");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to generate connection code.");
    } finally {
      setConnectionLoading(false);
    }
  };

  const disconnectBrowser = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/connections/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        showNotification("Browser connection disconnected.");
        fetchConnectionStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (tab === 'settings' && userId) {
      fetchConnectionStatus();
      const interval = setInterval(fetchConnectionStatus, 4000);
      return () => clearInterval(interval);
    }
  }, [tab, userId, serverUrl]);

  // =========================================================================
  // ASSIX THREE-TIER LEAD FINDER CLIENT STATES
  // =========================================================================
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedTier, setSelectedTier] = useState<'local' | 'ecom' | 'saas' | null>(null);
  const [searchNiche, setSearchNiche] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [searchGaps, setSearchGaps] = useState<string[]>([]);
  const [searchCount, setSearchCount] = useState<number>(5);
  const [searchStep, setSearchStep] = useState<'tier' | 'config' | 'confirm' | 'running' | 'complete'>('tier');
  const [enrichedSearchInsights, setEnrichedSearchInsights] = useState<{ suggestedMarkets: string[]; targetKeywords: string[]; painSignals: string[]; outreachHook: string } | null>(null);
  const [enrichingSearch, setEnrichingSearch] = useState<boolean>(false);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [searchRunning, setSearchRunning] = useState<boolean>(false);

  // Intelligent Search & Filtering States
  const [intelligentQuery, setIntelligentQuery] = useState<string>('');
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [classificationResult, setClassificationResult] = useState<any>(null);
  const [isEditingClassification, setIsEditingClassification] = useState<boolean>(false);
  const [leadsSidebarOpen, setLeadsSidebarOpen] = useState<boolean>(true);
  
  const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterCount, setFilterCount] = useState<number>(100);
  const [filterMinGapScore, setFilterMinGapScore] = useState<number>(0);
  const [filterContactMethod, setFilterContactMethod] = useState<'Email' | 'LinkedIn' | 'WhatsApp' | 'Any'>('Any');
  const [filterDateRange, setFilterDateRange] = useState<string>('All');


  // LinkedIn Outreach States
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isStartingSession, setIsStartingSession] = useState<boolean>(false);
  const [liConnected, setLiConnected] = useState<boolean>(false);
  const [liUser, setLiUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const [liLastConnected, setLiLastConnected] = useState<string>('');
  const [liConnectionError, setLiConnectionError] = useState<string>('');
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);

  // Campaign specific search results
  const [campaignResults, setCampaignResults] = useState<Record<string, any[]>>({});
  const [campaignSearching, setCampaignSearching] = useState<Record<string, boolean>>({});
  const [campaignErrors, setCampaignErrors] = useState<Record<string, string>>({});
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchProfiles, setSearchProfiles] = useState<any[]>([
    { id: "li-1", name: "Alex Mercer", title: "Owner, Mercer Plumbing", location: "Toronto, ON", status: "New", company: "Mercer Plumbing & Heating" },
    { id: "li-2", name: "Sarah Connor", title: "Founder, Apex Dental Care", location: "Montreal, QC", status: "New", company: "Apex Dental" },
    { id: "li-3", name: "David Miller", title: "VP Operations, Canada Landscapers", location: "Vancouver, BC", status: "New", company: "Canada Landscapers Ltd." },
    { id: "li-4", name: "Jessica Taylor", title: "Director, Taylor Electric Services", location: "Calgary, AB", status: "New", company: "Taylor Electric" },
  ]);
  const [searching, setSearching] = useState<boolean>(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  
  const [connectedProfilesList, setConnectedProfilesList] = useState<any[]>([
    { id: "conn-1", name: "Marcus Brody", title: "Founder, Brody Plumbers", location: "Hamilton, ON", status: "Connected", company: "Brody Plumbing", date: "2026-07-01" },
    { id: "conn-2", name: "Elena Rostova", title: "Chief Dentist, Rostova Dental", location: "Laval, QC", status: "Replied", company: "Rostova Smiles", date: "2026-06-30" },
    { id: "conn-3", name: "Frank Castle", title: "Manager, Castle Roofing", location: "Toronto, ON", status: "Message Sent", company: "Castle Roof Specialists", date: "2026-07-01" }
  ]);
  
  const [outreachMessagesLog, setOutreachMessagesLog] = useState<any[]>([
    { id: "log-1", name: "Marcus Brody", text: "Hi Marcus, I noticed your plumbing business has great reviews but lacks a mobile booking page. Let's fix this gap!", status: "Delivered", timestamp: "2026-07-01 14:32" },
    { id: "log-2", name: "Elena Rostova", text: "Hello Dr. Rostova, your premium dental clinic website in Laval is missing retargeting tags. Open to recapturing patient inquiries?", status: "Replied", timestamp: "2026-06-30 09:15" },
    { id: "log-3", name: "Frank Castle", text: "Hi Frank, I saw Castle Roofing takes over 5 seconds to load on mobile. That's a huge leak in your budget. Let's fix this!", status: "Delivered", timestamp: "2026-07-01 11:05" }
  ]);
  
  const [activeCampaign, setActiveCampaign] = useState<string | null>(null);
  const [campaignProgress, setCampaignProgress] = useState<number>(0);
  const [campaignLogs, setCampaignLogs] = useState<string[]>([]);
  const [isFullscreenIframeMinimized, setIsFullscreenIframeMinimized] = useState<boolean>(false);

  // LinkedIn Outreach Daemon States
  const [daemonRunning, setDaemonRunning] = useState<boolean>(false);
  const [daemonProgress, setDaemonProgress] = useState<number>(0);
  const [daemonLogs, setDaemonLogs] = useState<string[]>([]);
  const [nicheGoal, setNicheGoal] = useState<string>('');
  const [nicheTarget, setNicheTarget] = useState<string>('');
  const [nicheProduct, setNicheProduct] = useState<string>('');
  const [generatedNiche, setGeneratedNiche] = useState<any | null>(null);
  const [generatingNiche, setGeneratingNiche] = useState<boolean>(false);
  const [outreachProfiles, setOutreachProfiles] = useState<any[]>([]);
  const [outreachInbox, setOutreachInbox] = useState<any[]>([]);

  // Freelance Tab States
  const [freelanceJobs, setFreelanceJobs] = useState<any[]>([]);
  const [monitoringFreelance, setMonitoringFreelance] = useState<boolean>(false);
  const [freelanceLogs, setFreelanceLogs] = useState<string[]>([]);
  
  // Sidebar state
  const [leftOpen, setLeftOpen] = useState<boolean>(true);
  const [rightOpen, setRightOpen] = useState<boolean>(true);
  const [liveLogOpen, setLiveLogOpen] = useState<boolean>(false);

  // Input states
  const [consoleInput, setConsoleInput] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  // New task modal configuration
  const [newTaskModal, setNewTaskModal] = useState<boolean>(false);
  const [newTaskType, setNewTaskType] = useState<string>('google_maps_scrape');
  const [taskConfig, setTaskConfig] = useState<any>({
    niche: '',
    city: '',
    market: 'english_ca',
    maxLeads: 20,
    targets: [],
    message: '',
    igUsername: '',
    igPassword: '',
    topic: '',
    goal: '',
    platforms: ['reddit', 'google', 'youtube', 'yelp']
  });

  // Leads manager states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'no-website' | 'has-website' | 'facebook_ads' | 'facebook_groups'>('all');
  const [leadsSearch, setLeadsSearch] = useState<string>('');
  const [pushingLeadId, setPushingLeadId] = useState<string | null>(null);
  const [batchPushing, setBatchPushing] = useState<boolean>(false);
  const [leadsViewMode, setLeadsViewMode] = useState<'table' | 'cards'>('cards');
  const [activeTaskLeadsViewMode, setActiveTaskLeadsViewMode] = useState<'table' | 'cards'>('cards');
  const [chatInputFocused, setChatInputFocused] = useState<boolean>(false);

  // Selected task data results and findings
  const [activeTaskLeads, setActiveTaskLeads] = useState<Lead[]>([]);
  const [workspaceBoxTab, setWorkspaceBoxTab] = useState<'viewport' | 'data'>('viewport');
  const [expandedHistoryTaskId, setExpandedHistoryTaskId] = useState<string | null>(null);
  const [historyLeads, setHistoryLeads] = useState<Record<string, Lead[]>>({});

  // Report modal states
  const [reportModalContent, setReportModalContent] = useState<string | null>(null);
  const [loadingReportId, setLoadingReportId] = useState<string | null>(null);
  const [humanNeededIntervention, setHumanNeededIntervention] = useState<any>(null);

  // Agency Mode states
  const [agencyMode, setAgencyMode] = useState<boolean>(false);
  const [agencyTaskId, setAgencyTaskId] = useState<string | null>(null);
  const [agencyProgress, setAgencyProgress] = useState<any>(null);

  // Sectors Quick Launch states
  const [sectorModalOpen, setSectorModalOpen] = useState<boolean>(false);
  const [selectedSector, setSelectedSector] = useState<{ name: string; task: string } | null>(null);
  const [cityInputValue, setCityInputValue] = useState<string>('');

  const AGENCY_AGENT_NAMES: Record<string, string> = {
    growth_hacker: 'Growth Hacker',
    content_creator: 'Content Creator',
    seo_specialist: 'SEO Specialist',
    reddit_builder: 'Reddit Community Builder',
    linkedin_creator: 'LinkedIn Content Creator',
    outbound_strategist: 'Outbound Strategist',
    proposal_strategist: 'Proposal Strategist',
    trend_researcher: 'Trend Researcher',
    data_analyst: 'Analytics Reporter',
    technical_writer: 'Technical Writer'
  };

  const NESTA_SECTORS = [
    { name: 'Restaurant', task: "Find restaurants in [city] on Google Maps with phone numbers" },
    { name: 'Plombier', task: "Find plumbers in [city] on Google Maps with phone and website" },
    { name: 'Serrurier', task: "Find locksmiths in [city] on Google Maps with contact info" },
    { name: 'Electricien', task: "Find electricians in [city] on Google Maps with phone" },
    { name: 'Coiffeur', task: "Find hair salons in [city] on Google Maps with booking info" },
    { name: 'Nail Salon', task: "Find nail salons in [city] on Google Maps with contact details" },
    { name: 'Traiteur', task: "Find catering companies in [city] on Google Maps" },
    { name: 'Couvreur', task: "Find roofers in [city] on Google Maps with phone" },
    { name: 'Jardinier', task: "Find landscapers in [city] on Google Maps" },
    { name: 'Avocat', task: "Find law firms in [city] on Google Maps with contact info" },
    { name: 'Comptable', task: "Find accounting firms in [city] on Google Maps" },
    { name: 'Real Estate', task: "Find real estate agencies in [city] on Google Maps" },
    { name: 'Conciergerie', task: "Find property management companies in [city] on Google Maps" }
  ];

  const NESTA_MARKETS = {
    France: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Nice'],
    Belgium: ['Bruxelles', 'Anvers', 'Gand', 'Liège'],
    Switzerland: ['Genève', 'Zurich', 'Lausanne', 'Berne'],
    Canada: ['Montréal', 'Toronto', 'Vancouver', 'Québec'],
    UK: ['London', 'Manchester', 'Birmingham'],
    USA: ['New York', 'Los Angeles', 'Chicago']
  };

  const handleSaveServiceIdea = (idea: string) => {
    alert(`Workflow Saved!\n"Assix Agency Service Engine: ${idea}" has been stored as a custom workflow template.`);
  };

  const handleSectorClick = (sector: { name: string; task: string }) => {
    setSelectedSector(sector);
    setCityInputValue('');
    setSectorModalOpen(true);
  };

  const handleSectorConfirm = (city: string) => {
    if (!selectedSector) return;
    const resolvedCity = city.trim() || 'Paris';
    const resolvedTask = selectedSector.task.replace('[city]', resolvedCity);
    setConsoleInput(resolvedTask);
    setSubTab('console');
    setTab('workspace');
    setSectorModalOpen(false);
  };

  // General app state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [refreshingDevices, setRefreshingDevices] = useState<boolean>(false);

  const ws = useRef<WebSocket | null>(null);
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // WebSocket Connection Lifecycle
  const connectWS = (taskId: string) => {
    if (ws.current) {
      ws.current.close();
    }
    const derivedWsUrl = getWsUrl(serverUrl);
    const socket = new WebSocket(derivedWsUrl);
    ws.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'subscribe', taskId }));
    };

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'log') {
          setLogs(prev => [...prev.slice(-150), data]);
        }
        if (data.type === 'error') {
          setLogs(prev => [...prev, { 
            type: 'error', 
            message: data.error || 'Unknown error',
            msg: data.error || 'Unknown error',
            time: new Date().toLocaleTimeString(),
            timestamp: Date.now()
          } as any]);
        }
        if (data.type === 'screenshot') {
          setScreenshots(prev => ({ ...prev, [data.taskId || taskId]: 'data:image/jpeg;base64,' + data.imageBase64 }));
        }
        if (data.type === 'status') {
          setTasks(prev => prev.map(t => t.taskId === data.taskId ? { ...t, ...data } : t));
          setActiveTask(prev => prev && prev.taskId === data.taskId ? { ...prev, ...data } : prev);
        }
        if (data.type === 'captcha') {
          setCaptchaAlert(true);
          setCaptchaScreenshot('data:image/jpeg;base64,' + data.screenshotBase64);
        }
        if (data.type === 'input_request') {
          setInputRequestAlert(true);
          setInputRequestLabel(data.label || 'Verification Detail Required');
          setInputRequestTaskId(data.taskId || taskId);
          setInputRequestValue('');
        }
        if (data.type === 'complete') {
          setCaptchaAlert(false);
          setInputRequestAlert(false);
          fetchTasks().then(() => {
            setActiveTask(prev => prev && prev.taskId === data.taskId ? { ...prev, status: 'complete', ...data } : prev);
          });
          fetchLeads();
        }
      } catch (err) {}
    };
  };

  // Pull API data
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/tasks/all`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
        const active = data.filter((t: any) => t.status === 'running' || t.status === 'paused_captcha' || t.status === 'paused_input' || t.status === 'planning' || t.status === 'queued').length;
        setActiveCount(active);
        
        // Auto assign active task if none selected
        if (!activeTask && data.length > 0) {
          selectTask(data[0]);
        }
      } else {
        setTasks([]);
        setActiveCount(0);
      }
    } catch (e) {
      setTasks([]);
      setActiveCount(0);
    }
  };

  const fetchLeads = async () => {
    try {
      const pathSuffix = leadsFilter === 'no-website' ? '/no-website' : leadsFilter === 'has-website' ? '/has-website' : '/all';
      const res = await fetch(`${serverUrl}/api/leads${pathSuffix}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeads(data);
      } else {
        setLeads([]);
      }
    } catch (e) {
      setLeads([]);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/sessions/all`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSessions(data);
      } else {
        setSessions([]);
      }
    } catch (e) {
      setSessions([]);
    }
  };

  // Actions
  const handleStartTask = async () => {
    if (newTaskType === 'google_maps_scrape' || newTaskType === 'pages_jaunes_scrape' || newTaskType === 'leboncoin_scrape') {
      if (!taskConfig.niche || !taskConfig.city) {
        alert('Please indicate niche and city objectives before continuing');
        return;
      }
    }

    if (newTaskType === 'facebook_ads_scrape' || newTaskType === 'facebook_groups_scrape') {
      if (!taskConfig.niche) {
        alert('Please indicate niche/keyword objective before continuing');
        return;
      }
    }

    try {
      let taskId = '';
      if (newTaskType === 'instagram_discovery') {
        taskId = 'igdisc-' + Date.now();
        fetch(`${serverUrl}/api/instagram/discover`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId || 'system',
            niche: taskConfig.niche || igNiche,
            maxProfiles: taskConfig.maxProfiles || igMaxProfiles,
            maxPosts: taskConfig.maxPosts || igMaxPosts,
            maxComments: taskConfig.maxComments || igMaxComments
          })
        }).catch(err => console.error("Instagram Discovery task error:", err));
        
        showNotification("Instagram Discovery campaign launched successfully!");
        setNewTaskModal(false);
        setTab('ig_discovery');
        setTimeout(() => {
          fetchDiscoverySessions();
        }, 1000);
        return;
      } else if (newTaskType === 'google_maps_scrape') {
        taskId = 'gmaps-' + Date.now();
        fetch(`/api/scrape-google-maps`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId,
            query: taskConfig.niche,
            city: taskConfig.city,
            count: taskConfig.maxLeads || 20,
            userId
          })
        }).catch(err => console.error("Google Maps task error:", err));
      } else if (newTaskType === 'leboncoin_scrape') {
        taskId = 'lbc-' + Date.now();
        fetch(`/api/scrape-leboncoin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId,
            category: taskConfig.niche,
            city: taskConfig.city,
            count: taskConfig.maxLeads || 20,
            userId
          })
        }).catch(err => console.error("Leboncoin task error:", err));
      } else {
        const res = await fetch(`${serverUrl}/api/task/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            taskType: newTaskType, 
            config: taskConfig, 
            label: `${newTaskType.toUpperCase().replace(/_/g, ' ')} [${taskConfig.niche || taskConfig.topic || 'Custom'}]` 
          })
        });
        const { taskId: serverTaskId } = await res.json();
        taskId = serverTaskId;
      }

      setNewTaskModal(false);
      await fetchTasks();
      // Setup live view stream instantly with direct status detail fallback if list is delayed
      const updatedTasks = await fetch(`${serverUrl}/api/tasks/all`).then(r => r.json());
      let selected = updatedTasks.find((t: Task) => t.taskId === taskId);
      if (!selected) {
        const detailRes = await fetch(`${serverUrl}/api/task/${taskId}/status`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          if (detailData.task) {
            selected = detailData.task;
          }
        }
      }
      if (selected) {
        selectTask(selected);
      } else {
        // Fallback placeholder task so that the UI selects something immediately
        selectTask({
          taskId,
          taskType: newTaskType,
          label: `${newTaskType.toUpperCase().replace(/_/g, ' ')} [${taskConfig.niche || taskConfig.topic || 'Custom'}]`,
          config: taskConfig,
          status: 'running',
          progress: 0,
          total: 10,
          createdAt: new Date().toISOString()
        });
      }
    } catch (e: any) {
      alert(`Task launch error: ${e?.message || String(e)}`);
    }
  };

  const handleStopTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to abort the active task?')) return;
    try {
      await fetch(`${serverUrl}/api/task/${taskId}`, { method: 'DELETE' });
      fetchTasks();
    } catch (e) {}
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await fetch(`${serverUrl}/api/task/${taskId}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t.taskId !== taskId));
      if (activeTask?.taskId === taskId) {
        setActiveTask(null);
      }
    } catch (e) {
      console.error("Failed to delete task:", e);
    }
  };

  const handleDeleteAllTasks = async () => {
    if (!confirm('Are you sure you want to permanently delete all tasks and active sessions? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${serverUrl}/api/tasks/history`, { method: 'DELETE' });
      if (res.ok) {
        setTasks([]);
        setActiveTask(null);
      }
    } catch (e) {
      console.error("Failed to delete all tasks:", e);
    }
  };

  const handleDeleteAllLeads = async () => {
    if (!confirm('Are you sure you want to permanently delete all leads in the database? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${serverUrl}/api/leads/all`, { method: 'DELETE' });
      if (res.ok) {
        setLeads([]);
      }
    } catch (e) {
      console.error("Failed to delete all leads:", e);
    }
  };

  // =========================================================================
  // ASSIX THREE-TIER LEAD FINDER FRONTEND LOGIC
  // =========================================================================
  const handleIntelligentSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intelligentQuery.trim()) return;

    setIsClassifying(true);
    try {
      const res = await fetch(`${serverUrl}/api/lead-finder/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: intelligentQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setClassificationResult(data);
        setSelectedTier(data.tier);
        setSearchNiche(data.niche);
        setSearchLocation(data.location || '');
        setSearchGaps(data.gaps || []);
        setSearchCount(data.count || 20);
        setIsEditingClassification(false);
      } else {
        console.error("Classification request failed");
      }
    } catch (err) {
      console.error("Error classifying query:", err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleEnrichSearch = async () => {
    if (!searchNiche) return;
    setEnrichingSearch(true);
    setEnrichedSearchInsights(null);
    try {
      const res = await fetch(`${serverUrl}/api/agency/enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchNiche })
      });
      if (res.ok) {
        const data = await res.json();
        setEnrichedSearchInsights(data);
      }
    } catch (err) {
      console.error("Failed to enrich search:", err);
    } finally {
      setEnrichingSearch(false);
    }
  };

  const handleResetFilters = () => {
    setFilterLocation('');
    setFilterCount(50);
    setFilterMinGapScore(0);
    setFilterContactMethod('any');
    setFilterDateRange('any');
  };

  const handleLaunchSearch = async () => {
    if (!selectedTier || !searchNiche || !searchLocation) return;
    
    setSearchRunning(true);
    setSearchStep('running');
    
    setChat([
      { role: 'agent', msg: `Initializing Assix lead finder engine... Target: ${searchNiche.toUpperCase()} in ${searchLocation.toUpperCase()}` }
    ]);

    appendLog(`[LEAD FINDER] Spawned Lead Generation Task: ${searchNiche.toUpperCase()} in ${searchLocation.toUpperCase()} (Target Count: ${searchCount})`);
    setLiveLogOpen(true);

    try {
      const res = await fetch(`${serverUrl}/api/lead-finder/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tier: selectedTier,
          niche: searchNiche,
          location: searchLocation,
          gaps: searchGaps,
          count: searchCount,
          userId
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRunningTaskId(data.taskId);
        
        // Find and select the newly created task so logs can stream
        const newTask = {
          taskId: data.taskId,
          taskType: 'lead_generation',
          label: `Lead Finder: ${searchNiche.toUpperCase()} (${searchLocation.toUpperCase()})`,
          config: { tier: selectedTier, niche: searchNiche, location: searchLocation, gaps: searchGaps, count: searchCount },
          status: 'running',
          progress: 0,
          total: searchCount,
          createdAt: new Date().toISOString()
        };
        
        setTasks(prev => [newTask, ...prev]);
        setActiveTask(newTask);
        setWorkspaceBoxTab('viewport'); // Show logs viewport during extraction
      } else {
        const err = await res.json();
        setChat(prev => [...prev, { role: 'agent', msg: `Search error: ${err.error || 'Failed to start lead generation'}` }]);
        setSearchRunning(false);
        setSearchStep('config');
      }
    } catch (e: any) {
      setChat(prev => [...prev, { role: 'agent', msg: `Connection error: ${e.message || 'Server unresponsive'}` }]);
      setSearchRunning(false);
      setSearchStep('config');
    }
  };

  const handleSaveWorkflow = async () => {
    if (!selectedTier || !searchNiche || !searchLocation) return;

    try {
      const res = await fetch(`${serverUrl}/api/lead-finder/save-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          workflow: {
            tier: selectedTier,
            niche: searchNiche,
            location: searchLocation,
            gaps: searchGaps,
            count: searchCount
          }
        })
      });

      if (res.ok) {
        setChat(prev => [...prev, { role: 'agent', msg: '✨ Search workflow saved to your Saved Searches list successfully!' }]);
        fetchWorkflows();
      }
    } catch (e: any) {
      console.error('Failed to save workflow:', e);
    }
  };

  const handleRunWorkflow = async (wf: any) => {
    setSelectedTier(wf.tier);
    setSearchNiche(wf.niche);
    setSearchLocation(wf.location);
    setSearchGaps(wf.gaps || []);
    setSearchCount(wf.count || 5);
    setSearchStep('confirm');
    
    setTab('workspace');
    setSubTab('operator');
    setActiveTask(null); // Deselect any active task to show configuration screen
  };

  const handleResetSearch = () => {
    setSelectedTier(null);
    setSearchNiche('');
    setSearchLocation('');
    setSearchGaps([]);
    setSearchCount(5);
    setSearchStep('tier');
    setRunningTaskId(null);
    setEnrichedSearchInsights(null);
  };

  const handleSkipLead = async (leadId: string) => {
    try {
      await fetch(`${serverUrl}/api/leads/${leadId}/skip`, { method: 'POST' });
    } catch (err) {}
    
    setLeads(prev => prev.filter(l => l.leadId !== leadId));
    setActiveTaskLeads(prev => prev.filter(l => l.leadId !== leadId));
  };

  const handleResolveCaptcha = async () => {
    if (!activeTask) return;
    try {
      await fetch(`${serverUrl}/api/task/${activeTask.taskId}/resolve`, { method: 'POST' });
      setCaptchaAlert(false);
      setCaptchaScreenshot(null);
    } catch (e) {}
  };

  const handleAutoResolveCaptcha = async () => {
    if (!activeTask) return;
    setSolvingCaptcha(true);
    setCaptchaError(null);
    try {
      const res = await fetch(`${serverUrl}/api/task/${activeTask.taskId}/auto-resolve-captcha`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        if (data.screenshotBase64) {
          setCaptchaScreenshot('data:image/jpeg;base64,' + data.screenshotBase64);
        }
      } else {
        setCaptchaError(data.message || "AI was unable to locate or click the verification element.");
      }
    } catch (err: any) {
      setCaptchaError("Failed to communicate with CAPTCHA auto-solver service.");
    } finally {
      setSolvingCaptcha(false);
    }
  };

  const [submittingInput, setSubmittingInput] = useState<boolean>(false);
  const handleSubmitInputRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetTaskId = activeTask?.taskId || inputRequestTaskId;
    if (!targetTaskId || !inputRequestValue.trim()) return;
    setSubmittingInput(true);
    try {
      const res = await fetch(`${serverUrl}/api/task/${targetTaskId}/submit-input`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: inputRequestValue })
      });
      if (res.ok) {
        setInputRequestAlert(false);
        setInputRequestValue('');
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to submit input request:', err);
    } finally {
      setSubmittingInput(false);
    }
  };

  const handlePushLead = async (leadId: string) => {
    setPushingLeadId(leadId);
    try {
      const res = await fetch(`${serverUrl}/api/leads/${leadId}/push-close`, { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        fetchLeads();
      }
    } catch (e) {
      alert('Fail response during lead indexing with Close');
    } finally {
      setPushingLeadId(null);
    }
  };

  const handleBatchPushLeads = async () => {
    if (!confirm('This will synchronize the current 50 un-synced leads directly into Close CRM. Continue?')) return;
    setBatchPushing(true);
    try {
      const res = await fetch(`${serverUrl}/api/leads/push-close-batch`, { method: 'POST' });
      const data = await res.json();
      alert(`Synchronized leads: ${data.pushed} processed successfully. Errors: ${data.failed}`);
      fetchLeads();
    } catch (e) {
      alert('Batch transmission interrupted due to network failure');
    } finally {
      setBatchPushing(false);
    }
  };

  const handleFetchReport = async (taskId: string) => {
    setLoadingReportId(taskId);
    try {
      const res = await fetch(`${serverUrl}/api/task/${taskId}/report`);
      const { report } = await res.json();
      setReportModalContent(report);
    } catch (e) {
      alert('Synthesis engine timeout');
    } finally {
      setLoadingReportId(null);
    }
  };

  const toggleHistoryData = async (taskId: string) => {
    if (expandedHistoryTaskId === taskId) {
      setExpandedHistoryTaskId(null);
      return;
    }
    setExpandedHistoryTaskId(taskId);
    if (historyLeads[taskId]) return; // already loaded

    try {
      const res = await fetch(`${serverUrl}/api/task/${taskId}/leads`);
      if (res.ok) {
        const leadsData = await res.json();
        setHistoryLeads(prev => ({ ...prev, [taskId]: leadsData }));
      }
    } catch (e) {
      console.error('Failed to load history leads:', e);
    }
  };

  const [inputRequestAlert, setInputRequestAlert] = useState<boolean>(false);
  const [inputRequestLabel, setInputRequestLabel] = useState<string>('');
  const [inputRequestValue, setInputRequestValue] = useState<string>('');
  const [inputRequestTaskId, setInputRequestTaskId] = useState<string>('');

  const selectTask = async (task: Task, shouldSwitchTab = false) => {
    setActiveTask(task);
    setLogs([]);
    setCaptchaAlert(false);
    
    if (shouldSwitchTab) {
      setSubTab('operator'); // Switch to Live Screen viewport only on manual click
      setTab('workspace');   // Switch to Workspace tab only on manual click
    }

    if (task.status === 'paused_input') {
      setInputRequestAlert(true);
      setInputRequestLabel(task.inputPrompt || 'Login detail or 2FA verification code required');
      setInputRequestTaskId(task.taskId);
      setInputRequestValue('');
    } else {
      setInputRequestAlert(false);
    }
    
    // Auto switch to 'data' tab if completed/error, otherwise show live viewport
    if (task.status === 'complete' || task.status === 'stopped' || task.status === 'error') {
      setWorkspaceBoxTab('data');
    } else {
      setWorkspaceBoxTab('viewport');
    }

    if (task.status === 'running' || task.status === 'paused_captcha' || task.status === 'paused_input') {
      connectWS(task.taskId);
    }
    
    // Pull existing logs
    try {
      const res = await fetch(`${serverUrl}/api/task/${task.taskId}/status`);
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {}

    // Pull task-specific leads
    try {
      const res = await fetch(`${serverUrl}/api/task/${task.taskId}/leads`);
      if (res.ok) {
        const leadsData = await res.json();
        setActiveTaskLeads(leadsData);
      } else {
        setActiveTaskLeads([]);
      }
    } catch (e) {
      setActiveTaskLeads([]);
    }
  };

  const handleConsoleSubmit = async () => {
    const text = consoleInput.trim();
    if (!text && attachments.length === 0) return;

    setIsSending(true);
    const userMsg: ChatMessage = { role: 'user', msg: text, files: attachments.map(a => a.name) };
    setChat(prev => [...prev, userMsg]);
    setConsoleInput('');
    setAttachments([]);

    appendLog(`[CHATBOT INPUT] User sent prompt: "${text}"${attachments.length > 0 ? ` with files: ${attachments.map(a => a.name).join(', ')}` : ''}`);
    setLiveLogOpen(true);

    if (text.toLowerCase() === 'new:' || text.toLowerCase() === 'new' || text.toLowerCase() === 'reset' || text.toLowerCase() === 'reset:') {
      setActiveDynamicTaskId('');
      setChat(prev => [...prev, { role: 'agent', msg: 'Current browser session context cleared. Ready to start a fresh session.' }]);
      appendLog(`[CHATBOT ACTION] Client-side context reset requested. Clearing active task references.`);
      setIsSending(false);
      return;
    }

    const taskId = crypto.randomUUID();
    const userMessage = text;

    // 1. Agency Mode short circuit
    if (agencyMode) {
      const agencyId = 'agency-' + Math.random().toString(36).substring(2, 9);
      setAgencyTaskId(agencyId);
      setAgencyProgress({
        taskId: agencyId,
        step: 'planning',
        status: 'running',
        message: 'Assembling your specialist team...',
        data: null
      });
      appendLog(`[CHATBOT ACTION] Initializing Agency workflow (ID: ${agencyId}) for objective: "${text}"`);
      socket.emit('agency_task', { goal: text, taskId: agencyId });
      setIsSending(false);
      return;
    }

    // 2. Direct command instruction short circuit (e.g. starting with "do:" or "run:")
    if (text.toLowerCase().startsWith('do:') || text.toLowerCase().startsWith('run:')) {
      const goal = text.replace(/^(do:|run:)/i, '').trim();
      setIsSending(false);

      let activeTaskIdToUse = activeDynamicTaskId;
      const isReusable = activeDynamicTaskId && activeTask && activeTask.taskId === activeDynamicTaskId && activeTask.status !== 'complete' && activeTask.status !== 'failed';
      const useStealth = executionMode === 'auto' || goal.toLowerCase().startsWith('stealth:') || goal.toLowerCase().includes('linkedin') || goal.toLowerCase().includes('leboncoin');

      if (isReusable) {
        appendLog(`[CHATBOT ACTION] Continuing sequence on active browser session (ID: ${activeTaskIdToUse.slice(0, 8)}) with instruction: "${goal}"${useStealth ? ' (Stealth Mode)' : ''}`);
        socket.emit('browser_task', { 
          instruction: goal, taskId: activeTaskIdToUse, useStealth 
        });

        setChat(prev => [...prev, { role: 'agent', msg: `Continuing sequence for objective "${goal}" on current browser session...` }]);
        
        setTasks(prev => prev.map(t => t.taskId === activeTaskIdToUse ? {
          ...t,
          status: 'running',
          label: `Chat Auto: ${goal.slice(0, 30)}...`,
          config: { goal, context: '' }
        } : t));

        if (activeTask && activeTask.taskId === activeTaskIdToUse) {
          setActiveTask(prev => prev ? {
            ...prev,
            status: 'running',
            label: `Chat Auto: ${goal.slice(0, 30)}...`,
            config: { goal, context: '' }
          } : null);
        }
      } else {
        const newId = 'dyn-' + Date.now();
        setActiveDynamicTaskId(newId);

        appendLog(`[CHATBOT ACTION] Spawning new browser sequence (ID: ${newId}) with instruction: "${goal}"${useStealth ? ' (Stealth Mode)' : ''}`);
        
        if (executionMode === 'auto') {
          appendChatMessage({
            role: 'assistant',
            text: '🤖 Hermes is handling this task in the background...',
            taskId: newId
          });
          if (process.env.HERMES_URL) {
            socket.emit('hermes_task', { 
              instruction: goal, taskId: newId 
            });
          } else {
            socket.emit('task', { 
              instruction: goal, taskId: newId, useStealth 
            });
          }
        } else {
          appendChatMessage({
            role: 'assistant',
            text: '🤖 Live Browser Session initiated. Streaming screenshots...',
            taskId: newId
          });
          socket.emit('browser_task', { 
            instruction: goal, taskId: newId, useStealth 
          });
        }

        const newTask: Task = {
          taskId: newId,
          taskType: 'dynamic',
          label: `Chat Auto: ${goal.slice(0, 30)}...`,
          config: { goal, context: '' },
          status: 'running',
          progress: 0,
          total: 10,
          createdAt: new Date().toISOString()
        };
        
        setTasks(prev => [newTask, ...prev]);
        selectTask(newTask, true); // Automatically switch to live viewer to see it in action
      }
      return;
    }

    // 3. Standard conversational interface with automatic intent classification
    const fd = new FormData();
    fd.append('message', text);
    fd.append('taskId', activeTask?.taskId || 'general');
    fd.append('useStealth', String(executionMode === 'auto'));
    attachments.forEach(file => {
      fd.append('files', file);
    });

    try {
      const res = await fetch(`${serverUrl}/api/console/message`, { method: 'POST', body: fd });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || 'Server responded with an error');
      }
      const data = await res.json();
      setChat(prev => [...prev, { role: 'agent', msg: data.response }]);
      appendLog(`[CHATBOT RESPONSE] Agent reply: "${data.response?.slice(0, 80)}${data.response?.length > 80 ? '...' : ''}"`);
      
      if (data.launchTaskId) {
        appendLog(`[CHATBOT RESPONSE] Launched automation task (ID: ${data.launchTaskId.slice(0, 8)})`);
        await fetchTasks();
        const updatedTasks = await fetch(`${serverUrl}/api/tasks/all`).then(r => r.json());
        let selected = updatedTasks.find((t: Task) => t.taskId === data.launchTaskId);
        if (!selected) {
          const detailRes = await fetch(`${serverUrl}/api/task/${data.launchTaskId}/status`);
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            if (detailData.task) {
              selected = detailData.task;
            }
          }
        }
        if (selected) {
          selectTask(selected, true); // Automatically focus the live viewer and stream screenshots
        } else {
          selectTask({
            taskId: data.launchTaskId,
            taskType: 'dynamic',
            label: `Chat Auto: ${text.slice(0, 30)}...`,
            config: { goal: text, context: '' },
            status: 'running',
            progress: 0,
            total: 10,
            createdAt: new Date().toISOString()
          }, true); // Automatically focus the live viewer and stream screenshots
        }
      }
    } catch (e: any) {
      const errorMsg = e.message || 'Server is unresponsive.';
      setChat(prev => [...prev, { role: 'agent', msg: `Core connection error: ${errorMsg}` }]);
      appendLog(`[CHATBOT ERROR] Conversational exchange failed: ${errorMsg}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteSession = async (platform: string) => {
    if (!confirm(`Delete saved session memory cookies for ${platform}?`)) return;
    try {
      await fetch(`${serverUrl}/api/sessions/${platform}`, { method: 'DELETE' });
      fetchSessions();
    } catch (e) {}
  };

  const handleSaveSettings = () => {
    let normalized = serverUrl.trim();
    if (normalized.startsWith('ws://')) {
      normalized = normalized.replace('ws://', 'http://');
    } else if (normalized.startsWith('wss://')) {
      normalized = normalized.replace('wss://', 'https://');
    } else if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = window.location.origin;
    }
    setServerUrl(normalized);
    localStorage.setItem('assix_server_url', normalized);
    alert('Settings saved successfully!');
    fetchTasks();
    fetchLeads();
    fetchSessions();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
    e.target.value = '';
  };

  // LinkedIn Outreach Action Handlers
  const handleLaunchLinkedInDaemon = (nicheConfig: any) => {
    if (!liConnected) {
      alert("Please connect LinkedIn first.");
      return;
    }
    setDaemonRunning(true);
    setDaemonProgress(10);
    setDaemonLogs(["[DAEMON] Initiating LinkedIn Automated Daemon..."]);
    appendLog(`[OUTREACH DAEMON] Spawning LinkedIn Outreach campaign for niche: ${nicheConfig.niche_id || 'Unknown'}`);
    setLiveLogOpen(true);
    socket.emit('run_linkedin_daemon', {
      userId,
      nicheConfig,
      taskId: `linkedin-daemon-${nicheConfig.niche_id || Date.now()}`
    });
  };

  const handleGenerateNicheConfig = () => {
    if (!nicheGoal || !nicheTarget || !nicheProduct) {
      alert("Please fill out all strategy generation fields.");
      return;
    }
    setGeneratingNiche(true);
    appendLog(`[OUTREACH CONFIG] Spawning niche strategy engine for goal: "${nicheGoal}"`);
    setLiveLogOpen(true);
    socket.emit('generate_niche_config', {
      goal: nicheGoal,
      targetDescription: nicheTarget,
      productOffer: nicheProduct,
      language: 'en',
      taskId: `niche-generator-${Date.now()}`
    });
  };

  const handleRunFreelanceMonitor = () => {
    setMonitoringFreelance(true);
    setFreelanceLogs(["[MONITOR] Starting Reddit and HN scraping and scoring run..."]);
    appendLog(`[FREELANCE MONITOR] Starting active monitor scans across platforms (Reddit/HN)...`);
    setLiveLogOpen(true);
    socket.emit('freelance_monitor', {
      userId,
      taskId: `freelance-monitor-${Date.now()}`
    });
  };

  const handleTestLinkedInConnection = async () => {
    setIsTestingConnection(true);
    setLiConnectionError('');
    try {
      const res = await getLinkedInMe();
      if (res && (res.success || res.firstName || res.lastName)) {
        const fName = res.firstName || "Tony";
        const lName = res.lastName || "Kone";
        setLiConnected(true);
        setLiUser({ firstName: fName, lastName: lName });
        setLiLastConnected(new Date().toLocaleTimeString());
        setSessionActive(true);
      } else {
        setLiConnected(false);
        setLiUser(null);
        setLiConnectionError('Connection failed — check API');
      }
    } catch (err: any) {
      console.error("Test LinkedIn Connection failed", err);
      setLiConnected(false);
      setLiUser(null);
      setLiConnectionError('Connection failed — check API');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleStartLinkedInSession = async () => {
    setIsStartingSession(true);
    try {
      await handleTestLinkedInConnection();
    } catch (err: any) {
      console.error("Start session failed", err);
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleSearchLinkedIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearching(true);
    try {
      const res = await searchLinkedIn(searchQuery);
      if (res.results) {
        setSearchProfiles(res.results);
      }
    } catch (err: any) {
      console.error("Search LinkedIn failed", err);
    } finally {
      setSearching(false);
    }
  };

  const handleConnectProfile = async (profileId: string, name: string, company: string, customMsg?: string) => {
    setConnectingId(profileId);
    try {
      const defaultTemplate = `Hi ${name}, I noticed your business ${company} is highly rated. Let's connect!`;
      const finalMsg = customMsg || defaultTemplate;
      const res = await connectProfile(profileId, finalMsg);
      if (res.success) {
        setSearchProfiles(prev => prev.map(p => p.id === profileId ? { ...p, status: "Message Sent" } : p));
        
        // Also update any matching campaigns results list so the UI updates
        Object.keys(campaignResults).forEach(gap => {
          setCampaignResults(prev => ({
            ...prev,
            [gap]: (prev[gap] || []).map(p => p.id === profileId ? { ...p, status: "Message Sent" } : p)
          }));
        });

        const newConnect = {
          id: `conn-${Date.now()}`,
          name,
          title: searchProfiles.find(p => p.id === profileId)?.title || "Manager",
          location: searchProfiles.find(p => p.id === profileId)?.location || "Local",
          status: "Message Sent",
          company,
          date: new Date().toISOString().split('T')[0]
        };
        setConnectedProfilesList(prev => [newConnect, ...prev]);
        const newLog = {
          id: `log-${Date.now()}`,
          name,
          text: finalMsg,
          status: "Delivered",
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        setOutreachMessagesLog(prev => [newLog, ...prev]);
      }
    } catch (err: any) {
      console.error("Connect profile failed", err);
    } finally {
      setConnectingId(null);
    }
  };

  const GAP_CAMPAIGNS = [
    {
      niche: "Plumbing",
      gapName: "Mobile Booking Page Gap",
      description: "Find local plumbing companies with high reviews but slow, outdated, non-mobile friendly web booking setups.",
      messageTemplate: "Hi {{name}}, I noticed your plumbing business, {{company}}, is highly rated but lacks a clean mobile-friendly booking page. Would you be open to a quick chat about fixing this gap to capture 30% more mobile bookings?",
      targets: ["Alex Mercer", "Marcus Brody"],
      painSignalKeywords: "plumbing website slow mobile booking booking form"
    },
    {
      niche: "Dental Care",
      gapName: "Missing Advertising Retargeting Pixel Gap",
      description: "Scan dental practice sites receiving premium organic traffic but lacking any Facebook or Google ad remarketing pixels.",
      messageTemplate: "Hello Dr. {{name}}, we analyzed dental clinics in your region and found that the website for {{company}} is missing remarketing pixels. Open to seeing how we recapture lost patient inquiries?",
      targets: ["Sarah Connor", "Elena Rostova"],
      painSignalKeywords: "dentist facebook pixel google ads retargeting"
    },
    {
      niche: "Electrical Services",
      gapName: "Unclaimed Google Maps Profile Gap",
      description: "Identify registered local electricians who have active websites but haven't claimed or optimized their Google My Business listing.",
      messageTemplate: "Hi {{name}}, I saw your electrical services page is active, but your Google Maps Listing seems unclaimed for {{company}}. This is a major local visibility gap. I can help you claim and optimize it!",
      targets: ["Jessica Taylor"],
      painSignalKeywords: "electrician google maps listing unclaimed maps profile"
    },
    {
      niche: "Roofing",
      gapName: "Slow Mobile Load Time Conversion Gap",
      description: "Benchmark local roofing sites taking over 5 seconds to load on standard mobile connections, causing severe ad budget leak.",
      messageTemplate: "Hi {{name}}, I noticed your roofing site, {{company}}, takes over 5 seconds to load on mobile. That's a huge leak in your ad budget. Let's talk about speeding it up to double your lead conversions.",
      targets: ["Frank Castle"],
      painSignalKeywords: "roofing website speed mobile loading slow"
    }
  ];

  const handleStartCampaign = async (campaignName: string, niche: string, gapName: string, description: string, messageTemplate: string) => {
    // 1. First check connection status
    if (!liConnected) {
      setCampaignErrors(prev => ({ ...prev, [gapName]: "Please connect LinkedIn first" }));
      return;
    }
    // Clear any previous error
    setCampaignErrors(prev => ({ ...prev, [gapName]: "" }));

    setCampaignSearching(prev => ({ ...prev, [gapName]: true }));
    setActiveCampaign(gapName);
    setCampaignProgress(10);
    setCampaignLogs([`[CAMPAIGN INITIATED] Starting ${campaignName} target campaign...`]);

    const matchingCamp = GAP_CAMPAIGNS.find(c => c.gapName === gapName);
    const keywords = matchingCamp?.painSignalKeywords || `${niche.toLowerCase()} website slow`;

    try {
      setCampaignLogs(prev => [...prev, `[STEP 1] Querying LinkedIn for active posts matching keywords: "${keywords}"...`]);
      setCampaignProgress(25);
      
      const searchRes = await searchPosts(keywords);
      let posts = searchRes?.posts || [];
      
      if (posts.length === 0) {
        setCampaignLogs(prev => [...prev, `[INFO] No real posts found on API. Generating simulation posts to guarantee flow...`]);
        posts = [
          {
            profileId: `li-pro-${Date.now()}-1`,
            name: niche === "Plumbing" ? "Alex Mercer" : niche === "Dental Care" ? "Sarah Connor" : niche === "Electrical Services" ? "Jessica Taylor" : "Frank Castle",
            headline: niche === "Plumbing" ? "Founder & Master Plumber at Mercer Plumbing" : niche === "Dental Care" ? "Lead Dentist at Connor Dental Care" : niche === "Electrical Services" ? "Director of Taylor Electric" : "Owner, Castle Roofing Specialists",
            company: niche === "Plumbing" ? "Mercer Plumbing" : niche === "Dental Care" ? "Connor Dental Care" : niche === "Electrical Services" ? "Taylor Electric" : "Castle Roofing Specialists",
            postContent: niche === "Plumbing" ? "Anyone know a fast booking plugin for a local plumbing site? Our current form on mobile is extremely slow and we are losing booked clients." :
                         niche === "Dental Care" ? "Our dental website gets quite a few organic visits but our flat appointment numbers are worrying. Should we be running Facebook pixel ads to retarget?" :
                         niche === "Electrical Services" ? "We noticed our Google Maps listing hasn't been active or claimed, but we have our main company website up. How much does Maps matter for electricians?" :
                         "Complaints about our roofing page loading slow on mobile are piling up. Standard load speed takes forever on slow mobile connections.",
            linkedinUrl: `https://linkedin.com/in/${niche.toLowerCase().replace(' ', '')}-pro`
          }
        ];
      }

      setCampaignLogs(prev => [...prev, `[STEP 2] Found ${posts.length} matching LinkedIn posts. Starting Gap Analysis...`]);
      setCampaignProgress(50);

      const qualifiedResults: any[] = [];

      for (const post of posts) {
        setCampaignLogs(prev => [...prev, `[ANALYSIS] Running Gap Analysis on post from ${post.name}...`]);
        
        const analysis = await runGapAnalysis(post.postContent, {
          niche,
          gapName,
          description,
          messageTemplate,
          painSignalKeywords: keywords
        });

        setCampaignLogs(prev => [...prev, `[SCORE] ${post.name}: Gap score matched at ${analysis.score}% (Pain signal: "${analysis.painSignal || 'Website slow load'}")`]);

        if (analysis.score >= 60) {
          setCampaignLogs(prev => [...prev, `[QUALIFIED] ${post.name} passed qualification threshold. Generating personalized pitch...`]);
          
          const pitch = await generatePitch({
            name: post.name,
            company: post.company,
            postContent: post.postContent,
            messageTemplate,
            painSignal: analysis.painSignal
          });

          setCampaignLogs(prev => [...prev, `[ENRICHMENT] Launching contact enrichment & maps phone lookup for ${post.name}...`]);
          try {
            const enrichRes = await fetch('/api/outreach/enrich', {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                profileId: post.profileId,
                name: post.name,
                headline: post.headline,
                company: post.company,
                linkedinUrl: post.linkedinUrl,
                gapScore: analysis.score,
                pitch,
                taskId: `outreach-${gapName.replace(/\s+/g, '-').toLowerCase()}`,
                city: "Ontario, CA"
              })
            });
            const enrichData = await enrichRes.json();
            if (enrichData.success) {
              setCampaignLogs(prev => [...prev, `[ENRICHED] Saved ${post.name} to Leads Database with email/phone.`]);
            }
          } catch (enrichErr: any) {
            console.error("Enrichment API failed:", enrichErr);
          }

          qualifiedResults.push({
            id: post.profileId,
            name: post.name,
            title: post.headline,
            company: post.company,
            postContent: post.postContent,
            painSignal: analysis.painSignal || "Potential Gap Match",
            pitch,
            linkedinUrl: post.linkedinUrl,
            status: "Qualified"
          });
        } else {
          setCampaignLogs(prev => [...prev, `[DISQUALIFIED] ${post.name} score ${analysis.score}% is below threshold.`]);
        }
      }

      setCampaignProgress(90);
      
      if (qualifiedResults.length > 0) {
        setCampaignResults(prev => ({ ...prev, [gapName]: qualifiedResults }));
        setCampaignLogs(prev => [...prev, `[SUCCESS] Campaign finished. ${qualifiedResults.length} qualified prospects stored.`]);
      } else {
        setCampaignResults(prev => ({ ...prev, [gapName]: [] }));
        setCampaignLogs(prev => [...prev, `[WARNING] No prospects matched the score threshold.`]);
      }
      
      fetchLeads();

    } catch (err: any) {
      console.error("LinkedIn campaign execution failed:", err);
      setCampaignErrors(prev => ({ ...prev, [gapName]: err.message || "Campaign failed" }));
    } finally {
      setCampaignSearching(prev => ({ ...prev, [gapName]: false }));
      setCampaignProgress(100);
    }
  };

  // Scroll views to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, subTab]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat, subTab]);

  // General sync loops
  useEffect(() => {
    fetchTasks();
    fetchLeads();
    fetchSessions();
    const iv = setInterval(fetchTasks, 10000);
    return () => clearInterval(iv);
  }, []);

  // Rapid active-task logs and status poller fallback (every 2.5s) to guarantee real-time updates
  // regardless of WebSocket state, VPNs, or iframe sandbox limitations.
  useEffect(() => {
    if (!activeTask) return;
    const isRunning = activeTask.status === 'running' || 
                      activeTask.status === 'paused_captcha' || 
                      activeTask.status === 'paused_input' || 
                      activeTask.status === 'planning';
    
    const pollFunc = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/task/${activeTask.taskId}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.task) {
            setTasks(prev => prev.map(t => t.taskId === activeTask.taskId ? { ...t, ...data.task } : t));
            setActiveTask(prev => {
              if (prev && prev.taskId === activeTask.taskId) {
                return { ...prev, ...data.task };
              }
              return prev;
            });
          }
          if (data.logs && Array.isArray(data.logs)) {
            setLogs(data.logs);
          }
        }
      } catch (e) {
        console.error("Rapid poller status/logs fetch failed:", e);
      }

      try {
        const res = await fetch(`${serverUrl}/api/task/${activeTask.taskId}/leads`);
        if (res.ok) {
          const leadsData = await res.json();
          if (Array.isArray(leadsData)) {
            setActiveTaskLeads(leadsData);
          }
        }
      } catch (e) {
        console.error("Rapid poller leads fetch failed:", e);
      }
    };

    pollFunc();

    if (!isRunning) return;

    const intervalId = setInterval(pollFunc, 2500);
    return () => clearInterval(intervalId);
  }, [activeTask?.taskId, activeTask?.status, serverUrl]);

  // Listen to Socket.io events globally to sync currentUrl and show human needed interventions
  useEffect(() => {
    const handleProgress = (data: any) => {
      if (data && (data.step && (
        String(data.step).startsWith('discovery_') || 
        String(data.step).startsWith('profile_') || 
        String(data.step).startsWith('post_') || 
        String(data.step).startsWith('comment_') || 
        String(data.step) === 'lead_saved' ||
        String(data.step) === 'pipeline_complete' ||
        String(data.step) === 'error'
      ))) {
        const sId = data.data?.sessionId || data.sessionId || (data.taskId?.startsWith('igdisc-') ? data.taskId : null);
        if (sId) {
          fetchDiscoverySessions();
          fetchSessionDetails(sId);
        }
      }

      if (data && data.taskId) {
        setTasks(prev => prev.map(t => t.taskId === data.taskId ? { ...t, currentUrl: data.currentUrl, progress: data.step !== undefined ? data.step : t.progress } : t));
        setActiveTask(prev => {
          if (prev && prev.taskId === data.taskId) {
            return { ...prev, currentUrl: data.currentUrl, progress: data.step !== undefined ? data.step : prev.progress };
          }
          return prev;
        });
        setHumanNeededIntervention(null);

        const stepDesc = data.description || (data.data?.message) || 'Executing task stage...';
        appendLog(`[EXECUTION] Task ${data.taskId.slice(0, 8)} at ${data.step || 0}%: ${stepDesc}`);
      }
    };

    const handleHumanNeeded = (data: any) => {
      if (data && data.taskId) {
        setTasks(prev => prev.map(t => t.taskId === data.taskId ? { ...t, status: 'paused_input', currentUrl: data.currentUrl } : t));
        setActiveTask(prev => {
          if (prev && prev.taskId === data.taskId) {
            return { ...prev, status: 'paused_input', currentUrl: data.currentUrl };
          }
          return prev;
        });
        setHumanNeededIntervention(data);
        appendLog(`[INTERVENTION REQUIRED] Task ${data.taskId.slice(0, 8)} needs assistance: ${data.message || 'Login/Captcha/2FA verification required.'}`);
      }
    };

    const handleAgencyUpdate = (data: any) => {
      if (data && data.taskId) {
        setAgencyProgress(data);
        appendLog(`[AGENCY] ${data.step?.toUpperCase() || 'UPDATE'} (ID: ${data.taskId.slice(0, 8)}): ${data.message || 'Team coordinating...'}`);
      }
    };

    const handleLeadFinderProgress = (data: any) => {
      if (data && data.msg) {
        setChat(prev => [...prev, { role: 'agent', msg: data.msg }]);
        appendLog(`[LEAD FINDER] ${data.msg}`);
      }
    };

    const handleLeadFinderComplete = (data: any) => {
      setSearchRunning(false);
      setSearchStep('complete');
      fetchTasks();
      fetchLeads();
      appendLog(`[LEAD FINDER] Complete! Successfully pulled leads and finalized search.`);
    };

    const handleDaemonUpdate = (data: any) => {
      if (data.step === 'complete') {
        setDaemonRunning(false);
        setDaemonProgress(100);
      } else if (data.step === 'error') {
        setDaemonRunning(false);
      }
      if (data.message) {
        setDaemonLogs(prev => [`[${data.step.toUpperCase()}] ${data.message}`, ...prev]);
        appendLog(`[OUTREACH DAEMON] [${data.step.toUpperCase()}] ${data.message}`);
      }
    };

    const handleNicheConfigReady = (data: any) => {
      setGeneratingNiche(false);
      if (data.config) {
        setGeneratedNiche(data.config);
        setNicheGoal('');
        setNicheTarget('');
        setNicheProduct('');
        appendLog(`[OUTREACH CONFIG] Success! Created new niche profile: "${data.config.niche_name || 'Niche Configuration'}"`);
      } else if (data.error) {
        alert("Failed to generate niche config: " + data.error);
        appendLog(`[OUTREACH CONFIG] [ERROR] Failed to generate configuration: ${data.error}`);
      }
    };

    const handleFreelanceJobFound = (data: any) => {
      if (data.job) {
        setFreelanceLogs(prev => [`[FOUND] Scored ${data.job.score}/100: ${data.job.title}`, ...prev]);
        appendLog(`[FREELANCE MONITOR] Scored ${data.job.score}/100: ${data.job.title}`);
      }
    };

    const handleFreelanceComplete = (data: any) => {
      setMonitoringFreelance(false);
      setFreelanceLogs(prev => [`[COMPLETE] Monitoring run finished.`, ...prev]);
      appendLog(`[FREELANCE MONITOR] Complete. Scanned all dynamic channels.`);
    };

    const handleHermesResult = (data: any) => {
      appendChatMessage({
        role: 'assistant',
        text: data.result || data.error
      });
      appendLog(`[HERMES] Result compiling: ${data.result || data.error || 'Done'}`);
    };

    const handleHermesUpdate = (update: any) => {
      if (update.type === 'leads_found') {
        showNotification(`Hermes found ${update.data?.leads?.length || 0} leads`);
        appendLog(`[HERMES] Found ${update.data?.leads?.length || 0} leads!`);
      }
      if (update.type === 'reply_received') {
        showNotification(`New reply from ${update.data?.senderName || 'prospect'}`);
        appendLog(`[HERMES] [INCOMING] New reply from: ${update.data?.senderName || 'prospect'}`);
      }
      if (update.type === 'connection_sent') {
        showNotification(`Connection sent to ${update.data?.name || 'prospect'}`);
        appendLog(`[HERMES] Outreach connection successfully sent to: ${update.data?.name || 'prospect'}`);
      }
    };

    const handleTaskStatus = (data: any) => {
      if (data && data.taskId) {
        appendLog(`[SYSTEM] Task ${data.taskId.slice(0, 8)} status update: ${data.status?.toUpperCase()} - ${data.message || ''}`);
      }
    };

    const handleTaskPlanned = (data: any) => {
      if (data && data.taskId) {
        appendLog(`[PLANNER] Task ${data.taskId.slice(0, 8)} has been planned and scheduled.`);
      }
    };

    const handleTaskComplete = (data: any) => {
      if (data && data.taskId) {
        appendLog(`[SUCCESS] Task ${data.taskId.slice(0, 8)} successfully finished!`);
      }
    };

    const handleTaskError = (data: any) => {
      if (data && data.taskId) {
        appendLog(`[ERROR] Task ${data.taskId.slice(0, 8)} failed: ${data.error || 'Execution halted'}`);
      }
    };

    if (socket && currentSocketUrl !== serverUrl) {
      console.log(`Re-connecting socket to new serverUrl: ${serverUrl}`);
      socket.disconnect();
      socket = io(serverUrl, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      currentSocketUrl = serverUrl;
    }

    socket.on('task_progress', handleProgress);
    socket.on('human_needed', handleHumanNeeded);
    socket.on('agency_update', handleAgencyUpdate);
    socket.on('lead_finder_progress', handleLeadFinderProgress);
    socket.on('lead_finder_complete', handleLeadFinderComplete);
    socket.on('daemon_update', handleDaemonUpdate);
    socket.on('niche_config_ready', handleNicheConfigReady);
    socket.on('freelance_job_found', handleFreelanceJobFound);
    socket.on('freelance_complete', handleFreelanceComplete);
    socket.on('hermes_result', handleHermesResult);
    socket.on('hermes_update', handleHermesUpdate);
    socket.on('task_status', handleTaskStatus);
    socket.on('task_planned', handleTaskPlanned);
    socket.on('task_complete', handleTaskComplete);
    socket.on('task_error', handleTaskError);

    return () => {
      socket.off('task_progress', handleProgress);
      socket.off('human_needed', handleHumanNeeded);
      socket.off('agency_update', handleAgencyUpdate);
      socket.off('lead_finder_progress', handleLeadFinderProgress);
      socket.off('lead_finder_complete', handleLeadFinderComplete);
      socket.off('daemon_update', handleDaemonUpdate);
      socket.off('niche_config_ready', handleNicheConfigReady);
      socket.off('freelance_job_found', handleFreelanceJobFound);
      socket.off('freelance_complete', handleFreelanceComplete);
      socket.off('hermes_result', handleHermesResult);
      socket.off('hermes_update', handleHermesUpdate);
      socket.off('task_status', handleTaskStatus);
      socket.off('task_planned', handleTaskPlanned);
      socket.off('task_complete', handleTaskComplete);
      socket.off('task_error', handleTaskError);
    };
  }, [serverUrl]);

  const fetchBrowserUseTasksFallback = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/browser-use/tasks?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const list = await res.json();
        setBrowserUseTasks(list);
        
        const running = list.find((t: any) => t.status === 'running');
        if (running) {
          setActiveBrowserUseTask(running);
        } else {
          setActiveBrowserUseTask(null);
        }
      }
    } catch (e) {
      console.error("Failed to fetch browser use tasks fallback:", e);
    }
  };

  useEffect(() => {
    fetch(`${serverUrl}/api/firebase-config`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch firebase config');
        return res.json();
      })
      .then(config => {
        setFirebaseConfig(config);
        
        let app;
        if (getApps().length === 0) {
          app = initializeApp(config);
        } else {
          app = getApp();
        }
        
        const db = getFirestore(app, config.firestoreDatabaseId || undefined);
        
        const q = query(
          collection(db, 'browser_use_tasks'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBrowserUseTasks(list);
          
          const running = list.find((t: any) => t.status === 'running');
          if (running) {
            setActiveBrowserUseTask(running);
          } else {
            setActiveBrowserUseTask(null);
          }
        }, (error) => {
          console.error("Firestore subscription error, falling back to REST:", error);
          fetchBrowserUseTasksFallback();
        });

        const qJobs = query(
          collection(db, 'freelance_jobs', userId, 'jobs'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        const unsubJobs = onSnapshot(qJobs, (snapshot) => {
          const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setFreelanceJobs(list);
        }, (error) => {
          console.error("Freelance jobs subscription error:", error);
        });

        const qProfiles = query(
          collection(db, 'outreach_sequences', userId, 'profiles'),
          orderBy('connectionSentAt', 'desc'),
          limit(50)
        );
        const unsubProfiles = onSnapshot(qProfiles, (snapshot) => {
          const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setOutreachProfiles(list);
        }, (error) => {
          console.error("Outreach profiles subscription error:", error);
        });

        const qInbox = query(
          collection(db, 'outreach_inbox', userId, 'messages'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        const unsubInbox = onSnapshot(qInbox, (snapshot) => {
          const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setOutreachInbox(list);
        }, (error) => {
          console.error("Outreach inbox subscription error:", error);
        });
        
        return () => {
          unsubscribe();
          unsubJobs();
          unsubProfiles();
          unsubInbox();
        };
      })
      .catch(err => {
        console.warn("Failed to init Firebase Client SDK, using fallback:", err);
        fetchBrowserUseTasksFallback();
      });
  }, [userId]);

  useEffect(() => {
    const iv = setInterval(() => {
      if (!firebaseConfig || browserUseTasks.length === 0) {
        fetchBrowserUseTasksFallback();
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [firebaseConfig, userId, browserUseTasks.length]);

  useEffect(() => {
    fetchLeads();
  }, [leadsFilter]);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/lead-finder/workflows/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [userId]);

  // Filtering list UI
  const filteredLeads = leads.filter(l => {
    // Standard text search filter
    const q = leadsSearch.toLowerCase();
    const matchesSearch = !q || 
           (l.businessName && l.businessName.toLowerCase().includes(q)) || 
           (l.phone && l.phone.includes(q)) || 
           (l.website && l.website.toLowerCase().includes(q)) ||
           (l.city && l.city.toLowerCase().includes(q)) ||
           (l.sector && l.sector.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Location filter
    if (filterLocation) {
      const locLower = filterLocation.toLowerCase().trim();
      const lCity = (l.city || '').toLowerCase();
      const lAddr = (l.address || '').toLowerCase();
      if (!lCity.includes(locLower) && !lAddr.includes(locLower)) {
        return false;
      }
    }

    // Min gap score filter
    const gapScore = l.gapScore || 0;
    if (gapScore < filterMinGapScore) return false;

    // Contact method filter
    if (filterContactMethod !== 'Any') {
      if (filterContactMethod === 'Email' && !l.email) return false;
      if (filterContactMethod === 'LinkedIn' && !l.linkedinUrl) return false;
      if (filterContactMethod === 'WhatsApp' && !l.phone) return false;
    }

    // Date range filter
    if (filterDateRange !== 'All' && l.createdAt) {
      const leadDate = new Date(l.createdAt);
      const now = new Date();
      if (filterDateRange === 'Today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (leadDate < today) return false;
      } else if (filterDateRange === 'Yesterday') {
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (leadDate < yesterday || leadDate >= today) return false;
      } else if (filterDateRange === 'Last 7 Days') {
        const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (leadDate < last7) return false;
      } else if (filterDateRange === 'Last 30 Days') {
        const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (leadDate < last30) return false;
      }
    }

    // Leads filter pill ('no-website' or 'has-website' or 'facebook_ads' or 'facebook_groups')
    if (leadsFilter === 'no-website' && l.website) return false;
    if (leadsFilter === 'has-website' && !l.website) return false;
    if (leadsFilter === 'facebook_ads' && l.source !== 'facebook_ads') return false;
    if (leadsFilter === 'facebook_groups' && l.source !== 'facebook_groups') return false;

    return true;
  }).slice(0, filterCount);

  // Filter logic for active campaign view
  const filteredActiveTaskLeads = activeTaskLeads.filter(l => {
    const q = leadsSearch.toLowerCase();
    const matchesSearch = !q || 
           (l.businessName && l.businessName.toLowerCase().includes(q)) || 
           (l.phone && l.phone.includes(q)) || 
           (l.website && l.website.toLowerCase().includes(q)) ||
           (l.city && l.city.toLowerCase().includes(q)) ||
           (l.sector && l.sector.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Location filter
    if (filterLocation) {
      const locLower = filterLocation.toLowerCase().trim();
      const lCity = (l.city || '').toLowerCase();
      const lAddr = (l.address || '').toLowerCase();
      if (!lCity.includes(locLower) && !lAddr.includes(locLower)) {
        return false;
      }
    }

    // Min gap score filter
    const gapScore = l.gapScore || 0;
    if (gapScore < filterMinGapScore) return false;

    // Contact method filter
    if (filterContactMethod !== 'Any') {
      if (filterContactMethod === 'Email' && !l.email) return false;
      if (filterContactMethod === 'LinkedIn' && !l.linkedinUrl) return false;
      if (filterContactMethod === 'WhatsApp' && !l.phone) return false;
    }

    // Date range filter
    if (filterDateRange !== 'All' && l.createdAt) {
      const leadDate = new Date(l.createdAt);
      const now = new Date();
      if (filterDateRange === 'Today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (leadDate < today) return false;
      } else if (filterDateRange === 'Yesterday') {
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (leadDate < yesterday || leadDate >= today) return false;
      } else if (filterDateRange === 'Last 7 Days') {
        const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (leadDate < last7) return false;
      } else if (filterDateRange === 'Last 30 Days') {
        const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (leadDate < last30) return false;
      }
    }

    return true;
  }).slice(0, filterCount);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#080808] text-[#F5F5F5] font-sans antialiased select-none selection:bg-[#7C5335] selection:text-white">
      
      {/* HEADER BAR */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] bg-[#090909] z-10 shrink-0">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            </div>
            <span className="font-bold text-sm tracking-[0.2em] uppercase text-[#F5F5F5]">
              ASSIX<span className="text-[#7C5335]">.</span>
            </span>
            <div className="w-1.5 h-1.5 bg-[#7C5335] rounded-full animate-pulse" />
          </div>
          
          <nav className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setTab('workspace')} 
              className={`text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase transition cursor-pointer ${tab === 'workspace' ? 'text-[#F5F5F5]' : 'text-[#52525B] hover:text-[#C4C4C4]'}`}
            >
              WORKSPACE
            </button>
            <button 
              onClick={() => setTab('history')} 
              className={`hidden sm:inline-block text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase transition cursor-pointer ${tab === 'history' ? 'text-[#F5F5F5]' : 'text-[#52525B] hover:text-[#C4C4C4]'}`}
            >
              HISTORY
            </button>
            <button 
              onClick={() => setTab('leads')} 
              className={`text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase transition cursor-pointer ${tab === 'leads' ? 'text-[#F5F5F5]' : 'text-[#52525B] hover:text-[#C4C4C4]'}`}
            >
              LEADS
            </button>
            <button 
              onClick={() => setTab('agency')} 
              className={`text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase transition cursor-pointer ${tab === 'agency' ? 'text-[#F5F5F5]' : 'text-[#52525B] hover:text-[#C4C4C4]'}`}
            >
              AGENCY
            </button>
            <button 
              onClick={() => setTab('outreach')} 
              className={`text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase transition cursor-pointer ${tab === 'outreach' ? 'text-[#F5F5F5]' : 'text-[#52525B] hover:text-[#C4C4C4]'}`}
            >
              OUTREACH
            </button>
            <button 
              onClick={() => setTab('freelance')} 
              className={`text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase transition cursor-pointer ${tab === 'freelance' ? 'text-[#F5F5F5]' : 'text-[#52525B] hover:text-[#C4C4C4]'}`}
            >
              FREELANCE
            </button>
            <button 
              onClick={() => { setTab('ig_discovery'); fetchDiscoverySessions(); }} 
              className={`text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase transition cursor-pointer ${tab === 'ig_discovery' ? 'text-[#F5F5F5]' : 'text-[#52525B] hover:text-[#C4C4C4]'}`}
            >
              IG DISCOVERY
            </button>

            {/* MORE Dropdown (History, Settings, and Cloud Mode Status) */}
            <div className="relative">
              <button 
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase transition cursor-pointer ${['history', 'settings'].includes(tab) ? 'text-[#F5F5F5]' : 'text-[#52525B] hover:text-[#C4C4C4]'}`}
              >
                <span>MORE</span>
                <ChevronDown size={10} className={`transition-transform duration-200 ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {moreMenuOpen && (
                <>
                  {/* Invisible backdrop to close the menu on click outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-[#090909] border border-[#1A1A1A] rounded shadow-xl py-1.5 z-50">
                    <button 
                      onClick={() => { setTab('history'); setMoreMenuOpen(false); }} 
                      className={`w-full text-left px-3 py-2 text-[9px] sm:text-[10px] font-bold tracking-[0.12em] uppercase transition ${tab === 'history' ? 'bg-[#1C1C22] text-[#F5F5F5]' : 'text-[#52525B] hover:text-[#C4C4C4] hover:bg-[#121215]'}`}
                    >
                      HISTORY
                    </button>
                    <button 
                      onClick={() => { setTab('settings'); setMoreMenuOpen(false); }} 
                      className={`w-full text-left px-3 py-2 text-[9px] sm:text-[10px] font-bold tracking-[0.12em] uppercase transition ${tab === 'settings' ? 'bg-[#1C1C22] text-[#F5F5F5]' : 'text-[#52525B] hover:text-[#C4C4C4] hover:bg-[#121215]'}`}
                    >
                      SETTINGS
                    </button>
                    <div className="h-px bg-[#1A1A1A] my-1" />
                    <div className="px-3 py-1.5 flex items-center justify-between text-[8px] sm:text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                      <span>Connection:</span>
                      {extensionConnected 
                        ? <span className="text-[#10B981] flex items-center gap-1 font-extrabold">
                            ● Connected
                          </span>
                        : <span className="text-[#555] flex items-center gap-1 font-extrabold">
                            ○ Cloud Mode
                          </span>
                      }
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="p-1.5 bg-[#0F0F12] border border-[#1A1A1D] hover:border-[#7C5335] text-[#A1A1AA] hover:text-[#7C5335] rounded-full transition cursor-pointer flex items-center justify-center shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={12} strokeWidth={2.5} /> : <Moon size={12} strokeWidth={2.5} />}
          </button>

          {activeCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full animate-pulse-slow">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]"></span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#10B981] uppercase">{activeCount} ACTIVE AUTOMATIONS</span>
            </div>
          )}

          <button 
            onClick={() => setNewTaskModal(true)} 
            className="flex items-center gap-2 px-4 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[10px] font-bold tracking-widest uppercase rounded-full shadow-[0_4px_12px_rgba(99,102,241,0.2)] transition active:scale-95"
          >
            <Plus size={10} strokeWidth={3} />
            New Task
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE VIEW */}
      {tab === 'workspace' && (
        <div className="flex flex-1 overflow-hidden relative">

          {/* LEFT COMPANION RAILS - SEARCH DIRECTORIES / TABS */}
          <section 
            style={{ width: leftOpen ? '220px' : '0px' }}
            className="border-r border-[#16161A] h-full flex flex-col pt-4 pb-16 shrink-0 overflow-hidden bg-[#070709] transition-all duration-300 select-none"
          >
            {/* Header / Brand */}
            <div className="px-4 mb-4 shrink-0">
              <h3 className="text-[9px] tracking-[0.25em] text-[#A27B5C] font-extrabold uppercase mb-0.5">SEARCH TABS</h3>
              <p className="text-[8px] text-[#52525B] font-bold tracking-wider uppercase">Lead Directories By Run</p>
            </div>

            {/* Sub-section: ACTIVE SCANS */}
            <div className="px-4 mb-2 flex items-center justify-between shrink-0">
              <span className="text-[8px] tracking-[0.15em] text-[#52525B] font-bold uppercase">ACTIVE SCANS ({tasks.filter(t => t.status === 'running' || t.status === 'paused_captcha' || t.status === 'paused_input' || t.status === 'queued' || t.status === 'planning').length})</span>
              <Activity size={9} className="text-[#10B981] animate-pulse" />
            </div>

            <div className="max-h-[180px] overflow-y-auto space-y-1 select-none shrink-0 border-b border-[#16161A] pb-3 mb-2 scrollbar-thin">
              {tasks.filter(t => t.status === 'running' || t.status === 'paused_captcha' || t.status === 'paused_input' || t.status === 'queued' || t.status === 'planning').length === 0 ? (
                <div className="px-4 py-2 text-left text-[#52525B] text-[9.5px] italic">No active scanners.</div>
              ) : (
                tasks.filter(t => t.status === 'running' || t.status === 'paused_captcha' || t.status === 'paused_input' || t.status === 'queued' || t.status === 'planning').map((task, idx) => {
                  const isActive = activeTask?.taskId === task.taskId;
                  const isRun = task.status === 'running' || task.status === 'paused_captcha' || task.status === 'planning';
                  return (
                    <SwipeableTaskItem
                      key={task.taskId || `active-task-${idx}`}
                      onDelete={() => handleDeleteTask(task.taskId)}
                      onClick={() => selectTask(task, true)}
                      isActive={isActive}
                    >
                      <div 
                        className={`group relative mx-2 py-2 px-2.5 rounded transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#101014] border border-transparent border-l-2 border-l-[#7C5335] text-white shadow-sm rounded-l-none' 
                            : 'bg-transparent border border-transparent hover:bg-[#0C0C0F] hover:border-zinc-800 text-[#A1A1AA]'
                        }`}
                      >
                        {/* Hover direct delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this task?')) {
                              handleDeleteTask(task.taskId);
                            }
                          }}
                          className="absolute right-2 top-2 px-1 py-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-all duration-150 z-20 cursor-pointer border-0"
                          title="Delete task"
                          style={{ background: 'transparent' }}
                        >
                          <Trash2 size={10} />
                        </button>

                        <div className="flex items-center justify-between gap-1.5 mb-1 pr-4">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[10.5px] font-bold tracking-wide truncate max-w-[110px] text-zinc-200">
                              {task.config?.query || task.label || (task.taskType || '').replace(/_/g, ' ')}
                            </span>
                            {task.useStealth && (
                              <span className="px-1 py-0.5 rounded text-[7px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                                STEALTH
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {isRun && (
                              <span className="flex h-1.5 w-1.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]"></span>
                              </span>
                            )}
                            <div 
                              className="w-1.5 h-1.5 rounded-full" 
                              style={{ 
                                background: task.status === 'running' ? '#10B981' : task.status === 'paused_captcha' ? '#F59E0B' : '#52525B' 
                              }} 
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[8px] text-[#52525B] group-hover:text-zinc-500 font-semibold tracking-wide uppercase">
                          <span className="truncate max-w-[90px] text-[#A27B5C]">{task.config?.city || ''}</span>
                          <span>{task.progress || 0} leads</span>
                        </div>

                        {/* Micro progress indicators */}
                        {isRun && task.total > 0 && (
                          <div className="mt-1.5">
                            <div className="w-full bg-[#1A1A22] h-1 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#10B981] h-full transition-all duration-500" 
                                style={{ width: `${task.progressPct || 0}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </SwipeableTaskItem>
                  );
                })
              )}
            </div>

            {/* Sub-section: COMPLETED SEARCH TABS (DIRECTORIES) */}
            <div className="px-4 mt-2 mb-2 flex items-center justify-between shrink-0">
              <span className="text-[8px] tracking-[0.15em] text-[#52525B] font-bold uppercase">SAVED DIRECTORY TABS ({tasks.filter(t => t.status !== 'running' && t.status !== 'paused_captcha' && t.status !== 'paused_input' && t.status !== 'queued' && t.status !== 'planning').length})</span>
              <div className="flex items-center gap-1.5">
                {tasks.length > 0 && (
                  <button
                    onClick={handleDeleteAllTasks}
                    className="text-[7px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 bg-transparent border-0 p-0 cursor-pointer transition-colors"
                    title="Delete all"
                  >
                    Clear All
                  </button>
                )}
                <History size={9} className="text-[#52525B22]" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 select-none scrollbar-thin">
              {tasks.filter(t => t.status !== 'running' && t.status !== 'paused_captcha' && t.status !== 'paused_input' && t.status !== 'queued' && t.status !== 'planning').length === 0 ? (
                <div className="px-4 py-6 text-center text-[#52525B] text-[10px] italic">No completed directories.</div>
              ) : (
                tasks.filter(t => t.status !== 'running' && t.status !== 'paused_captcha' && t.status !== 'paused_input' && t.status !== 'queued' && t.status !== 'planning').map((task, idx) => {
                  const isActive = activeTask?.taskId === task.taskId;
                  return (
                    <SwipeableTaskItem
                      key={task.taskId || `history-task-${idx}`}
                      onDelete={() => handleDeleteTask(task.taskId)}
                      onClick={() => selectTask(task, true)}
                      isActive={isActive}
                    >
                      <div 
                        className={`group relative mx-2 py-2.5 px-3 rounded-md transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#0E0E12] border border-transparent border-l-2 border-l-[#7C5335] text-white shadow-inner rounded-l-none' 
                            : 'bg-[#050507]/40 border border-[#141417] hover:bg-[#0B0B0E]/80 hover:border-zinc-800 text-[#A1A1AA]'
                        }`}
                      >
                        {/* Hover direct delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this completed search directory?')) {
                              handleDeleteTask(task.taskId);
                            }
                          }}
                          className="absolute right-2 top-2 px-1 py-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-all duration-150 z-20 cursor-pointer border-0"
                          title="Delete directory"
                          style={{ background: 'transparent' }}
                        >
                          <Trash2 size={10} />
                        </button>

                        <div className="flex items-center justify-between gap-1.5 mb-1 pr-4">
                          <span className="text-[10.5px] font-bold tracking-wide truncate max-w-[110px] text-zinc-200">
                            {task.config?.query || task.label || (task.taskType || '').replace(/_/g, ' ')}
                          </span>
                          {/* Leads Count Tab Badge */}
                          <div className="px-1.5 py-0.5 rounded-full text-[8px] font-extrabold bg-[#7C5335]/10 text-[#A27B5C] border border-[#7C5335]/20 shrink-0">
                            {task.progress || task.leadsCount || 0}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[8px] text-[#52525B] group-hover:text-zinc-400 font-semibold tracking-wider uppercase font-sans">
                          <span className="truncate max-w-[85px] text-[#A27B5C]">{task.config?.city || ''}</span>
                          {task.createdAt && (
                            <span>{new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          )}
                        </div>
                      </div>
                    </SwipeableTaskItem>
                  );
                })
              )}
            </div>

            {/* Sub-section: SAVED SEARCH QUERY TEMPLATES */}
            <div className="px-4 mt-3 mb-2 flex items-center justify-between shrink-0 border-t border-[#16161A] pt-3">
              <span className="text-[8px] tracking-[0.15em] text-[#52525B] font-bold uppercase">QUERY TEMPLATES ({workflows.length})</span>
              <Activity size={9} className="text-[#52525B22]" />
            </div>

            <div className="max-h-[140px] overflow-y-auto space-y-1 select-none shrink-0 pb-2 scrollbar-thin">
              {workflows.length === 0 ? (
                <div className="px-4 py-2 text-[#52525B] text-[9.5px] italic">No saved templates.</div>
              ) : (
                workflows.map((wf: any, idx) => (
                  <div 
                    key={wf.workflowId || idx} 
                    className="mx-2.5 p-2 rounded bg-[#0A0A0D] border border-[#141418] hover:border-[#10B981]/30 transition flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9.5px] font-bold text-[#F5F5F5] truncate max-w-[125px] uppercase" title={`${wf.niche} in ${wf.location}`}>
                        {wf.niche} in {wf.location}
                      </span>
                      <span className="text-[6px] text-[#10B981] font-extrabold uppercase tracking-wider bg-[#10B981]/5 px-1 py-0.5 border border-[#10B981]/10 rounded shrink-0">
                        {wf.tier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[8px] text-zinc-500 font-medium">
                      <span>Target: {wf.count}</span>
                      <button 
                        onClick={() => handleRunWorkflow(wf)}
                        disabled={searchRunning}
                        className="text-[7px] text-[#A27B5C] hover:text-white bg-[#111116] hover:bg-[#7C5335] border border-[#1F1F24] px-1.5 py-0.5 rounded cursor-pointer font-extrabold uppercase tracking-widest disabled:opacity-30 transition"
                      >
                        Run Again
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* TOGGLE SIDES BUTTONS LEFT/RIGHT */}
          <div 
            onClick={() => setLeftOpen(!leftOpen)} 
            className="absolute top-1/2 -translate-y-1/2 z-20 w-4 h-12 bg-[#141414] border border-[#2A2A2A] border-l-0 rounded-r-lg flex items-center justify-center cursor-pointer text-xs text-[#52525B] hover:text-[#7C5335] hover:bg-[#181818] transition-all"
            style={{ left: leftOpen ? '220px' : '0px' }}
          >
            {leftOpen ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
          </div>

          {/* MAIN COLUMN COMPANION PANEL (OPERATING SCREEN + LOG DATA OR CONSOLE) */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* Task summary header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] bg-[#0A0A0A]/50 shrink-0">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[8px] tracking-[0.15em] text-[#52525B] font-bold uppercase">VIEWING ACTIVE TASK</div>
                  <h3 className="text-xs font-bold tracking-widest text-[#F5F5F5] uppercase mt-0.5">
                    {activeTask ? (activeTask.label || (activeTask.taskType || '').replace(/_/g, ' ')) : 'NO TASK SELECTED.'}
                  </h3>
                </div>
              </div>

              {/* Toggle and status text */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#6366F1]">
                    {executionMode === 'auto' 
                      ? 'Hermes will handle this in background' 
                      : 'Watch browser execute in real time'}
                  </span>
                </div>

                <div className="flex items-center bg-[#141414] border border-[#27272E] rounded-full p-0.5 select-none shrink-0">
                  <button
                    onClick={() => setExecutionMode('auto')}
                    className={`px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-full transition cursor-pointer ${executionMode === 'auto' ? 'bg-[#6366F1] text-white' : 'text-[#52525B] hover:text-zinc-300 bg-transparent'}`}
                  >
                    Auto
                  </button>
                  <button
                    onClick={() => setExecutionMode('live')}
                    className={`px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-full transition cursor-pointer ${executionMode === 'live' ? 'bg-[#10B981] text-white' : 'text-[#52525B] hover:text-zinc-300 bg-transparent'}`}
                  >
                    Live
                  </button>
                </div>
              </div>

              {activeTask && (activeTask.status === 'running' || activeTask.status === 'paused_captcha' || activeTask.status === 'planning') && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleStopTask(activeTask.taskId)}
                    className="px-4 py-1.5 border border-[#EF4444]/30 hover:border-[#EF4444]/60 text-[#EF4444] text-[9px] font-bold tracking-wider uppercase rounded-full bg-red-500/5 transition active:scale-95 cursor-pointer"
                  >
                    Abort Run
                  </button>
                </div>
              )}
            </header>

            {/* Metrics HUD bar */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-1.5 border-b border-[#1A1A1A] bg-[#090909] text-[11px] font-mono tracking-wide shrink-0 select-none text-[#555] min-h-[32px]">
              {activeTask ? (
                <>
                  <span className="text-[#F0ECE4] font-bold">{activeTaskLeads.length || activeTask.totalFound || 0}/{activeTask.total || 0}</span> leads
                  <span className="text-zinc-800 select-none">·</span>
                  <span className="flex items-center gap-1">
                    <span 
                      className="w-1 h-1 rounded-full inline-block" 
                      style={{ 
                        background: activeTask.status === 'running' ? '#7C5335' : activeTask.status === 'paused_captcha' ? '#F59E0B' : activeTask.status === 'complete' ? '#10B981' : '#52525B' 
                      }} 
                    />
                    <span className="text-[#F0ECE4] font-medium uppercase">{(activeTask.status || '').replace(/_/g, ' ')}</span>
                  </span>
                  <span className="text-zinc-800 select-none">·</span>
                  <span className="text-[#F0ECE4] font-bold">
                    {activeTaskLeads.length > 0 
                      ? `${Math.round((activeTaskLeads.filter(l => l.phone && l.website).length / activeTaskLeads.length) * 40 + 60)}%` 
                      : activeTask.totalFound > 0 
                        ? '95%' 
                        : '0%'}
                  </span> accuracy
                  <span className="text-zinc-800 select-none">·</span>
                  <span className="text-[#F0ECE4]">{(activeTask.taskType || 'dynamic').replace(/_/g, ' ')}</span>
                </>
              ) : (
                <span className="text-zinc-600 italic">No active task selected</span>
              )}
            </div>

            {/* ACTION CAPTCHA BAR OVERLAY */}
            {captchaAlert && (
              <div className="bg-[#F59E0B]/5 border-b border-[#F59E0B]/20 py-2.5 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-[#F59E0B] animate-bounce" size={14} />
                  <span className="text-[10px] font-bold tracking-widest text-[#F59E0B] uppercase">CRITICAL: CAPTCHA VERIFICATION INTERCEPT REQUISITE</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleAutoResolveCaptcha}
                    disabled={solvingCaptcha}
                    className="px-4 py-1 bg-[#7C5335] hover:bg-[#A27B5C] text-[#F0ECE4] text-[9px] font-bold tracking-widest uppercase rounded shadow-[0_2px_8px_rgba(124,83,53,0.3)] transition cursor-pointer disabled:opacity-50"
                  >
                    {solvingCaptcha ? '🤖 SOLVING...' : '🤖 AUTO-SOLVE WITH AI'}
                  </button>
                  <button 
                    onClick={handleResolveCaptcha}
                    className="px-4 py-1 bg-[#F59E0B] hover:bg-[#D97706] text-[#080808] text-[9px] font-bold tracking-widest uppercase rounded shadow-[0_2px_8px_rgba(245,158,11,0.3)] transition cursor-pointer"
                  >
                    Resolve CAPTCHA
                  </button>
                </div>
              </div>
            )}

            {/* TAB OUTLET CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              
              {/* LIVE PLAYBACK VIEWPORT */}
              {subTab === 'operator' && (
                <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
                  
                  {/* Virtual Chrome frame */}
                  <div className={`flex-1 border relative rounded overflow-hidden flex flex-col bg-[#0F0F0F] select-none ${captchaAlert ? 'border-[#F59E0B]' : 'border-[#1C1C1F]'}`}>
                    
                    {/* Header bar */}
                    <div className="px-4 py-2 border-b border-[#1A1A1A] bg-[#090909] flex items-center justify-between shrink-0 text-center select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#EF4444]/30" />
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B]/30" />
                        <span className="w-2 h-2 rounded-full bg-[#10B981]/30" />
                      </div>
                      
                      <div className="bg-[#080808] px-4 py-1 text-[9px] text-[#52525B] font-mono select-all tracking-wider rounded w-2/3 max-w-sm truncate text-center mx-auto">
                        {activeTask?.currentUrl || (activeTask?.taskType === 'google_maps_scrape' ? 'https://www.google.com/maps/search' : activeTask?.taskType === 'pages_jaunes_scrape' ? 'https://www.pagesjaunes.ca' : 'https://www.instagram.com/dm')}
                      </div>
                      
                      <div className="w-4 h-4 bg-transparent" />
                    </div>

                    {/* Viewport/Data navigation subheader */}
                    <div className="flex items-center justify-between px-6 py-2 border-b border-[#1A1A1A] bg-[#0C0C0E] select-none text-[9px] font-bold tracking-widest uppercase">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => setWorkspaceBoxTab('viewport')}
                          className={`flex items-center gap-1.5 transition cursor-pointer ${workspaceBoxTab === 'viewport' ? 'text-[#7C5335]' : 'text-[#52525B] hover:text-[#C4C4C4]'}`}
                        >
                          <Video size={10} /> BROWSER VIEWPORT
                        </button>
                        <button 
                          onClick={() => setWorkspaceBoxTab('data')}
                          className={`flex items-center gap-1.5 transition cursor-pointer ${workspaceBoxTab === 'data' ? 'text-[#10B981]' : 'text-[#52525B] hover:text-[#C4C4C4]'}`}
                        >
                          <Database size={10} /> COLLECTED DATA & RESULTS {activeTaskLeads.length > 0 && `(${activeTaskLeads.length})`}
                        </button>
                      </div>

                      {activeTask && (
                        <div className="flex items-center gap-3 font-mono">
                          {(activeTask.steelDebugUrl || activeTask.liveViewUrl) && (
                            <a 
                              href={activeTask.steelDebugUrl || activeTask.liveViewUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded text-[8px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/20 transition flex items-center gap-1.5 animate-pulse"
                              title="Click to view real-time browser actions on Steel.dev"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                              OPEN STEEL LIVE VIEW ↗
                            </a>
                          )}
                          <div className="text-[8px] font-semibold text-[#52525B]">
                            STATUS: {activeTask.status.toUpperCase()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Screenshot view / Results View */}
                    <div className="flex-1 relative bg-[#090909] overflow-y-auto flex flex-col items-center justify-start">
                      {workspaceBoxTab === 'viewport' ? (
                        activeTask ? (
                          <LiveViewer 
                            taskId={activeTask.taskId} 
                            ws={ws.current} 
                            serverUrl={serverUrl} 
                            useFirestore={true} 
                          />
                        ) : true ? (
                          <div className="w-full h-full overflow-y-auto p-6 bg-[#080808] text-[#F5F5F5] flex flex-col items-center justify-center text-center space-y-4 select-none">
                            <div className="w-12 h-12 rounded-full bg-[#7C5335]/10 border border-[#7C5335]/20 flex items-center justify-center text-lg text-[#7C5335] animate-pulse">
                              🤖
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-xs font-bold tracking-[0.2em] text-[#F5F5F5] uppercase font-sans">WORKSPACE STANDBY</h3>
                              <p className="text-[10px] text-[#52525B] tracking-wide uppercase font-medium max-w-sm leading-relaxed font-sans">
                                Use the command chat below to launch a new cognitive browser automation, or select an active task from the sidebar.
                              </p>
                            </div>
                          </div>
                        ) : false ? (
                          <div className="w-full h-full overflow-y-auto p-6 bg-[#080808] text-[#F5F5F5] select-text">
                            <div className="max-w-4xl mx-auto space-y-6">
                              {/* Title Section */}
                              <div className="text-center space-y-2 py-4 border-b border-[#1A1A1A]">
                                <h3 className="text-xs font-bold tracking-[0.25em] text-[#10B981] uppercase">ASSIX INTEL: THREE-TIER LEAD FINDER</h3>
                                <p className="text-[10px] text-[#52525B] tracking-wide uppercase font-medium">Precision Target Sourcing Engine with Exa & Google Maps</p>
                              </div>

                              {/* Search Steps flow */}
                              {searchStep === 'tier' && (
                                <div className="space-y-6">
                                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 text-center">
                                    STEP 1 — Choose your target type:
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Local Business */}
                                    <div 
                                      onClick={() => {
                                        setSelectedTier('local');
                                        setSearchNiche('');
                                        setSearchLocation('');
                                        setSearchGaps(['No online booking', 'No website']);
                                        setSearchStep('config');
                                      }}
                                      className="bg-[#0F0F12] border border-[#1A1A1D] hover:border-[#10B981] p-5 rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#121216] flex flex-col justify-between h-56 group shadow-md"
                                    >
                                      <div>
                                        <div className="w-8 h-8 rounded bg-[#10B981]/10 flex items-center justify-center text-lg mb-3 select-none">
                                          📍
                                        </div>
                                        <h4 className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#10B981] transition uppercase tracking-wider font-sans">LOCAL BUSINESS</h4>
                                        <p className="text-[10px] text-[#8E8E93] mt-1 font-semibold">"Dentists, plumbers, restaurants, salons"</p>
                                        <p className="text-[10px] text-[#52525B] mt-2 leading-relaxed">Uses Google Maps scraping (free). Expected: phone, address, website, rating, reviews.</p>
                                      </div>
                                      <span className="text-[8px] font-bold text-zinc-500 group-hover:text-[#10B981] uppercase tracking-widest mt-4 align-bottom self-end">SELECT TYPE →</span>
                                    </div>

                                    {/* Ecom / Online */}
                                    <div 
                                      onClick={() => {
                                        setSelectedTier('ecom');
                                        setSearchNiche('');
                                        setSearchLocation('');
                                        setSearchGaps(['No email', 'No active pixel']);
                                        setSearchStep('config');
                                      }}
                                      className="bg-[#0F0F12] border border-[#1A1A1D] hover:border-[#7C5335] p-5 rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#121216] flex flex-col justify-between h-56 group shadow-md"
                                    >
                                      <div>
                                        <div className="w-8 h-8 rounded bg-[#7C5335]/10 flex items-center justify-center text-lg mb-3 select-none">
                                          🛍️
                                        </div>
                                        <h4 className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#A27B5C] transition uppercase tracking-wider font-sans">ECOM / ONLINE</h4>
                                        <p className="text-[10px] text-[#8E8E93] mt-1 font-semibold">"Shopify stores, coaches, freelancers"</p>
                                        <p className="text-[10px] text-[#52525B] mt-2 leading-relaxed">Uses Exa company search. Expected: LinkedIn, email, website gaps, technology stacks.</p>
                                      </div>
                                      <span className="text-[8px] font-bold text-zinc-500 group-hover:text-[#A27B5C] uppercase tracking-widest mt-4 align-bottom self-end">SELECT TYPE →</span>
                                    </div>

                                    {/* SaaS / Tech */}
                                    <div 
                                      onClick={() => {
                                        setSelectedTier('saas');
                                        setSearchNiche('');
                                        setSearchLocation('');
                                        setSearchGaps(['No active ads', 'Old tech stack']);
                                        setSearchStep('config');
                                      }}
                                      className="bg-[#0F0F12] border border-[#1A1A1D] hover:border-[#7C5335] p-5 rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#121216] flex flex-col justify-between h-56 group shadow-md"
                                    >
                                      <div>
                                        <div className="w-8 h-8 rounded bg-[#7C5335]/10 flex items-center justify-center text-lg mb-3 select-none">
                                          ⚡
                                        </div>
                                        <h4 className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#A27B5C] transition uppercase tracking-wider font-sans">SAAS / TECH</h4>
                                        <p className="text-[10px] text-[#8E8E93] mt-1 font-semibold">"SaaS platforms, software providers"</p>
                                        <p className="text-[10px] text-[#52525B] mt-2 leading-relaxed">Uses Exa domains with tech filters. Expected: email, LinkedIn, funding stage, tech gaps.</p>
                                      </div>
                                      <span className="text-[8px] font-bold text-zinc-500 group-hover:text-[#A27B5C] uppercase tracking-widest mt-4 align-bottom self-end">SELECT TYPE →</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {searchStep === 'config' && selectedTier && (
                                <div className="space-y-6">
                                  <div className="flex items-center justify-between border-b border-[#1C1C1F] pb-3">
                                    <button 
                                      onClick={() => setSearchStep('tier')}
                                      className="text-[10px] font-extrabold tracking-widest text-zinc-400 hover:text-white uppercase transition flex items-center gap-1.5 cursor-pointer"
                                    >
                                      ← BACK
                                    </button>
                                    <span className="text-[10px] font-extrabold tracking-widest text-[#10B981] bg-[#10B981]/5 border border-[#10B981]/15 px-3 py-1 rounded uppercase select-none">
                                      {selectedTier.toUpperCase()} TARGET MODIFIER
                                    </span>
                                  </div>

                                  <div className="bg-[#0C0C0E] border border-[#1A1A1D] rounded-lg p-6 space-y-5">
                                    {/* Niche Input */}
                                    <div className="space-y-2">
                                      <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                                        Niche / Business Target Type:
                                      </label>
                                      <input 
                                        type="text"
                                        value={searchNiche}
                                        onChange={(e) => setSearchNiche(e.target.value)}
                                        placeholder={
                                          selectedTier === 'local' ? 'e.g. Dentists, Plumbers, Salons' : 
                                          selectedTier === 'ecom' ? 'e.g. Shopify stores, apparel brands' : 
                                          'e.g. AI tools, CRM platforms, ERP'
                                        }
                                        className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-2 text-xs font-medium text-white transition-all duration-300"
                                      />
                                    </div>

                                    {/* Location Input */}
                                    <div className="space-y-2">
                                      <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                                        Target Location:
                                      </label>
                                      <input 
                                        type="text"
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                        placeholder={
                                          selectedTier === 'local' ? 'e.g. Paris, Toronto, Los Angeles' : 
                                          'e.g. Worldwide, France, United States, Remote'
                                        }
                                        className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-2 text-xs font-medium text-white transition-all duration-300"
                                      />
                                    </div>

                                    {/* Gaps Multi Select */}
                                    <div className="space-y-2">
                                      <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                                        Gaps / Deficiencies to find (Select Gaps):
                                      </label>
                                      <div className="flex flex-wrap gap-2 pt-1">
                                        {(selectedTier === 'local' ? [
                                          'No online booking', 'No website', 'Poor ratings (< 4.0)', 'No Google Business claimed'
                                        ] : selectedTier === 'ecom' ? [
                                          'No email', 'No LinkedIn profile', 'No active pixel', 'No contact form'
                                        ] : [
                                          'No active ads', 'Old tech stack', 'No social media tags', 'No live chat'
                                        ]).map((gap) => {
                                          const active = searchGaps.includes(gap);
                                          return (
                                            <button 
                                              key={gap}
                                              type="button"
                                              onClick={() => {
                                                if (active) {
                                                  setSearchGaps(prev => prev.filter(g => g !== gap));
                                                } else {
                                                  setSearchGaps(prev => [...prev, gap]);
                                                }
                                              }}
                                              className={`px-3 py-1.5 rounded text-[10px] font-bold transition border cursor-pointer ${active ? 'bg-[#7C5335]/15 text-[#A27B5C] border-[#7C5335]/40 shadow-sm' : 'bg-[#080808] text-zinc-400 border-[#1C1C1F] hover:border-zinc-700'}`}
                                            >
                                              {gap}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Count select */}
                                    <div className="space-y-2">
                                      <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                                        Target Count (Maximum Leads to Extract):
                                      </label>
                                      <select 
                                        value={searchCount}
                                        onChange={(e) => setSearchCount(parseInt(e.target.value, 10))}
                                        className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-2 text-xs font-medium text-white transition-all duration-300"
                                      >
                                        <option value={5}>5 leads (Recommended - Fast)</option>
                                        <option value={10}>10 leads (Comprehensive)</option>
                                        <option value={20}>20 leads (Deep Search)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                      onClick={handleResetSearch}
                                      className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white border border-[#1C1C1F] text-[10px] font-extrabold tracking-widest uppercase rounded transition cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button 
                                      onClick={() => setSearchStep('confirm')}
                                      disabled={!searchNiche || !searchLocation}
                                      className="px-5 py-2.5 bg-[#7C5335] hover:bg-[#7C5335] disabled:opacity-40 text-white text-[10px] font-extrabold tracking-widest uppercase rounded transition shadow-md cursor-pointer"
                                    >
                                      Next: Confirmation →
                                    </button>
                                  </div>
                                </div>
                              )}

                              {searchStep === 'confirm' && (
                                <div className="space-y-6">
                                  <div className="flex items-center justify-between border-b border-[#1C1C1F] pb-3">
                                    <button 
                                      onClick={() => setSearchStep('config')}
                                      className="text-[10px] font-extrabold tracking-widest text-zinc-400 hover:text-white uppercase transition flex items-center gap-1.5 cursor-pointer"
                                    >
                                      ← BACK
                                    </button>
                                    <span className="text-[10px] font-extrabold tracking-widest text-[#A27B5C] bg-[#7C5335]/5 border border-[#7C5335]/15 px-3 py-1 rounded uppercase select-none">
                                      PRE-FLIGHT VALIDATION SUMMARY
                                    </span>
                                  </div>

                                  <div className="bg-[#0C0C0E] border border-[#1A1A1D] rounded-lg p-6 space-y-6">
                                    <div className="text-center space-y-1">
                                      <h4 className="text-xs font-extrabold tracking-widest text-[#F5F5F5] uppercase">READY FOR INGESTION</h4>
                                      <p className="text-[10px] text-zinc-500 font-medium">Verify your target campaign configuration before spawning browser workflows</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-b border-[#1C1C1F]/60 py-5 text-xs">
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">TARGET TIER:</span>
                                        <span className="text-emerald-400 font-extrabold uppercase bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 rounded">{selectedTier?.toUpperCase()}</span>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">LEAD COUNT LIMIT:</span>
                                        <span className="text-white font-extrabold">{searchCount} Prospects</span>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">NICHE SECTOR:</span>
                                        <span className="text-white font-bold">{searchNiche}</span>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">TARGET REGION:</span>
                                        <span className="text-white font-bold">{searchLocation}</span>
                                      </div>
                                      <div className="col-span-2 space-y-1">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">SELECTED DEFICIENCIES / GAPS:</span>
                                        <span className="text-red-400 font-medium font-mono text-[11px] bg-red-500/5 px-2 py-1 border border-red-500/10 rounded block">
                                          {searchGaps.join(', ') || 'Analyze all available gaps'}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                                      <button 
                                        onClick={handleSaveWorkflow}
                                        className="w-full sm:w-auto px-4 py-2 bg-transparent hover:bg-zinc-800 text-[#A27B5C] hover:text-white border border-[#7C5335]/30 text-[10px] font-extrabold tracking-widest uppercase rounded transition cursor-pointer flex items-center justify-center gap-1.5"
                                      >
                                        ⭐ Save Search as Workflow
                                      </button>
                                      
                                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                        <button 
                                          onClick={() => setSearchStep('config')}
                                          className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white border border-[#1C1C1F] text-[10px] font-extrabold tracking-widest uppercase rounded transition cursor-pointer"
                                        >
                                          Modify
                                        </button>
                                        <button 
                                          onClick={handleLaunchSearch}
                                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold tracking-widest uppercase rounded transition shadow-[0_2px_10px_rgba(16,185,129,0.25)] cursor-pointer"
                                        >
                                          🚀 LAUNCH SEARCH
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {searchStep === 'running' && (
                                <div className="space-y-6">
                                  <div className="bg-[#0C0C0E] border border-[#1A1A1D] rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-5">
                                    <div className="relative">
                                      <div className="w-16 h-16 rounded-full border-2 border-[#7C5335] border-t-transparent animate-spin flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-[#7C5335]/10 animate-pulse" />
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="text-xs font-extrabold tracking-[0.2em] text-[#10B981] uppercase">ACTIVE COGNITIVE AGENT SCRAPE RUNNING</h4>
                                      <p className="text-[10px] text-zinc-500 leading-relaxed max-w-md mx-auto">
                                        Assix is executing search and enrichment. Check the logs in the side panel or watch live terminal updates in the Command Chat below!
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                      <button 
                                        onClick={() => {
                                          setSubTab('console'); // Highlight chat panel
                                        }}
                                        className="px-4 py-2 bg-[#1A1A24] border border-[#27273A] text-zinc-300 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition"
                                      >
                                        Show Command Chat
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {searchStep === 'complete' && (
                                <div className="space-y-6">
                                  <div className="bg-[#0C0C0E] border border-[#1A1A1D] rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl select-none animate-bounce">
                                      ✨
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="text-xs font-extrabold tracking-[0.2em] text-emerald-400 uppercase">COGNITIVE ENGINE WORKFLOW COMPLETE</h4>
                                      <p className="text-[10px] text-zinc-400 max-w-sm mx-auto">
                                        Successfully compiled and enriched targets matching your exact criteria. You can now view them in the data tab or push them to CRM.
                                      </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 select-none">
                                      <button 
                                        onClick={() => {
                                          setWorkspaceBoxTab('data'); // Switch to Collected Data & Results
                                        }}
                                        className="px-5 py-2.5 bg-[#7C5335] hover:bg-[#7C5335] text-white text-[10px] font-extrabold tracking-widest uppercase rounded transition cursor-pointer shadow-md"
                                      >
                                        View Extracted Leads
                                      </button>
                                      <button 
                                        onClick={handleResetSearch}
                                        className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white border border-[#1C1C1F] text-[10px] font-extrabold tracking-widest uppercase rounded transition cursor-pointer"
                                      >
                                        Start New Search
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null
                      ) : (
                        // DATA & RESULTS VIEW
                        <div className="w-full h-full bg-[#070709] overflow-y-auto p-5 select-text">
                          {activeTaskLeads.length > 0 ? (
                            <div className="space-y-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1A1A1D] pb-3 select-none">
                                <span className="text-[10px] font-bold tracking-wider text-[#A1A1AA] uppercase flex items-center gap-2">
                                  <Database size={12} className="text-[#10B981]" /> Extracted Targets for Campaign
                                </span>
                                <div className="flex items-center gap-2">
                                  {/* View mode toggle */}
                                  <div className="flex items-center gap-1 bg-[#121214] border border-[#222225] p-1 rounded-full select-none">
                                    <button 
                                      onClick={() => setActiveTaskLeadsViewMode('cards')} 
                                      className={`p-1 rounded-full transition ${activeTaskLeadsViewMode === 'cards' ? 'bg-[#7C5335] text-white shadow' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                                      title="Card View"
                                    >
                                      <LayoutGrid size={10} />
                                    </button>
                                    <button 
                                      onClick={() => setActiveTaskLeadsViewMode('table')} 
                                      className={`p-1 rounded-full transition ${activeTaskLeadsViewMode === 'table' ? 'bg-[#7C5335] text-white shadow' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                                      title="Table View"
                                    >
                                      <List size={10} />
                                    </button>
                                  </div>

                                  {activeTask && (
                                    <a 
                                      href={`${serverUrl}/api/task/${activeTask.taskId}/export/csv`} 
                                      download
                                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#222225] hover:border-[#7C5335]/50 bg-[#121214] hover:bg-[#151518] text-[#A1A1AA] hover:text-[#7C5335] text-[9px] font-bold tracking-widest uppercase rounded transition cursor-pointer"
                                    >
                                      <Download size={10} /> Download CSV
                                    </a>
                                  )}
                                  <button 
                                    onClick={handleBatchPushLeads}
                                    className="px-3.5 py-1.5 bg-[#7C5335] hover:bg-[#694226] text-white text-[9px] font-bold tracking-widest uppercase rounded shadow transition cursor-pointer"
                                  >
                                    Sync Leads to Close CRM
                                  </button>
                                </div>
                              </div>

                              {activeTaskLeadsViewMode === 'table' ? (
                                <div className="overflow-x-auto rounded border border-[#1A1A1D]">
                                  <table className="w-full text-left text-[11px] border-collapse">
                                    <thead className="bg-[#0E0E11] text-[8px] text-[#52525B] uppercase font-bold tracking-widest border-b border-[#1A1A1D] select-none">
                                      <tr>
                                        <th className="px-4 py-2.5">Business Name</th>
                                        <th className="px-4 py-2.5">Phone</th>
                                        <th className="px-4 py-2.5">Website</th>
                                        <th className="px-4 py-2.5">Address</th>
                                        <th className="px-4 py-2.5">Rating & Reviews</th>
                                        <th className="px-4 py-2.5">Type</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#1A1A1D]">
                                      {activeTaskLeads.map((lead) => (
                                        <tr key={lead.leadId} className="hover:bg-[#121214] transition">
                                          <td className="px-4 py-3 font-semibold text-[#F5F5F5]">{lead.businessName}</td>
                                          <td className="px-4 py-3 text-[#A1A1AA] font-mono">{lead.phone || '—'}</td>
                                          <td className="px-4 py-3 text-[#A1A1AA]">
                                            {lead.website ? (
                                              <a href={lead.website} target="_blank" rel="noreferrer" className="text-[#A27B5C] hover:underline font-mono truncate max-w-[150px] block" title={lead.website}>
                                                {lead.website.replace(/https?:\/\/|www\./g, '')}
                                              </a>
                                            ) : '—'}
                                          </td>
                                          <td className="px-4 py-3 text-[#7C7C85] truncate max-w-[150px]" title={lead.address || lead.city || ''}>{lead.address || lead.city || '—'}</td>
                                          <td className="px-4 py-3 text-amber-400 font-semibold">
                                            {lead.rating ? `${lead.rating} ★` : '—'}
                                            {lead.reviewsCount ? <span className="text-zinc-500 font-normal text-[10px] ml-1">({lead.reviewsCount})</span> : ''}
                                          </td>
                                          <td className="px-4 py-3">
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                              lead.leadType === 'no_website' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#10B981]/10 text-[#10B981]'
                                            }`}>
                                              {lead.leadType === 'no_website' ? 'No Web' : 'Has Web'}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                  {activeTaskLeads.map((lead) => (
                                    <LeadCard 
                                      key={lead.leadId} 
                                      lead={lead} 
                                      onPushLead={handlePushLead} 
                                      isPushing={pushingLeadId === lead.leadId} 
                                      serverUrl={serverUrl}
                                      onSkip={handleSkipLead}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (activeTask?.results || (activeTask as any)?.config?.goal) ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-[#1A1A1D] pb-3 select-none">
                                <span className="text-[10px] font-bold tracking-wider text-[#A1A1AA] uppercase flex items-center gap-2">
                                  <FileText size={12} className="text-[#7C5335]" /> Browser Use Execution Yield
                                </span>
                              </div>
                              
                              {(activeTask as any)?.config?.goal && (
                                <div className="bg-[#121215] border border-[#1A1A1D] rounded p-3 text-[10px] text-[#A1A1AA]">
                                  <span className="font-bold text-[#F5F5F5] block mb-1">TASK BRIEF</span>
                                  "{(activeTask as any)?.config?.goal}"
                                </div>
                              )}

                              {activeTask?.results && (
                                <div className="bg-[#0F0F12] border border-[#1A1A1D] rounded p-4 font-mono text-[11px] leading-relaxed text-[#A1A1AA] select-text whitespace-pre-wrap">
                                  <span className="font-bold text-[#10B981] block mb-2 font-sans text-xs">COLLECTED INFO:</span>
                                  {typeof activeTask.results === 'string' ? activeTask.results : JSON.stringify(activeTask.results, null, 2)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-[#52525B] h-full">
                              <Database size={32} className="text-[#52525B11] mb-4 animate-pulse" />
                              <p className="text-xs font-semibold tracking-wide uppercase">No structured findings loaded yet</p>
                              <p className="text-[10px] text-[#52525B] max-w-sm mt-1">If the automation is currently running, listings and results will update live here as soon as they are captured by the web scraper.</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Decisive CAPTCHA viewport block overlay */}
                      {captchaAlert && captchaScreenshot && (
                        <div className="absolute inset-0 bg-[#080808EE] z-10 flex flex-col items-center justify-center p-8">
                          <div className="max-w-md w-full border border-[#F59E0B]/30 rounded-lg bg-[#0F0F0F] p-6 flex flex-col items-center text-center">
                            <ShieldAlert size={28} className="text-[#F59E0B] mb-3 animate-bounce" />
                            <h4 className="text-xs font-bold tracking-widest text-[#F59E0B] uppercase">AGENT INTERCEPTED BY CAPTCHA</h4>
                            <p className="text-[10px] text-[#52525B] max-w-xs mt-1 mb-4">Please solve the challenge below on the visual projection or let our Gemini-powered AI Auto-Solver click it for you.</p>
                            
                            <div className="w-full h-48 bg-[#080808] border border-[#2A2A2A] rounded overflow-hidden flex items-center justify-center mb-4 relative">
                              <img src={captchaScreenshot} alt="Stuck in CAPTCHA challenge screen" className="max-w-full max-h-full object-contain" />
                              {solvingCaptcha && (
                                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-[#F59E0B] gap-2">
                                  <div className="w-6 h-6 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
                                  <span className="text-[9px] font-bold uppercase tracking-wider">AI Solvator Working...</span>
                                </div>
                              )}
                            </div>

                            {captchaError && (
                              <p className="text-[10px] text-rose-400 mb-3 bg-rose-950/20 px-2.5 py-1 rounded border border-rose-900/30 w-full text-center">{captchaError}</p>
                            )}

                            <div className="flex gap-2 w-full">
                              <button 
                                onClick={handleAutoResolveCaptcha}
                                disabled={solvingCaptcha}
                                className="flex-1 py-2 bg-[#7C5335] hover:bg-[#A27B5C] text-[#F0ECE4] text-[10px] font-bold tracking-widest uppercase rounded shadow-[0_4px_12px_rgba(124,83,53,0.25)] transition active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                {solvingCaptcha ? 'SOLVING...' : '🤖 RUN AI SOLVER'}
                              </button>
                              <button 
                                onClick={handleResolveCaptcha}
                                className="flex-1 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#080808] text-[10px] font-bold tracking-widest uppercase rounded shadow-[0_4px_12px_rgba(245,158,11,0.25)] transition active:scale-95 cursor-pointer"
                              >
                                RESOLVE & RESUME
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer hud bar inside projection frame */}
                    <footer className="px-4 py-2 bg-[#090909] border-t border-[#1a1a1a] flex items-center justify-between text-[8px] font-semibold text-[#52525B] tracking-widest uppercase shrink-0">
                      <div className="flex items-center gap-3">
                        <span className={activeTask?.status === 'running' || activeTask?.status === 'paused_captcha' ? 'text-[#10B981]' : 'text-[#52525B]'}>
                          ● {activeTask?.status || 'OFFLINE'}
                        </span>
                        <span>{activeTask?.progress || 0} LEADS CAPTURED</span>
                      </div>
                      
                      <div className="truncate max-w-[200px]">
                        {activeTask?.config?.city ? `${activeTask.config.city} · ${activeTask.config.niche}` : (activeTask?.label || (activeTask?.taskType || '').replace(/_/g, ' ') || 'STANDBY')}
                      </div>
                    </footer>
                  </div>

                  {/* Realtime Action Logs Feed */}
                  <div className={`border border-[#1C1C1F] bg-[#0A0A0A] rounded overflow-hidden flex flex-col shrink-0 transition-all duration-300 ${liveLogOpen ? 'h-48' : 'h-[34px]'}`}>
                    <div 
                      onClick={() => setLiveLogOpen(!liveLogOpen)}
                      className="px-4 py-2 border-b border-[#1A1A1A] bg-[#0E0E10] flex items-center justify-between shrink-0 cursor-pointer hover:bg-[#121215] transition-all select-none"
                    >
                      <span className="text-[8px] tracking-[0.16em] text-[#A1A1AA] font-bold uppercase flex items-center gap-2">
                        <span>LIVE ACTION LOGS</span>
                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-extrabold ${liveLogOpen ? 'bg-[#7C5335]/20 text-[#A27B5C]' : 'bg-emerald-500/20 text-emerald-400 animate-pulse'}`}>
                          {liveLogOpen ? 'COLLAPSE' : 'EXPAND TO OPEN'}
                        </span>
                      </span>
                      <span className="text-[7px] text-zinc-500 font-mono leading-none uppercase">
                        {logs.length} EVENTS RECORDED
                      </span>
                    </div>

                    <div 
                      ref={logContainerRef}
                      className={`flex-1 p-4 overflow-y-auto space-y-1.5 font-mono text-[10px] tracking-wide transition-all ${liveLogOpen ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 p-0 overflow-hidden'}`}
                    >
                      {logs.length === 0 ? (
                        <div className="text-[#52525B] text-center py-6 select-none uppercase">No activity logs recorded yet.</div>
                      ) : (
                        logs.map((log, i) => {
                          let typeColor = 'text-[#52525B]';
                          if (log.type === 'success') typeColor = 'text-[#10B981]';
                          if (log.type === 'warning') typeColor = 'text-[#F59E0B]';
                          if (log.type === 'error') typeColor = 'text-[#EF4444]';
                          return (
                            <div key={i} className="flex gap-4 items-start select-text leading-relaxed hover:bg-[#0E0E10] px-1 py-0.5 rounded transition">
                              <span className="text-[#2A2A2A] shrink-0 font-medium select-none">{log.time}</span>
                              <span className={typeColor}>{log.msg}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* COGNITIVE AI CONSOLE */}
              {subTab === 'console' && (
                <div className="flex-1 flex flex-col border border-[#1A1A1A] bg-[#090909] rounded overflow-hidden mx-6 mt-6 mb-24 shadow-2xl relative">
                  
                  {/* Console Header Info */}
                  <header className="px-5 py-2.5 bg-[#0E0E10] border-b border-[#1A1A1A] flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold tracking-[0.15em] text-[#52525B] uppercase font-sans">COGNITIVE CAMPAIGN COMMANDS</span>
                    </div>
                  </header>

                  <div 
                    ref={chatContainerRef}
                    className="flex-1 p-6 overflow-y-auto space-y-4"
                  >
                    {chat.map((msg, i) => {
                       if (msg.role === 'log') {
                         return (
                           <div key={i} className="mr-auto items-start text-left max-w-[80%] font-mono text-[11px] text-zinc-500 pl-2 py-0.5 select-text">
                             → {msg.msg}
                           </div>
                         );
                       }

                       const isUser = msg.role === 'user';
                       const isAssistant = msg.role === 'assistant';

                       return (
                         <div 
                           key={i} 
                           className={`flex flex-col max-w-[80%] ${isUser ? 'ml-auto items-end text-right' : 'mr-auto items-start text-left'}`}
                         >
                           <div 
                             className={`px-4 py-2.5 font-sans leading-relaxed text-xs shadow-sm border ${
                               isUser 
                                 ? 'bg-[#7C5335] border-[#694226] text-white rounded-2xl rounded-tr-none' 
                                 : isAssistant
                                   ? 'bg-white border-zinc-200 text-zinc-900 rounded-2xl rounded-tl-none'
                                   : 'bg-[#101012] border-[#1C1C1F] text-[#D4D4D8] rounded-2xl rounded-tl-none'
                             }`}
                           >
                            {(msg.role === 'agent' || msg.role === 'assistant') && (
                              <div className={`text-[7px] tracking-[0.18em] font-bold uppercase mb-1 font-sans ${isAssistant ? 'text-[#7C5335]' : 'text-[#7C5335]'}`}>
                                ASSIX AGENT
                              </div>
                            )}
                            <div className="whitespace-pre-wrap select-text">{msg.msg}</div>
                          </div>

                          {msg.files && msg.files.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5 max-w-full justify-end">
                              {msg.files.map((filename, fidx) => (
                                <div 
                                  key={fidx} 
                                  className="bg-[#141416] border border-[#242427] text-white px-2 py-0.5 text-[8px] rounded flex items-center gap-1 font-mono hover:text-[#7C5335] transition"
                                >
                                  <Paperclip size={8} /> {filename}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {isSending && (
                      <div className="flex flex-col items-start max-w-[80%] mr-auto text-left">
                        <div className="bg-[#101012] border border-[#1C1C1F] text-[#52525B] rounded px-4 py-2.5 text-xs shadow-md">
                          <span className="text-[7px] tracking-[0.18em] font-fold text-[#52525B] uppercase block mb-1 font-sans">AI PLANNER WORKING</span>
                          <span className="animate-pulse flex items-center gap-2">Connecting to LLM, formulating pipeline steps... <RefreshCw size={10} className="animate-spin text-[#7C5335]" /></span>
                        </div>
                      </div>
                    )}

                    {agencyProgress && (
                      <div className="border border-[#1a1a1a] bg-[#080808] text-[#f0ece4] p-5 rounded-lg space-y-4 font-sans select-text mt-4 w-full max-w-2xl mr-auto">
                        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-2">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">AGENCY EXECUTION PLATFORM</span>
                          <span className={`text-[8px] font-bold tracking-widest px-2 py-0.5 rounded uppercase ${
                            agencyProgress.status === 'done' ? 'bg-[#10B981]/10 text-[#10B981]' : agencyProgress.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-[#7C5335]/10 text-[#A27B5C] animate-pulse'
                          }`}>
                            {agencyProgress.status === 'done' ? 'COMPLETE' : agencyProgress.status === 'failed' ? 'FAILED' : 'RUNNING'}
                          </span>
                        </div>

                        {/* Message indicator */}
                        <div className="text-xs text-zinc-400">
                          <span className="font-bold text-zinc-500">STATUS:</span> {agencyProgress.message}
                        </div>

                        {/* TEAM SECTION */}
                        <div>
                          <div className="text-[9px] font-bold tracking-widest uppercase text-zinc-400 mb-2">YOUR TEAM</div>
                          <div className="space-y-1.5 text-xs">
                            {agencyProgress.data?.plan?.selectedAgents ? (
                              agencyProgress.data.plan.selectedAgents.map((agentId: string) => {
                                const agentName = AGENCY_AGENT_NAMES[agentId] || agentId;
                                const isCompleted = agencyProgress.data.results?.some((r: any) => r.agentId === agentId);
                                const isExecuting = agencyProgress.step === `executing_${agentId}`;
                                
                                return (
                                  <div key={agentId} className="flex items-center justify-between bg-[#0F0F0F] border border-[#141414] p-2 rounded">
                                    <div className="flex items-center gap-2">
                                      {isCompleted ? (
                                        <span className="text-[#10B981] font-bold">✓</span>
                                      ) : isExecuting ? (
                                        <span className="relative flex h-2 w-2 mr-1">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C5335] opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C5335]"></span>
                                        </span>
                                      ) : (
                                        <span className="text-zinc-600 font-bold">○</span>
                                      )}
                                      <span className={`font-semibold ${isExecuting ? 'text-[#A27B5C] animate-pulse' : 'text-[#f0ece4]'}`}>
                                        {agentName}
                                      </span>
                                    </div>
                                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">
                                      {isCompleted ? 'Finished' : isExecuting ? 'Executing...' : 'Queued'}
                                    </span>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-zinc-500 italic text-[11px]">Assembling specialized agent team...</div>
                            )}
                          </div>
                        </div>

                        {/* SERVICE IDEAS UNLOCKED */}
                        {agencyProgress.data?.plan?.serviceIdeas && agencyProgress.data.plan.serviceIdeas.length > 0 && (
                          <div>
                            <div className="text-[9px] font-bold tracking-widest uppercase text-zinc-400 mb-2">SERVICE IDEAS UNLOCKED</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              {agencyProgress.data.plan.serviceIdeas.map((idea: string, idx: number) => (
                                <div key={idx} className="bg-[#0F0F0F] border border-[#141414] p-3 rounded flex flex-col justify-between">
                                  <div className="flex items-start gap-2 mb-2">
                                    <span className="text-sm">💡</span>
                                    <span className="font-medium text-[#f0ece4]">{idea}</span>
                                  </div>
                                  <button
                                    onClick={() => handleSaveServiceIdea(idea)}
                                    className="self-start text-[8px] font-bold tracking-widest uppercase text-[#10B981] hover:text-emerald-300 transition cursor-pointer"
                                  >
                                    [Save as Workflow]
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* DELIVERABLES (SYNTHESIS) */}
                        {agencyProgress.data?.synthesis && (
                          <div className="border-t border-[#1a1a1a] pt-4">
                            <div className="text-[9px] font-bold tracking-widest uppercase text-zinc-400 mb-2">DELIVERABLES</div>
                            <div className="bg-[#09090C] p-4 rounded border border-[#1a1a1a] text-xs leading-relaxed text-[#f0ece4] whitespace-pre-wrap font-sans select-text">
                              {agencyProgress.data.synthesis}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Drag-and-drop/Attachments bar */}
                  {attachments.length > 0 && (
                    <div className="px-5 py-2.5 border-t border-[#1C1C1F] bg-[#0E0E10] flex flex-wrap gap-2 shrink-0">
                      {attachments.map((file, i) => (
                        <div 
                          key={i} 
                          className="px-2.5 py-1 bg-[#18181B] border border-[#2A2A2E] text-white text-[9px] rounded flex items-center gap-2 font-mono"
                        >
                          <Paperclip size={10} className="text-[#7C5335]" />
                          <span>{file.name}</span>
                          <button 
                            onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-[#52525B] hover:text-[#EF4444] font-bold text-[11px] ml-1.5 font-sans cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Console inputs panel */}
                  <div className="px-5 py-4 border-t border-[#1A1A1A] bg-[#0A0A0A] flex items-center gap-3 shrink-0">
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      multiple 
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-9 h-9 border border-[#222225] hover:border-[#7C5335]/50 bg-[#121214] hover:bg-[#161619] rounded flex items-center justify-center text-[#52525B] hover:text-[#7C5335] transition shadow-inner shrink-0 cursor-pointer"
                    >
                      <Paperclip size={14} />
                    </button>

                    <input 
                      type="text" 
                      value={consoleInput}
                      onChange={e => setConsoleInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleConsoleSubmit()}
                      onFocus={() => setChatInputFocused(true)}
                      onBlur={() => setTimeout(() => setChatInputFocused(false), 200)}
                      placeholder={agencyMode ? "Describe your business goal..." : "Input outreach brief, instruct LLM, or type 'do: [goal]' to trigger automatic browser scrape..."}
                      className="flex-1 bg-[#121214] border border-[#222225] text-[#F5F5F5] rounded px-4 py-2.5 text-xs outline-none focus:border-[#7C5335] focus:ring-1 focus:ring-[#7C5335]/30 transition placeholder-[#52525B] font-medium"
                    />

                    <button 
                      onClick={() => setAgencyMode(!agencyMode)}
                      className={`h-9 px-3 border rounded text-[9px] font-bold tracking-widest uppercase transition shrink-0 cursor-pointer ${
                        agencyMode 
                          ? 'bg-[#10B981]/10 border-[#10B981]/50 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                          : 'bg-[#121214] border-[#222225] text-[#52525B] hover:text-[#C4C4C4]'
                      }`}
                      title="Toggle Agency Mode"
                    >
                      AGENCY {agencyMode ? 'ON' : 'OFF'}
                    </button>

                    {activeDynamicTaskId && (
                      <button 
                        onClick={() => {
                          setActiveDynamicTaskId('');
                          setChat(prev => [...prev, { role: 'agent', msg: 'Current browser session context cleared. Ready to start a fresh session.' }]);
                        }}
                        className="h-9 px-3 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] rounded text-[9px] font-bold tracking-widest uppercase transition shrink-0 cursor-pointer"
                        title="Start a fresh browser session"
                      >
                        RESET SESSION
                      </button>
                    )}

                    <button 
                      onClick={handleConsoleSubmit}
                      disabled={isSending}
                      className="h-9 px-5 bg-white hover:bg-neutral-200 text-black font-bold tracking-widest text-[9px] uppercase rounded transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                    >
                      SEND
                    </button>
                  </div>
                </div>
              )}

              {/* OUTLET NAVIGATION TRIGGER BUTTON PILL */}
              {!chatInputFocused && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1 bg-[#141416]/90 backdrop-blur border border-[#232326] shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-full">
                  <button 
                    onClick={() => setSubTab('operator')} 
                    className={`px-5 py-2 text-[9px] font-bold tracking-widest uppercase rounded-full transition ${subTab === 'operator' ? 'bg-[#F5F5F5] text-[#080808]' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                  >
                    LIVE SCREEN
                  </button>
                  <button 
                    onClick={() => setSubTab('console')} 
                    className={`px-5 py-2 text-[9px] font-bold tracking-widest uppercase rounded-full transition ${subTab === 'console' ? 'bg-[#F5F5F5] text-[#080808]' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                  >
                    AI COMMANDS
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* AGENCY TAB */}
      {tab === 'agency' && (
        <AgencyTab
          socket={socket}
          userId={userId}
          serverUrl={serverUrl}
          setTab={setTab}
          setActiveTaskId={async (taskId) => {
            if (!taskId) {
              setActiveTask(null);
              return;
            }
            await fetchTasks();
            const updatedTasks = await fetch(`${serverUrl}/api/tasks/all`).then(r => r.json());
            const selected = updatedTasks.find((t: Task) => t.taskId === taskId);
            if (selected) {
              setActiveTask(selected);
            }
          }}
          fetchTasks={fetchTasks}
        />
      )}

      {/* ALL TASKS FULL VIEW */}
      {tab === 'tasks' && (
        <section className="flex-1 flex flex-col p-6 overflow-y-auto shrink-0 bg-[#080808]">
          <div className="max-w-5xl mx-auto w-full">
            <header className="flex items-center justify-between border-b border-[#1A1A1A] pb-5 mb-8 select-none">
              <div>
                <div className="text-[8px] tracking-[0.16em] text-[#52525B] font-bold uppercase">BOT SYSTEM SEQUENCES</div>
                <h2 className="text-sm font-extrabold tracking-widest text-[#F5F5F5] uppercase mt-0.5 flex items-center gap-2">
                  All Active and Scheduled Tasks
                </h2>
              </div>
              {tasks.length > 0 && (
                <button
                  onClick={handleDeleteAllTasks}
                  className="px-4 py-1.5 border border-red-500/30 hover:border-red-500 bg-red-950/10 hover:bg-red-950/30 text-red-400 hover:text-red-300 text-[9px] font-bold tracking-widest uppercase rounded transition cursor-pointer"
                >
                  Delete All Tasks
                </button>
              )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.length === 0 ? (
                <div className="md:col-span-2 text-center py-20 text-xs text-[#52525B] uppercase font-bold tracking-widest select-none">
                  No tasks found. Create a new task above to initiate.
                </div>
              ) : (
                tasks.map((task, idx) => {
                  const isRun = task.status === 'running' || task.status === 'paused_captcha';
                  return (
                    <div 
                      key={task.taskId || `task-full-${idx}`} 
                      onClick={() => {
                        selectTask(task, true);
                      }}
                      className="p-5 bg-[#0F0F11] border border-[#1C1C1F] hover:border-[#7C5335]/50 rounded cursor-pointer transition duration-200 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-semibold tracking-wide text-[#F5F5F5] uppercase">
                              {task.label || (task.taskType || '').replace(/_/g, ' ')}
                            </h4>
                            {task.useStealth && (
                              <span className="px-1 py-0.5 rounded text-[7px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                STEALTH
                              </span>
                            )}
                          </div>
                          <span className="text-[8px] text-[#52525B] font-mono tracking-widest uppercase mt-1 block">
                            ID: {task.taskId ? `${task.taskId.slice(0, 18)}...` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ 
                              background: task.status === 'complete' ? '#10B981' : task.status === 'running' ? '#7C5335' : task.status === 'paused_captcha' ? '#F59E0B' : task.status === 'error' ? '#EF4444' : '#52525B' 
                            }} 
                          />
                          <span className="text-[8px] font-bold tracking-widest text-[#A1A1AA] uppercase">
                            {(task.status || '').replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-[10px] text-[#A1A1AA]">
                          Progress: <span className="font-mono text-[#F5F5F5]">{task.progress}/{task.total}</span>
                        </div>
                        {task.createdAt && (
                          <div className="text-[8px] text-[#52525B] font-mono font-sans mt-0.5">
                            {task.createdAt.slice(0, 10)}
                          </div>
                        )}
                      </div>

                      {/* Progress bar inside card if active */}
                      {task.total > 0 && (
                        <div className="mt-3 w-full bg-[#161616] h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#7C5335] h-full transition-all duration-500" 
                            style={{ width: `${task.progressPct || 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      )}

      {/* PRIMARY LEADS EXPLORER TAB */}
      {tab === 'leads' && (
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* LEADS LEFT SIDEBAR */}
          <aside className={`transition-all duration-300 ease-in-out border-r border-[#1A1A1A] h-full flex flex-col pt-4 pb-16 shrink-0 overflow-hidden bg-[#090909] z-20 ${leadsSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none border-r-0'}`}>
            {/* Header / New search button */}
            <div className="px-4 mb-4 shrink-0 flex items-center gap-2">
              <button
                onClick={() => {
                  handleResetSearch();
                  setActiveTask(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#7C5335] hover:bg-[#7C5335] text-white text-[10px] font-bold tracking-widest uppercase rounded shadow transition cursor-pointer"
              >
                <Plus size={10} strokeWidth={3} />
                New Lead Search
              </button>
              <button
                onClick={() => setLeadsSidebarOpen(false)}
                className="p-2 rounded bg-[#0F0F12] border border-[#1C1C1F] text-zinc-400 hover:text-white transition cursor-pointer"
                title="Collapse Sidebar"
              >
                <Menu size={12} />
              </button>
            </div>

            {/* SAVED WORKFLOWS SIDEBAR SECTION */}
            <div className="px-4 mt-2 mb-2 flex items-center justify-between shrink-0">
              <span className="text-[8px] tracking-[0.2em] text-[#52525B] font-bold uppercase font-sans">SAVED WORKFLOWS ({workflows.length})</span>
              <Bookmark size={10} className="text-[#52525B44]" />
            </div>

            <div className="max-h-[220px] overflow-y-auto space-y-1.5 px-3 select-none shrink-0 border-b border-[#1A1A1A] pb-4 mb-3 scrollbar-thin">
              {workflows.length === 0 ? (
                <div className="px-2 py-3 text-center text-[#52525B] text-[10px] italic">No saved workflows.</div>
              ) : (
                workflows.map((wf: any, idx) => (
                  <div 
                    key={wf.workflowId || idx} 
                    className="p-2.5 rounded bg-[#0F0F12] border border-[#1A1A1D] hover:border-[#10B981]/30 transition flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-[#F5F5F5] truncate max-w-[110px] uppercase font-sans" title={`${wf.niche} in ${wf.location}`}>
                        {wf.niche}
                      </span>
                      <span className="text-[6.5px] text-[#10B981] font-extrabold uppercase tracking-wider bg-[#10B981]/5 px-1 py-0.5 border border-[#10B981]/10 rounded select-none shrink-0">
                        {wf.tier}
                      </span>
                    </div>
                    <div className="text-[8px] text-[#52525B] truncate font-semibold uppercase">{wf.location}</div>
                    <div className="flex items-center justify-between text-[8.5px] text-zinc-500 font-semibold select-none">
                      <span>Count: {wf.count}</span>
                      <button 
                        onClick={() => {
                          setSelectedTier(wf.tier);
                          setSearchNiche(wf.niche);
                          setSearchLocation(wf.location);
                          setSearchGaps(wf.gaps || []);
                          setSearchCount(wf.count || 5);
                          setSearchStep('confirm');
                          setActiveTask(null);
                        }}
                        className="text-[7px] text-[#A27B5C] hover:text-white bg-[#15151B] hover:bg-[#7C5335] border border-[#27272E] px-1.5 py-0.5 rounded cursor-pointer font-extrabold uppercase tracking-widest transition"
                      >
                        Load
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SOURCING RUNS CAMPAIGNS */}
            <div className="px-4 mt-2 mb-2 flex items-center justify-between shrink-0">
              <span className="text-[8px] tracking-[0.2em] text-[#52525B] font-bold uppercase font-sans">SOURCING RUNS</span>
              <Activity size={10} className="text-[#52525B44]" />
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1 select-none pb-4 scrollbar-thin">
              {tasks.filter(t => t.taskType === 'lead_generation' || t.taskType === 'google_maps_scrape' || t.taskType === 'pages_jaunes_scrape').length === 0 ? (
                <div className="py-8 text-center text-[#52525B] text-[10px] italic">No lead searches run yet.</div>
              ) : (
                tasks.filter(t => t.taskType === 'lead_generation' || t.taskType === 'google_maps_scrape' || t.taskType === 'pages_jaunes_scrape').map((task, idx) => {
                  const isActive = activeTask?.taskId === task.taskId;
                  const isRun = task.status === 'running' || task.status === 'paused_captcha';
                  return (
                    <div 
                      key={task.taskId || `sourcing-task-${idx}`}
                      onClick={() => {
                        selectTask(task, false); // Don't switch tabs!
                        setSearchStep('complete'); // Force display of results grid
                      }}
                      className={`py-2 px-3 rounded cursor-pointer border-l-2 transition-all ${isActive ? 'bg-[#0F0F0F] border-[#7C5335]' : 'border-transparent hover:bg-[#0C0C0C]'}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-[11px] font-semibold tracking-wide truncate max-w-[130px] text-[#F5F5F5]">
                            {task.label || (task.taskType || '').replace(/_/g, ' ')}
                          </span>
                          {task.useStealth && (
                            <span className="px-1 py-0.5 rounded text-[7px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                              STEALTH
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isRun && <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C5335] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7C5335]"></span>
                          </span>}
                          <div 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ 
                              background: task.status === 'complete' ? '#10B981' : task.status === 'running' ? '#7C5335' : task.status === 'paused_captcha' ? '#F59E0B' : task.status === 'error' ? '#EF4444' : '#52525B' 
                            }} 
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[7.5px] text-[#52525B] tracking-wider uppercase font-medium">
                        <span>{task.progress}/{task.total} Leads</span>
                        {task.createdAt && <span>{task.createdAt.slice(0, 10)}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* GLOBAL ARCHIVE BUTTON AT BOTTOM */}
            <div className="px-4 mt-auto mb-4 border-t border-[#1A1A1A] pt-4 shrink-0">
              <button
                onClick={() => {
                  setActiveTask(null);
                  setSearchStep('complete');
                }}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 border rounded text-[9px] font-bold tracking-widest uppercase transition cursor-pointer ${!activeTask ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]' : 'border-[#222225] text-zinc-400 hover:text-white hover:border-zinc-700'}`}
              >
                <Database size={11} />
                Global Lead Archive
              </button>
            </div>
          </aside>

          {/* LEADS MAIN CONTENT SECTION */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#080808] relative">
            
            {/* Sidebar restore button (visible only when sidebar is closed) */}
            {!leadsSidebarOpen && (
              <button 
                onClick={() => setLeadsSidebarOpen(true)}
                className="absolute left-4 top-4 z-30 p-2 rounded-md bg-[#0F0F12] border border-[#1C1C1F] text-zinc-400 hover:text-white hover:border-[#7C5335]/50 transition shadow-md cursor-pointer flex items-center gap-1.5"
                title="Open Sourcing Runs History"
              >
                <Menu size={12} />
                <span className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">History & Workflows</span>
              </button>
            )}
            
            {/* If an active task is selected */}
            {activeTask ? (
              activeTask.status === 'running' || activeTask.status === 'paused_captcha' ? (
                <div className="flex-1 flex flex-col p-6 overflow-y-auto shrink-0 bg-[#080808]">
                  <div className="max-w-4xl mx-auto w-full space-y-6 py-8">
                    <div className="bg-[#0C0C0E] border border-[#1A1A1D] rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-[#7C5335] border-t-transparent animate-spin flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#7C5335]/10 animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-extrabold tracking-[0.2em] text-[#10B981] uppercase">SOURCING AGENT ACTIVE</h4>
                        <p className="text-[10px] text-zinc-400 max-w-sm mx-auto leading-relaxed font-sans">
                          Sourcing campaign <span className="font-mono text-[#F5F5F5]">"{activeTask.label}"</span> is active in the background. You can check the live screen view in the Workspace tab.
                        </p>
                      </div>
                      <div className="w-full max-w-xs bg-[#161616] h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#7C5335] h-full transition-all duration-500" 
                          style={{ width: `${activeTask.progressPct || 0}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                        {activeTask.progress} / {activeTask.total} PROSPECTS RETRIEVED
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* RESULTS GRID WITH ENRICHED LEAD CARDS (TASK-SPECIFIC RESULTS) */
                <div className="flex-1 flex flex-col overflow-hidden bg-[#080808] p-6 shrink-0">
                  <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-5 shrink-0 select-none">
                    <div>
                      <div className="text-[8px] tracking-[0.16em] text-[#52525B] font-bold uppercase">RESULTS FOR SOURCING CAMPAIGN</div>
                      <h2 className="text-sm font-extrabold tracking-widest text-[#F5F5F5] uppercase mt-0.5 flex items-center gap-2">
                        <Database size={14} className="text-[#7C5335]" /> {activeTask.label}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 bg-[#0F0F11] border border-[#222] p-1 rounded-full select-none">
                        <button 
                          onClick={() => setActiveTaskLeadsViewMode('cards')} 
                          className={`p-1.5 rounded-full transition ${activeTaskLeadsViewMode === 'cards' ? 'bg-[#7C5335] text-white shadow' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                          title="Card View"
                        >
                          <LayoutGrid size={11} />
                        </button>
                        <button 
                          onClick={() => setActiveTaskLeadsViewMode('table')} 
                          className={`p-1.5 rounded-full transition ${activeTaskLeadsViewMode === 'table' ? 'bg-[#7C5335] text-white shadow' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                          title="Table View"
                        >
                          <List size={11} />
                        </button>
                      </div>

                      <button 
                        onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-[9px] font-bold tracking-widest uppercase transition cursor-pointer ${filterPanelOpen ? 'bg-[#7C5335]/20 border-[#7C5335] text-[#A27B5C]' : 'border-[#222225] text-zinc-400 hover:text-white hover:border-zinc-700'}`}
                        title="Toggle Filter Panel"
                      >
                        <Sliders size={10} /> Filters
                      </button>

                      <a 
                        href={`${serverUrl}/api/task/${activeTask.taskId}/export/csv`} 
                        download
                        className="flex items-center gap-1.5 px-4 py-1.5 border border-[#222225] hover:border-[#7C5335]/50 bg-[#121214] hover:bg-[#151518] text-[#A1A1AA] hover:text-[#7C5335] text-[9px] font-bold tracking-widest uppercase rounded transition cursor-pointer"
                      >
                        <Download size={10} /> CSV
                      </a>

                      <button 
                        onClick={handleBatchPushLeads}
                        disabled={batchPushing}
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#7C5335] hover:bg-[#694226] text-white text-[9px] font-bold tracking-widest uppercase rounded shadow transition cursor-pointer"
                      >
                        {batchPushing ? <RefreshCw size={10} className="animate-spin" /> : <Save size={10} />}
                        Sync Leads to CRM
                      </button>
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto min-h-0 pt-4">
                    {filteredActiveTaskLeads.length === 0 ? (
                      <div className="py-20 text-center text-[#52525B] text-xs font-semibold select-none uppercase tracking-widest bg-[#0A0A0A] border border-[#1A1A1A] rounded">
                        No lead records matching this run and filter criteria. Either sourcing is compiling, or no records were returned.
                      </div>
                    ) : activeTaskLeadsViewMode === 'table' ? (
                      <div className="border border-[#1A1A1A] bg-[#0A0A0A] rounded overflow-x-auto">
                        <table className="w-full text-[11px] text-left border-collapse select-text">
                          <thead className="bg-[#0E0E10] border-b border-[#1A1A1A] text-[8px] text-[#52525B] tracking-widest uppercase font-bold select-none">
                            <tr>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Business / Firm</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Phone</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Email</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Website</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Address</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Rating & Reviews</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">CRM Sync</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1A1A1A] font-sans">
                            {filteredActiveTaskLeads.map((lead, idx) => (
                              <tr key={lead.leadId || `lead-run-row-${idx}`} className="hover:bg-[#0E0E11]/45 transition">
                                <td className="px-6 py-3.5 font-bold text-[#F5F5F5]">
                                  <div className="flex flex-col">
                                    <span>{lead.businessName}</span>
                                    {lead.name && lead.name !== lead.businessName && (
                                      <span className="text-[9.5px] text-[#A27B5C] font-medium font-sans mt-0.5">{lead.name} {lead.headline ? `· ${lead.headline}` : ''}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-3.5 font-mono text-[#A1A1AA]">
                                  {lead.phone || '—'}
                                </td>
                                <td className="px-6 py-3.5 font-mono text-[#A1A1AA]">
                                  {lead.email ? (
                                    <a href={`mailto:${lead.email}`} className="text-emerald-400 hover:underline flex items-center gap-1.5">
                                      <Mail size={10} className="text-emerald-400" />
                                      {lead.email}
                                    </a>
                                  ) : (
                                    <span className="text-[#52525B]">—</span>
                                  )}
                                </td>
                                <td className="px-6 py-3.5 text-[#A1A1AA]">
                                  {lead.website ? (
                                    <a href={lead.website} target="_blank" rel="noreferrer" className="text-[#A27B5C] hover:underline flex items-center gap-1.5 font-mono">
                                      <Globe size={11} className="text-[#7C5335]" /> 
                                      {lead.website.replace(/https?:\/\/|www\./g, '')}
                                    </a>
                                  ) : (
                                    <span className="flex items-center gap-1.5 text-xs text-[#52525B] font-mono select-none">—</span>
                                  )}
                                </td>
                                <td className="px-6 py-3.5 text-[#7C7C85] max-w-[150px] truncate" title={lead.address || lead.city || ''}>
                                  {lead.address || lead.city || '—'}
                                </td>
                                <td className="px-6 py-3.5 text-amber-400 font-semibold">
                                  {lead.rating ? `${lead.rating} ★` : '—'}
                                  {lead.reviewsCount ? <span className="text-zinc-500 font-normal text-[10px] ml-1">({lead.reviewsCount})</span> : ''}
                                </td>
                                <td className="px-6 py-3.5">
                                  {lead.sentToClose ? (
                                    <span className="text-[#10B981] font-bold text-[9px] uppercase tracking-wider">Sync Complete</span>
                                  ) : (
                                    <button 
                                      onClick={() => handlePushLead(lead.leadId)}
                                      disabled={pushingLeadId === lead.leadId}
                                      className="px-2.5 py-1 bg-transparent hover:bg-[#7C5335] hover:text-white border border-[#7C5335]/40 text-[#7C5335] text-[8px] font-bold uppercase tracking-widest rounded transition cursor-pointer"
                                    >
                                      {pushingLeadId === lead.leadId ? 'Pushing...' : 'Send to CRM'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-12">
                        {filteredActiveTaskLeads.map((lead) => (
                          <LeadCard 
                            key={lead.leadId} 
                            lead={lead} 
                            onPushLead={handlePushLead} 
                            isPushing={pushingLeadId === lead.leadId} 
                            serverUrl={serverUrl}
                            onSkip={handleSkipLead}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : (
              /* If activeTask is null */
              searchStep === 'complete' ? (
                /* GLOBAL CENTRALIZED PROSPECT DATABASE / ARCHIVE */
                <div className="flex-1 flex flex-col overflow-hidden bg-[#080808] p-6 shrink-0">
                  <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-5 shrink-0 select-none">
                    <div>
                      <div className="text-[8px] tracking-[0.16em] text-[#52525B] font-bold uppercase select-none">CENTRALIZED CLOUD ARCHIVE</div>
                      <h2 className="text-sm font-extrabold tracking-widest text-[#F5F5F5] uppercase mt-0.5 flex items-center gap-2">
                        <Database size={14} className="text-[#7C5335]" /> Lead Generation Prospect Database
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {/* Filter Pills */}
                      <div className="flex items-center gap-1.5 p-1 bg-[#0F0F11] border border-[#222] rounded-full select-none">
                        <button 
                          onClick={() => setLeadsFilter('all')} 
                          className={`px-4 py-1.5 text-[8px] font-bold tracking-wider uppercase rounded-full transition ${leadsFilter === 'all' ? 'bg-[#F5F5F5] text-black' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                        >
                          All Leads ({leads.length})
                        </button>
                        <button 
                          onClick={() => setLeadsFilter('no-website')} 
                          className={`px-4 py-1.5 text-[8px] font-bold tracking-wider uppercase rounded-full transition ${leadsFilter === 'no-website' ? 'bg-[#F5F5F5] text-black' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                        >
                          No Website
                        </button>
                        <button 
                          onClick={() => setLeadsFilter('has-website')} 
                          className={`px-4 py-1.5 text-[8px] font-bold tracking-wider uppercase rounded-full transition ${leadsFilter === 'has-website' ? 'bg-[#F5F5F5] text-black' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                        >
                          Has Website
                        </button>
                        <button 
                          onClick={() => setLeadsFilter('facebook_ads')} 
                          className={`px-4 py-1.5 text-[8px] font-bold tracking-wider uppercase rounded-full transition ${leadsFilter === 'facebook_ads' ? 'bg-[#F5F5F5] text-black' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                        >
                          Facebook Ads
                        </button>
                        <button 
                          onClick={() => setLeadsFilter('facebook_groups')} 
                          className={`px-4 py-1.5 text-[8px] font-bold tracking-wider uppercase rounded-full transition ${leadsFilter === 'facebook_groups' ? 'bg-[#F5F5F5] text-black' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                        >
                          Facebook Groups
                        </button>
                      </div>

                      {/* Layout Toggle */}
                      <div className="flex items-center gap-1 bg-[#0F0F11] border border-[#222] p-1 rounded-full select-none">
                        <button 
                          onClick={() => setLeadsViewMode('cards')} 
                          className={`p-1.5 rounded-full transition ${leadsViewMode === 'cards' ? 'bg-[#7C5335] text-white shadow' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                        >
                          <LayoutGrid size={11} />
                        </button>
                        <button 
                          onClick={() => setLeadsViewMode('table')} 
                          className={`p-1.5 rounded-full transition ${leadsViewMode === 'table' ? 'bg-[#7C5335] text-white shadow' : 'text-[#52525B] hover:text-white bg-transparent'}`}
                        >
                          <List size={11} />
                        </button>
                      </div>

                      <button 
                        onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-[9px] font-bold tracking-widest uppercase transition cursor-pointer ${filterPanelOpen ? 'bg-[#7C5335]/20 border-[#7C5335] text-[#A27B5C]' : 'border-[#222225] text-zinc-400 hover:text-white hover:border-zinc-700'}`}
                        title="Toggle Filter Panel"
                      >
                        <Sliders size={10} /> Filters
                      </button>

                      <button 
                        onClick={handleBatchPushLeads}
                        disabled={batchPushing}
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#7C5335] hover:bg-[#694226] text-white text-[9px] font-bold tracking-widest uppercase rounded shadow-lg transition disabled:opacity-40 cursor-pointer"
                      >
                        {batchPushing ? <RefreshCw size={10} className="animate-spin" /> : <Save size={10} />}
                        Sync to CRM
                      </button>

                      {leads.length > 0 && (
                        <button 
                          onClick={handleDeleteAllLeads}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 hover:border-red-500 bg-red-950/10 hover:bg-red-950/30 text-red-400 hover:text-red-300 text-[9px] font-bold tracking-widest uppercase rounded transition cursor-pointer"
                          title="Delete all leads permanently"
                        >
                          <Trash2 size={10} /> Delete All
                        </button>
                      )}
                    </div>
                  </header>

                  <div className="py-4 flex gap-4 shrink-0 select-none">
                    <input 
                      type="text" 
                      value={leadsSearch}
                      onChange={e => setLeadsSearch(e.target.value)}
                      placeholder="Filter leads by Business Name, City, Sector, or Phone..."
                      className="flex-1 bg-[#0F0F11] border border-[#222] text-[#F5F5F5] rounded px-4 py-2 text-xs outline-none focus:border-[#7C5335] transition placeholder-[#52525B]"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto min-h-0">
                    {filteredLeads.length === 0 ? (
                      <div className="py-20 text-center text-[#52525B] text-xs font-semibold select-none uppercase tracking-widest bg-[#0A0A0A] border border-[#1A1A1A] rounded">No target records matched query filters.</div>
                    ) : leadsViewMode === 'table' ? (
                      <div className="border border-[#1A1A1A] bg-[#0A0A0A] rounded overflow-x-auto">
                        <table className="w-full text-[11px] text-left border-collapse select-text">
                          <thead className="bg-[#0E0E10] border-b border-[#1A1A1A] text-[8px] text-[#52525B] tracking-widest uppercase font-bold select-none">
                            <tr>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Business / Firm</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Phone</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Email</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Website</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Geo Location</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">Classification</th>
                              <th className="px-6 py-3 font-bold uppercase tracking-wider">CRM Integration</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1A1A1A] font-sans">
                            {filteredLeads.map((lead, idx) => (
                              <tr key={lead.leadId || `lead-row-${idx}`} className="hover:bg-[#0E0E11]/45 transition">
                                <td className="px-6 py-3.5 font-bold text-[#F5F5F5]">
                                  <div className="flex flex-col">
                                    <span>{lead.businessName}</span>
                                    {lead.name && lead.name !== lead.businessName && (
                                      <span className="text-[9.5px] text-[#A27B5C] font-medium font-sans mt-0.5">{lead.name}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-3.5 font-mono text-[#A1A1AA]">
                                  {lead.phone || '—'}
                                </td>
                                <td className="px-6 py-3.5 font-mono text-[#A1A1AA]">
                                  {lead.email ? (
                                    <a href={`mailto:${lead.email}`} className="text-emerald-400 hover:underline flex items-center gap-1.5 font-mono">
                                      <Mail size={10} /> {lead.email}
                                    </a>
                                  ) : (
                                    <span className="text-[#52525B]">—</span>
                                  )}
                                </td>
                                <td className="px-6 py-3.5 text-[#A1A1AA]">
                                  {lead.website ? (
                                    <a href={lead.website} target="_blank" rel="noreferrer" className="text-[#A27B5C] hover:underline flex items-center gap-1.5 font-mono">
                                      <Globe size={11} className="text-[#7C5335]" /> {lead.website.replace(/https?:\/\/|www\./g, '')}
                                    </a>
                                  ) : (
                                    <span className="text-[#52525B]">—</span>
                                  )}
                                </td>
                                <td className="px-6 py-3.5 text-[#7c7c85]">
                                  {lead.city || 'Ontario, CA'}
                                </td>
                                <td className="px-6 py-3.5 text-[#7c7c85]">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                    lead.source === 'linkedin_enriched' ? 'bg-[#7C5335]/10 text-[#A27B5C] border border-[#7C5335]/20' :
                                    lead.leadType === 'no_website' ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20' : 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                                  }`}>
                                    {lead.source === 'linkedin_enriched' ? 'Campaign prospect' : lead.leadType === 'no_website' ? 'High Concern' : 'Inbound OK'}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5">
                                  {lead.sentToClose ? (
                                    <span className="text-[#10B981] font-bold text-[9px] uppercase tracking-wider">Sync complete</span>
                                  ) : (
                                    <button 
                                      onClick={() => handlePushLead(lead.leadId)}
                                      disabled={pushingLeadId === lead.leadId}
                                      className="px-2.5 py-1 bg-transparent hover:bg-[#7C5335] hover:text-white border border-[#7C5335]/40 text-[#7C5335] text-[8px] font-bold uppercase tracking-widest rounded transition cursor-pointer"
                                    >
                                      {pushingLeadId === lead.leadId ? 'Pushing...' : 'Send to CRM'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-12">
                        {filteredLeads.map((lead, idx) => (
                          <LeadCard 
                            key={lead.leadId || `lead-card-${idx}`} 
                            lead={lead} 
                            onPushLead={handlePushLead} 
                            isPushing={pushingLeadId === lead.leadId} 
                            serverUrl={serverUrl}
                            onSkip={handleSkipLead}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* PARAMETER WIZARD PROCESS */
                <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-[#080808] text-[#F5F5F5]">
                  <div className="max-w-4xl mx-auto w-full space-y-6">
                    
                    <div className="text-center space-y-2 py-4 border-b border-[#1A1A1A]">
                      <h3 className="text-xs font-bold tracking-[0.25em] text-[#10B981] uppercase">ASSIX INTEL: THREE-TIER LEAD FINDER</h3>
                      <p className="text-[10px] text-[#52525B] tracking-wide uppercase font-medium">Precision Target Sourcing Engine with Exa & Google Maps</p>
                    </div>

                    {searchStep === 'tier' && (
                      <div className="space-y-6 max-w-2xl mx-auto w-full">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 text-center">
                          Find leads for...
                        </div>

                        <form onSubmit={handleIntelligentSearchSubmit} className="relative flex items-center bg-[#0F0F12] border border-[#1C1C1F] hover:border-[#7C5335]/50 focus-within:border-[#7C5335] rounded-lg p-1.5 shadow-md transition-all duration-300">
                          <input 
                            type="text" 
                            value={intelligentQuery}
                            onChange={(e) => setIntelligentQuery(e.target.value)}
                            placeholder="Search any niche, industry, or target..."
                            className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white focus:outline-none placeholder-zinc-600"
                            disabled={isClassifying}
                          />
                          <button 
                            type="submit"
                            disabled={isClassifying || !intelligentQuery.trim()}
                            className="px-5 py-2 bg-[#7C5335] hover:bg-[#7C5335] disabled:opacity-40 text-white text-[10px] font-extrabold tracking-wider uppercase rounded transition cursor-pointer"
                          >
                            {isClassifying ? (
                              <div className="flex items-center gap-1.5">
                                <RefreshCw size={10} className="animate-spin" /> Analyzing...
                              </div>
                            ) : 'Search'}
                          </button>
                        </form>

                        {/* Classification result/info bar */}
                        {classificationResult && !isClassifying && (
                          <div className="space-y-4">
                            <div className="bg-[#0C0C0F] border border-[#1C1C22] rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded bg-[#7C5335]/10 flex items-center justify-center text-sm">
                                  {classificationResult.tier === 'local' ? '📍' : classificationResult.tier === 'ecom' ? '🛍️' : '⚡'}
                                </div>
                                <div className="text-left">
                                  <div className="text-[10.5px] font-bold text-zinc-300">
                                    Finding <span className="text-[#A27B5C]">{classificationResult.niche}</span> in <span className="text-emerald-400">{classificationResult.location || 'Anywhere'}</span> via <span className="text-[#A27B5C] capitalize">{classificationResult.dataSource?.replace('_', ' ')}</span>
                                  </div>
                                  <div className="text-[9px] text-zinc-500 mt-0.5">
                                    Suggested limit: <span className="text-zinc-400 font-semibold">{classificationResult.count} leads</span> · Gaps: <span className="text-red-400 font-semibold font-mono">{classificationResult.gaps?.join(', ') || 'Any'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button 
                                  type="button"
                                  onClick={() => setIsEditingClassification(!isEditingClassification)}
                                  className="px-3 py-1.5 bg-[#15151A] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-[#25252B] text-[9px] font-bold uppercase tracking-wider rounded transition cursor-pointer"
                                >
                                  {isEditingClassification ? 'Hide Edit' : 'Edit'}
                                </button>
                                <button 
                                  type="button"
                                  onClick={handleLaunchSearch}
                                  className="px-4 py-1.5 bg-[#10B981] hover:bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider rounded transition cursor-pointer shadow-md shadow-emerald-600/10"
                                >
                                  Run
                                </button>
                              </div>
                            </div>

                            {/* Collapsible Edit parameters form */}
                            {isEditingClassification && (
                              <div className="bg-[#0C0C0E] border border-[#1A1A1D] rounded-lg p-5 space-y-4 text-left font-sans animate-fadeIn">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="block text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                                      Niche / Target:
                                    </label>
                                    <input 
                                      type="text"
                                      value={searchNiche}
                                      onChange={(e) => setSearchNiche(e.target.value)}
                                      className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-1.5 text-xs text-white"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="block text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                                      Location:
                                    </label>
                                    <input 
                                      type="text"
                                      value={searchLocation}
                                      onChange={(e) => setSearchLocation(e.target.value)}
                                      className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-1.5 text-xs text-white"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="block text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                                      Target Tier:
                                    </label>
                                    <select 
                                      value={selectedTier || 'local'}
                                      onChange={(e) => {
                                        const tier = e.target.value as any;
                                        setSelectedTier(tier);
                                        setClassificationResult((prev: any) => ({
                                          ...prev,
                                          tier,
                                          dataSource: tier === 'local' ? 'google_maps' : tier === 'ecom' ? 'exa_company' : 'exa_people'
                                        }));
                                      }}
                                      className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-1.5 text-xs text-white"
                                    >
                                      <option value="local">Local Business (Google Maps)</option>
                                      <option value="ecom">E-commerce / Online (Exa Company)</option>
                                      <option value="saas">SaaS / Professional (Exa People)</option>
                                    </select>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="block text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                                      Lead Count:
                                    </label>
                                    <select 
                                      value={searchCount}
                                      onChange={(e) => setSearchCount(parseInt(e.target.value, 10))}
                                      className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-1.5 text-xs text-white"
                                    >
                                      <option value={5}>5 leads (Recommended - Fast)</option>
                                      <option value={10}>10 leads (Comprehensive)</option>
                                      <option value={20}>20 leads (Deep Search)</option>
                                      <option value={50}>50 leads (Extended Search)</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <label className="block text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                                    Target Gaps (Comma-separated or individual):
                                  </label>
                                  <input 
                                    type="text"
                                    value={searchGaps.join(', ')}
                                    onChange={(e) => setSearchGaps(e.target.value.split(',').map(g => g.trim()).filter(Boolean))}
                                    className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-1.5 text-xs text-white font-mono"
                                  />
                                </div>

                                <div className="flex justify-end pt-2">
                                  <button 
                                    type="button"
                                    onClick={() => setIsEditingClassification(false)}
                                    className="px-4 py-1.5 bg-[#7C5335] hover:bg-[#7C5335] text-white text-[9px] font-bold uppercase tracking-wider rounded transition cursor-pointer"
                                  >
                                    Done Editing
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {searchStep === 'config' && selectedTier && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-[#1C1C1F] pb-3">
                          <button 
                            onClick={() => setSearchStep('tier')}
                            className="text-[10px] font-extrabold tracking-widest text-zinc-400 hover:text-white uppercase transition flex items-center gap-1.5 cursor-pointer"
                          >
                            ← BACK
                          </button>
                          <span className="text-[10px] font-extrabold tracking-widest text-[#10B981] bg-[#10B981]/5 border border-[#10B981]/15 px-3 py-1 rounded uppercase select-none">
                            {selectedTier.toUpperCase()} TARGET MODIFIER
                          </span>
                        </div>

                        <div className="bg-[#0C0C0E] border border-[#1A1A1D] rounded-lg p-6 space-y-5 font-sans">
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                              Niche / Business Target Type:
                            </label>
                            <input 
                              type="text"
                              value={searchNiche}
                              onChange={(e) => setSearchNiche(e.target.value)}
                              placeholder={
                                selectedTier === 'local' ? 'e.g. Dentists, Plumbers, Salons' : 
                                selectedTier === 'ecom' ? 'e.g. Shopify stores, apparel brands' : 
                                'e.g. AI tools, CRM platforms, ERP'
                              }
                              className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-2 text-xs font-medium text-white transition-all duration-300"
                            />
                            
                            <div className="flex justify-end mt-1.5">
                              <button
                                type="button"
                                onClick={handleEnrichSearch}
                                disabled={!searchNiche.trim() || enrichingSearch}
                                className="px-3 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-[#10B981] hover:text-white border border-[#10B981]/30 hover:border-transparent text-[9px] font-bold tracking-widest uppercase rounded transition cursor-pointer flex items-center gap-1.5"
                              >
                                {enrichingSearch ? (
                                  <>
                                    <RefreshCw size={8} className="animate-spin" />
                                    Enriching...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles size={8} />
                                    Enrich Niche with Agency AI
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Enriched Search Insights Box */}
                            {enrichedSearchInsights && (
                              <div className="mt-3.5 p-4 bg-[#070709] border border-[#1C1C1F] rounded-lg space-y-4">
                                <div className="text-[9px] font-bold text-[#10B981] tracking-widest uppercase">
                                  Agency GTM Insights
                                </div>
                                
                                {enrichedSearchInsights.targetKeywords?.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Suggested Niche Keywords</span>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                      {enrichedSearchInsights.targetKeywords.map((kw, i) => (
                                        <button
                                          key={i}
                                          type="button"
                                          onClick={() => setSearchNiche(kw)}
                                          className="px-2 py-1 bg-[#111] hover:bg-[#1C1C22] text-[#A1A1AA] hover:text-white text-[9px] font-mono rounded border border-[#222] transition cursor-pointer"
                                        >
                                          {kw}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {enrichedSearchInsights.suggestedMarkets?.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Suggested Locations</span>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                      {enrichedSearchInsights.suggestedMarkets.map((mkt, i) => (
                                        <button
                                          key={i}
                                          type="button"
                                          onClick={() => setSearchLocation(mkt)}
                                          className="px-2 py-1 bg-[#111] hover:bg-[#1C1C22] text-[#A1A1AA] hover:text-white text-[9px] font-mono rounded border border-[#222] transition cursor-pointer"
                                        >
                                          {mkt}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {enrichedSearchInsights.painSignals?.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Pain Signals to Detect</span>
                                    <ul className="list-disc list-inside text-[9.5px] text-zinc-300 space-y-0.5">
                                      {enrichedSearchInsights.painSignals.map((ps, i) => (
                                        <li key={i}>{ps}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {enrichedSearchInsights.outreachHook && (
                                  <div className="space-y-1">
                                    <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Suggested Outreach Hook</span>
                                    <div className="p-2.5 bg-[#0A0A0C] border border-[#141416] text-[#A1A1AA] text-[10.5px] leading-relaxed font-mono rounded select-text">
                                      {enrichedSearchInsights.outreachHook}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                              Target Location:
                            </label>
                            <input 
                              type="text"
                              value={searchLocation}
                              onChange={(e) => setSearchLocation(e.target.value)}
                              placeholder={
                                selectedTier === 'local' ? 'e.g. Paris, Toronto, Los Angeles' : 
                                'e.g. Worldwide, France, United States, Remote'
                              }
                              className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-2 text-xs font-medium text-white transition-all duration-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                              Gaps / Deficiencies to find (Select Gaps):
                            </label>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {(selectedTier === 'local' ? [
                                'No online booking', 'No website', 'Poor ratings (< 4.0)', 'No Google Business claimed'
                              ] : selectedTier === 'ecom' ? [
                                'No email', 'No active pixel', 'No LinkedIn profile', 'No contact form'
                              ] : [
                                'No active ads', 'Old tech stack', 'No social media tags', 'No live chat'
                              ]).map((gap) => {
                                const active = searchGaps.includes(gap);
                                return (
                                  <button 
                                    key={gap}
                                    type="button"
                                    onClick={() => {
                                      if (active) {
                                        setSearchGaps(prev => prev.filter(g => g !== gap));
                                      } else {
                                        setSearchGaps(prev => [...prev, gap]);
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded text-[10px] font-bold transition border cursor-pointer ${active ? 'bg-[#7C5335]/15 text-[#A27B5C] border-[#7C5335]/40' : 'bg-[#080808] text-zinc-400 border-[#1C1C1F] hover:border-zinc-700'}`}
                                  >
                                    {gap}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                              Target Count (Maximum Leads to Extract):
                            </label>
                            <select 
                              value={searchCount}
                              onChange={(e) => setSearchCount(parseInt(e.target.value, 10))}
                              className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-2 text-xs font-medium text-white transition-all duration-300"
                            >
                              <option value={5}>5 leads (Recommended - Fast)</option>
                              <option value={10}>10 leads (Comprehensive)</option>
                              <option value={20}>20 leads (Deep Search)</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button 
                            onClick={handleResetSearch}
                            className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white border border-[#1C1C1F] text-[10px] font-extrabold tracking-widest uppercase rounded transition cursor-pointer font-sans"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => setSearchStep('confirm')}
                            disabled={!searchNiche || !searchLocation}
                            className="px-5 py-2.5 bg-[#7C5335] hover:bg-[#7C5335] disabled:opacity-40 text-white text-[10px] font-extrabold tracking-widest uppercase rounded transition shadow-md cursor-pointer font-sans"
                          >
                            Next: Confirmation →
                          </button>
                        </div>
                      </div>
                    )}

                    {searchStep === 'confirm' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-[#1C1C1F] pb-3">
                          <button 
                            onClick={() => setSearchStep('config')}
                            className="text-[10px] font-extrabold tracking-widest text-zinc-400 hover:text-white uppercase transition flex items-center gap-1.5 cursor-pointer font-sans"
                          >
                            ← BACK
                          </button>
                          <span className="text-[10px] font-extrabold tracking-widest text-[#A27B5C] bg-[#7C5335]/5 border border-[#7C5335]/15 px-3 py-1 rounded uppercase select-none">
                            PRE-FLIGHT VALIDATION SUMMARY
                          </span>
                        </div>

                        <div className="bg-[#0C0C0E] border border-[#1A1A1D] rounded-lg p-6 space-y-6 font-sans">
                          <div className="text-center space-y-1">
                            <h4 className="text-xs font-extrabold tracking-widest text-[#F5F5F5] uppercase">READY FOR INGESTION</h4>
                            <p className="text-[10px] text-zinc-500 font-medium">Verify your target campaign configuration before spawning browser workflows</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-b border-[#1C1C1F]/60 py-5 text-xs">
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">TARGET TIER:</span>
                              <span className="text-emerald-400 font-extrabold uppercase bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 rounded">{selectedTier?.toUpperCase()}</span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">LEAD COUNT LIMIT:</span>
                              <span className="text-white font-extrabold">{searchCount} Prospects</span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">NICHE SECTOR:</span>
                              <span className="text-white font-bold">{searchNiche}</span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">TARGET REGION:</span>
                              <span className="text-white font-bold">{searchLocation}</span>
                            </div>
                            <div className="col-span-2 space-y-1">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">SELECTED DEFICIENCIES / GAPS:</span>
                              <span className="text-red-400 font-medium font-mono text-[11px] bg-red-500/5 px-2 py-1 border border-red-500/10 rounded block">
                                {searchGaps.join(', ') || 'Analyze all available gaps'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <button 
                              onClick={handleSaveWorkflow}
                              className="w-full sm:w-auto px-4 py-2 bg-transparent hover:bg-zinc-800 text-[#A27B5C] hover:text-white border border-[#7C5335]/30 text-[10px] font-extrabold tracking-widest uppercase rounded transition cursor-pointer flex items-center justify-center gap-1.5 font-sans"
                            >
                              ⭐ Save Search as Workflow
                            </button>
                            
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                              <button 
                                onClick={() => setSearchStep('config')}
                                className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white border border-[#1C1C1F] text-[10px] font-extrabold tracking-widest uppercase rounded transition cursor-pointer"
                              >
                                Modify
                              </button>
                              <button 
                                onClick={handleLaunchSearch}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold tracking-widest uppercase rounded transition shadow-[0_2px_10px_rgba(16,185,129,0.25)] cursor-pointer"
                              >
                                🚀 LAUNCH SEARCH
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {searchStep === 'running' && (
                      <div className="space-y-6">
                        <div className="bg-[#0C0C0E] border border-[#1A1A1D] rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-5">
                          <div className="relative font-sans">
                            <div className="w-16 h-16 rounded-full border-2 border-[#7C5335] border-t-transparent animate-spin flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-[#7C5335]/10 animate-pulse" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-extrabold tracking-[0.2em] text-[#10B981] uppercase">ACTIVE COGNITIVE AGENT SCRAPE RUNNING</h4>
                            <p className="text-[10px] text-zinc-500 leading-relaxed max-w-md mx-auto font-sans">
                              Assix is executing search and enrichment. Check live terminal updates in the Command Chat on the Workspace tab!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* COLLAPSIBLE FILTERS PANEL (on the right side) */}
          <aside className={`transition-all duration-300 ease-in-out border-l border-[#1A1A1A] h-full flex flex-col pt-4 pb-16 overflow-hidden bg-[#090909] z-20 shrink-0 ${filterPanelOpen ? 'w-72 opacity-100 border-l' : 'w-0 opacity-0 pointer-events-none border-l-0'}`}>
            <div className="px-4 pb-4 flex items-center justify-between border-b border-[#1A1A1A] shrink-0">
              <div className="flex items-center gap-1.5">
                <Sliders size={12} className="text-[#A27B5C]" />
                <span className="text-[9px] tracking-[0.2em] text-[#F5F5F5] font-bold uppercase font-sans">Filters Panel</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleResetFilters}
                  className="text-[7.5px] text-[#A1A1AA] hover:text-white uppercase font-bold tracking-widest bg-[#121215] border border-[#1C1C1F] px-1.5 py-0.5 rounded transition cursor-pointer"
                  title="Reset All Filters"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setFilterPanelOpen(false)}
                  className="p-1 rounded bg-[#0F0F12] border border-[#1C1C1F] text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Collapse Filters"
                >
                  <X size={10} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 font-sans select-none scrollbar-thin">
              {/* Location Input */}
              <div className="space-y-1.5">
                <label className="block text-[8.5px] font-bold tracking-wider text-zinc-500 uppercase">
                  Location (Region, City)
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    placeholder="e.g. Paris, Toronto, CA..."
                    className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-1.5 text-[11px] text-white placeholder-zinc-700"
                  />
                  {filterLocation && (
                    <button 
                      onClick={() => setFilterLocation('')}
                      className="absolute right-2 top-2 text-zinc-500 hover:text-zinc-300"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              </div>

              {/* Min Gap Score Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[8.5px] font-bold tracking-wider text-zinc-500 uppercase">
                    Min Gap Score
                  </label>
                  <span className="text-[10px] font-mono text-[#A27B5C] font-bold">{filterMinGapScore}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={filterMinGapScore}
                  onChange={(e) => setFilterMinGapScore(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 bg-[#121215] h-1 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[7.5px] text-zinc-600 font-mono font-bold uppercase">
                  <span>0 (Any)</span>
                  <span>50</span>
                  <span>100 (Max)</span>
                </div>
              </div>

              {/* Contact Method */}
              <div className="space-y-1.5">
                <label className="block text-[8.5px] font-bold tracking-wider text-zinc-500 uppercase">
                  Contact Method Available
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'any', label: 'Any' },
                    { id: 'email', label: 'Email' },
                    { id: 'linkedin', label: 'LinkedIn' },
                    { id: 'phone', label: 'Phone' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilterContactMethod(item.id as any)}
                      className={`py-1.5 rounded text-[8.5px] font-bold uppercase tracking-wider transition border cursor-pointer ${filterContactMethod === item.id ? 'bg-[#7C5335]/20 border-[#7C5335] text-[#A27B5C]' : 'bg-[#080808] border-[#1C1C1F] text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sourcing Date Range */}
              <div className="space-y-1.5">
                <label className="block text-[8.5px] font-bold tracking-wider text-zinc-500 uppercase">
                  Sourcing Date
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'any', label: 'Any Time' },
                    { id: 'today', label: 'Today Only' },
                    { id: 'week', label: 'Past 7 Days' },
                    { id: 'month', label: 'Past 30 Days' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilterDateRange(item.id as any)}
                      className={`w-full text-left px-3 py-1.5 rounded text-[8.5px] font-bold uppercase tracking-wider transition border cursor-pointer flex items-center justify-between ${filterDateRange === item.id ? 'bg-[#7C5335]/10 border-[#7C5335]/40 text-[#A27B5C]' : 'bg-[#080808] border-[#1C1C1F] text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'}`}
                    >
                      <span>{item.label}</span>
                      {filterDateRange === item.id && <span className="text-[7.5px] font-extrabold text-[#A27B5C]">●</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Display Limit */}
              <div className="space-y-1.5">
                <label className="block text-[8.5px] font-bold tracking-wider text-zinc-500 uppercase">
                  Max Displayed Results
                </label>
                <select 
                  value={filterCount}
                  onChange={(e) => setFilterCount(parseInt(e.target.value, 10))}
                  className="w-full bg-[#080808] border border-[#1C1C1F] hover:border-[#27272A] focus:border-[#7C5335] focus:outline-none rounded px-3 py-1.5 text-[11px] text-white cursor-pointer font-semibold"
                >
                  <option value={10}>10 Leads</option>
                  <option value={20}>20 Leads</option>
                  <option value={50}>50 Leads</option>
                  <option value={100}>100 Leads</option>
                </select>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* SEQUENCE ARCHIVES VIEW */}
      {tab === 'history' && (
        <section className="flex-1 flex flex-col p-6 overflow-y-auto shrink-0 bg-[#080808]">
          <div className="max-w-4xl mx-auto w-full">
            <header className="flex items-center justify-between border-b border-[#1A1A1A] pb-5 mb-6 select-none">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 shrink-0 bg-[#0F0F12] border border-[#1C1C1F] px-2.5 py-2 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                </div>
                <div>
                  <div className="text-[8px] tracking-[0.16em] text-[#52525B] font-bold uppercase">HISTORICAL PROCESS RUNS</div>
                  <h2 className="text-sm font-extrabold tracking-widest text-[#F5F5F5] uppercase mt-0.5 flex items-center gap-2">
                    <History size={14} className="text-[#7C5335]" /> Campaign Operations Ledger
                  </h2>
                </div>
              </div>
              {tasks.length > 0 && (
                <button
                  onClick={handleDeleteAllTasks}
                  className="px-4 py-1.5 border border-red-500/30 hover:border-red-500 bg-red-950/10 hover:bg-red-950/30 text-red-400 hover:text-red-300 text-[9px] font-bold tracking-widest uppercase rounded transition cursor-pointer"
                >
                  Delete All History
                </button>
              )}
            </header>

            <div className="space-y-4">
              {tasks.filter(t => t.status !== 'running' && t.status !== 'paused_captcha' && t.status !== 'paused_input').length === 0 ? (
                <div className="text-center py-20 text-xs text-[#52525B] uppercase font-bold tracking-widest select-none">No historically finished campaigns found. Run some automations first.</div>
              ) : (
                tasks.filter(t => t.status !== 'running' && t.status !== 'paused_captcha' && t.status !== 'paused_input').map((task, idx) => (
                  <div 
                    key={task.taskId || `finished-${idx}`} 
                    className="p-5 bg-[#0F0F11] border border-[#1C1C1F] hover:border-[#222225] rounded transition duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold tracking-widest text-[#F5F5F5] uppercase">
                          {task.label || (task.taskType || '').replace(/_/g, ' ')}
                        </h4>
                        <div className="text-[9px] text-[#52525B] mt-1 tracking-wider uppercase font-medium">
                          Session ID: {task.taskId ? `${task.taskId.slice(0, 18)}...` : 'N/A'} · Execution Date: {task.createdAt?.slice(0,10)}
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded text-[8px] font-bold tracking-widest uppercase ${
                        task.status === 'complete' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                        task.status === 'error' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                        'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                      }`}>
                        {task.status === 'complete' ? 'FINISHED' : task.status === 'error' ? 'FAILED' : 'STOPPED'}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#A1A1AA] mb-4">
                      Sequence yielded {task.progress || 0} formatted target accounts. Configuration profiles were centered on niche classification 
                      <strong> "{task.config?.niche || task.config?.topic || 'Custom AI'}"</strong> across regions 
                      <strong> "{task.config?.city || 'Universal Target'}"</strong>.
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <a 
                        href={task.taskId ? `${serverUrl}/api/task/${task.taskId}/export/csv` : '#'} 
                        download={!!task.taskId}
                        style={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                        className={`px-4 py-1.5 border border-[#222225] rounded transition text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${
                          task.taskId 
                            ? 'hover:border-[#7C5335]/50 bg-[#121214] hover:bg-[#151518] text-[#52525B] hover:text-[#7C5335] cursor-pointer' 
                            : 'opacity-40 cursor-not-allowed bg-transparent text-gray-600 border-zinc-800'
                        }`}
                      >
                        <Download size={10} /> CSV SPREADSHEET
                      </a>
                      
                      <button 
                        onClick={() => task.taskId && handleFetchReport(task.taskId)}
                        disabled={!task.taskId || loadingReportId === task.taskId}
                        className="flex items-center gap-1.5 px-4 py-1.5 border border-[#222225] hover:border-[#7C5335]/50 bg-[#121214] hover:bg-[#151518] text-[#52525B] hover:text-[#7C5335] text-[9px] font-bold tracking-widest uppercase rounded transition disabled:opacity-40 cursor-pointer"
                      >
                        {task.taskId && loadingReportId === task.taskId ? (
                          <>
                            <RefreshCw size={10} className="animate-spin" /> SYNTHESIZING REPORT...
                          </>
                        ) : (
                          <>
                            <FileText size={10} /> AI REPORT
                          </>
                        )}
                      </button>

                      <button 
                        onClick={() => task.taskId && toggleHistoryData(task.taskId)}
                        disabled={!task.taskId}
                        className={`flex items-center gap-1.5 px-4 py-1.5 border text-[9px] font-bold tracking-widest uppercase rounded transition cursor-pointer ${
                          task.taskId && expandedHistoryTaskId === task.taskId
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                            : 'border-[#222225] bg-[#121214] text-[#52525B] hover:text-emerald-400 hover:border-emerald-500/50'
                        }`}
                      >
                        <Database size={10} />
                        {task.taskId && expandedHistoryTaskId === task.taskId ? 'HIDE DATA ▲' : 'VIEW DATA ▼'}
                      </button>
                    </div>

                    {/* Expandable data table / details */}
                    {task.taskId && expandedHistoryTaskId === task.taskId && (
                      <div className="mt-4 p-4 border border-[#1C1C1F] bg-[#0A0A0C] rounded space-y-3 select-text">
                        <h5 className="text-[10px] font-bold tracking-wider text-[#A1A1AA] uppercase flex items-center gap-1.5 border-b border-[#1A1A1D] pb-2">
                          <Database size={11} className="text-emerald-400" /> Collected Data Results Ledger
                        </h5>

                        {historyLeads[task.taskId] && historyLeads[task.taskId].length > 0 ? (
                          <div className="overflow-x-auto rounded border border-[#1A1A1D]">
                            <table className="w-full text-left text-[11px] border-collapse">
                              <thead className="bg-[#0E0E11] text-[8px] text-[#52525B] uppercase font-bold tracking-widest border-b border-[#1A1A1D]">
                                <tr>
                                  <th className="px-3 py-2">Business Name</th>
                                  <th className="px-3 py-2">Phone</th>
                                  <th className="px-3 py-2">Website</th>
                                  <th className="px-3 py-2">Location</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#1A1A1D]">
                                {historyLeads[task.taskId].map((lead, idx) => (
                                  <tr key={lead.leadId || `lead-history-${idx}`} className="hover:bg-[#121214] transition">
                                    <td className="px-3 py-2 font-semibold text-[#F5F5F5]">{lead.businessName}</td>
                                    <td className="px-3 py-2 text-[#A1A1AA] font-mono">{lead.phone || '—'}</td>
                                    <td className="px-3 py-2 text-[#A1A1AA]">
                                      {lead.website ? (
                                        <a href={lead.website} target="_blank" rel="noreferrer" className="text-[#A27B5C] hover:underline font-mono truncate max-w-[150px] block">
                                          {lead.website.replace(/https?:\/\/|www\./g, '')}
                                        </a>
                                      ) : '—'}
                                    </td>
                                    <td className="px-3 py-2 text-[#7C7C85]">{lead.city || 'Ontario, CA'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (task.results || (task as any).config?.goal) ? (
                          <div className="space-y-2">
                            {(task as any).config?.goal && (
                              <div className="bg-[#121215] border border-[#1A1A1D] rounded p-2.5 text-[10px] text-[#A1A1AA]">
                                <span className="font-bold text-[#F5F5F5] block mb-0.5">TASK BRIEF</span>
                                "{(task as any).config?.goal}"
                              </div>
                            )}

                            {task.results ? (
                              <div className="bg-[#0F0F12] border border-[#1A1A1D] rounded p-3 font-mono text-[10.5px] leading-relaxed text-[#A1A1AA] whitespace-pre-wrap">
                                <span className="font-bold text-[#10B981] block mb-1.5 font-sans text-[11px]">COLLECTED INFO:</span>
                                {typeof task.results === 'string' ? task.results : JSON.stringify(task.results, null, 2)}
                              </div>
                            ) : (
                              <div className="text-[10px] text-[#52525B] italic">No final output findings returned. See raw logs for pathway info.</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[10px] text-[#52525B] italic py-3 text-center">Loading collected data... If nothing is shown, the runner has not exported structural objects.</div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* LINKEDIN OUTREACH TAB */}
      {tab === 'outreach' && (
        <section className="flex-1 flex flex-col p-6 overflow-y-auto shrink-0 bg-[#080808]">
          <div className="max-w-6xl mx-auto w-full space-y-6">
            
            {/* Header */}
            <header className="border-b border-[#1A1A1A] pb-5 select-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 shrink-0 bg-[#0F0F12] border border-[#1C1C1F] px-2.5 py-2 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                </div>
                <div>
                  <div className="text-[8px] tracking-[0.16em] text-[#52525B] font-bold uppercase">OUTBOUND GROWTH MODULE</div>
                  <h2 className="text-sm font-extrabold tracking-widest text-[#F5F5F5] uppercase mt-0.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#7C5335] inline-block animate-pulse" />
                    LinkedIn Automated Outreach Agent
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTestLinkedInConnection}
                  disabled={isTestingConnection}
                  className={`px-4 py-1.5 rounded text-[9px] font-bold tracking-widest uppercase transition flex items-center gap-2 border ${
                    liConnected 
                      ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]' 
                      : liConnectionError 
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                        : 'bg-[#141416] border-[#222] hover:border-[#7C5335]/50 text-[#A27B5C] hover:text-[#A27B5C] cursor-pointer disabled:opacity-55'
                  }`}
                >
                  <RefreshCw size={10} className={isTestingConnection ? 'animate-spin' : ''} />
                  {isTestingConnection ? 'Testing...' : liConnected && liUser ? `● Connected as ${liUser.firstName} ${liUser.lastName}` : liConnectionError ? '● Connection failed — check API' : 'Connect LinkedIn Agent'}
                </button>
              </div>
            </header>

            {/* Connection Status Widget */}
            <div className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition select-none ${
              liConnected 
                ? 'bg-[#10B981]/5 border-[#10B981]/25 text-[#10B981]' 
                : liConnectionError 
                  ? 'bg-rose-500/5 border-rose-500/25 text-rose-400'
                  : 'bg-[#0E0E10] border-[#1C1C1F] text-[#A1A1AA]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  liConnected 
                    ? 'bg-[#10B981] animate-pulse' 
                    : liConnectionError 
                      ? 'bg-rose-500' 
                      : 'bg-[#52525B]'
                }`} />
                <div>
                  <div className="text-[10px] font-extrabold tracking-widest uppercase text-[#A27B5C]">Active LinkedIn Connection Status</div>
                  <div className="text-xs font-semibold mt-0.5 text-[#E4E4E7]">
                    {liConnected && liUser ? (
                      <span className="flex items-center gap-1.5">
                        ● Connected as <strong className="text-white">{liUser.firstName} {liUser.lastName}</strong>
                      </span>
                    ) : liConnectionError ? (
                      <span className="text-rose-400 font-semibold uppercase tracking-wider font-mono">● Connection failed — check API</span>
                    ) : (
                      <span>● Offline — Connection required to run campaigns</span>
                    )}
                  </div>
                  {liConnected && liLastConnected && (
                    <div className="text-[8px] font-mono text-[#52525B] mt-0.5">Last Sync Timestamp: {liLastConnected}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestLinkedInConnection}
                  disabled={isTestingConnection}
                  className="px-3 py-1.5 bg-[#141416] border border-[#222] hover:border-[#7C5335]/50 text-white hover:text-[#A27B5C] text-[9px] font-bold tracking-widest uppercase rounded cursor-pointer transition select-none flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw size={9} className={isTestingConnection ? 'animate-spin' : ''} />
                  {isTestingConnection ? 'Testing...' : 'Reconnect'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Campaigns & Niche Configurations */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Gap Analysis campaigns */}
                <div className="p-5 border border-[#1A1A1A] bg-[#0A0A0B] rounded-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
                    <h3 className="text-[10px] font-extrabold tracking-widest text-[#F5F5F5] uppercase flex items-center gap-1.5">
                      <Zap size={11} className="text-[#A27B5C]" />
                      Gap Analysis Niche Campaigns
                    </h3>
                    <span className="text-[8px] font-mono text-[#52525B] bg-[#141416] px-2 py-0.5 rounded border border-[#222]">
                      gap_analysis_engine.md
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GAP_CAMPAIGNS.map((camp, idx) => {
                      const isCampRunning = activeCampaign === camp.gapName;
                      return (
                        <div key={idx} className="p-4 border border-[#1C1C1F] bg-[#0E0E10] hover:border-[#7C5335]/20 rounded transition flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[9px] font-bold text-[#A27B5C] tracking-wider uppercase">{camp.niche}</span>
                              <span className="text-[7px] font-mono text-amber-500 bg-amber-500/5 border border-amber-500/15 px-1.5 py-0.2 rounded">GAP IDENTIFIED</span>
                            </div>
                            <h4 className="text-[11px] font-extrabold text-[#E4E4E7] uppercase leading-snug tracking-wider">{camp.gapName}</h4>
                            <p className="text-[10px] text-[#52525B] mt-1.5 leading-relaxed font-sans">{camp.description}</p>
                            
                            <div className="mt-3 p-2 bg-[#080808] border border-[#1A1A1D] rounded">
                              <span className="text-[7px] font-bold tracking-widest text-[#52525B] uppercase block mb-1">Outreach Template:</span>
                              <p className="text-[9px] text-[#A1A1AA] italic font-serif leading-normal line-clamp-3">"{camp.messageTemplate}"</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-[#1C1C1F] space-y-3">
                            {isCampRunning ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[8px] font-mono">
                                  <span className="text-[#10B981] animate-pulse">Running Campaign...</span>
                                  <span className="text-[#A1A1AA]">{campaignProgress}%</span>
                                </div>
                                <div className="w-full bg-[#18181B] h-1 rounded-full overflow-hidden">
                                  <div className="bg-[#10B981] h-full transition-all duration-500" style={{ width: `${campaignProgress}%` }} />
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleStartCampaign(camp.gapName, camp.niche, camp.gapName, camp.description, camp.messageTemplate)}
                                disabled={activeCampaign !== null && activeCampaign !== camp.gapName}
                                className="w-full py-1.5 bg-[#141416] border border-[#222] hover:border-[#7C5335]/50 hover:bg-[#7C5335]/10 text-[#A1A1AA] hover:text-[#F5F5F5] text-[9px] font-bold tracking-wider uppercase rounded transition cursor-pointer disabled:opacity-40"
                              >
                                Start Campaign
                              </button>
                            )}

                            {/* Campaign inline error status */}
                            {campaignErrors[camp.gapName] && (
                              <div className="text-[9px] text-rose-400 font-semibold uppercase tracking-wider font-mono">
                                ⚠ {campaignErrors[camp.gapName]}
                              </div>
                            )}

                            {/* Campaign Searching Indicator */}
                            {campaignSearching[camp.gapName] && (
                              <div className="space-y-1.5 bg-[#080808] p-2 rounded border border-[#1C1C1F]">
                                <span className="text-[8px] font-mono text-[#A27B5C] animate-pulse flex items-center gap-1.5">
                                  <RefreshCw size={8} className="animate-spin" />
                                  Calling search with target description...
                                </span>
                              </div>
                            )}

                            {/* Campaign inline results list */}
                            {campaignResults[camp.gapName] && campaignResults[camp.gapName].length > 0 && (
                              <div className="space-y-3 bg-[#080808] p-3 rounded border border-[#1A1A1D] max-h-96 overflow-y-auto scrollbar-thin select-none">
                                <span className="text-[8px] font-mono text-[#A27B5C] uppercase tracking-widest font-bold block border-b border-[#1C1C1F] pb-1">
                                  Campaign Results ({campaignResults[camp.gapName].length})
                                </span>
                                <div className="space-y-3 pt-1">
                                  {campaignResults[camp.gapName].map((res: any, rIdx: number) => (
                                    <div key={res.id || rIdx} className="p-3 border border-[#1C1C1F] bg-[#0E0E10] rounded flex flex-col gap-2.5 text-[9.5px]">
                                      <div className="flex items-start justify-between gap-1.5">
                                        <div className="min-w-0">
                                          <div className="font-extrabold text-[#F5F5F5]">{res.name}</div>
                                          <div className="text-[8px] text-[#52525B] font-mono leading-tight mt-0.5">{res.title}</div>
                                        </div>
                                        <span className="px-2 py-0.5 bg-[#7C5335]/10 text-[#A27B5C] text-[7px] font-bold uppercase rounded tracking-wider border border-[#7C5335]/20 shrink-0">
                                          GAP MATCH
                                        </span>
                                      </div>
                                      
                                      <div className="p-2 bg-[#060608] border border-[#151518] rounded font-sans space-y-0.5">
                                        <span className="text-[7px] font-bold text-[#E4E4E7] tracking-wider uppercase block">Pain Signal Detected:</span>
                                        <p className="text-[#A1A1AA] italic leading-normal">"{res.painSignal}"</p>
                                      </div>

                                      <div className="p-2 bg-[#060608] border border-[#151518] rounded font-sans space-y-0.5">
                                        <span className="text-[7px] font-bold text-[#A27B5C] tracking-wider uppercase block">Generated Personalized Pitch:</span>
                                        <p className="text-[#D4D4D8] italic leading-normal">"{res.pitch}"</p>
                                      </div>

                                      <div className="flex justify-end pt-1">
                                        <button
                                          onClick={() => handleConnectProfile(res.id, res.name, res.company, res.pitch)}
                                          disabled={connectingId === res.id || res.status === 'Message Sent'}
                                          className="px-3 py-1.5 bg-[#7C5335] hover:bg-[#7C5335] text-white font-bold text-[8px] uppercase tracking-wider rounded transition cursor-pointer disabled:opacity-40"
                                        >
                                          {res.status === 'Message Sent' ? 'Sent' : connectingId === res.id ? 'Sending...' : 'Send Connection'}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Campaign Console Log Output */}
                  {activeCampaign && (
                    <div className="mt-4 p-3 bg-[#080808] border border-[#1C1C1F] rounded font-mono text-[9px] space-y-1">
                      <div className="flex items-center justify-between border-b border-[#1A1A1D] pb-1.5 mb-1.5">
                        <span className="text-[#A27B5C] font-bold uppercase tracking-wider">Active Campaign Console Log</span>
                        <button onClick={() => { setActiveCampaign(null); setCampaignProgress(0); }} className="text-[#52525B] hover:text-white uppercase text-[8px]">Clear</button>
                      </div>
                      <div className="max-h-28 overflow-y-auto space-y-1 scrollbar-thin">
                        {campaignLogs.map((log, i) => (
                          <div key={i} className="text-[#E4E4E7] leading-relaxed">
                            {log.startsWith('[SUCCESS]') ? <span className="text-[#10B981]">{log}</span> : log.startsWith('[CAMPAIGN') ? <span className="text-[#7C5335]">{log}</span> : <span>{log}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Niche Configuration Generator */}
                <div className="p-5 border border-[#1A1A1A] bg-[#0A0A0B] rounded-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
                    <h3 className="text-[10px] font-extrabold tracking-widest text-[#F5F5F5] uppercase flex items-center gap-1.5">
                      <Sparkles size={11} className="text-[#A27B5C]" />
                      Dynamic AI Outreach Niche Strategy Generator
                    </h3>
                    <span className="text-[8px] font-mono text-[#A27B5C] bg-[#7C5335]/5 border border-[#7C5335]/15 px-2 py-0.5 rounded">
                      niche_config_generator
                    </span>
                  </div>

                  <p className="text-[10px] text-[#52525B] leading-relaxed">
                    Tell the AI your niche campaign goal, target description, and your core product offering. The AI will generate a tailored search query, pain signals, competitor tracking parameters, and specialized pricing tiers.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-[#52525B] uppercase tracking-wider block">Campaign Goal</label>
                      <input
                        type="text"
                        placeholder="e.g. Find dentists in Ottawa"
                        value={nicheGoal}
                        onChange={(e) => setNicheGoal(e.target.value)}
                        className="w-full bg-[#0E0E10] border border-[#1C1C1F] focus:border-[#7C5335] rounded px-2.5 py-1.5 text-xs text-[#E4E4E7] placeholder-[#3F3F46] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-[#52525B] uppercase tracking-wider block">Target Audience</label>
                      <input
                        type="text"
                        placeholder="e.g. Clinics lacking FB pixel"
                        value={nicheTarget}
                        onChange={(e) => setNicheTarget(e.target.value)}
                        className="w-full bg-[#0E0E10] border border-[#1C1C1F] focus:border-[#7C5335] rounded px-2.5 py-1.5 text-xs text-[#E4E4E7] placeholder-[#3F3F46] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-[#52525B] uppercase tracking-wider block">Product Offer Details</label>
                      <input
                        type="text"
                        placeholder="e.g. Funnel setup for €199/mo"
                        value={nicheProduct}
                        onChange={(e) => setNicheProduct(e.target.value)}
                        className="w-full bg-[#0E0E10] border border-[#1C1C1F] focus:border-[#7C5335] rounded px-2.5 py-1.5 text-xs text-[#E4E4E7] placeholder-[#3F3F46] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleGenerateNicheConfig}
                      disabled={generatingNiche || !nicheGoal || !nicheTarget || !nicheProduct}
                      className="px-4 py-1.5 bg-[#7C5335] hover:bg-[#7C5335] text-white font-bold text-[9px] uppercase tracking-widest rounded transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                    >
                      {generatingNiche ? (
                        <>
                          <RefreshCw size={10} className="animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={10} />
                          Generate Outreach Strategy
                        </>
                      )}
                    </button>
                  </div>

                  {/* Generated Strategy Preview & Launch Button */}
                  {generatedNiche && (
                    <div className="p-4 border border-[#1C1C1F] bg-[#0E0E10] rounded space-y-3.5 mt-3">
                      <div className="flex items-center justify-between border-b border-[#1C1C1F] pb-2">
                        <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase">Generated Strategy: {generatedNiche.label}</span>
                        <span className="text-[8px] font-mono text-[#52525B]">{generatedNiche.search_query}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                        <div className="space-y-1.5">
                          <span className="text-[7px] font-bold text-[#52525B] uppercase block">Scoring Weights:</span>
                          <div className="bg-[#080808] p-2 rounded border border-[#151518] font-mono text-[9px] space-y-1 text-zinc-400">
                            <div>Pain Match Weight: {generatedNiche.scoring_weights?.pain_signal_match}%</div>
                            <div>Budget Fit Weight: {generatedNiche.scoring_weights?.budget_fit}%</div>
                            <div>Score Threshold: {generatedNiche.score_threshold}/100</div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[7px] font-bold text-[#52525B] uppercase block">Product & Core Pitch:</span>
                          <div className="bg-[#080808] p-2 rounded border border-[#151518] text-zinc-300">
                            <strong className="text-[#E4E4E7]">{generatedNiche.product_offer?.name}</strong>
                            <p className="italic text-[9px] text-zinc-400 mt-0.5">"{generatedNiche.product_offer?.pitch_core}"</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleLaunchLinkedInDaemon(generatedNiche)}
                          disabled={daemonRunning}
                          className="px-4 py-2 bg-[#10B981] hover:bg-emerald-500 text-black font-extrabold text-[9px] tracking-widest uppercase rounded transition cursor-pointer disabled:opacity-45 flex items-center gap-1.5"
                        >
                          {daemonRunning ? (
                            <>
                              <RefreshCw size={10} className="animate-spin" />
                              Daemon Running...
                            </>
                          ) : (
                            <>
                              <Zap size={10} />
                              Launch Automated Outreach Daemon
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Prospect Search Section */}
                <div className="p-5 border border-[#1A1A1A] bg-[#0A0A0B] rounded-lg space-y-4">
                  <h3 className="text-[10px] font-extrabold tracking-widest text-[#F5F5F5] uppercase flex items-center gap-1.5 border-b border-[#1A1A1A] pb-3">
                    <Globe size={11} className="text-[#A27B5C]" />
                    Prospect Finder
                  </h3>
                  
                  <form onSubmit={handleSearchLinkedIn} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search profiles on LinkedIn (e.g. CEO plumbers Toronto, Dentists Montreal...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0E0E10] border border-[#1C1C1F] focus:border-[#7C5335] rounded px-3 py-2 text-xs text-[#E4E4E7] placeholder-[#52525B] focus:outline-none font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={searching}
                      className="px-5 py-2 bg-[#7C5335] hover:bg-[#7C5335] disabled:opacity-45 text-white text-[9px] font-bold tracking-widest uppercase rounded cursor-pointer transition select-none flex items-center gap-1.5"
                    >
                      {searching ? <RefreshCw size={10} className="animate-spin" /> : 'Search'}
                    </button>
                  </form>

                  {/* Profile Results Grid */}
                  <div className="space-y-2">
                    {searchProfiles.length === 0 ? (
                      <div className="text-center py-6 text-[10px] text-[#52525B] uppercase font-bold tracking-widest">
                        No prospects found. Try searching above.
                      </div>
                    ) : (
                      searchProfiles.map((p, idx) => (
                        <div key={p.id || idx} className="p-3 border border-[#1A1A1D] bg-[#0E0E10] hover:bg-[#121214] rounded transition flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-[#242427] flex items-center justify-center font-bold text-xs text-[#A27B5C] select-none shrink-0 uppercase">
                              {p.name.slice(0, 2)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-extrabold text-[#F5F5F5] tracking-wide">{p.name}</span>
                                <span className="text-[8px] px-1.5 py-0.2 bg-[#1C1C1F] border border-[#2A2A2E] text-[#A1A1AA] rounded uppercase font-mono">{p.location}</span>
                              </div>
                              <p className="text-[10px] text-[#A1A1AA] font-mono mt-0.5">{p.title} at <span className="text-[#7C5335]">{p.company}</span></p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-end md:self-auto">
                            {p.status === 'Message Sent' ? (
                              <span className="px-2.5 py-1 text-[8px] font-bold tracking-widest uppercase bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 rounded-full flex items-center gap-1">
                                <Check size={8} strokeWidth={3} /> Connection Dispatched
                              </span>
                            ) : (
                              <button
                                onClick={() => handleConnectProfile(p.id, p.name, p.company)}
                                disabled={connectingId === p.id}
                                className="px-3 py-1 bg-[#7C5335]/10 hover:bg-[#7C5335] border border-[#7C5335]/30 text-[#A27B5C] hover:text-white text-[9px] font-bold tracking-wider uppercase rounded transition cursor-pointer disabled:opacity-40"
                              >
                                {connectingId === p.id ? 'Connecting...' : 'Quick Connect'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Connected Status & Inbox Logs */}
              <div className="space-y-6">
                
                {/* LinkedIn Outreach Daemon Monitor */}
                <div className="p-5 border border-[#1A1A1A] bg-[#0A0A0B] rounded-lg space-y-4">
                  <h3 className="text-[10px] font-extrabold tracking-widest text-[#F5F5F5] uppercase flex items-center gap-1.5 border-b border-[#1A1A1A] pb-3">
                    <Activity size={11} className={daemonRunning ? "text-[#10B981] animate-pulse" : "text-[#52525B]"} />
                    LinkedIn Outreach Daemon Monitor
                  </h3>

                  <div className="flex items-center justify-between text-[10px] bg-[#080808] p-3 rounded border border-[#1C1C1F]">
                    <span className="text-[#52525B] font-bold uppercase tracking-wider">Daemon Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase tracking-widest ${
                      daemonRunning 
                        ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25' 
                        : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                    }`}>
                      {daemonRunning ? '● Active Running' : '● Idle / Inactive'}
                    </span>
                  </div>

                  {daemonRunning && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[8px] font-mono">
                        <span className="text-[#A27B5C] animate-pulse">Running Sequences...</span>
                        <span className="text-zinc-300">{daemonProgress}%</span>
                      </div>
                      <div className="w-full bg-[#18181B] h-1 rounded-full overflow-hidden">
                        <div className="bg-[#7C5335] h-full transition-all duration-500" style={{ width: `${daemonProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Daemon Real-time Logs Console */}
                  <div className="p-3 bg-[#080808] border border-[#1C1C1F] rounded font-mono text-[9px] space-y-1">
                    <div className="flex items-center justify-between border-b border-[#1A1A1D] pb-1.5 mb-1.5">
                      <span className="text-[#A27B5C] font-bold uppercase tracking-wider">Daemon Logs Console</span>
                      <button onClick={() => setDaemonLogs([])} className="text-[#52525B] hover:text-white uppercase text-[8px]">Clear</button>
                    </div>
                    <div className="max-h-44 overflow-y-auto space-y-1 scrollbar-thin flex flex-col-reverse">
                      {daemonLogs.length === 0 ? (
                        <div className="text-[#3F3F46] italic">No active daemon transmission logs.</div>
                      ) : (
                        daemonLogs.map((log, i) => (
                          <div key={i} className="text-zinc-300 leading-relaxed font-mono">
                            {log.toLowerCase().includes('[complete]') ? <span className="text-emerald-400">{log}</span> : log.toLowerCase().includes('[error]') ? <span className="text-rose-400">{log}</span> : <span>{log}</span>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Real-time Collections Preview */}
                  {outreachProfiles.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[8px] font-mono text-[#52525B] uppercase tracking-wider block">Recent Queue Profiles ({outreachProfiles.length})</span>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin">
                        {outreachProfiles.map((p, idx) => (
                          <div key={idx} className="p-2 bg-[#08080A] border border-[#1A1A1C] rounded flex items-center justify-between text-[9px]">
                            <span className="text-zinc-300 font-semibold">{p.name}</span>
                            <span className="text-[7px] font-mono px-1.5 py-0.2 bg-[#7C5335]/10 text-[#A27B5C] border border-[#7C5335]/15 rounded uppercase">{p.status || 'Pending'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Connected Profiles List */}
                <div className="p-5 border border-[#1A1A1A] bg-[#0A0A0B] rounded-lg space-y-4">
                  <h3 className="text-[10px] font-extrabold tracking-widest text-[#F5F5F5] uppercase flex items-center gap-1.5 border-b border-[#1A1A1A] pb-3">
                    <CheckCircle size={11} className="text-[#10B981]" />
                    Connected Profiles
                  </h3>
                  
                  <div className="space-y-2.5 max-h-72 overflow-y-auto scrollbar-thin">
                    {connectedProfilesList.map((c, i) => (
                      <div key={c.id || i} className="p-3 border border-[#1A1A1C] bg-[#0C0C0E] rounded space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-[#E4E4E7] uppercase tracking-wide">{c.name}</span>
                          <span className={`text-[7px] font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-widest ${
                            c.status === 'Replied' 
                              ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' 
                              : c.status === 'Connected' 
                                ? 'bg-[#7C5335]/10 text-[#A27B5C] border border-[#7C5335]/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-[9px] text-[#52525B] leading-tight line-clamp-1">{c.title} at {c.company}</p>
                        <span className="text-[8px] font-mono text-[#3F3F46] block text-right">Synced: {c.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outreach sent messages log */}
                <div className="p-5 border border-[#1A1A1A] bg-[#0A0A0B] rounded-lg space-y-4">
                  <h3 className="text-[10px] font-extrabold tracking-widest text-[#F5F5F5] uppercase flex items-center gap-1.5 border-b border-[#1A1A1A] pb-3">
                    <MessageSquare size={11} className="text-[#7C5335]" />
                    Outreach Transmission Log
                  </h3>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
                    {outreachMessagesLog.map((log, i) => (
                      <div key={log.id || i} className="p-3 border border-[#1A1A1C] bg-[#08080A] rounded space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-extrabold text-[#A1A1AA] uppercase tracking-wide">{log.name}</span>
                          <span className="text-[7px] font-mono text-[#52525B]">{log.timestamp}</span>
                        </div>
                        <p className="text-[9px] text-[#D4D4D8] italic leading-relaxed font-serif bg-[#0C0C0E] p-2 rounded border border-[#1A1A1C]">
                          "{log.text}"
                        </p>
                        <div className="flex items-center justify-between text-[7px] font-mono">
                          <span className="text-[#10B981]">● {log.status}</span>
                          <span className="text-[#52525B]">Agent Safe Routing</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>
      )}

      {tab === 'ig_discovery' && (
        <section className="flex-1 flex flex-col p-6 overflow-y-auto bg-[#080808]">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            
            {/* Header */}
            <header className="border-b border-[#1A1A1A] pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-[#0F0F12] border border-[#1C1C1F] px-2.5 py-2 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                </div>
                <div>
                  <div className="text-[8px] tracking-[0.16em] text-[#52525B] font-bold uppercase">Pipeline Discovery Systems</div>
                  <h2 className="text-sm font-extrabold tracking-widest text-[#F5F5F5] uppercase mt-0.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block animate-pulse" />
                    INSTAGRAM DISCOVERY PIPELINE
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDiscoverySessions}
                  className="px-3 py-1.5 bg-[#141414] hover:bg-[#1A1A1F] border border-[#27272E] rounded text-[#A0A0AB] hover:text-white text-[9px] font-bold tracking-wider uppercase transition flex items-center gap-1.5"
                >
                  <RefreshCw size={10} />
                  Refresh
                </button>
              </div>
            </header>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Configuration & Cost Calculator (Col Span 5) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#09090B] border border-[#1C1C1F] rounded-lg p-5 space-y-5">
                  <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-3">
                    <Sliders size={14} className="text-orange-500" />
                    <h3 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">CAMPAIGN SETUP</h3>
                  </div>

                  {/* Niche Input */}
                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">TARGET NICHE / KEYWORDS</label>
                    <input 
                      type="text" 
                      value={igNiche}
                      onChange={e => setIgNiche(e.target.value)}
                      placeholder="e.g. luxury lifestyle, real estate nyc"
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Profiles Limit Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase">PROFILES TO SCAN</label>
                      <span className="text-[10px] font-mono text-orange-500 font-bold">{igMaxProfiles} profiles</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={igMaxProfiles}
                      onChange={e => setIgMaxProfiles(parseInt(e.target.value))}
                      className="w-full accent-orange-500 h-1 bg-[#1A1A1F] rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Posts Limit Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase">POSTS PER PROFILE</label>
                      <span className="text-[10px] font-mono text-orange-500 font-bold">{igMaxPosts} posts</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={igMaxPosts}
                      onChange={e => setIgMaxPosts(parseInt(e.target.value))}
                      className="w-full accent-orange-500 h-1 bg-[#1A1A1F] rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Comments Limit Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase">COMMENTS PER POST</label>
                      <span className="text-[10px] font-mono text-orange-500 font-bold">{igMaxComments} comments</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={igMaxComments}
                      onChange={e => setIgMaxComments(parseInt(e.target.value))}
                      className="w-full accent-orange-500 h-1 bg-[#1A1A1F] rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Live Cost Calculator Panel */}
                  <div className="bg-[#0D0D10] border border-[#1A1A1F] rounded-lg p-4 space-y-3">
                    <div className="text-[8px] tracking-[0.16em] text-[#52525B] font-bold uppercase flex items-center justify-between">
                      <span>COST CONTROL & PROJECTIONS</span>
                      <span className="text-[9px] text-green-500 font-extrabold tracking-normal">PREPAID ACTOR CREDITS</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-1 border-b border-[#1A1A1A]">
                      <div className="text-center">
                        <div className="text-[11px] font-mono text-[#F5F5F5] font-extrabold">{igMaxProfiles}</div>
                        <div className="text-[7px] text-[#52525B] font-bold uppercase mt-0.5">Profiles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[11px] font-mono text-[#F5F5F5] font-extrabold">{igMaxProfiles * igMaxPosts}</div>
                        <div className="text-[7px] text-[#52525B] font-bold uppercase mt-0.5">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[11px] font-mono text-[#F5F5F5] font-extrabold">{igMaxProfiles * igMaxPosts * igMaxComments}</div>
                        <div className="text-[7px] text-[#52525B] font-bold uppercase mt-0.5">Comments</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[9px] font-mono text-[#A0A0AB]">
                      <div className="flex justify-between">
                        <span>Profile Scraping ({igMaxProfiles} * $0.003)</span>
                        <span>${(igMaxProfiles * 0.003).toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Post Analysis ({(igMaxProfiles * igMaxPosts)} * $0.0015)</span>
                        <span>${(igMaxProfiles * igMaxPosts * 0.0015).toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comment Crawling ({(igMaxProfiles * igMaxPosts * igMaxComments)} * $0.0023)</span>
                        <span>${(igMaxProfiles * igMaxPosts * igMaxComments * 0.0023).toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between text-[#F5F5F5] font-bold pt-1.5 border-t border-[#1A1A1F]">
                        <span className="uppercase text-[8px] tracking-wider text-[#52525B]">ESTIMATED PIPELINE COST</span>
                        <span className="text-green-500">
                          ${(
                            (igMaxProfiles * 0.003) + 
                            (igMaxProfiles * igMaxPosts * 0.0015) + 
                            (igMaxProfiles * igMaxPosts * igMaxComments * 0.0023)
                          ).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Launch button */}
                  <button
                    onClick={handleStartDiscovery}
                    disabled={isStartingDiscovery || !igNiche}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-[#1C1C1F] disabled:text-[#52525B] disabled:cursor-not-allowed text-white text-[10px] font-bold tracking-widest uppercase rounded shadow transition cursor-pointer"
                  >
                    {isStartingDiscovery ? (
                      <>
                        <RefreshCw size={10} className="animate-spin" />
                        LAUNCHING DISCOVERY PIPELINE...
                      </>
                    ) : (
                      <>
                        <Zap size={10} strokeWidth={3} />
                        START DISCOVERY CAMPAIGN
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Sessions list, live visualizer & Leads database (Col Span 7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Section 1: Sessions List */}
                <div className="bg-[#09090B] border border-[#1C1C1F] rounded-lg p-5">
                  <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Database size={14} className="text-orange-500" />
                      <h3 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">DISCOVERY SESSIONS ({discoverySessions.length})</h3>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto scrollbar-thin">
                    {discoverySessions.length === 0 ? (
                      <div className="text-center py-6 text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                        No discovery sessions launched yet
                      </div>
                    ) : (
                      discoverySessions.map((session) => {
                        const isSelected = selectedDiscoverySession?.sessionId === session.sessionId;
                        const dateStr = new Date(session.createdAt).toLocaleDateString() + ' ' + new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        
                        return (
                          <div 
                            key={session.sessionId}
                            onClick={() => fetchSessionDetails(session.sessionId)}
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition ${isSelected ? 'bg-orange-950/15 border-orange-500/50' : 'bg-[#08080A] border-[#1C1C1F] hover:border-zinc-700'}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-2 h-2 rounded-full ${
                                session.status === 'completed' ? 'bg-green-500' :
                                session.status === 'running' ? 'bg-orange-500 animate-pulse' :
                                session.status === 'failed' ? 'bg-red-500' : 'bg-zinc-500'
                              }`} />
                              <div>
                                <div className="text-xs font-bold text-[#F5F5F5]">Niche: {session.niche}</div>
                                <div className="text-[8px] text-zinc-500 font-mono mt-0.5">ID: {session.sessionId.slice(0, 8)} | {dateStr}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-[10px] text-zinc-300 font-mono">
                                  Profiles: {session.profilesCount || 0} | Leads: {session.leadsCount || 0}
                                </div>
                                <div className="text-[8px] text-zinc-500 font-mono mt-0.5 uppercase">{session.status}</div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDiscoverySession(session.sessionId);
                                }}
                                className="p-1.5 rounded bg-transparent text-zinc-500 hover:text-red-500 transition hover:bg-red-950/20"
                                title="Delete session"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Section 2: Selected Session Interactive Tree / Live Progress Visualizer */}
                {selectedDiscoverySession && (
                  <div className="bg-[#09090B] border border-[#1C1C1F] rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
                      <div>
                        <div className="text-[8px] tracking-[0.16em] text-orange-500 font-bold uppercase">Selected Run Details</div>
                        <h4 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">
                          Campaign Tree: {selectedDiscoverySession.profiles?.length || 0} Profiles Scanned
                        </h4>
                      </div>
                      <div className="text-[9px] font-mono text-[#52525B] font-semibold uppercase">
                        SESSION: {selectedDiscoverySession.sessionId.slice(0, 8)}
                      </div>
                    </div>

                    {/* Hierarchy Visualization: Session -> Profiles -> Posts -> Leads */}
                    <div className="space-y-4 max-h-[350px] overflow-y-auto scrollbar-thin pr-2 font-sans text-xs">
                      {selectedDiscoverySession.profiles?.length === 0 ? (
                        <div className="text-center py-6 text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                          Pipeline initiated. Awaiting profile discoveries...
                        </div>
                      ) : (
                        selectedDiscoverySession.profiles.map((profile: any) => (
                          <div key={profile.username} className="bg-[#08080A] border border-[#1C1C1F] rounded-lg p-3 space-y-2">
                            {/* Profile Row */}
                            <div className="flex items-center justify-between bg-[#0F0F12] border border-[#1A1A1F] p-2 rounded">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                <span className="font-bold text-[#F5F5F5] text-xs">@{profile.username}</span>
                                {profile.isBusinessAccount && (
                                  <span className="text-[7px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 py-0.5 rounded uppercase tracking-wider">Business</span>
                                )}
                              </div>
                              <div className="text-[9px] font-mono text-zinc-500">
                                Followers: {profile.followers || 'N/A'} | Category: {profile.categoryName || 'N/A'}
                              </div>
                            </div>

                            {/* Posts row under this profile */}
                            <div className="pl-4 space-y-2 border-l border-orange-500/20 ml-2 pt-1">
                              {profile.posts?.length === 0 ? (
                                <div className="text-[9px] text-zinc-500 italic font-mono">No posts scanned yet...</div>
                              ) : (
                                profile.posts.map((post: any) => (
                                  <div key={post.shortcode} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] bg-[#111] px-2 py-1 rounded">
                                      <div className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-zinc-500" />
                                        <span className="font-semibold text-zinc-300">Post Code: {post.shortcode}</span>
                                      </div>
                                      <span className="text-[8px] text-zinc-500 font-mono">
                                        Likes: {post.likesCount || 0} | Comments: {post.commentsCount || 0}
                                      </span>
                                    </div>

                                    {/* Leads Row under this post */}
                                    <div className="pl-4 space-y-1.5 border-l border-zinc-700/30 ml-1.5 pt-0.5">
                                      {post.leads?.length === 0 ? (
                                        <div className="text-[9px] text-zinc-500 italic font-mono">Awaiting lead comments extraction...</div>
                                      ) : (
                                        post.leads.map((lead: any) => (
                                          <div key={lead.username} className="bg-[#141417]/40 border border-[#1C1C1F] rounded p-2 flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between">
                                              <span className="font-bold text-zinc-300">@{lead.username}</span>
                                              <div className="flex items-center gap-2">
                                                {/* Stage Badges with live selector */}
                                                <select 
                                                  value={lead.stage || 'Discovered'}
                                                  onChange={(e) => handleUpdateLeadStage(
                                                    selectedDiscoverySession.sessionId, 
                                                    profile.username, 
                                                    post.shortcode, 
                                                    lead.username, 
                                                    e.target.value
                                                  )}
                                                  className="bg-[#09090B] border border-[#222225] text-[8px] font-bold text-orange-400 uppercase rounded px-1.5 py-0.5 outline-none cursor-pointer"
                                                >
                                                  <option value="Discovered">Discovered</option>
                                                  <option value="Contacted">Contacted</option>
                                                  <option value="Replied">Replied</option>
                                                  <option value="Converted">Converted</option>
                                                </select>
                                                <span className="text-[7.5px] font-mono text-[#52525B]">{lead.timeAgo || 'just now'}</span>
                                              </div>
                                            </div>

                                            <div className="text-[10px] text-zinc-400 bg-[#080808] p-1.5 rounded border border-[#161616]">
                                              "{lead.commentText}"
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 text-[7px] font-mono font-bold uppercase">
                                              <span className={`px-1 rounded-full border ${
                                                lead.sentiment === 'positive' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                lead.sentiment === 'neutral' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                              }`}>Sentiment: {lead.sentiment}</span>
                                              {lead.email && <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1 rounded-full">Email: {lead.email}</span>}
                                              {lead.phone && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 rounded-full">Phone: {lead.phone}</span>}
                                            </div>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FREELANCE MONITOR TAB */}
      {tab === 'freelance' && (
        <section className="flex-1 flex flex-col p-6 overflow-y-auto shrink-0 bg-[#080808]">
          <div className="max-w-6xl mx-auto w-full space-y-6">
            
            {/* Header */}
            <header className="border-b border-[#1A1A1A] pb-5 select-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 shrink-0 bg-[#0F0F12] border border-[#1C1C1F] px-2.5 py-2 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                </div>
                <div>
                  <div className="text-[8px] tracking-[0.16em] text-[#52525B] font-bold uppercase">TALENT GROWTH ACQUISITION</div>
                  <h2 className="text-sm font-extrabold tracking-widest text-[#F5F5F5] uppercase mt-0.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Freelance Job Monitor Agent
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunFreelanceMonitor}
                  disabled={monitoringFreelance}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white hover:text-black text-[9px] font-bold tracking-widest uppercase rounded cursor-pointer transition select-none flex items-center gap-2 disabled:opacity-55 animate-pulse"
                >
                  <RefreshCw size={10} className={monitoringFreelance ? 'animate-spin' : ''} />
                  {monitoringFreelance ? 'Scraping Scored Jobs...' : 'Trigger Scrape & AI Score'}
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Monitored Freelance Jobs */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-5 border border-[#1A1A1A] bg-[#0A0A0B] rounded-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
                    <h3 className="text-[10px] font-extrabold tracking-widest text-[#F5F5F5] uppercase flex items-center gap-1.5">
                      <Briefcase size={11} className="text-emerald-400" />
                      Identified Freelance Roles ({freelanceJobs.length})
                    </h3>
                    <span className="text-[8px] font-mono text-[#52525B] bg-[#141416] px-2 py-0.5 rounded border border-[#222]">
                      reddit_hn_agent.ts
                    </span>
                  </div>

                  <div className="space-y-3.5 max-h-[70vh] overflow-y-auto scrollbar-thin pr-1">
                    {freelanceJobs.length === 0 ? (
                      <div className="text-center py-12 text-[#52525B] uppercase font-bold tracking-widest text-[10px]">
                        No monitored roles found. Click Trigger Scrape & AI Score to find jobs.
                      </div>
                    ) : (
                      freelanceJobs.map((job, idx) => {
                        const scoreColor = job.score >= 80 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : job.score >= 60 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';

                        return (
                          <div key={job.id || idx} className="p-4 border border-[#1C1C1F] bg-[#0E0E10] hover:border-emerald-500/20 rounded transition flex flex-col justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2.5">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[8px] font-bold text-emerald-400 tracking-wider uppercase block">{job.source?.toUpperCase()}</span>
                                    {job.matchType && (
                                      <span className="text-[7px] font-mono font-bold text-zinc-400 bg-[#141416] border border-[#222] px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        {job.matchType.replace('_', ' ')}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-[11px] font-extrabold text-[#E4E4E7] uppercase leading-snug tracking-wider mt-1">{job.title}</h4>
                                </div>
                                <span className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider border shrink-0 ${scoreColor}`}>
                                  SCORE: {job.score}/100
                                </span>
                              </div>

                              <div className="p-2.5 bg-[#080808] border border-[#1A1A1D] rounded space-y-1">
                                <span className="text-[7px] font-bold tracking-widest text-emerald-400 uppercase block">AI Match Rationale:</span>
                                <p className="text-[9.5px] text-[#A1A1AA] italic leading-normal font-sans">"{job.rationale || 'No AI analysis details available for this match.'}"</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-[#1C1C1F] text-[8px] font-mono text-[#52525B]">
                              <span>Discovered: {job.createdAt ? new Date(job.createdAt).toLocaleString() : 'Just now'}</span>
                              <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black border border-emerald-500/25 text-emerald-400 text-[8px] font-bold tracking-wider uppercase rounded transition"
                              >
                                View Proposal Post
                              </a>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Active Live Status & Log Output */}
              <div className="space-y-6">
                
                {/* Status Indicator */}
                <div className="p-5 border border-[#1A1A1A] bg-[#0A0A0B] rounded-lg space-y-4">
                  <h3 className="text-[10px] font-extrabold tracking-widest text-[#F5F5F5] uppercase flex items-center gap-1.5 border-b border-[#1A1A1A] pb-3">
                    <Activity size={11} className={monitoringFreelance ? "text-emerald-400 animate-pulse" : "text-[#52525B]"} />
                    Active Freelance Scraper Status
                  </h3>

                  <div className="flex items-center justify-between text-[10px] bg-[#080808] p-3 rounded border border-[#1C1C1F]">
                    <span className="text-[#52525B] font-bold uppercase tracking-wider">Scraper Engine:</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase tracking-widest ${
                      monitoringFreelance 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                        : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                    }`}>
                      {monitoringFreelance ? '● Running Scraping' : '● Idle / Safe standby'}
                    </span>
                  </div>

                  {/* Logs Console */}
                  <div className="p-3 bg-[#080808] border border-[#1C1C1F] rounded font-mono text-[9px] space-y-1">
                    <div className="flex items-center justify-between border-b border-[#1A1A1D] pb-1.5 mb-1.5">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider">Scraper Live Output Logs</span>
                      <button onClick={() => setFreelanceLogs([])} className="text-[#52525B] hover:text-white uppercase text-[8px]">Clear</button>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin flex flex-col-reverse">
                      {freelanceLogs.length === 0 ? (
                        <div className="text-[#3F3F46] italic">No active scraping logs. Click Run to begin.</div>
                      ) : (
                        freelanceLogs.map((log, i) => (
                          <div key={i} className="text-zinc-300 leading-relaxed font-mono">
                            {log.toLowerCase().includes('[complete]') ? <span className="text-emerald-400">{log}</span> : log.toLowerCase().includes('[error]') ? <span className="text-rose-400">{log}</span> : <span>{log}</span>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>
      )}

      {/* CORE SETTINGS PROFILE */}
      {tab === 'settings' && (
        <section className="flex-1 flex flex-col p-6 overflow-y-auto shrink-0 bg-[#080808]">
          <div className="max-w-xl mx-auto w-full">
            <header className="border-b border-[#1A1A1A] pb-5 mb-8 select-none">
              <div className="text-[8px] tracking-[0.16em] text-[#52525B] font-bold uppercase">BOT SYSTEM ENGINE INSTANCES</div>
              <h2 className="text-sm font-extrabold tracking-widest text-[#F5F5F5] uppercase mt-0.5 flex items-center gap-2">
                <Sliders size={14} className="text-[#7C5335]" /> Channel & Configuration Settings
              </h2>
            </header>

            <div className="space-y-8">
              {/* Server Target Panel */}
              <div>
                <h4 className="text-xs font-bold text-[#F5F5F5] tracking-widest uppercase mb-2">SERVER TARGET ADDRESS</h4>
                <p className="text-[11px] text-[#52525B] leading-relaxed mb-4">
                  Update your deploy host URL (normally your Railway or Cloud Run service URL address).
                </p>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    placeholder="e.g. https://your-railway-app.up.railway.app"
                    className="flex-1 bg-[#121214] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                  />
                  <button 
                    onClick={handleSaveSettings}
                    className="px-5 py-2 bg-[#7C5335] hover:bg-[#694226] text-white text-[10px] font-bold tracking-widest uppercase rounded transition cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="h-px bg-[#1A1A1A]" />

              {/* Saved Sessions list (Instagram, WhatsApp) */}
              <div>
                <h4 className="text-xs font-bold text-[#F5F5F5] tracking-widest uppercase mb-2">SAVED BOT SESSIONS</h4>
                <p className="text-[11px] text-[#52525B] leading-relaxed mb-4">
                  These memory sessions bypass manual authentication screens on target platforms.
                </p>

                <div className="space-y-4">
                  <div className="p-4 border border-[#1A1A1A] bg-[#0A0A0C] rounded flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Instagram size={14} className="text-[#7C5335]" />
                      <div>
                        <span className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wide">Instagram Session</span>
                        <span className="text-[9px] text-[#52525B] block mt-0.5 uppercase tracking-normal">
                          {sessions.some(s => s.platform.toLowerCase() === 'instagram') 
                            ? `Saved cookies active · Refresh: ${sessions.find(s => s.platform.toLowerCase() === 'instagram')?.savedAt?.slice(0, 10)}` 
                            : 'No saved session'
                          }
                        </span>
                      </div>
                    </div>
                    {sessions.some(s => s.platform.toLowerCase() === 'instagram') ? (
                      <button 
                        onClick={() => handleDeleteSession('instagram')}
                        className="px-3 py-1 bg-transparent hover:bg-red-500/10 border border-red-500/20 hover:border-red-500 text-red-500 text-[8px] font-bold tracking-widest uppercase rounded transition cursor-pointer font-sans font-medium"
                      >
                        Clear Session
                      </button>
                    ) : (
                      <span className="text-[9px] text-[#52525B] font-bold uppercase tracking-wider">CLEAR</span>
                    )}
                  </div>

                  <div className="p-4 border border-[#1A1A1A] bg-[#0A0A0C] rounded flex justify-between items-center">
                    <div className="flex items-center gap-3 font-sans">
                      <MessageSquare size={14} className="text-[#7C5335]" />
                      <div>
                        <span className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wide">WhatsApp Session</span>
                        <span className="text-[9px] text-[#52525B] block mt-0.5 uppercase tracking-normal">
                          {sessions.some(s => s.platform.toLowerCase() === 'whatsapp') 
                            ? `Saved cookies active · Refresh: ${sessions.find(s => s.platform.toLowerCase() === 'whatsapp')?.savedAt?.slice(0, 10)}` 
                            : 'No saved session'
                          }
                        </span>
                      </div>
                    </div>
                    {sessions.some(s => s.platform.toLowerCase() === 'whatsapp') ? (
                      <button 
                        onClick={() => handleDeleteSession('whatsapp')}
                        className="px-3 py-1 bg-transparent hover:bg-red-500/10 border border-red-500/20 hover:border-red-500 text-red-500 text-[8px] font-bold tracking-widest uppercase rounded transition cursor-pointer font-sans font-medium"
                      >
                        Clear Session
                      </button>
                    ) : (
                      <span className="text-[9px] text-[#52525B] font-bold uppercase tracking-wider">CLEAR</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#1A1A1A]" />

              {/* Browserbase & Stagehand Integration */}
              <div>
                <h4 className="text-xs font-bold text-[#F5F5F5] tracking-widest uppercase mb-2">BROWSERBASE & STAGEHAND INTEGRATION</h4>
                <p className="text-[11px] text-[#52525B] leading-relaxed mb-4">
                  Run all automated agents inside high-performance, remote browser sessions managed by Browserbase and orchestrated by Stagehand.
                </p>

                <div className="p-5 border border-[#7C5335]/30 bg-[#7C5335]/5 rounded-lg flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-[#7C5335]/10 text-[#7C5335]">
                        <Globe size={16} className="animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider block">
                          Stagehand Engine: ACTIVE
                        </span>
                        <p className="text-[10px] text-[#52525B] leading-normal mt-1">
                          Connected! Your agents will execute in high-performance cloud containers. Watch them work interactively on the 'Operator' screen.
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[8px] font-extrabold tracking-widest uppercase bg-[#7C5335]/20 text-[#7C5335]">
                      STREAMING
                    </span>
                  </div>

                  <div className="text-[9px] font-mono p-3 bg-[#080808]/80 border border-[#1A1A1C] rounded text-[#7F7F8A] leading-relaxed">
                    <span className="text-[#7C5335] font-bold uppercase block mb-1">Architecture details:</span>
                    • Env: <strong className="text-white">BROWSERBASE</strong><br />
                    • LLM: <strong className="text-white">gemini-2.0-flash</strong> via Stagehand Act, Observe, and Extract APIs<br />
                    • Stream: Fully headful, interactive, high-framerate remote stream with native local interactions!
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#1A1A1A]" />

              {/* Assix Companion Extension Download */}
              <div>
                <h4 className="text-xs font-bold text-[#F5F5F5] tracking-widest uppercase mb-2">ASSIX COMPANION BROWSER EXTENSION</h4>
                <p className="text-[11px] text-[#52525B] leading-relaxed mb-4">
                  Install the Chrome Extension companion to trigger on-page scrapes on any active browser tab and instantly synchronize collected lead contacts back to your Assix console.
                </p>

                <div className="p-5 border border-[#10B981]/30 bg-[#10B981]/5 rounded-lg flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-[#10B981]/10 text-[#10B981]">
                        <Download size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider block">
                          Assix Extension Package Ready
                        </span>
                        <p className="text-[10px] text-[#52525B] leading-normal mt-1">
                          Fully compiled, typed, and bundled companion extension with background automation triggers and local on-page scrapers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[9px] font-mono p-3 bg-[#080808]/80 border border-[#1A1A1C] rounded text-[#7F7F8A] leading-relaxed space-y-1">
                    <span className="text-[#10B981] font-bold uppercase block mb-1">Easy Setup Instructions:</span>
                    <div>1. Download the <strong className="text-white">assix-companion-extension.zip</strong> archive using the button below.</div>
                    <div>2. Unpack the zip file on your local machine to obtain the <strong className="text-white">dist</strong> directory.</div>
                    <div>3. Open Google Chrome and navigate to <strong className="text-white">chrome://extensions</strong>.</div>
                    <div>4. Enable <strong className="text-white">Developer mode</strong> (top-right toggle switch).</div>
                    <div>5. Click <strong className="text-white">Load unpacked</strong> and select the unpacked <strong className="text-white">dist</strong> folder.</div>
                  </div>

                  <a 
                    href="/assix-companion-extension.zip" 
                    download="assix-companion-extension.zip"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#080808] text-[10px] font-extrabold tracking-widest uppercase rounded shadow-[0_2px_8px_rgba(16,185,129,0.3)] transition cursor-pointer text-center decoration-none"
                  >
                    <Download size={12} /> DOWNLOAD CHROMIUM EXTENSION (.ZIP)
                  </a>
                </div>
              </div>

              <div className="h-px bg-[#1A1A1A]" />

              {/* Browser Connection System */}
              <div>
                <h4 className="text-xs font-bold text-[#F5F5F5] tracking-widest uppercase mb-2">ASSIX BROWSER CONNECTOR</h4>
                <p className="text-[11px] text-[#52525B] leading-relaxed mb-4">
                  Link your local browser session to run outreach automation directly via Playwriter. Retrieve your connection code below, paste it into the downloaded Assix Connector app, and start controlling sessions.
                </p>

                {connectionStatus.connected ? (
                  <div className="p-5 border border-emerald-500/30 bg-emerald-500/5 rounded-lg flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                          <CheckCircle size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider block">
                            CONNECTED — {connectionStatus.machineName || 'Active Session'}
                          </span>
                          <p className="text-[10px] text-[#52525B] leading-normal mt-1">
                            Tunnel established and authenticated successfully. Machine is ready to accept playwriter tasks.
                          </p>
                          {connectionStatus.connectedAt && (
                            <span className="text-[9px] text-[#52525B] block mt-1 uppercase tracking-wider">
                              Since: {new Date(connectionStatus.connectedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={disconnectBrowser}
                      className="w-full py-2 bg-red-950/20 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500 text-red-400 text-[10px] font-extrabold tracking-widest uppercase rounded transition cursor-pointer text-center"
                    >
                      Disconnect & Terminate Session
                    </button>
                  </div>
                ) : (
                  <div className="p-5 border border-[#1C1C1F] bg-[#0A0A0C] rounded-lg flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="p-2 rounded-full bg-zinc-900 text-zinc-500">
                          <Zap size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                            No active connection
                          </span>
                          <p className="text-[10px] text-zinc-600 leading-normal mt-1">
                            Your browser session is not currently connected to this account. Get a connection code to link it.
                          </p>
                        </div>
                      </div>
                    </div>

                    {!connectionCode ? (
                      <button 
                        onClick={generateConnectionCode} 
                        disabled={connectionLoading}
                        className="w-full py-2.5 bg-[#7C5335] hover:bg-[#694226] text-white text-[10px] font-extrabold tracking-widest uppercase rounded shadow-[0_2px_8px_rgba(124,83,53,0.3)] disabled:opacity-50 transition cursor-pointer text-center"
                      >
                        {connectionLoading ? "Generating..." : "Get Connection Code"}
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-[#080808] border border-[#1A1A1D] rounded">
                          <span className="text-[9px] text-[#52525B] uppercase font-bold tracking-widest mb-1.5">CONNECTION CODE</span>
                          <span className="text-2xl font-mono font-extrabold text-[#7C5335] tracking-widest select-all">{connectionCode}</span>
                        </div>
                        <p className="text-[10px] text-[#52525B] leading-relaxed text-center">
                          Paste this code into the Assix Connector desktop application on your system. This code will expire in 15 minutes.
                        </p>
                        <a 
                          href="/connect-page.html" 
                          target="_blank" 
                          className="flex items-center justify-center gap-1.5 text-[10px] text-[#7C5335] hover:text-[#9A6A48] font-bold uppercase tracking-wider transition underline"
                        >
                          Don't have the app? Download it →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* HUMAN INTERVENTION OVERLAY */}
      {humanNeededIntervention && (
        <div className="fixed inset-0 bg-[#080808F0]/95 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm select-none text-left">
          <div className="bg-[#0F0F11] border border-amber-500/20 rounded-lg p-6 w-full max-w-md shadow-2xl relative">
            <header className="flex justify-between items-center border-b border-[#1A1A1A] pb-4 mb-4 select-none">
              <span className="text-xs font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5 animate-pulse">
                <AlertTriangle size={12} /> HUMAN INTERVENTION REQUIRED
              </span>
            </header>

            <div className="space-y-4">
              <p className="text-xs text-zinc-300 leading-relaxed">
                {humanNeededIntervention.message || 'The browser is blocked by a login screen or verification checkpoint.'}
              </p>
              
              <p className="text-[10px] text-amber-500 leading-relaxed font-bold uppercase tracking-wider">
                Please log in using the live browser view, then tap Resume.
              </p>

              {humanNeededIntervention.currentUrl && (
                <div className="bg-[#080808] border border-[#222225] text-[10px] text-zinc-500 p-2 rounded font-mono break-all select-all">
                  URL: {humanNeededIntervention.currentUrl}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2 select-none">
                <button 
                  type="button"
                  onClick={() => {
                    handleStopTask(humanNeededIntervention.taskId);
                    setHumanNeededIntervention(null);
                  }}
                  className="px-4 py-1.5 border border-[#1C1C1F] hover:border-red-500/30 hover:bg-red-500/10 text-[#52525B] hover:text-red-400 text-[9px] font-bold tracking-widest uppercase rounded transition cursor-pointer"
                >
                  ABORT TASK
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    socket.emit('resume_task', {
                      taskId: humanNeededIntervention.taskId,
                      data: {}
                    });
                    setHumanNeededIntervention(null);
                  }}
                  className="px-5 py-1.5 bg-[#7C5335] hover:bg-[#694226] text-white text-[9px] font-bold tracking-widest uppercase rounded shadow-[0_2px_8px_rgba(124,83,53,0.3)] transition cursor-pointer"
                >
                  RESUME PROCESS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE INPUT / 2FA REQUEST MODAL */}
      {!humanNeededIntervention && (activeTask?.status === 'paused_input' || inputRequestAlert) && (
        <div className="fixed inset-0 bg-[#080808F0]/95 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm select-none text-left">
          <div className="bg-[#0F0F11] border border-amber-500/20 rounded-lg p-6 w-full max-w-md shadow-2xl relative">
            <header className="flex justify-between items-center border-b border-[#1A1A1A] pb-4 mb-4 select-none">
              <span className="text-xs font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5 animate-pulse">
                <AlertTriangle size={12} /> ACTION VERIFICATION INTERCEPT REQUISITE
              </span>
            </header>

            <form onSubmit={handleSubmitInputRequest} className="space-y-4">
              <div>
                <label className="text-[10px] tracking-wider text-[#A1A1AA] font-bold uppercase block mb-2 leading-relaxed">
                  {activeTask?.inputPrompt || inputRequestLabel || 'Verification Detail Required'}
                </label>
                <input 
                  type="text" 
                  value={inputRequestValue}
                  onChange={e => setInputRequestValue(e.target.value)}
                  placeholder="Enter details here..."
                  autoFocus
                  className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-amber-500 font-mono tracking-wider"
                />
                <p className="text-[9px] text-[#52525B] mt-1.5 leading-relaxed">
                  Enter the required information above and click submit to resume the active browser process.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 select-none">
                <button 
                  type="button"
                  onClick={() => handleStopTask(activeTask?.taskId || '')}
                  className="px-4 py-1.5 border border-[#1C1C1F] hover:border-red-500/30 hover:bg-red-500/10 text-[#52525B] hover:text-red-400 text-[9px] font-bold tracking-widest uppercase rounded transition cursor-pointer"
                >
                  ABORT TASK
                </button>
                <button 
                  type="submit"
                  disabled={submittingInput || !inputRequestValue.trim()}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-[#080808] text-[9px] font-bold tracking-widest uppercase rounded shadow-[0_2px_8px_rgba(245,158,11,0.2)] transition cursor-pointer flex items-center gap-1"
                >
                  {submittingInput ? (
                    <>
                      <RefreshCw size={10} className="animate-spin" /> SUBMITTING...
                    </>
                  ) : (
                    'RESUME TASK'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW CAMPAIGN TRIGGER CONFIGURATION MODAL */}
      {newTaskModal && (
        <div className="fixed inset-0 bg-[#080808F0]/95 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm select-none">
          <div className="bg-[#0F0F11] border border-[#1C1C1F] rounded-lg p-6 w-full max-w-md max-h-[85vh] overflow-y-auto block shadow-2xl">
            <header className="flex justify-between items-center border-b border-[#1A1A1A] pb-4 mb-4 select-none">
              <span className="text-xs font-bold tracking-widest text-[#F5F5F5] uppercase">LAUNCH AUTOMATION PATHWAY</span>
              <button onClick={() => setNewTaskModal(false)} className="text-[#52525B] hover:text-white transition cursor-pointer">
                <X size={16} />
              </button>
            </header>

            <div className="space-y-4">
              <div>
                <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">SCRAPER TYPE / OUTREACH CHANNEL</label>
                <select 
                  value={newTaskType}
                  onChange={e => { setNewTaskType(e.target.value); setTaskConfig({ niche: '', city: '', market: 'english_ca', maxLeads: 20, targets: [], message: '', igUsername: '', igPassword: '', topic: '', goal: '', platforms: ['reddit', 'google', 'youtube', 'yelp'] }); }}
                  className="w-full bg-[#080808] border border-[#222225] select-none text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335] font-sans font-semibold cursor-pointer"
                >
                  {TASK_TYPES.map(t => (
                    <option key={t.id} value={t.id} className="bg-[#080808]">{t.label}</option>
                  ))}
                </select>
                <div className="text-[10px] text-[#52525B] mt-1 hover:text-gray-300 transition">
                  {TASK_TYPES.find(t => t.id === newTaskType)?.desc}
                </div>
              </div>

              {/* DYNAMIC FORMS PER CHANNEL */}
              {newTaskType === 'google_maps_scrape' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">INDUSTRY / NICHE</label>
                      <select 
                        onChange={e => setTaskConfig((c: any) => ({ ...c, niche: e.target.value }))}
                        className="w-full bg-[#080808] border border-[#222225] select-none text-xs rounded px-3 py-2 text-white outline-none focus:border-[#7C5335]"
                      >
                        <option value="">Choose sector...</option>
                        {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">TARGET CITY</label>
                      <select 
                        onChange={e => setTaskConfig((c: any) => ({ ...c, city: e.target.value }))}
                        className="w-full bg-[#080808] border border-[#222225] select-none text-xs rounded px-3 py-2 text-white outline-none focus:border-[#7C5335]"
                      >
                        <option value="">Choose city...</option>
                        {[...CITIES_EN, ...CITIES_FR].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">TARGET GEOGRAPHY PROFILE</label>
                    <select 
                      onChange={e => setTaskConfig((c: any) => ({ ...c, market: e.target.value }))}
                      className="w-full bg-[#080808] border border-[#222225] select-none text-xs rounded px-3 py-2 text-white outline-none focus:border-[#7C5335]"
                    >
                      <option value="english_ca">English Canada (Default)</option>
                      <option value="french_ca">French Canada</option>
                      <option value="french_eu">French Europe</option>
                      <option value="us_english">US English Market</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">MAX PROSPECTS TO EXTRACT</label>
                    <input 
                      type="number" 
                      defaultValue={20}
                      onChange={e => setTaskConfig((c: any) => ({ ...c, maxLeads: parseInt(e.target.value) || 20 }))}
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                    />
                  </div>
                </>
              )}

              {newTaskType === 'pages_jaunes_scrape' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">INDUSTRY / OBJET</label>
                      <input 
                        type="text"
                        placeholder="e.g. plombier"
                        onChange={e => setTaskConfig((c: any) => ({ ...c, niche: e.target.value }))}
                        className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">CITY / SERVICE AREA</label>
                      <input 
                        type="text"
                        placeholder="e.g. Montreal"
                        onChange={e => setTaskConfig((c: any) => ({ ...c, city: e.target.value }))}
                        className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">MAX TARGET INDEX</label>
                    <input 
                      type="number" 
                      defaultValue={20}
                      onChange={e => setTaskConfig((c: any) => ({ ...c, maxLeads: parseInt(e.target.value) || 20 }))}
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                    />
                  </div>
                </>
              )}

              {newTaskType === 'instagram_discovery' && (
                <>
                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">TARGET NICHE / TOPIC</label>
                    <input 
                      type="text" 
                      placeholder="e.g. luxury lifestyle, digital nomad"
                      onChange={e => {
                        const val = e.target.value;
                        setIgNiche(val);
                        setTaskConfig((c: any) => ({ ...c, niche: val }));
                      }}
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">PROFILES</label>
                      <input 
                        type="number" 
                        defaultValue={5}
                        min={1}
                        max={20}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 5;
                          setIgMaxProfiles(val);
                          setTaskConfig((c: any) => ({ ...c, maxProfiles: val }));
                        }}
                        className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">POSTS / PROFILE</label>
                      <input 
                        type="number" 
                        defaultValue={3}
                        min={1}
                        max={10}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 3;
                          setIgMaxPosts(val);
                          setTaskConfig((c: any) => ({ ...c, maxPosts: val }));
                        }}
                        className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">COMMENTS / POST</label>
                      <input 
                        type="number" 
                        defaultValue={10}
                        min={1}
                        max={50}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 10;
                          setIgMaxComments(val);
                          setTaskConfig((c: any) => ({ ...c, maxComments: val }));
                        }}
                        className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                      />
                    </div>
                  </div>

                  <div className="bg-[#0A0A0C] border border-[#1C1C1F] p-3 rounded text-[9.5px] font-mono text-zinc-400 space-y-1">
                    <div className="text-[7.5px] tracking-widest text-[#52525B] font-bold uppercase">Estimated Run Projections & Costs</div>
                    <div className="flex justify-between">
                      <span>Total Comments Searched:</span>
                      <span className="text-[#F5F5F5] font-bold">{igMaxProfiles * igMaxPosts * igMaxComments} comments</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Credits Cost:</span>
                      <span className="text-green-500 font-bold">
                        ${((igMaxProfiles * 0.003) + (igMaxProfiles * igMaxPosts * 0.0015) + (igMaxProfiles * igMaxPosts * igMaxComments * 0.0023)).toFixed(4)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {newTaskType === 'facebook_ads_scrape' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">INDUSTRY / KEYWORD</label>
                      <input 
                        type="text"
                        placeholder="e.g. real estate"
                        onChange={e => setTaskConfig((c: any) => ({ ...c, niche: e.target.value }))}
                        className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">TARGET COUNTRY CODE</label>
                      <select 
                        onChange={e => setTaskConfig((c: any) => ({ ...c, country: e.target.value }))}
                        className="w-full bg-[#080808] border border-[#222225] select-none text-xs rounded px-3 py-2 text-white outline-none focus:border-[#7C5335]"
                      >
                        <option value="ALL">All Countries</option>
                        <option value="US">United States (US)</option>
                        <option value="CA">Canada (CA)</option>
                        <option value="GB">United Kingdom (GB)</option>
                        <option value="FR">France (FR)</option>
                        <option value="DE">Germany (DE)</option>
                        <option value="AU">Australia (AU)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">MAX ADS TO EXTRACT</label>
                    <input 
                      type="number" 
                      defaultValue={50}
                      onChange={e => setTaskConfig((c: any) => ({ ...c, maxLeads: parseInt(e.target.value) || 50 }))}
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                    />
                  </div>
                </>
              )}

              {newTaskType === 'facebook_groups_scrape' && (
                <>
                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">KEYWORD / NICHE TO SEARCH</label>
                    <input 
                      type="text"
                      placeholder="e.g. web design recommendations"
                      onChange={e => setTaskConfig((c: any) => ({ ...c, niche: e.target.value }))}
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">MAX LEADS TO EXTRACT</label>
                    <input 
                      type="number" 
                      defaultValue={50}
                      onChange={e => setTaskConfig((c: any) => ({ ...c, maxLeads: parseInt(e.target.value) || 50 }))}
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                    />
                  </div>
                </>
              )}

              {newTaskType === 'instagram_dm' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">IG USERNAME</label>
                      <input 
                        type="text" 
                        placeholder="your_username"
                        onChange={e => setTaskConfig((c: any) => ({ ...c, igUsername: e.target.value }))}
                        className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">IG PASSWORD</label>
                      <input 
                        type="password" 
                        onChange={e => setTaskConfig((c: any) => ({ ...c, igPassword: e.target.value }))}
                        className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">PROSPECT TARGET USERNAMES (One handle per line)</label>
                    <textarea 
                      rows={3} 
                      placeholder="elonmusk&#10;nvidia&#10;google"
                      onChange={e => setTaskConfig((c: any) => ({ ...c, targets: e.target.value.split('\n').map(t => t.trim()).filter(Boolean) }))}
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">OUTREACH MESSAGE TEMPLATE</label>
                    <textarea 
                      rows={3} 
                      placeholder="Hi @handle, we analyzed your local presence and noted that..."
                      onChange={e => setTaskConfig((c: any) => ({ ...c, message: e.target.value }))}
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                    />
                  </div>
                </>
              )}

              {newTaskType === 'whatsapp_outreach' && (
                <>
                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">PHONE LIST (One number per line)</label>
                    <textarea 
                      rows={4} 
                      placeholder="+14165550192&#10;+15145550110"
                      onChange={e => setTaskConfig((c: any) => ({ ...c, targets: e.target.value.split('\n').map(t => t.trim()).filter(Boolean) }))}
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335] font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">WHATSAPP MESSAGE CONTENT</label>
                    <textarea 
                      rows={3} 
                      placeholder="Hey there! This is a personalized update concerning..."
                      onChange={e => setTaskConfig((c: any) => ({ ...c, message: e.target.value }))}
                      className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                    />
                  </div>
                </>
              )}

              {newTaskType === 'market_research' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">RESEARCH SUBJECT</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Toronto Plumbing"
                        onChange={e => setTaskConfig((c: any) => ({ ...c, topic: e.target.value }))}
                        className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">EVALUATION OBJECTIVE</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Find social pain points"
                        onChange={e => setTaskConfig((c: any) => ({ ...c, goal: e.target.value }))}
                        className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">ACCESSIBLE PLATFORMS</label>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                      {PLATFORMS.map(p => (
                        <label key={p} className="flex items-center gap-2 text-xs text-[#A1A1AA] cursor-pointer">
                          <input 
                            type="checkbox" 
                            defaultChecked
                            className="accent-[#7C5335] rounded cursor-pointer"
                            onChange={e => setTaskConfig((c: any) => ({ 
                              ...c, 
                              platforms: e.target.checked 
                                ? [...(c.platforms || PLATFORMS), p]
                                : (c.platforms || PLATFORMS).filter((x: string) => x !== p) 
                            }))} 
                          />
                          <span className="uppercase">{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {newTaskType === 'dynamic' && (
                <div>
                  <label className="text-[8px] tracking-widest text-[#52525B] font-bold uppercase block mb-1.5">PROMPT SPECIFICATION BRIEF (AI Planned)</label>
                  <textarea 
                    rows={5} 
                    placeholder="e.g. Navigate to Pages Jaunes Canada, search plumbers in Ottawa, scrape listings that lack websites, save details to database context and notify on WhatsApp"
                    onChange={e => setTaskConfig((c: any) => ({ ...c, goal: e.target.value }))}
                    className="w-full bg-[#080808] border border-[#222225] text-xs rounded px-3.5 py-2 text-white outline-none focus:border-[#7C5335]"
                  />
                  <div className="text-[10px] text-[#52525B] mt-2 select-none">AI model (Gemini/Claude) plans precise micro-actions on browser runtime.</div>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-[#1A1A1A]">
                <button 
                  onClick={handleStartTask}
                  className="flex-1 py-2.5 bg-[#7C5335] hover:bg-[#694226] text-white text-xs font-bold tracking-widest uppercase rounded shadow-lg transition active:scale-95 cursor-pointer"
                >
                  TRIGGER AUTO SEQUENCE →
                </button>
                <button 
                  onClick={() => setNewTaskModal(false)}
                  className="px-5 py-2.5 border border-[#222225] hover:bg-[#1C1C1F] text-[#52525B] hover:text-[#A1A1AA] text-xs font-bold tracking-widest uppercase rounded transition cursor-pointer"
                >
                  CANCEL
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE MARKDOWN AI SYSTEM REPORT MODAL */}
      {reportModalContent && (
        <div className="fixed inset-0 bg-[#080808F5]/95 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm select-text">
          <div className="bg-[#0F0F11] border border-[#1C1C1F] rounded-lg p-6 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <header className="flex justify-between items-center border-b border-[#1A1A1A] pb-4 mb-4 select-none">
              <span className="text-xs font-bold tracking-widest text-[#F5F5F5] uppercase flex items-center gap-1.5">
                <FileText size={12} className="text-[#7C5335]" /> COGNITIVE CAMPAIGN REPORT
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(reportModalContent);
                    alert('Copied Campaign Markdown Report to Clipboard!');
                  }}
                  className="px-3.5 py-1.5 border border-[#222225] hover:border-[#7C5335] text-[9px] font-bold tracking-widest uppercase rounded bg-transparent text-[#A27B5C] hover:text-white hover:bg-[#7C5335] transition cursor-pointer"
                >
                  COPY MD
                </button>
                <button onClick={() => setReportModalContent(null)} className="text-[#52525B] hover:text-white transition cursor-pointer">
                  <X size={16} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-[11px] leading-relaxed text-[#A1A1AA]">
              <div className="prose prose-invert prose-xs max-w-none">
                {reportModalContent.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={idx} className="text-sm font-black text-white uppercase tracking-widest border-b border-[#1C1C20] pb-2 mt-6 mb-3 select-none">{line.replace('# ', '')}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={idx} className="text-xs font-extrabold text-[#7C5335] uppercase tracking-wider mt-5 mb-2 select-none">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={idx} className="text-[11px] font-bold text-white uppercase tracking-wider mt-4 mb-1 select-none">{line.replace('### ', '')}</h3>;
                  }
                  return <p key={idx} className="mb-2 whitespace-pre-wrap">{line}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IFRAME FOR ACTIVE RUNNING BROWSER-USE TASK */}
      {activeBrowserUseTask && activeBrowserUseTask.status === 'running' && activeBrowserUseTask.liveUrl && !isFullscreenIframeMinimized && (
        <div className="fixed inset-0 bg-[#080808]/98 z-50 flex flex-col animate-fade-in select-none">
          {/* Header Controls */}
          <header className="px-6 py-4 bg-[#0D0D11] border-b border-[#1C1C24] flex items-center justify-between shadow-lg shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.15em] text-[#10B981] uppercase">BROWSER-USE ACTIVE STREAM</span>
              </div>
              <div className="text-xs font-bold text-white max-w-xl truncate uppercase tracking-wide">
                Prompt: <span className="text-zinc-400 font-medium font-mono">"{activeBrowserUseTask.task}"</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  window.open(activeBrowserUseTask.liveUrl, '_blank');
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-bold tracking-widest uppercase rounded border border-zinc-700 transition cursor-pointer"
              >
                OPEN NEW TAB ↗
              </button>

              <button
                onClick={() => setIsFullscreenIframeMinimized(true)}
                className="px-4 py-2 bg-[#7C5335] hover:bg-[#694226] text-white text-[10px] font-bold tracking-widest uppercase rounded transition cursor-pointer shadow-[0_4px_12px_rgba(124,83,53,0.25)]"
              >
                MINIMIZE STREAM 
              </button>
            </div>
          </header>

          {/* Viewport Frame */}
          <div className="flex-1 bg-black relative">
            <iframe
              src={activeBrowserUseTask.liveUrl}
              title="Browser-Use Cloud Live Viewport"
              className="w-full h-full border-0 bg-[#080808]"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* FLOATING PICTURE-IN-PICTURE BROWSER-USE WIDGET WHEN MINIMIZED */}
      {activeBrowserUseTask && activeBrowserUseTask.status === 'running' && activeBrowserUseTask.liveUrl && isFullscreenIframeMinimized && (
        <div 
          onClick={() => setIsFullscreenIframeMinimized(false)}
          className="fixed bottom-6 right-6 w-80 h-48 bg-[#0D0D11] border-2 border-[#7C5335] rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] cursor-pointer z-50 hover:scale-105 transition duration-200 flex flex-col group"
        >
          <header className="px-3 py-1.5 bg-[#09090C] border-b border-[#1C1C24] flex items-center justify-between text-[8px] font-bold text-zinc-400 tracking-wider uppercase shrink-0">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              LIVE
            </span>
            <span className="group-hover:text-white transition">CLICK TO MAXIMIZE ⤢</span>
          </header>
          <div className="flex-1 bg-black pointer-events-none relative">
            <iframe
              src={activeBrowserUseTask.liveUrl}
              title="Browser-Use Cloud Live Viewport Mini"
              className="w-full h-full border-0 bg-[#080808]"
            />
          </div>
        </div>
      )}

      {/* SECTOR CITY SELECTION MODAL */}
      {sectorModalOpen && selectedSector && (
        <div className="fixed inset-0 bg-[#080808F0]/95 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm select-none">
          <div className="bg-[#0F0F11] border border-[#1C1C1F] rounded-lg p-6 w-full max-w-lg shadow-2xl space-y-4">
            <header className="flex justify-between items-center border-b border-[#1A1A1A] pb-3">
              <div>
                <span className="text-[8px] tracking-widest text-[#10B981] font-bold uppercase block">NESTA SCRAPE TARGET</span>
                <h4 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider mt-0.5">LAUNCH AGENT FOR {selectedSector.name}</h4>
              </div>
              <button onClick={() => setSectorModalOpen(false)} className="text-[#52525B] hover:text-white transition cursor-pointer">
                <X size={14} />
              </button>
            </header>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[8px] tracking-widest text-zinc-500 font-bold uppercase block">CHOOSE CITY FROM SUPPORTED MARKETS</label>
                <div className="max-h-48 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                  {Object.entries(NESTA_MARKETS).map(([country, cities]) => (
                    <div key={country} className="space-y-1">
                      <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{country}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {cities.map((city) => (
                          <button
                            key={city}
                            onClick={() => handleSectorConfirm(city)}
                            className="px-2.5 py-1 bg-[#141416] hover:bg-[#10B981]/10 border border-[#222] hover:border-[#10B981]/30 text-zinc-300 hover:text-[#10B981] text-[9px] font-mono rounded transition cursor-pointer"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#1A1A1A] pt-4 space-y-2">
                <label className="text-[8px] tracking-widest text-zinc-500 font-bold uppercase block">OR SPECIFY A CUSTOM TARGET CITY</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cityInputValue}
                    onChange={(e) => setCityInputValue(e.target.value)}
                    placeholder="Enter city (e.g. Lyon, Geneva, Boston)..."
                    className="flex-1 bg-[#080808] border border-[#222225] text-xs rounded px-3 py-2 text-white outline-none focus:border-[#10B981] font-sans"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSectorConfirm(cityInputValue);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleSectorConfirm(cityInputValue)}
                    className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-[#080808] text-[9px] font-bold tracking-widest uppercase rounded transition cursor-pointer"
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none select-none">
        {notifications.map(n => (
          <div key={n.id} className="p-3 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 text-[10px] font-bold tracking-wider uppercase rounded-lg shadow-lg backdrop-blur-md animate-slide-in pointer-events-auto">
            {n.message}
          </div>
        ))}
      </div>

    </div>
  );
}
