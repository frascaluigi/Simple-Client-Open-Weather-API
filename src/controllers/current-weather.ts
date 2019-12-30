import _ from 'lodash'
import { Request, Response, NextFunction } from 'express'

import { currentWeatherForecast } from '../helpers/recovers-forecasts'

const env = process.env.NODE_ENV
const config = require('../../config/config.json')[env]

export default async (req: Request, res: Response, next: NextFunction) => {
  const citiesThatIlike = config.local.cities
  const parameter = req.params.city
  if (
    _.find(citiesThatIlike, elem => {
      return elem === parameter.toLowerCase()
    })
  ) {
    const cityForecast = await currentWeatherForecast(parameter)
    if (!cityForecast) res.status(400).json({ error: 'An error has occured' })
    res.status(200).json(cityForecast.data)
  } else {
    console.log(`city ${parameter} not found`)
    res.status(200).json({
      info: `We're sorry we have no weather information about ${req.params.city}`
    })
  }
}
