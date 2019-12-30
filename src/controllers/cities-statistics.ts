import _ from 'lodash'
import { Request, Response, NextFunction } from 'express'

import { currentWeatherForecast } from '../helpers/recovers-forecasts'

const env = process.env.NODE_ENV
const config = require('../../config/config.json')[env]

export interface ResponseInterface {
  cityName: string
  value: number
}

export interface AvgTemperatureInterface extends ResponseInterface {}
export interface HottestCityInterface extends ResponseInterface {}
export interface WetterCityInterface extends ResponseInterface {}

export interface CityMetricsInterface {
  avgTemperatures: AvgTemperatureInterface[]
  wetterCity: WetterCityInterface
  hottestCity: HottestCityInterface
}

const highestUmidity = (cities: any) => {
  let wetterCity: WetterCityInterface = {
    cityName: '',
    value: 0
  }

  for (let city of cities) {
    const name = city.data.name
    const humidity = _.get(_.get(city, 'data'), 'main').humidity
    if (humidity > wetterCity.value) {
      wetterCity.cityName = name
      wetterCity.value = humidity
    }
  }

  return wetterCity
}

const highestTemperature = (cities: any): HottestCityInterface => {
  let hottestCity: HottestCityInterface = {
    cityName: '',
    value: 0
  }
  for (let city of cities) {
    let temp = _.get(_.get(city, 'data'), 'main').temp
    if (temp > hottestCity.value) {
      ;(hottestCity.cityName = city.data.name), (hottestCity.value = temp)
    }
  }

  return hottestCity
}

const averageTemperature = (city: any): AvgTemperatureInterface => {
  const main = _.get(city, 'main')
  const avg = (main.temp_min + main.temp_max) / 2

  const avgTempResponse: AvgTemperatureInterface = {
    cityName: city.name,
    value: avg
  }

  return avgTempResponse
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const citiesThatIlike = config.local.cities

  let promises: any[] = []

  citiesThatIlike.map((city: any) => {
    promises.push(currentWeatherForecast(city))
  })

  Promise.all(promises)
    .then(result => {
      let avgTemperatures: AvgTemperatureInterface[] = []

      for (let city of result) {
        avgTemperatures.push(averageTemperature(city.data))
      }

      let wetterCity = highestUmidity(result)
      let hottestCity = highestTemperature(result)

      const response: CityMetricsInterface = {
        avgTemperatures,
        hottestCity,
        wetterCity
      }

      res.status(200).json(response)
    })
    .catch(error => {
      console.error('Error:', error)
      res.status(400).json({ error: 'An error has occured' })
    })
}
