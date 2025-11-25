import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import {fileURLToPath} from 'url'
import authRouter from './routes/auth.js'
import widgetRoutes from './routes/widgets.js'
import apiWidgetRoutes from './routes/api/widgets.js'
import swaggerUi from 'swagger-ui-express'
import {swaggerSpec} from './docs/swagger.js'
import {jwtErrorHandler} from './middleware/checkJwt.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'ejs')

app.use('/auth', authRouter)

app.use('/w', widgetRoutes)
app.use('/api/widgets', apiWidgetRoutes)

app.use(jwtErrorHandler)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`))
