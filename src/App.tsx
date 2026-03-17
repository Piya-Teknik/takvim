import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, CheckCircle, Clock, Calendar as CalendarIcon, FlaskConical } from 'lucide-react';
import { CONFIG, HOLIDAYS, MOODS } from './config';
import { getRandomQuestions } from './questions';

// --- Hooks & Utils ---
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};

const getDaysBetween = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    days.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
};

const getTodayStr = () => new Date().toISOString().split('T')[0];

// --- Components ---
const Balloon = ({ color = '#ef4444', emoji = '', popped, isLocked = false, onClick, interactive = false, className = "w-32 h-48 drop-shadow-2xl" }: any) => {
  const [animConfig] = useState(() => ({
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 1
  }));

  if (popped) {
    return <div className="text-6xl filter drop-shadow-md">💥</div>;
  }

  const content = (
    <motion.div
      animate={!isLocked ? {
        y: [0, -8, 0],
        rotate: [-3, 3, -3],
      } : {}}
      transition={{
        duration: animConfig.duration,
        delay: animConfig.delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative flex items-center justify-center"
    >
      <svg viewBox="0 0 120 200" className={className}>
        <path d="M60,10 C20,10 10,50 10,80 C10,110 40,140 60,150 C80,140 110,110 110,80 C110,50 100,10 60,10 Z" fill={color} />
        <path d="M30,40 C30,30 40,20 50,20" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M55,150 L65,150 L60,160 Z" fill={color} />
        <path d="M60,160 Q50,180 60,200" stroke="#9ca3af" strokeWidth="2" fill="none" />
        {emoji && !isLocked && <text x="60" y="95" fontSize="45" textAnchor="middle" dominantBaseline="middle">{emoji}</text>}
        {isLocked && (
          <g transform="translate(45, 75) scale(1.2)">
            <rect x="5" y="10" width="14" height="10" rx="2" fill="#333" />
            <path d="M8,10 V7 C8,4.5 16,4.5 16,7 V10" fill="none" stroke="#333" strokeWidth="2" />
            <circle cx="12" cy="15" r="1.5" fill="white" />
          </g>
        )}
      </svg>
    </motion.div>
  );

  if (interactive) {
    return (
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }} onClick={onClick} className="cursor-pointer">
        {content}
      </motion.div>
    );
  }

  return <div>{content}</div>;
};

