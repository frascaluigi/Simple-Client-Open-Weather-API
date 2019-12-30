import axios, { AxiosResponse } from 'axios'

const env = process.env.NODE_ENV
const config = require('../../config/config.json')[env]

export const currentWeatherForecast = async (city:string):Promise<AxiosResponse> => {
  let urlCurrentWeatherForecast = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${
    config.local.external_api_key
  }`
  try {
    return await axios.get(urlCurrentWeatherForecast)
  } catch (error) {
    throw new Error(`API Open Weather Failed: ${error}`)
  }
}

export const fiveDaysForecast = async (city:string):Promise<AxiosResponse> => {
  let urlFiveDaysForecast = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${
    config.local.external_api_key
  }`
  try {
    return await axios.get(urlFiveDaysForecast)
  } catch (error) {
    throw new Error(`API Open Weather Failed: ${error}`)
  }
}