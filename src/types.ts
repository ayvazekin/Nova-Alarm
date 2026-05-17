export interface Alarm {
  id: string;
  time: string; // HH:mm format
  isActive: boolean;
  label: string;
  videoUrl?: string; // Local blob URL or base64 (kept for backward compat)
  mediaUrl?: string; // Active blob URL resolved at runtime
  mediaType?: 'video' | 'audio'; // Type of the selected media file
  fileName?: string;
  days: number[]; // 0-6 (Sun-Sat)
}

export interface AlarmRinging {
  alarm: Alarm;
  timestamp: number;
}
