const tickerEl = document.getElementById('scroll-text')

const loadTicker = async () => {
  const segments = window.location.pathname.split('/').filter(Boolean)
  const slug = segments.pop() || 'weather'

  if (!accessToken) {
    await loadAccessToken()
    if (!accessToken) {
      tickerEl.textContent = (slug === 'news' ? '⚠ News unavailable' : '⚠ Weather unavailable')
      return
    }
  }

  try {
    const res = await fetch(`/w/${slug}/fetch`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    const data = await res.json()

    let formattedData = []

    if (slug === 'news') {
      formattedData = data.result.map(item => `${item.country} ${item.source}: ${item.title}`)
    } else {
      formattedData = data.result.map(item => `${item.desc.icon} ${item.city}: ${Math.round(item.temperature)}°C`)
    }

    tickerEl.textContent = formattedData.join('   •   ')
    adjustTickerSpeed()
  } catch (err) {
    console.error('Failed to load ticker:', err)
    tickerEl.textContent = (slug === 'news' ? '⚠ News unavailable' : '⚠ Weather unavailable')
  }
}

const adjustTickerSpeed = () => {
  const text = document.getElementById('scroll-text')

  const speed = 100 // pixels per second
  const textWidth = text.offsetWidth

  text.style.animationDuration = `${textWidth / speed}s`
}

document.addEventListener('DOMContentLoaded', loadTicker)
