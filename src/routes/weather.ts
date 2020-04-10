import express from 'express'
import currentWeather from '../controllers/current-weather'
import cityStatistics from '../controllers/cities-statistics'
import fiveDays from '../controllers/five-days'

const router = express.Router()

router.get('/current-weather-forecast/:city', currentWeather)
router.get('/statistics', cityStatistics)
router.get('/five-days-forecast/:city', fiveDays)

export default router