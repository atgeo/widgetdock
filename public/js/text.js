async function loadText (refresh = false) {
  try {
    const segments = window.location.pathname.split('/').filter(Boolean)
    const slug = segments.pop() || 'passage'
    const res = await fetch(`/w/${slug}/fetch`, { method: 'POST' })
    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    document.getElementById('reader').innerHTML = parseText(data.result)
  } catch (err) {
    console.error('Error fetching text:', err)
    document.getElementById('reader').textContent = 'Failed to load text.'
  }
}

function parseText (text) {
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').
    replace(/\n+/g, '\n\n')

  const paragraphs = html.split(/\n\n/).map(p => `<p>${p}</p>`)

  return paragraphs.join('\n')
}

loadText()
