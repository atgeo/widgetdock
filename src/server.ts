import express from 'express'
import textRoutes from './routes/text.js'
import tickerRoutes from './routes/ticker.js'
import quizRoutes from './routes/quiz.js'

const app = express()
app.use(express.static('public'))

app.use(express.json())

app.use('/text', textRoutes)
app.use('/ticker', tickerRoutes)
app.use('/quiz', quizRoutes)

app.listen(3000, () => console.log('Server running at http://localhost:3000'))
