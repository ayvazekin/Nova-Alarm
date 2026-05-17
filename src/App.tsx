/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Bell, X, Film, Play, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Alarm, AlarmRinging } from './types';
import { saveVideo, getVideo, deleteVideo, saveGlobalBackground, getGlobalBackground } from './db';

export default function App() {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('nova_alarms');
    return saved ? JSON.parse(saved) : [];
  });
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const [globalBgUrl, setGlobalBgUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ringingAlarm, setRingingAlarm] = useState<AlarmRinging | null>(null);
  const [dismissedAlarms, setDismissedAlarms] = useState<Record<string, string>>({});
  const [isDbReady, setIsDbReady] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      const urls: Record<string, string> = {};
      for (const alarm of alarms) {
        if (alarm.videoUrl) {
          try {
            const blob = await getVideo(alarm.id);
            if (blob) urls[alarm.id] = URL.createObjectURL(blob);
          } catch (e) {
            console.error("Video load error", e);
          }
        }
      }
      setVideoUrls(urls);

      try {
        const bgBlob = await getGlobalBackground();
        if (bgBlob) setGlobalBgUrl(URL.createObjectURL(bgBlob));
      } catch (e) {
        console.error("Background load error", e);
      }

      setIsDbReady(true);
    };
    loadData();
    return () => {
      Object.values(videoUrls).forEach(URL.revokeObjectURL);
      if (globalBgUrl) URL.revokeObjectURL(globalBgUrl);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('nova_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDbReady) return;
      const now = new Date();
      const currentHHmm = format(now, 'HH:mm');
      const currentDay = now.getDay();
      
      alarms.forEach(alarm => {
        const isDismissedThisMinute = dismissedAlarms[alarm.id] === currentHHmm;
        
        if (alarm.isActive && alarm.time === currentHHmm && alarm.days.includes(currentDay) && !isDismissedThisMinute) {
          if (!ringingAlarm || ringingAlarm.alarm.id !== alarm.id || (now.getTime() - ringingAlarm.timestamp > 60000)) {
            setRingingAlarm({ 
              alarm: { ...alarm, videoUrl: videoUrls[alarm.id] || alarm.videoUrl }, 
              timestamp: now.getTime() 
            });
          }
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms, ringingAlarm, videoUrls, isDbReady, dismissedAlarms]);

  const addAlarm = async (alarm: Alarm, mediaBlob?: Blob) => {
    if (mediaBlob) {
      await saveVideo(alarm.id, mediaBlob);
      const url = URL.createObjectURL(mediaBlob);
      setVideoUrls(prev => ({ ...prev, [alarm.id]: url }));
      alarm.videoUrl = "db-stored";
    }
    setAlarms([...alarms, alarm]);
    setIsModalOpen(false);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlarm = async (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
    await deleteVideo(id);
    if (videoUrls[id]) {
      URL.revokeObjectURL(videoUrls[id]);
      setVideoUrls(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await saveGlobalBackground(file);
      if (globalBgUrl) URL.revokeObjectURL(globalBgUrl);
      setGlobalBgUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div id="nova-app" className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] font-sans selection:bg-blue-100 overflow-x-hidden flex flex-col items-center pt-32 px-6">
      <main className="relative z-10 w-full max-w-sm">
        <header className="mb-12 flex items-center justify-between px-2">
          <h1 className="text-4xl font-bold tracking-tight">Alarmlar</h1>
          <div className="flex items-center gap-2">
            <label className="w-10 h-10 bg-white border border-stone-100 text-stone-400 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm cursor-pointer hover:text-black">
              <ImageIcon className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
            </label>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 bg-[#007AFF] text-white rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </header>

        <section className="space-y-3">
          <AnimatePresence mode="popLayout">
            {alarms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center bg-white rounded-3xl border border-stone-100 shadow-sm"
              >
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-stone-200" />
                </div>
                <p className="text-stone-400 font-medium text-sm">Alarm Kurulu Değil</p>
              </motion.div>
            ) : (
              alarms.sort((a,b) => a.time.localeCompare(b.time)).map((alarm) => (
                <AlarmItem 
                  key={alarm.id} 
                  alarm={alarm} 
                  hasVideo={!!videoUrls[alarm.id]}
                  onToggle={() => toggleAlarm(alarm.id)} 
                  onDelete={() => deleteAlarm(alarm.id)} 
                />
              ))
            )}
          </AnimatePresence>
        </section>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <AlarmModal 
            onClose={() => setIsModalOpen(false)} 
            onSave={addAlarm} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ringingAlarm && (
          <AlarmRinger 
            alarmRinging={ringingAlarm} 
            globalBgUrl={globalBgUrl}
            onDismiss={() => {
              const ringTime = ringingAlarm.alarm.time;
              setDismissedAlarms(prev => ({ ...prev, [ringingAlarm.alarm.id]: ringTime }));
              setRingingAlarm(null);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface AlarmItemProps {
  alarm: Alarm;
  hasVideo: boolean;
  onToggle: () => void;
  onDelete: () => void | Promise<void>;
  key?: React.Key;
}

function AlarmItem({ alarm, hasVideo, onToggle, onDelete }: AlarmItemProps) {
  const daysString = alarm.days.length === 7 ? 'Her gün' : alarm.days.length === 0 ? 'Bugün' : 
    alarm.days.map(d => ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][d]).join(', ');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative overflow-hidden p-6 rounded-[1.5rem] border transition-all duration-300 ${
        alarm.isActive 
          ? 'bg-white border-stone-100 shadow-sm' 
          : 'bg-stone-50/50 border-stone-50 opacity-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className={`text-4xl font-medium tracking-tight leading-none ${alarm.isActive ? 'text-black' : 'text-stone-400'}`}>
              {alarm.time}
            </h3>
            {hasVideo && alarm.isActive && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            )}
          </div>
          <p className="text-[12px] font-semibold text-stone-400 uppercase tracking-wide">
            {alarm.label || 'Alarm'}, {daysString}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onToggle}
            className={`w-12 h-7 rounded-full transition-all duration-300 relative ${
              alarm.isActive ? 'bg-[#34C759]' : 'bg-stone-200'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm absolute top-1 ${
              alarm.isActive ? 'left-6' : 'left-1'
            }`} />
          </button>
          
          <button 
            onClick={onDelete}
            className="p-2 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function AlarmModal({ onClose, onSave }: { onClose: () => void; onSave: (alarm: Alarm, blob?: Blob) => void }) {
  const [time, setTime] = useState('08:00');
  const [label, setLabel] = useState('');
  const [days, setDays] = useState<number[]>([0,1,2,3,4,5,6]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const toggleDay = (day: number) => {
    setDays(days.includes(day) ? days.filter(d => d !== day) : [...days, day]);
  };

  const getMediaType = (file: File): 'video' | 'audio' => 
    file.type.startsWith('audio/') ? 'audio' : 'video';

  const handleSave = () => {
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      time,
      label,
      days,
      isActive: true,
      videoUrl: mediaFile ? 'persistent' : undefined,
      mediaType: mediaFile ? getMediaType(mediaFile) : undefined,
      fileName: mediaFile?.name
    }, mediaFile || undefined);
  };

  const dayNames = ['P', 'P', 'S', 'Ç', 'P', 'C', 'C'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/20 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between border-b border-stone-50 pb-6">
            <button onClick={onClose} className="text-[#007AFF] font-medium text-lg">İptal</button>
            <h2 className="text-lg font-bold">Alarm Ekle</h2>
            <button onClick={handleSave} className="text-[#007AFF] font-bold text-lg">Kaydet</button>
          </div>

          <div className="flex justify-center py-4">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-7xl font-light tracking-tight bg-transparent border-none focus:ring-0 text-black cursor-pointer p-0 text-center"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between bg-stone-50 rounded-2xl p-4">
              <span className="font-medium">Etiket</span>
              <input
                type="text"
                placeholder="Alarm"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="bg-transparent border-none text-right focus:ring-0 text-stone-500 font-medium"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between gap-1">
                {dayNames.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => toggleDay(i)}
                    className={`w-10 h-10 text-xs font-black rounded-full transition-all ${
                      days.includes(i) 
                        ? 'bg-black text-white' 
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">Ses / Video Seç</span>
                <span className="text-[11px] text-stone-400">MP3, MP4, WAV, M4A…</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <span className="text-sm truncate max-w-[120px]">{mediaFile ? mediaFile.name : 'Yok'}</span>
                {mediaFile?.type.startsWith('audio/') 
                  ? <Play className="w-5 h-5" /> 
                  : <Film className="w-5 h-5" />
                }
              </div>
              <input
                type="file"
                accept="video/*,audio/*,.mp3,.mp4,.wav,.m4a,.ogg,.aac,.flac"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setMediaFile(file);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AlarmRinger({ alarmRinging, onDismiss, globalBgUrl }: { alarmRinging: AlarmRinging; onDismiss: () => void; globalBgUrl: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const mediaUrl = alarmRinging.alarm.videoUrl;
  const mediaType = alarmRinging.alarm.mediaType;
  // Backward compat: if no mediaType stored, assume video for existing alarms with a url
  const isAudio = mediaType === 'audio';
  const isVideo = !isAudio && !!mediaUrl;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Blocked by user interaction policy", e));
    }
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Blocked by user interaction policy", e));
    }
  }, [alarmRinging]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center justify-between"
    >
      <div className="absolute inset-0">
        {globalBgUrl && (
          <img src={globalBgUrl} className="w-full h-full object-cover pointer-events-none" alt="" />
        )}
        
        {isVideo ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            className={`w-full h-full object-cover ${globalBgUrl ? 'opacity-0 absolute inset-0 pointer-events-none' : 'opacity-100'}`}
            loop
            playsInline
            autoPlay
          />
        ) : (
          !globalBgUrl && (
            <div className="w-full h-full bg-[#000] flex items-center justify-center">
              <div className="w-64 h-64 bg-stone-900 rounded-full animate-pulse blur-[100px]" />
            </div>
          )
        )}
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-32 bg-black/20 px-8">
        <div className="text-center">
          <h2 className="text-8xl font-light tracking-tighter text-white mb-4">
            {alarmRinging.alarm.time}
          </h2>
          <p className="text-xl font-medium text-white/80 uppercase tracking-[0.2em]">
            {alarmRinging.alarm.label || 'Günaydın'}
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="w-full max-w-xs h-20 bg-white text-black text-2xl font-bold rounded-full shadow-2xl active:scale-95 transition-transform"
        >
          Durdur
        </button>
      </div>

      {/* Audio: MP3/WAV/AAC veya fallback alarm sesi */}
      <audio ref={audioRef} loop hidden autoPlay>
        {isAudio && mediaUrl
          ? <source src={mediaUrl} />
          : !isVideo && <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-clock-beep-988.mp3" type="audio/mpeg" />
        }
      </audio>
    </motion.div>
  );
}
