import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import widgetRoutes from './routes/widgets.js'
import apiTextRoutes from './routes/api/texts.js'
import apiQuizRoutes from './routes/api/quizzes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'ejs')

app.use('/w', widgetRoutes)
app.use('/api/texts', apiTextRoutes)
app.use('/api/quizzes', apiQuizRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`))
