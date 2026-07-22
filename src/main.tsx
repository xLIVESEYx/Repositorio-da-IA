import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Performance monitoring
if (typeof performance !== 'undefined') {
  performance.mark('app-init')
}

// Report when fonts are loaded
if (document.fonts) {
  document.fonts.ready.then(() => {
    if (typeof performance !== 'undefined') {
      performance.mark('fonts-loaded')
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      if (navEntry) {
        const fontLoadTime = performance.now() - navEntry.domContentLoadedEventEnd
        if (fontLoadTime > 0) {
          console.debug(`[Perf] Fonts loaded in ${fontLoadTime.toFixed(0)}ms`)
        }
      }
    }
  })
}

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
