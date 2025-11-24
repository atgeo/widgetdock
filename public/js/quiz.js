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

    playPhonetic (word) {
      const segments = window.location.pathname.split('/').filter(Boolean)
      const slug = segments.pop() || 'synonyms'

      fetch(`/w/${slug}/phonetic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      }).then(res => res.json()).then(data => {
        if (!data.result) return

        const audio = new Audio(data.result)
        audio.play()
      }).catch(err => console.error('Error fetching phonetic:', err))
    },

    init () {
      //
    },
  }
}
