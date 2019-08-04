const express = require('express')
const router = express.Router()

// router.get('/', (req, res, next) => {
//   res.status(200).send('You Are Welcome On SimpleClient - OpenWeatherApi')
// })

router.get('/current-weather-forecast/:city', require('./current-weather'))
router.get('/statistics', require('./cities-statistics'))
router.get('/five-days-forecast/:city', require('./five-days'))

module.exports = router
