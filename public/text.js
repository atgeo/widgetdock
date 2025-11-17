async function loadText (refresh = false) {
  try {
    const params = new URLSearchParams(window.location.search)
    const mode = params.get('mode') || 'passage'
    const res = await fetch('/text/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: mode,
        refresh: refresh,
      }),
    })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    document.getElementById('reader').innerHTML = parseText(data.result)
  } catch (err) {
    console.error('Error fetching dialogue:', err)
    document.getElementById('dialogue').textContent = 'Failed to load dialogue.'
  }
}

function parseText (text) {
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').
    replace(/\n+/g, '\n\n')

  const paragraphs = html.split(/\n\n/).map(p => `<p>${p}</p>`)

  return paragraphs.join('\n')
}

loadText()
