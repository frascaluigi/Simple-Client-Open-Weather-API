import _ from 'lodash'
import { Request, Response, NextFunction } from 'express'

import { currentWeatherForecast } from '../helpers/recovers-forecasts'

const env = process.env.NODE_ENV
const config = require('../../config/config.json')[env]

export interface ResponseInterface{
  cityName: string,
  value: number
}

export interface AvgTemperatureInterface extends ResponseInterface{}
export interface HottestCityInterface extends ResponseInterface{}
export interface WetterCityInterface extends ResponseInterface{}

export interface CityMetricsInterface{
  avgTemperatures: AvgTemperatureInterface[],
  wetterCity: WetterCityInterface,
  hottestCity: HottestCityInterface
}

const highestUmidity = (cities: any) => {
  let city = {
    name: '',
    maxUmidity: 0
  }
  for (let city of cities) {
    let main = _.get(_.get(city, 'data'), 'main')
    if (main.humidity > city.maxUmidity) {
      city = {
        name: city.data.name,
        maxUmidity: main.humidity
      }
    }
  }

  const wetterCity:WetterCityInterface={
    cityName: city.name,
    value: city.maxUmidity
  }

  return wetterCity
}

const highestTemperature = (cities: any):HottestCityInterface => {
  let city = {
    name: '',
    maxTemperature: 0
  }

  for (let city of cities) {
    let main = _.get(_.get(city, 'data'), 'main')
    if (main.temp > city.maxTemperature) {
      city = {
        name: city.data.name,
        maxTemperature: main.temp
      }
    }
  }

  const hottestCity:HottestCityInterface = {
    cityName:city.name,
    value: city.maxTemperature
  }

  return hottestCity
}

const averageTemperature = (city:any):AvgTemperatureInterface => {
  const main = _.get(city, 'main')
  const avg = (main.temp_min + main.temp_max) / 2

  const avgTempResponse:AvgTemperatureInterface={
    cityName: city.name,
    value: avg
  } 

  return avgTempResponse
}

export default async (req:Request, res:Response, next:NextFunction) => {
  const citiesThatIlike = config.local.cities

  let promises:any[]=[];

  citiesThatIlike.map((city:any) => {
    promises.push(currentWeatherForecast(city))
  })

  Promise.all(promises)
    .then(result => {
      let avgTemperatures:AvgTemperatureInterface[]=[];

      for (let city of result) {
        avgTemperatures.push(averageTemperature(city.data))
      }

      let wetterCity = highestUmidity(result)
      let hottestCity = highestTemperature(result)

      const response:CityMetricsInterface={
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
