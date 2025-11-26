function quizWidget () {
  const raw = document.getElementById('quiz-data').textContent
  const parsed = JSON.parse(raw)

  return {
    quiz: parsed.map(item => {
      const shuffled = [...item.options].sort(() => Math.random() - 0.5)
      return {
        word: item.questionText,
        options: shuffled.map(o => o.optionText),
        correctIndex: shuffled.findIndex(o => o.isCorrect),
        feedback: ''
      }
    }),
    feedback: '',
    correctIndex: 0,

    checkAnswer (itemIdx, optionIdx) {
      const item = this.quiz[itemIdx]
      item.feedback = optionIdx === item.correctIndex ? '✅ Correct!' : '❌ Wrong!'
    },

    playPhonetic: async function (word) {
      const segments = window.location.pathname.split('/').filter(Boolean)
      const slug = segments.pop() || 'synonyms'

      if (!accessToken) {
        await loadAccessToken()
        if (!accessToken) {
          console.warn('Not authenticated, cannot fetch phonetic')
          return;
        }
      }

      try {
        const res = await fetch(`/w/${slug}/phonetic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ word }),
        })

        if (!res.ok) throw new Error('Failed to fetch phonetic')

        const data = await res.json()
        if (!data.result) return

        const audio = new Audio(data.result)
        await audio.play()
      } catch (err) {
        console.error('Error fetching phonetic:', err);
      }
    },

    init () {
      //
    },
  }
}
