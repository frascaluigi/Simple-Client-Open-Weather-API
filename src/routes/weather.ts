import express from 'express';
import currentWeather from '../controllers/current-weather';
import statisticsController from '../controllers/StatisticsController';

const router = express.Router();

/**
 * @swagger
 * /weather/current-weather-forecast/{city}:
 *  get:
 *    tags:
 *      - Weather
 *    summary: weather information of city
 *    parameters:
 *      - in: path
 *        name: city
 *        schema:
 *          type: string
 *    security:
 *      - apiKeyAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: Return info about weather information of city
 *      '404':
 *        description: not found
 */
router.get('/current-weather-forecast/:city', currentWeather);

/**
 * @swagger
 * /weather/statistics:
 *  get:
 *    tags:
 *      - Weather
 *    summary: info about average temperature, warmer city, wetter city
 *    security:
 *      - apiKeyAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: Return info about 3 city (average temperature, warmer city, wetter city)
 */
router.get('/statistics', statisticsController.citiesStatisticsResponse);

/**
 * @swagger
 * /weather/five-days-forecast/{city}:
 *  get:
 *    tags:
 *      - Weather
 *    summary: weather information of city in the last 5  days
 *    parameters:
 *      - in: path
 *        name: city
 *        schema:
 *          type: string
 *    security:
 *      - apiKeyAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: Return info about weather information of city in the last 5  days
 */
router.get('/five-days-forecast/:city', statisticsController.fiveDaysResponse);

export default router;
