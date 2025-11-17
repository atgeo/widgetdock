const tickerEl = document.getElementById('scroll-text')

async function loadTicker () {
  const params = new URLSearchParams(window.location.search)
  const type = params.get('type') || 'passage'

  try {
    const res = await fetch('/ticker/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: type,
      }),
    })
    const data = await res.json()

    let formattedData = []

    if (type === 'news') {
      formattedData = data.items.map(item => `${item.country} ${item.source}: ${item.title}`)
    } else {
      formattedData = data.items.map(item => `${item.desc.icon} ${item.city}: ${Math.round(item.temperature)}°C`)
    }

    tickerEl.textContent = formattedData.join('   •   ')
    adjustTickerSpeed()
  } catch (err) {
    console.error('Failed to load ticker:', err)
    tickerEl.textContent = (type === 'news' ? '⚠ News unavailable' : '⚠ Weather unavailable')
  }
}

function adjustTickerSpeed() {
  const text = document.getElementById('scroll-text')

  const speed = 100 // pixels per second
  const textWidth = text.offsetWidth

  text.style.animationDuration = `${textWidth / speed}s`
}

document.addEventListener('DOMContentLoaded', loadTicker)
