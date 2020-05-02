import _ from 'lodash'
import { Request, Response, NextFunction } from 'express'
import { config } from '../loadConfiguration';
import { currentWeatherForecast } from '../helpers/recovers-forecasts'

export default async (req: Request, res: Response, next: NextFunction) => {
  const citiesThatIlike = config.get('server').cities
  const parameter = req.params.city
  if (_.find(citiesThatIlike, elem => elem === parameter.toLowerCase())) {
    const cityForecast = await currentWeatherForecast(parameter)
    if (!cityForecast) res.status(400).json({ error: 'An error has occured' })
    res.status(200).json(cityForecast.data)
  } else {
    console.log(`city ${parameter} not found`)
    res.status(404).json({
      info: `We're sorry we have no weather information about ${parameter.toUpperCase()} in environment: ${config.get('env')}`
    })
  }
}
