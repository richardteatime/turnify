import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import useThemeStore from '../store/themeStore'

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      )}
    </button>
  )
}
