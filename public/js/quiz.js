async function loadQuiz(refresh = false) {
  try {
    const params = new URLSearchParams(window.location.search)
    const type = params.get('type') || 'synonyms'
    const res = await fetch('/quiz/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: type,
        refresh: refresh,
      }),
    })
    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    document.getElementById('quiz').innerHTML = data.result
  } catch (err) {
    console.error('Error fetching text:', err)
    document.getElementById('quiz').textContent = 'Failed to load text.'
  }
}

loadQuiz()
