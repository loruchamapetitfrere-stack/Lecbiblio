import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Flame, 
  Calendar, 
  Share2, 
  Copy, 
  Check, 
  Book, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Info, 
  Trash2, 
  Search, 
  Lock, 
  PenTool, 
  Compass,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  ExternalLink
} from 'lucide-react';
import { PREDEFINED_PLANS, ReadingPlan, PlanDay } from './plansData';

// Helper to format date as YYYY-MM-DD
const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  // State management
  const [plans, setPlans] = useState<ReadingPlan[]>(() => {
    const saved = localStorage.getItem('bible_plans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved plans', e);
      }
    }
    return PREDEFINED_PLANS;
  });

  const [activePlanId, setActivePlanId] = useState<string>(() => {
    return localStorage.getItem('bible_active_plan_id') || PREDEFINED_PLANS[0].id;
  });

  const [currentDays, setCurrentDays] = useState<{ [planId: string]: number }>(() => {
    const saved = localStorage.getItem('bible_current_days');
    return saved ? JSON.parse(saved) : {};
  });

  const [completedDays, setCompletedDays] = useState<{ [planId: string]: number[] }>(() => {
    const saved = localStorage.getItem('bible_completed_days');
    return saved ? JSON.parse(saved) : {};
  });

  const [journals, setJournals] = useState<{ [planId: string]: { [day: number]: string } }>(() => {
    const saved = localStorage.getItem('bible_journals');
    return saved ? JSON.parse(saved) : {};
  });

  // Streaks & dates history
  const [completedDates, setCompletedDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('bible_completed_dates');
    return saved ? JSON.parse(saved) : [];
  });

  // App UI state
  const [activeTab, setActiveTab] = useState<'read' | 'discover' | 'journal' | 'stats'>('read');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('bible_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Custom AI Plan Form State
  const [customTopic, setCustomTopic] = useState('');
  const [customDuration, setCustomDuration] = useState('15');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planGenerationError, setPlanGenerationError] = useState<string | null>(null);

  // Dynamic AI Reflection State
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);
  const [aiReflection, setAiReflection] = useState<{ reflection: string; prayer: string } | null>(null);
  const [reflectionError, setReflectionError] = useState<string | null>(null);

  // Share Dialog State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareDay, setShareDay] = useState<{ planId: string; day: number } | null>(null);
  const [includeVerse, setIncludeVerse] = useState(true);
  const [includeJournal, setIncludeJournal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Quick notification toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Health and API check
  const [apiStatus, setApiStatus] = useState<{ status: string; geminiConfigured: boolean } | null>(null);

  useEffect(() => {
    // Check backend API status
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(err => console.log('Backend connection offline or building...', err));
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('bible_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('bible_active_plan_id', activePlanId);
  }, [activePlanId]);

  useEffect(() => {
    localStorage.setItem('bible_current_days', JSON.stringify(currentDays));
  }, [currentDays]);

  useEffect(() => {
    localStorage.setItem('bible_completed_days', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem('bible_journals', JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem('bible_completed_dates', JSON.stringify(completedDates));
  }, [completedDates]);

  useEffect(() => {
    localStorage.setItem('bible_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Show auto-dismiss toast
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Find active plan details
  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];
  const activeDayNumber = currentDays[activePlan.id] || 1;
  const activeDayData = activePlan.days.find(d => d.day === activeDayNumber) || activePlan.days[0];

  // Current streak calculation
  const streakInfo = React.useMemo(() => {
    if (completedDates.length === 0) return { current: 0, longest: 0 };
    
    // De-duplicate and sort ascending
    const uniqueDates = Array.from(new Set(completedDates)).sort();
    if (uniqueDates.length === 0) return { current: 0, longest: 0 };

    const todayStr = getLocalDateString(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    
    // Longest streak calculation
    let longest = 0;
    let currentStreakRun = 0;
    let prevDate: Date | null = null;
    
    for (const dateStr of uniqueDates) {
      const currentDate = new Date(dateStr + 'T12:00:00'); // Use mid-day to avoid TZ shifting
      if (prevDate === null) {
        currentStreakRun = 1;
      } else {
        const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          currentStreakRun++;
        } else {
          if (currentStreakRun > longest) longest = currentStreakRun;
          currentStreakRun = 1;
        }
      }
      prevDate = currentDate;
    }
    if (currentStreakRun > longest) longest = currentStreakRun;
    
    // Current streak calculation
    let current = 0;
    const hasToday = uniqueDates.includes(todayStr);
    const hasYesterday = uniqueDates.includes(yesterdayStr);
    
    if (hasToday || hasYesterday) {
      let checkDate = hasToday ? new Date() : yesterday;
      let checkStr = getLocalDateString(checkDate);
      
      while (uniqueDates.includes(checkStr)) {
        current++;
        checkDate.setDate(checkDate.getDate() - 1);
        checkStr = getLocalDateString(checkDate);
      }
    }
    
    return { current, longest: Math.max(longest, current) };
  }, [completedDates]);

  // Handle plan day navigation
  const navigateDay = (direction: 'next' | 'prev') => {
    setAiReflection(null); // Clear dynamic AI reflection when changing day
    setReflectionError(null);
    
    const newDay = direction === 'next' 
      ? Math.min(activeDayNumber + 1, activePlan.duration) 
      : Math.max(activeDayNumber - 1, 1);
    
    setCurrentDays(prev => ({
      ...prev,
      [activePlan.id]: newDay
    }));
  };

  // Mark day as completed
  const toggleDayCompletion = (planId: string, dayNum: number) => {
    const currentCompleted = completedDays[planId] || [];
    const isCompleted = currentCompleted.includes(dayNum);
    
    let updatedCompleted: number[];
    let updatedDates = [...completedDates];
    const todayStr = getLocalDateString(new Date());

    if (isCompleted) {
      // Remove completion
      updatedCompleted = currentCompleted.filter(d => d !== dayNum);
      
      // Remove date from history if no other plan was completed on this day
      // (This is simple logic; we can keep it as is or do strict matching)
      const dateIndex = updatedDates.indexOf(todayStr);
      if (dateIndex !== -1) {
        updatedDates.splice(dateIndex, 1);
      }
      showToast("Jour marqué comme non complété", "info");
    } else {
      // Add completion
      updatedCompleted = [...currentCompleted, dayNum].sort((a, b) => a - b);
      
      // Add completion date if not already recorded
      if (!updatedDates.includes(todayStr)) {
        updatedDates.push(todayStr);
      }
      showToast("Merveilleux ! Jour de lecture complété ! ✨", "success");
    }

    setCompletedDays(prev => ({
      ...prev,
      [planId]: updatedCompleted
    }));
    
    setCompletedDates(updatedDates);
  };

  // Handle journal text change
  const handleJournalChange = (text: string) => {
    setJournals(prev => ({
      ...prev,
      [activePlan.id]: {
        ...(prev[activePlan.id] || {}),
        [activeDayNumber]: text
      }
    }));
  };

  // Generate Custom AI Reading Plan
  const handleGenerateCustomPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    setIsGeneratingPlan(true);
    setPlanGenerationError(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          duration: Number(customDuration)
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du plan par le serveur.');
      }

      const newPlanData = await response.json();
      
      // Create fresh plan ID
      const newPlanId = `custom-plan-${Date.now()}`;
      const newPlan: ReadingPlan = {
        id: newPlanId,
        title: newPlanData.title || `Plan : ${customTopic}`,
        description: newPlanData.description || `Parcours sur ${customTopic}`,
        duration: Number(customDuration),
        isCustom: true,
        days: newPlanData.days.map((d: any) => ({
          day: Number(d.day),
          passage: d.passage,
          title: d.title || `Jour ${d.day}`,
          text: d.text || `Méditez sur ${d.passage}`,
          reflection: d.reflection || `Réflexion sur ${d.passage}`
        }))
      };

      setPlans(prev => [...prev, newPlan]);
      setActivePlanId(newPlanId);
      setCurrentDays(prev => ({ ...prev, [newPlanId]: 1 }));
      setCustomTopic('');
      setActiveTab('read');
      showToast(`Parcours personnalisé "${newPlan.title}" généré avec succès ! 🕊️`, "success");
    } catch (err: any) {
      console.error(err);
      setPlanGenerationError(err.message || "Une erreur est survenue lors de l'appel à l'IA.");
      showToast("La génération du plan a échoué. Essayez à nouveau.", "error");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Generate Dynamic AI Reflection / Prayer based on current thoughts
  const handleGenerateAIReflection = async () => {
    setIsGeneratingReflection(true);
    setReflectionError(null);
    setAiReflection(null);

    const userThoughts = journals[activePlan.id]?.[activeDayNumber] || '';

    try {
      const response = await fetch('/api/generate-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passage: activeDayData.passage,
          currentThoughts: userThoughts
        })
      });

      if (!response.ok) {
        throw new Error('Impossible d\'obtenir une méditation personnalisée.');
      }

      const data = await response.json();
      setAiReflection(data);
      showToast("Méditation inspirée par l'IA générée ! 🕊️", "success");
    } catch (err: any) {
      console.error(err);
      setReflectionError("Une erreur est survenue. Vérifiez la clé API.");
      showToast("Échec de la connexion à l'IA.", "error");
    } finally {
      setIsGeneratingReflection(false);
    }
  };

  // Toggle favorite passage
  const toggleFavorite = (passage: string) => {
    if (favorites.includes(passage)) {
      setFavorites(prev => prev.filter(f => f !== passage));
      showToast("Verset retiré de vos favoris", "info");
    } else {
      setFavorites(prev => [...prev, passage]);
      showToast("Verset ajouté à vos favoris ❤️", "success");
    }
  };

  // Delete a reading plan
  const handleDeletePlan = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (PREDEFINED_PLANS.some(p => p.id === planId)) {
      showToast("Les parcours d'origine ne peuvent pas être supprimés.", "error");
      return;
    }
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce parcours personnalisé ? Toutes les progressions et réflexions seront conservées dans votre journal, mais le parcours lui-même sera retiré.")) {
      setPlans(prev => prev.filter(p => p.id !== planId));
      if (activePlanId === planId) {
        const remaining = plans.filter(p => p.id !== planId);
        if (remaining.length > 0) {
          setActivePlanId(remaining[0].id);
        }
      }
      showToast("Parcours personnalisé retiré.", "info");
    }
  };

  // Open Share Dialog
  const openShare = (planId: string, dayNum: number) => {
    setShareDay({ planId, day: dayNum });
    setIncludeVerse(true);
    setIncludeJournal(!!journals[planId]?.[dayNum]);
    setCopied(false);
    setIsShareOpen(true);
  };

  // Generate shareable text
  const getShareText = () => {
    if (!shareDay) return '';
    const targetPlan = plans.find(p => p.id === shareDay.planId);
    if (!targetPlan) return '';
    const dayData = targetPlan.days.find(d => d.day === shareDay.day);
    if (!dayData) return '';

    let text = `📖 *Méditation Biblique Quotidienne* 📖\n`;
    text += `🌿 *Parcours :* ${targetPlan.title} (Jour ${shareDay.day})\n\n`;

    if (includeVerse) {
      text += `📍 *Passage :* ${dayData.passage}\n`;
      text += `« ${dayData.text} »\n\n`;
      text += `✨ *Réflexion :* ${dayData.reflection}\n\n`;
    }

    const journalText = journals[shareDay.planId]?.[shareDay.day];
    if (includeJournal && journalText) {
      text += `✍️ *Mes Pensées & Prières :*\n`;
      text += `"${journalText}"\n\n`;
    }

    text += `🕊️ *Partagé depuis mon Compagnon Biblique*`;
    return text;
  };

  // Copy to clipboard
  const handleCopyToClipboard = () => {
    const text = getShareText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Texte copié dans le presse-papiers !", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  // Native share trigger
  const handleNativeShare = async () => {
    const text = getShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ma méditation - Jour ${shareDay?.day}`,
          text: text,
        });
        showToast("Partagé avec succès !", "success");
        setIsShareOpen(false);
      } catch (err) {
        console.log('User canceled share or error occurred', err);
      }
    } else {
      // Fallback: copy and inform
      handleCopyToClipboard();
    }
  };

  // WhatsApp quick share
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setIsShareOpen(false);
    showToast("Lancement de WhatsApp...", "info");
  };

  // Twitter share
  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Méditation du jour : ${activeDayData.passage} #Bible #Foi`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    setIsShareOpen(false);
  };

  // Email share
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Méditation Biblique Quotidienne - Jour ${shareDay?.day}`);
    const body = encodeURIComponent(getShareText());
    window.open(`mailto:?subject=${subject}&body=${body}`);
    setIsShareOpen(false);
  };

  // Gather all past journal notes with values
  const allNotes = React.useMemo(() => {
    const list: Array<{
      planTitle: string;
      planId: string;
      day: number;
      passage: string;
      note: string;
      date?: string;
    }> = [];

    Object.entries(journals).forEach(([planId, dayMap]) => {
      const plan = plans.find(p => p.id === planId);
      if (!plan) return;

      Object.entries(dayMap).forEach(([dayStr, noteText]) => {
        if (!noteText.trim()) return;
        const dayNum = Number(dayStr);
        const dayData = plan.days.find(d => d.day === dayNum);
        
        list.push({
          planTitle: plan.title,
          planId,
          day: dayNum,
          passage: dayData?.passage || `Jour ${dayNum}`,
          note: noteText
        });
      });
    });

    return list.reverse(); // Newest first
  }, [journals, plans]);

  // Filter notes by search query
  const filteredNotes = allNotes.filter(item => 
    item.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.passage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.planTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100 text-sky-950 font-sans flex flex-col antialiased selection:bg-rose-100 selection:text-rose-900">
      
      {/* Toast Notification */}
      {toast && (
        <div id="app-toast" className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl transition-all duration-300 transform scale-100 animate-bounce ${
          toast.type === 'success' ? 'bg-sky-900 text-white' : 
          toast.type === 'error' ? 'bg-red-600 text-white' : 
          'bg-sky-100 text-sky-950 border border-sky-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <header id="app-header" className="bg-white/80 backdrop-blur-md border-b border-sky-100 sticky top-0 z-30 transition-all">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-sky-950 flex items-center gap-1.5">
                Compagnon Biblique
                <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md font-medium border border-red-100">
                  Privé
                </span>
              </h1>
              <p className="text-xs text-sky-600/90 font-medium">Lecture & Journal Spirituel</p>
            </div>
          </div>

          {/* Quick Streak Widget & Plan Progress badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 shadow-sm" title="Votre série de jours de méditation consécutifs">
              <Flame className="w-4 h-4 fill-current text-red-500 animate-pulse" />
              <span className="text-sm font-bold">{streakInfo.current} {streakInfo.current === 1 ? 'jour' : 'jours'}</span>
            </div>
            
            <div className="hidden sm:flex flex-col items-end text-xs">
              <span className="font-semibold text-sky-900 max-w-[150px] truncate">{activePlan.title}</span>
              <span className="text-sky-500">Jour {activeDayNumber}/{activePlan.duration}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* API Alert/Tips banner if gemini not configured (Only warning, still lets user use offline mode nicely) */}
        {apiStatus && !apiStatus.geminiConfigured && (
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex gap-3 text-sky-800 items-start shadow-sm">
            <Sparkles className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <div className="text-xs flex-1">
              <p className="font-bold text-sky-900">Mode Local & Préfait Actif</p>
              <p className="mt-1 leading-relaxed text-sky-700">
                Vous lisez de magnifiques parcours prédéfinis. Pour générer des parcours 100% sur mesure ou des méditations interactives basées sur vos pensées, ajoutez votre <strong>GEMINI_API_KEY</strong> dans les Secrets de l'AI Studio.
              </p>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div id="tab-switcher" className="bg-sky-100/60 p-1 rounded-2xl flex w-full">
          <button 
            id="tab-read"
            onClick={() => setActiveTab('read')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'read' ? 'bg-white text-sky-950 shadow-md' : 'text-sky-700/80 hover:text-sky-900'
            }`}
          >
            <Book className="w-4 h-4" />
            <span>Méditer</span>
          </button>
          
          <button 
            id="tab-discover"
            onClick={() => setActiveTab('discover')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'discover' ? 'bg-white text-sky-950 shadow-md' : 'text-sky-700/80 hover:text-sky-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Parcours</span>
          </button>

          <button 
            id="tab-journal"
            onClick={() => setActiveTab('journal')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'journal' ? 'bg-white text-sky-950 shadow-md' : 'text-sky-700/80 hover:text-sky-900'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Journal ({allNotes.length})</span>
          </button>

          <button 
            id="tab-stats"
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'stats' ? 'bg-white text-sky-950 shadow-md' : 'text-sky-700/80 hover:text-sky-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Statistiques</span>
          </button>
        </div>

        {/* ==================================== */}
        {/* 1. READ & MEDITATE TAB */}
        {/* ==================================== */}
        {activeTab === 'read' && (
          <div id="read-tab" className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{activePlan.title}</span>
                <h2 className="text-2xl font-serif font-extrabold text-sky-950 mt-1">Jour {activeDayNumber} : {activeDayData.title}</h2>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => navigateDay('prev')}
                  disabled={activeDayNumber === 1}
                  className="p-2.5 rounded-xl bg-white hover:bg-sky-50 text-sky-900 disabled:opacity-40 disabled:hover:bg-white border border-sky-100 transition shadow-sm"
                  title="Jour précédent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigateDay('next')}
                  disabled={activeDayNumber === activePlan.duration}
                  className="p-2.5 rounded-xl bg-white hover:bg-sky-50 text-sky-900 disabled:opacity-40 disabled:hover:bg-white border border-sky-100 transition shadow-sm"
                  title="Jour suivant"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-sky-100/50 rounded-full h-2.5 overflow-hidden w-full flex">
              <div 
                className="bg-gradient-to-r from-sky-400 to-sky-600 h-full transition-all duration-500"
                style={{ width: `${(activeDayNumber / activePlan.duration) * 100}%` }}
              />
            </div>

            {/* BIBLE PASSAGE CARD */}
            <div className="bg-white rounded-3xl border border-sky-100 shadow-xl overflow-hidden relative">
              <div className="bg-gradient-to-r from-sky-500/10 via-sky-50 to-transparent px-6 py-4 border-b border-sky-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-600" />
                  <span className="font-serif font-bold text-sky-900 text-lg">{activeDayData.passage}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleFavorite(activeDayData.passage)}
                    className={`p-2 rounded-xl transition ${
                      favorites.includes(activeDayData.passage) 
                        ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                        : 'text-sky-400 hover:bg-sky-50 hover:text-sky-600'
                    }`}
                    title={favorites.includes(activeDayData.passage) ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Heart className="w-5 h-5" fill={favorites.includes(activeDayData.passage) ? "currentColor" : "none"} />
                  </button>
                  
                  <button 
                    onClick={() => openShare(activePlan.id, activeDayNumber)}
                    className="p-2 rounded-xl text-sky-600 hover:bg-sky-50 transition"
                    title="Partager cette méditation"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Bible Text */}
              <div className="p-8">
                <blockquote className="font-serif text-xl md:text-2xl italic leading-relaxed text-sky-950 relative pl-4 border-l-4 border-sky-400">
                  « {activeDayData.text} »
                </blockquote>
                
                {/* Standard Reflection */}
                <div className="mt-8 pt-8 border-t border-sky-50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-500 mb-2">Réflexion d'accompagnement</h4>
                  <p className="text-sky-900 leading-relaxed text-base">
                    {activeDayData.reflection}
                  </p>
                </div>

                {/* Dynamic AI Reflection Area */}
                {aiReflection && (
                  <div className="mt-6 p-6 rounded-2xl bg-rose-50/50 border border-rose-100/50 animate-fadeIn">
                    <div className="flex items-center gap-1.5 mb-3 text-red-600">
                      <Sparkles className="w-4 h-4" />
                      <h5 className="text-xs font-bold uppercase tracking-wider">Méditation IA Guidée</h5>
                    </div>
                    <p className="text-sky-900 text-sm leading-relaxed mb-4 whitespace-pre-line">
                      {aiReflection.reflection}
                    </p>
                    <div className="border-t border-rose-100/60 pt-3">
                      <h6 className="text-xs font-bold text-sky-800 mb-1 italic">Votre prière pour aujourd'hui :</h6>
                      <p className="text-sky-700 text-sm italic font-serif">
                        {aiReflection.prayer}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action button to ask AI helper */}
                {!aiReflection && (
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={handleGenerateAIReflection}
                      disabled={isGeneratingReflection}
                      className="text-xs font-semibold text-sky-800 hover:text-red-600 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl border border-sky-100 flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      {isGeneratingReflection ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-sky-800 border-t-transparent rounded-full animate-spin"></div>
                          <span>L'IA rédige une réflexion...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Générer une méditation personnalisée par l'IA</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PRIVATE JOURNAL & COMPLETION CARD */}
            <div className="bg-white rounded-3xl border border-sky-100 shadow-lg p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-sky-600" />
                  <h3 className="font-bold text-sky-950">Mon Journal Spirituel</h3>
                </div>
                
                <span className="text-xs text-sky-500 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Privé sur cet appareil
                </span>
              </div>

              <textarea 
                value={journals[activePlan.id]?.[activeDayNumber] || ''}
                onChange={(e) => handleJournalChange(e.target.value)}
                placeholder="Écrivez ici vos propres pensées, prières de reconnaissance, ou résolutions face à ce passage..."
                className="w-full min-h-[140px] p-4 rounded-2xl bg-sky-50/50 border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sky-950 placeholder:text-sky-400 text-sm leading-relaxed transition resize-y"
              />

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
                <span className="text-xs text-sky-500 italic">
                  {(journals[activePlan.id]?.[activeDayNumber] || '').trim() ? "Enregistré automatiquement dans votre journal" : "Rien d'écrit pour le moment"}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Share current reflection / thoughts button if there are any */}
                  {(journals[activePlan.id]?.[activeDayNumber] || '').trim() && (
                    <button
                      onClick={() => openShare(activePlan.id, activeDayNumber)}
                      className="px-4 py-2.5 rounded-xl border border-sky-100 hover:bg-sky-50 text-sky-900 text-sm font-semibold flex items-center gap-2 transition"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Partager mes pensées</span>
                    </button>
                  )}

                  {/* Mark as completed big button */}
                  <button 
                    onClick={() => toggleDayCompletion(activePlan.id, activeDayNumber)}
                    className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-md ${
                      (completedDays[activePlan.id] || []).includes(activeDayNumber)
                        ? 'bg-red-50 text-red-600 border border-red-100 shadow-inner'
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-red-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {(completedDays[activePlan.id] || []).includes(activeDayNumber) 
                        ? 'Complété ! (Cliquez pour annuler)' 
                        : 'Marquer comme Complété'
                      }
                    </span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* 2. PLANS & AI GENERATION TAB */}
        {/* ==================================== */}
        {activeTab === 'discover' && (
          <div id="discover-tab" className="flex flex-col gap-8 animate-fadeIn">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl font-serif font-extrabold text-sky-950">Vos Parcours de Lecture</h2>
              <p className="text-sky-600 text-sm mt-1">Sélectionnez un parcours prédéfini ou laissez notre compagnon spirituel IA composer un plan sur-mesure.</p>
            </div>

            {/* List of active/available plans */}
            <div className="grid md:grid-cols-2 gap-4">
              {plans.map((plan) => {
                const isSelected = plan.id === activePlanId;
                const completedCount = (completedDays[plan.id] || []).length;
                const percent = Math.round((completedCount / plan.duration) * 100);

                return (
                  <div 
                    key={plan.id}
                    onClick={() => {
                      setActivePlanId(plan.id);
                      setActiveTab('read');
                      showToast(`Parcours "${plan.title}" activé`, "info");
                    }}
                    className={`p-5 rounded-3xl border text-left cursor-pointer transition flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-white border-sky-400 shadow-xl ring-2 ring-sky-400/20' 
                        : 'bg-white border-sky-100 hover:border-sky-300 hover:shadow-lg'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                          plan.isCustom 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                            : 'bg-sky-50 text-sky-700 border border-sky-100'
                        }`}>
                          {plan.isCustom ? 'Généré par IA' : 'Parcours standard'}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-sky-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {plan.duration} jours
                          </span>
                          
                          {plan.isCustom && (
                            <button 
                              onClick={(e) => handleDeletePlan(plan.id, e)}
                              className="p-1.5 rounded-lg text-sky-400 hover:text-red-500 hover:bg-sky-50 transition ml-1"
                              title="Supprimer ce parcours"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-sky-950 text-lg group-hover:text-sky-900">
                        {plan.title}
                      </h3>
                      
                      <p className="text-xs text-sky-600/90 mt-2 leading-relaxed line-clamp-3">
                        {plan.description}
                      </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-6 pt-4 border-t border-sky-50">
                      <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-1.5">
                        <span>Progression</span>
                        <span>{completedCount} / {plan.duration} jours ({percent}%)</span>
                      </div>
                      <div className="bg-sky-100/50 rounded-full h-1.5 overflow-hidden w-full">
                        <div className="bg-sky-500 h-full transition-all" style={{ width: `${percent}%` }} />
                      </div>
                      
                      {isSelected && (
                        <div className="mt-3 text-right">
                          <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest flex items-center justify-end gap-1">
                            En cours de lecture
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI CUSTOM PLAN GENERATOR FORM */}
            <div className="bg-gradient-to-tr from-sky-950 to-sky-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-800/20 rounded-full blur-3xl -z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-rose-400 mb-3">
                  <Sparkles className="w-5 h-5 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-wider">Création Spirituelle sur-mesure</span>
                </div>

                <h3 className="text-2xl font-serif font-extrabold mb-2 text-white">Générer un Plan par l'IA</h3>
                <p className="text-sky-200/90 text-sm mb-6 max-w-xl">
                  Entrez n'importe quel sujet, question, sentiment du moment ou défi de vie. L'IA concevra un plan de lecture unique avec des passages pertinents, des réflexions adaptées et des thèmes par jour.
                </p>

                <form onSubmit={handleGenerateCustomPlan} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Topic input */}
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-sky-200">Quel thème ou sujet souhaitez-vous approfondir ?</label>
                      <input 
                        type="text" 
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="Ex: surmonter le deuil, la patience, élever ses enfants, la joie..."
                        className="w-full p-3.5 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white text-white focus:text-sky-950 placeholder:text-sky-300/60 text-sm transition"
                        required
                        disabled={isGeneratingPlan}
                      />
                    </div>

                    {/* Duration select */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-sky-200">Durée du parcours</label>
                      <select 
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-sky-800/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400 text-white text-sm transition cursor-pointer"
                        disabled={isGeneratingPlan}
                      >
                        <option value="5" className="bg-sky-950 text-white">5 jours (Express)</option>
                        <option value="10" className="bg-sky-950 text-white">10 jours (Intermédiaire)</option>
                        <option value="15" className="bg-sky-950 text-white">15 jours (Recommandé)</option>
                        <option value="30" className="bg-sky-950 text-white">30 jours (Complet)</option>
                      </select>
                    </div>
                  </div>

                  {planGenerationError && (
                    <p className="text-red-400 text-xs font-semibold flex items-center gap-1 bg-red-950/40 p-3 rounded-lg border border-red-900/30">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {planGenerationError}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-sky-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Sûr, privé et anonyme.
                    </span>

                    <button 
                      type="submit"
                      disabled={isGeneratingPlan || !customTopic.trim()}
                      className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-sky-800 disabled:text-sky-300 text-white font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-red-900/10 cursor-pointer"
                    >
                      {isGeneratingPlan ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>L'IA écrit votre parcours...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 fill-current" />
                          <span>Générer mon parcours personnalisé ✨</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* ==================================== */}
        {/* 3. SPIRITUAL DIARY TAB */}
        {/* ==================================== */}
        {activeTab === 'journal' && (
          <div id="journal-tab" className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Header & search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-extrabold text-sky-950">Mon Journal de Prière</h2>
                <p className="text-sky-600 text-sm mt-1">Parcourez et recherchez dans vos notes spirituelles passées.</p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un mot, verset..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
            </div>

            {/* Notes list */}
            {filteredNotes.length === 0 ? (
              <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-400">
                  <PenTool className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sky-950">Aucun écrit trouvé</h3>
                <p className="text-xs text-sky-500 max-w-sm">
                  {searchQuery ? "Aucune note ne correspond à vos critères de recherche." : "Prenez le temps d'écrire vos prières et pensées dans l'espace journal de chaque lecture quotidienne pour les voir s'afficher ici."}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-xs font-semibold text-sky-600 underline"
                  >
                    Effacer la recherche
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((item, index) => (
                  <div key={`${item.planId}-${item.day}-${index}`} className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm hover:shadow-md transition">
                    
                    {/* Note header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-50 pb-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block sm:inline mr-2">
                          {item.planTitle}
                        </span>
                        <span className="text-xs text-sky-500 font-semibold">
                          Jour {item.day} — {item.passage}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => openShare(item.planId, item.day)}
                          className="p-1.5 rounded-lg text-sky-400 hover:text-sky-600 hover:bg-sky-50 transition"
                          title="Partager cette note"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => {
                            setActivePlanId(item.planId);
                            setCurrentDays(prev => ({ ...prev, [item.planId]: item.day }));
                            setActiveTab('read');
                            showToast(`Lecture du Jour ${item.day} affichée`, "info");
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-lg transition"
                        >
                          Aller à la lecture
                        </button>
                      </div>
                    </div>

                    {/* Note content */}
                    <p className="text-sky-950 text-sm leading-relaxed whitespace-pre-line font-medium italic pl-3 border-l-2 border-red-200">
                      "{item.note}"
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ==================================== */}
        {/* 4. STATISTICS TAB */}
        {/* ==================================== */}
        {activeTab === 'stats' && (
          <div id="stats-tab" className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl font-serif font-extrabold text-sky-950">Statistiques de Progression</h2>
              <p className="text-sky-600 text-sm mt-1">Félicitations pour votre engagement quotidien envers l'Écriture.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total completed */}
              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col items-center justify-center text-center">
                <BookOpen className="w-6 h-6 text-sky-500 mb-2" />
                <span className="text-2xl font-black text-sky-950">
                  {Object.values(completedDays).reduce((acc, curr) => acc + curr.length, 0)}
                </span>
                <span className="text-[10px] uppercase font-bold text-sky-500 tracking-wider mt-1">Jours Complétés</span>
              </div>

              {/* Current streak */}
              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col items-center justify-center text-center">
                <Flame className="w-6 h-6 text-red-500 mb-2 fill-current" />
                <span className="text-2xl font-black text-red-600">
                  {streakInfo.current}
                </span>
                <span className="text-[10px] uppercase font-bold text-sky-500 tracking-wider mt-1">Série en cours</span>
              </div>

              {/* Longest streak */}
              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col items-center justify-center text-center">
                <Flame className="w-6 h-6 text-orange-500 mb-2" />
                <span className="text-2xl font-black text-sky-950">
                  {streakInfo.longest}
                </span>
                <span className="text-[10px] uppercase font-bold text-sky-500 tracking-wider mt-1">Record de Série</span>
              </div>

              {/* Notes written count */}
              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col items-center justify-center text-center">
                <PenTool className="w-6 h-6 text-sky-600 mb-2" />
                <span className="text-2xl font-black text-sky-950">
                  {allNotes.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-sky-500 tracking-wider mt-1">Écrits Journal</span>
              </div>
            </div>

            {/* Favorites List */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm">
              <h3 className="font-bold text-sky-950 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                Mes Versets Préférés ({favorites.length})
              </h3>

              {favorites.length === 0 ? (
                <p className="text-xs text-sky-500 py-4 text-center">
                  Vous n'avez pas encore marqué de versets favoris. Cliquez sur le cœur ❤️ en haut de la fiche de passage pour les retrouver ici.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {favorites.map((fav, i) => (
                    <div 
                      key={i} 
                      className="px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-100/50 text-sky-950 text-xs font-semibold flex items-center gap-2"
                    >
                      <span>{fav}</span>
                      <button 
                        onClick={() => toggleFavorite(fav)}
                        className="text-sky-400 hover:text-red-500 transition"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Motivational message card */}
            <div className="bg-sky-50 border border-sky-100/50 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Sparkles className="w-6 h-6 fill-current" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-serif font-bold text-sky-900 text-lg">"Ta parole est une lampe à mes pieds..."</h4>
                <p className="text-xs text-sky-700 leading-relaxed mt-1">
                  La persévérance est la clé. En lisant un chapitre ou un verset clé par jour, vous cultivez un espace de réflexion paisible, propice au ressourcement intérieur. Continuez ainsi !
                </p>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-sky-100 bg-white/70 py-6 mt-12 text-center text-xs text-sky-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Compagnon de Lecture Biblique Privé.</p>
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            <span>Toutes vos données et pensées sont conservées en sécurité sur votre appareil.</span>
          </div>
        </div>
      </footer>

      {/* ==================================== */}
      {/* 5. SHARE DIALOG MODAL */}
      {/* ==================================== */}
      {isShareOpen && shareDay && (
        <div id="share-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-sky-950/40 backdrop-blur-sm"
            onClick={() => setIsShareOpen(false)}
          />

          {/* Modal Card */}
          <div className="bg-white rounded-3xl border border-sky-100 shadow-2xl max-w-lg w-full p-6 relative z-10 animate-scaleIn">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-sky-50">
              <h3 className="font-bold text-sky-950 text-lg flex items-center gap-2">
                <Share2 className="w-5 h-5 text-sky-600" />
                Partager ma réflexion
              </h3>
              <button 
                onClick={() => setIsShareOpen(false)}
                className="text-sky-400 hover:text-sky-700 text-2xl font-bold p-1 line-none focus:outline-none"
              >
                &times;
              </button>
            </div>

            {/* Privacy Warning */}
            <div className="my-4 bg-sky-50 rounded-xl p-3 flex gap-2 border border-sky-100">
              <Lock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-sky-700 leading-relaxed">
                Le partage est entièrement optionnel. Vos écrits du journal sont stockés uniquement sur votre appareil. Rien n'est envoyé automatiquement en ligne. Vous décidez ce que vous partagez manuellement.
              </p>
            </div>

            {/* Share Options */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-500">Contenu à inclure</h4>
              
              <label className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/50 hover:bg-sky-50 border border-sky-100/50 cursor-pointer transition select-none">
                <input 
                  type="checkbox" 
                  checked={includeVerse}
                  onChange={(e) => setIncludeVerse(e.target.checked)}
                  className="w-4 h-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <span className="text-xs font-bold text-sky-950 block">Verset du Jour & Réflexion</span>
                  <span className="text-[10px] text-sky-500 block">Inclure la citation biblique et la méditation d'origine.</span>
                </div>
              </label>

              {journals[shareDay.planId]?.[shareDay.day] && (
                <label className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/50 hover:bg-sky-50 border border-sky-100/50 cursor-pointer transition select-none">
                  <input 
                    type="checkbox" 
                    checked={includeJournal}
                    onChange={(e) => setIncludeJournal(e.target.checked)}
                    className="w-4 h-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-sky-950 block">Mes Écrits Spirituels</span>
                    <span className="text-[10px] text-sky-500 block">Inclure votre texte ou prière du journal intime.</span>
                  </div>
                </label>
              )}
            </div>

            {/* Content Preview Block */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-500 mb-2">Aperçu du message</h4>
              <div className="bg-sky-50/80 rounded-2xl p-4 max-h-[160px] overflow-y-auto text-xs text-sky-950 font-serif whitespace-pre-line border border-sky-100">
                {getShareText()}
              </div>
            </div>

            {/* Share action buttons */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleCopyToClipboard}
                  className="py-3 px-4 rounded-xl border border-sky-100 hover:bg-sky-50 text-sky-900 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-sky-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copié !" : "Copier le texte"}</span>
                </button>

                <button 
                  onClick={handleNativeShare}
                  className="py-3 px-4 rounded-xl bg-sky-900 hover:bg-sky-950 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Partager (Mobile)</span>
                </button>
              </div>

              {/* Direct App/Social channels */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-sky-50">
                <button 
                  onClick={handleWhatsAppShare}
                  className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
                <button 
                  onClick={handleEmailShare}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  E-mail
                </button>
                <button 
                  onClick={handleTwitterShare}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  X / Twitter
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
