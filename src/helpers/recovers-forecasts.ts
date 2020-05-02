import axios, { AxiosResponse } from 'axios'
import { config } from '../loadConfiguration';


export const currentWeatherForecast = async (city:string):Promise<AxiosResponse> => {
  let urlCurrentWeatherForecast = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${
    config.get('server').external_api_key
  }`
  try {
    return axios.get(urlCurrentWeatherForecast)
  } catch (error) {
    throw new Error(`API Open Weather Failed: ${error}`)
  }
}

export const fiveDaysForecast = async (city:string):Promise<AxiosResponse> => {
  let urlFiveDaysForecast = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${
    config.get('server').external_api_key
  }`
  try {
    return await axios.get(urlFiveDaysForecast)
  } catch (error) {
    throw new Error(`API Open Weather Failed: ${error}`)
  }
}