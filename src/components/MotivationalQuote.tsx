import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "A little progress each day adds up to big results.", author: "Satya Nani" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
  { text: "Study hard what interests you the most in the most undisciplined way.", author: "Richard Feynman" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
];

export function MotivationalQuote() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * quotes.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const quote = quotes[index];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl px-5 py-4 max-w-md text-center"
      >
        <Quote className="w-4 h-4 timer-text opacity-50 mx-auto mb-2" />
        <p className="timer-text text-sm font-body italic leading-relaxed opacity-90">
          "{quote.text}"
        </p>
        <p className="timer-text text-xs font-display mt-2 opacity-60">
          — {quote.author}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
