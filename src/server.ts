import express from 'express'
import textRoutes from './routes/text.js'
import tickerRoutes from './routes/ticker.js'
import quizRoutes from './routes/quiz.js'
import widgetRoutes from './routes/widgets.js'

const app = express()
app.use(express.static('public'))

app.use(express.json())

app.use('/text', textRoutes)
app.use('/ticker', tickerRoutes)
app.use('/quiz', quizRoutes)
app.use('/w', widgetRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`))
