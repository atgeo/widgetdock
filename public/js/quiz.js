function quizWidget () {
  return {
    quiz: { word: '', options: [] },
    feedback: '',
    correctIndex: 0,

    async loadQuiz (refresh = false) {
      try {

        const params = new URLSearchParams(window.location.search)
        const type = params.get('type') || 'synonyms'

        const res = await fetch('/quiz/fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, refresh }),
        })

        if (!res.ok) {
          console.error(`HTTP error! status: ${res.status}`)
          this.feedback = 'Failed to load quiz.'
          return
        }

        const data = await res.json()
        const results = JSON.parse(data.result)

        this.quiz = results.map(item => {
          // shuffle options for this item
          const shuffled = item.options.map(
            (opt, i) => ({ opt, isCorrect: i === 0 })).
            sort(() => Math.random() - 0.5)

          return {
            word: item.word,
            options: shuffled.map(o => o.opt),
            correctIndex: shuffled.findIndex(o => o.isCorrect),
            feedback: ''
          }
        })
      } catch (err) {
        console.error('Error fetching quiz:', err)
        this.feedback = 'Failed to load quiz.'
      }
    },

    checkAnswer (itemIdx, optionIdx) {
      const item = this.quiz[itemIdx]
      item.feedback = optionIdx === item.correctIndex ? '✅ Correct!' : '❌ Wrong!'
    },

    init () {
      this.loadQuiz()
    },
  }
}
