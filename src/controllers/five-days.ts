import _ from 'lodash'
import { Request, Response, NextFunction } from 'express'

import { fiveDaysForecast } from '../helpers/recovers-forecasts'

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
    const fiveDays = await fiveDaysForecast(parameter)
    if (!fiveDays) res.status(400).json({ error: 'An error occured' })

    let list = _.get(_.get(fiveDays, 'data'), 'list')
    let city = _.get(_.get(fiveDays, 'data'), 'city')

    let allTemperatures = []
    let allPressures = []
    let allHumidity = []

    for (let l of list) {
      allTemperatures.push(_.get(_.get(l, 'main'), 'temp'))
      allPressures.push(_.get(_.get(l, 'main'), 'pressure'))
      allHumidity.push(_.get(_.get(l, 'main'), 'humidity'))
    }

    let returnObj = {
      city: city,
      temperatures: allTemperatures,
      pressures: allPressures,
      humidity: allHumidity
    }

    res.status(200).json(returnObj)
  } else {
    console.log(`city ${parameter} not found`)
    res.status(200).json({
      info: `We're sorry we have no weather information about ${req.params.city}`
    })
  }
}
