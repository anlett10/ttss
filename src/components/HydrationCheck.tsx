import { useEffect, useState } from 'react'

export function HydrationCheck() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return <div suppressHydrationWarning>Loading...</div>
  }

  return <div style={{ color: 'green' }}>✅ Hydrated</div>
}
