const tickerEl = document.getElementById('scroll-text')

async function loadTicker () {
  try {
    const res = await fetch('/ticker/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'weather',
      }),
    })
    const data = await res.json()

    const text = data.items
    .map(item => `${item.desc.icon} ${item.city}: ${Math.round(item.temperature)}°C`)
    .join('   •   '); // spacer between items

    tickerEl.textContent = text;
  } catch (err) {
    console.error('Failed to load ticker:', err)
    tickerEl.textContent = '⚠ Weather unavailable'
  }
}

document.addEventListener('DOMContentLoaded', loadTicker);
