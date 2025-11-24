import express from 'express'
import widgetRoutes from './routes/widgets.js'

const app = express()
app.use(express.static('public'))

app.use(express.json())

app.use('/w', widgetRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`))
