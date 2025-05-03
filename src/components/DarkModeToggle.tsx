// components/DarkModeToggle.tsx
import { useEffect, useState } from 'react';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setIsDark(html.classList.contains('dark'));
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  };

  // Ensure persisted theme on page load
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  return (
    <button
      onClick={toggleDarkMode}
      className="ml-2 px-2 py-1 border rounded text-sm bg-secondary dark:bg-muted hover:opacity-80 transition"
    >
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
