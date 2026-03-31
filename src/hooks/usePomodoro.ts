import { useState, useEffect, useCallback, useRef } from "react";

const playNotificationSound = (type: "focus" | "break") => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === "break") {
      // Gentle chime for break
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } else {
      // Upbeat tone for focus
      osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(523.25, ctx.currentTime + 0.3); // C5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch (e) {
    // Audio not available
  }
};

const showNotification = (title: string, body: string) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  } else if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
};

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export interface PomodoroSettings {
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  sessionsBeforeLongBreak: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  sessionsBeforeLongBreak: 4,
};

export function usePomodoro(onSessionComplete?: (focusMinutes: number) => void) {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const saved = localStorage.getItem("pomodoro-settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onSessionCompleteRef = useRef(onSessionComplete);
  onSessionCompleteRef.current = onSessionComplete;

  const getTimeForMode = useCallback(
    (m: TimerMode) => {
      switch (m) {
        case "pomodoro": return settings.focusTime * 60;
        case "shortBreak": return settings.shortBreakTime * 60;
        case "longBreak": return settings.longBreakTime * 60;
      }
    },
    [settings]
  );

  useEffect(() => {
    localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (mode === "pomodoro") {
              const newCompleted = completedSessions + 1;
              setCompletedSessions(newCompleted);
              onSessionCompleteRef.current?.(settings.focusTime);
              if (newCompleted % settings.sessionsBeforeLongBreak === 0) {
                setMode("longBreak");
                return settings.longBreakTime * 60;
              } else {
                setMode("shortBreak");
                return settings.shortBreakTime * 60;
              }
            } else {
              setMode("pomodoro");
              return settings.focusTime * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, completedSessions, settings]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      setTimeLeft(getTimeForMode(newMode));
      setIsRunning(false);
    },
    [getTimeForMode]
  );

  const toggleTimer = useCallback(() => setIsRunning((p) => !p), []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(getTimeForMode(mode));
  }, [getTimeForMode, mode]);

  const updateSettings = useCallback(
    (newSettings: PomodoroSettings) => {
      setSettings(newSettings);
      setIsRunning(false);
      switch (mode) {
        case "pomodoro": setTimeLeft(newSettings.focusTime * 60); break;
        case "shortBreak": setTimeLeft(newSettings.shortBreakTime * 60); break;
        case "longBreak": setTimeLeft(newSettings.longBreakTime * 60); break;
      }
    },
    [mode]
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    mode, switchMode, display, isRunning, toggleTimer, resetTimer,
    settings, updateSettings, completedSessions, timeLeft,
    totalTime: getTimeForMode(mode),
  };
}
