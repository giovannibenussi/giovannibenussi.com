import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        flex items-center justify-center w-9 h-9 rounded-[var(--radius-4)]
        border border-[var(--dracula-border)]
        bg-[var(--dracula-bg-darker)]/80 backdrop-blur-md
        text-[var(--dracula-fg)]
        transition-all duration-200
        hover:border-[var(--dracula-purple)] hover:shadow-[0_0_12px_rgba(189,147,249,0.2)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dracula-purple)]
      "
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon width={16} height={16} />
      ) : (
        <MoonIcon width={16} height={16} />
      )}
    </button>
  );
}
