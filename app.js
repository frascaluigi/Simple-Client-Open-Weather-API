const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const weather_api = require('./controllers/index')

const env = process.env.NODE_ENV
const config = require('./config/config.json')[env]

const app = express()

app.use(cors())
app.use(bodyParser.json({ limit: '12mb' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/exposed-api', weather_api)

app.listen(config.local.port, () => {
  console.log(`${config.local.app_name} started on port: ${config.local.port}`)
})