const CooldownTimer = ({ cooldownUntil, onExpire }: { cooldownUntil: number, onExpire: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, cooldownUntil - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = cooldownUntil - Date.now();
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        onExpire();
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownUntil, onExpire]);

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="text-4xl font-mono font-black text-red-500 tracking-wider">
      {hours > 0 ? `${String(hours).padStart(2, '0')}:` : ''}
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [poppedDays, setPoppedDays] = useLocalStorage<string[]>('poppedDays', []);
  const [cooldowns, setCooldowns] = useLocalStorage<Record<string, number>>('cooldowns', {});
  const [dayMoods, setDayMoods] = useLocalStorage<Record<string, string>>('dayMoods', {});
  const [isTestMode, setIsTestMode] = useLocalStorage<boolean>('testMode', false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [videoId, setVideoId] = useState(CONFIG.VIDEOS[0]);

  const today = getTodayStr();
  const days = getDaysBetween(CONFIG.START_DATE, CONFIG.TARGET_DATE);
  const daysLeft = Math.max(0, Math.ceil((new Date(CONFIG.TARGET_DATE).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)));

  // Modal State
  const [step, setStep] = useState<'mood' | 'initial' | 'quiz' | 'ready' | 'video'>('initial');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [wrongAnswer, setWrongAnswer] = useState(false);

  useEffect(() => {
    if (selectedDay) {
      const isPopped = poppedDays.includes(selectedDay);
      const hasCooldown = !isTestMode && (cooldowns[selectedDay] || 0) > Date.now();
      const hasMood = !!dayMoods[selectedDay];
      
      if (isPopped) {
        setVideoId(CONFIG.VIDEOS[Math.floor(Math.random() * CONFIG.VIDEOS.length)]);
        setStep('video');
      }
      else if (!hasMood) setStep('mood');
      else if (hasCooldown) setStep('initial');
      else setStep('initial');
      
      setQuestions(getRandomQuestions(3));
      setCurrentQ(0);
      setAnswers([]);
      setWrongAnswer(false);
    }
  }, [selectedDay, poppedDays, cooldowns, dayMoods]);

  const renderModalContent = () => {
    if (!selectedDay) return null;
    const moodId = dayMoods[selectedDay];
    const mood = MOODS.find(m => m.id === moodId);
    const balloonColor = mood ? mood.color : '#ef4444';
    const balloonEmoji = mood ? mood.emoji : '';
    const isPopped = poppedDays.includes(selectedDay);
    const cooldownUntil = cooldowns[selectedDay] || 0;
    const hasCooldown = !isTestMode && cooldownUntil > Date.now();

    if (step === 'mood') {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
          <h2 className="text-2xl font-bold mb-6">Bugün nasıl hissediyorsun?</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full max-w-md">
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setDayMoods(prev => ({ ...prev, [selectedDay]: m.id }));
                  setStep('initial');
                }}
                className="flex flex-col items-center p-3 rounded-xl border-2 border-stone-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
              >
                <span className="text-3xl mb-2">{m.emoji}</span>
                <span className="text-xs font-medium text-stone-600">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (step === 'initial') {
      if (isPopped) {
        setStep('video');
        return null;
      }
      if (hasCooldown) {
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <Clock className="w-16 h-16 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Biraz Beklemelisin</h2>
            <p className="text-gray-600 mb-8 max-w-sm">
              Soruları yanlış cevapladığın için yeni soruları görebilmek için beklemen gerekiyor.
            </p>
            <CooldownTimer cooldownUntil={cooldownUntil} onExpire={() => setStep('initial')} />
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
          <Balloon color={balloonColor} emoji={balloonEmoji} popped={false} />
          <h2 className="text-2xl font-bold mt-6 mb-2">Günün Balonu</h2>
          <p className="text-gray-600 mb-8 max-w-sm">
            Bu balonu patlatmak için 3 soruyu doğru cevaplamalısın. Yanlış cevap verirsen 2.5 dakika beklemek zorundasın!
          </p>
          <button 
            onClick={() => setStep('quiz')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl active:scale-95"
          >
            Sorulara Başla
          </button>
        </div>
      );
    }

    if (step === 'quiz') {
      const q = questions[currentQ];
      if (!q) return null;
      
      const handleAnswer = (opt: string) => {
        if (wrongAnswer) return;
        const newAnswers = [...answers, opt];
        setAnswers(newAnswers);
        
        if (opt !== q.a) {
          setWrongAnswer(true);
          setTimeout(() => {
            setCooldowns((prev: any) => ({ ...prev, [selectedDay]: Date.now() + CONFIG.COOLDOWN_MS }));
            setStep('initial');
            setWrongAnswer(false);
          }, 2000);
          return;
        }

        if (currentQ < 2) {
          setTimeout(() => setCurrentQ(prev => prev + 1), 500);
        } else {
          setTimeout(() => setStep('ready'), 500);
        }
      };

      return (
        <div className="p-8 w-full max-w-lg mx-auto flex flex-col h-full justify-center">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">Soru {currentQ + 1} / 3</span>
            <span className="text-xs font-medium text-gray-400">{selectedDay}</span>
          </div>
          <h3 className="text-2xl font-bold mb-8 text-gray-800 leading-tight">{q.q}</h3>
          <div className="space-y-3">
            {q.options.map((opt: string) => {
              const isSelected = answers.includes(opt);
              const isCorrect = opt === q.a;
              let btnClass = 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700';
              
              if (wrongAnswer) {
                if (isCorrect) btnClass = 'bg-green-100 border-green-500 text-green-800';
                else if (isSelected) btnClass = 'bg-red-100 border-red-500 text-red-800';
                else btnClass = 'border-gray-200 opacity-50';
              } else if (isSelected && isCorrect) {
                btnClass = 'bg-green-100 border-green-500 text-green-800';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={wrongAnswer || (isSelected && isCorrect)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-medium text-lg flex justify-between items-center ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isTestMode && isCorrect && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full border border-amber-200">
                      Doğru Cevap
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {wrongAnswer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-red-600 font-bold text-lg">Yanlış cevap!</p>
              <p className="text-red-500 text-sm mt-1">2.5 dakika beklemelisin...</p>
            </motion.div>
          )}
        </div>
      );
    }

    if (step === 'ready') {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
          <h2 className="text-3xl font-black text-green-500 mb-8">Harika! Tüm cevaplar doğru.</h2>
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
            <Balloon 
              color={balloonColor} 
              emoji={balloonEmoji} 
              popped={false} 
              onClick={() => {
                setPoppedDays((prev: string[]) => [...prev, selectedDay]);
                setVideoId(CONFIG.VIDEOS[Math.floor(Math.random() * CONFIG.VIDEOS.length)]);
                setStep('video');
              }} 
              interactive 
              className="w-48 h-72 drop-shadow-2xl"
            />
          </motion.div>
          <p className="mt-12 text-2xl font-bold text-indigo-600 animate-pulse">
            Patlatmak için balona dokun!
          </p>
        </div>
      );
    }

    if (step === 'video') {
      return (
        <div className="p-6 w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white rounded-3xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-green-400">Tebrikler! Balonu Patlattın!</h2>
          <div className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <button onClick={() => setSelectedDay(null)} className="mt-8 bg-white/10 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-colors">
            Takvime Dön
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans text-stone-900 selection:bg-indigo-200">
      <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl shadow-md">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Geri Sayım</h1>
            <button
              onClick={() => setIsTestMode(!isTestMode)}
              className={`ml-2 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isTestMode 
                  ? 'bg-amber-100 text-amber-700 border border-amber-300 shadow-sm' 
                  : 'bg-stone-100 text-stone-400 hover:bg-stone-200 border border-transparent'
              }`}
              title="Test Modu (Gelecek günleri açar, bekleme süresini kaldırır, doğru cevapları gösterir)"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isTestMode ? 'Test Modu Açık' : 'Test Modu'}</span>
            </button>
          </div>
          <div className="flex flex-col items-end bg-white px-4 py-2 rounded-2xl shadow-sm border border-indigo-50">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Hedefe Kalan</span>
            <span className="text-2xl font-black text-indigo-600 leading-none">{daysLeft} Gün</span>
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {days.map((day) => {
            const isFuture = !isTestMode && day > today;
            const isPopped = poppedDays.includes(day);
            
            const dateObj = new Date(day);
            const dayNum = dateObj.getDate();
            const monthName = dateObj.toLocaleString('tr-TR', { month: 'short' });
            const dayName = dateObj.toLocaleString('tr-TR', { weekday: 'short' });
            const isToday = day === today;
            
            const monthDayStr = day.substring(5);
            const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
            const isHoliday = HOLIDAYS.includes(monthDayStr);
            const isSpecialDay = isWeekend || isHoliday;

            const moodId = dayMoods[day];
            const mood = MOODS.find(m => m.id === moodId);
            const balloonColor = mood ? mood.color : '#cbd5e1';
            const balloonEmoji = mood ? mood.emoji : '';

            return (
              <motion.button
                key={day}
                whileHover={!isFuture ? { scale: 1.03, y: -2 } : {}}
                whileTap={!isFuture ? { scale: 0.97 } : {}}
                onClick={() => !isFuture && setSelectedDay(day)}
                disabled={isFuture}
                className={`relative aspect-[3/4] rounded-2xl flex flex-col items-center justify-between p-3 transition-all overflow-hidden ${
                  isFuture ? 'bg-stone-200/40 opacity-70 cursor-not-allowed border-2 border-dashed border-stone-300' :
                  isPopped ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 shadow-md' :
                  isToday ? 'bg-white border-2 border-indigo-400 shadow-lg ring-4 ring-indigo-100 transform scale-105 z-10' :
                  isSpecialDay ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 shadow-sm hover:border-red-400 hover:shadow-md' :
                  'bg-white border-2 border-indigo-100 shadow-sm hover:border-indigo-400 hover:shadow-md'
                }`}
              >
                <div className={`text-xs font-bold w-full flex justify-between ${isToday ? 'text-indigo-600' : isFuture ? 'text-stone-400' : isSpecialDay ? 'text-red-500' : 'text-stone-600'}`}>
                  <span>{dayNum} {monthName}</span>
                  <span>{dayName}</span>
                </div>
                
                <div className="flex-grow flex items-center justify-center w-full">
                  {isFuture ? (
                    <Balloon color="#e5e7eb" isLocked={true} popped={false} interactive={false} className="w-16 h-24 drop-shadow-sm opacity-60" />
                  ) : isPopped ? (
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2 filter drop-shadow-sm">💥</span>
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                  ) : (
                    <Balloon color={balloonColor} emoji={balloonEmoji} popped={false} interactive={false} className="w-16 h-24 drop-shadow-md" />
                  )}
                </div>
                
                {cooldowns[day] && cooldowns[day] > Date.now() && !isPopped && !isFuture && !isTestMode && (
                  <div className="absolute bottom-2 right-2 bg-red-100 p-1 rounded-full">
                    <Clock className="w-3 h-3 text-red-500" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative min-h-[400px] flex flex-col"
            >
              {step !== 'video' && (
                <button
                  onClick={() => setSelectedDay(null)}
                  className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-500 transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              <div className="flex-grow flex flex-col">
                {renderModalContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
