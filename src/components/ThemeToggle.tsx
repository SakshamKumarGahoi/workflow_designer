import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('hr-wf-theme') as Theme | null
    if (stored) return stored
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  }
  return 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('hr-wf-theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
