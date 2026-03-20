import { useState, useEffect } from "react";

import citySunset from "@/assets/themes/city-sunset.jpg";
import cozyRoom from "@/assets/themes/cozy-room.jpg";
import oceanDawn from "@/assets/themes/ocean-dawn.jpg";
import forest from "@/assets/themes/forest.jpg";
import aurora from "@/assets/themes/aurora.jpg";
import sakura from "@/assets/themes/sakura.jpg";
import cafe from "@/assets/themes/cafe.jpg";
import library from "@/assets/themes/library.jpg";
import zen from "@/assets/themes/zen.jpg";
import rainyNight from "@/assets/themes/rainy-night.jpg";
import space from "@/assets/themes/space.jpg";
import lavender from "@/assets/themes/lavender.jpg";

export interface ThemeOption {
  id: string;
  name: string;
  image: string;
}

export const themes: ThemeOption[] = [
  { id: "city-sunset", name: "City Sunset", image: citySunset },
  { id: "cozy-room", name: "Cozy Room", image: cozyRoom },
  { id: "ocean-dawn", name: "Ocean Dawn", image: oceanDawn },
  { id: "forest", name: "Forest", image: forest },
  { id: "aurora", name: "Aurora", image: aurora },
  { id: "sakura", name: "Sakura", image: sakura },
  { id: "cafe", name: "Café", image: cafe },
  { id: "library", name: "Library", image: library },
  { id: "zen", name: "Zen Garden", image: zen },
  { id: "rainy-night", name: "Rainy Night", image: rainyNight },
  { id: "space", name: "Space", image: space },
  { id: "lavender", name: "Lavender", image: lavender },
];

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return localStorage.getItem("pomodoro-theme") || "city-sunset";
  });

  const [customBg, setCustomBg] = useState<string | null>(() => {
    return localStorage.getItem("pomodoro-custom-bg");
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("pomodoro-dark") === "true";
  });

  useEffect(() => {
    localStorage.setItem("pomodoro-theme", currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (customBg) {
      localStorage.setItem("pomodoro-custom-bg", customBg);
    } else {
      localStorage.removeItem("pomodoro-custom-bg");
    }
  }, [customBg]);

  useEffect(() => {
    localStorage.setItem("pomodoro-dark", String(isDark));
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const theme = themes.find((t) => t.id === currentTheme) || themes[0];

  const handleCustomUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setCustomBg(dataUrl);
      setCurrentTheme("custom");
    };
    reader.readAsDataURL(file);
  };

  const clearCustomBg = () => {
    setCustomBg(null);
    if (currentTheme === "custom") {
      setCurrentTheme("city-sunset");
    }
  };

  // Resolve the actual background image
  const backgroundImage = currentTheme === "custom" && customBg ? customBg : theme.image;

  return {
    theme, themes, setCurrentTheme, isDark, setIsDark,
    customBg, handleCustomUpload, clearCustomBg, backgroundImage,
    currentTheme,
  };
}
