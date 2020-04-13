import express from 'express'
import currentWeather from '../controllers/current-weather'
import statisticsController from '../controllers/StatisticsController'
import fiveDays from '../controllers/five-days'

const router = express.Router()

router.get('/current-weather-forecast/:city', currentWeather)
router.get('/statistics', statisticsController.citiesStatisticsResponse)
router.get('/five-days-forecast/:city', statisticsController.fiveDaysResponse)

export default router