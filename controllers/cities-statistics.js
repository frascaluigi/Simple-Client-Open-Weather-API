const _ = require('lodash')

const env = process.env.NODE_ENV
const config = require('../config/config.json')[env]

const currentWeatherForecast = require('../helpers/recovers-forecasts')
  .currentWeatherForecast

const highestUmidity = cities => {
  let wetterCity = {
    name: '',
    maxUmidity: 0
  }
  for (let city of cities) {
    let main = _.get(_.get(city, 'data'), 'main')
    if (main.humidity > wetterCity.maxUmidity) {
      wetterCity = {
        name: city.data.name,
        maxUmidity: main.humidity
      }
    }
  }
  return wetterCity
}

const highestTemperature = cities => {
  let hottestCity = {
    name: '',
    maxTemperature: 0
  }

  for (let city of cities) {
    let main = _.get(_.get(city, 'data'), 'main')
    if (main.temp > hottestCity.maxTemperature) {
      hottestCity = {
        name: city.data.name,
        maxTemperature: main.temp
      }
    }
  }

  return hottestCity
}

const averageTemperature = city => {
  let main = _.get(city, 'main')
  let avg = (main.temp_min + main.temp_max) / 2

  return {
    city: city.name,
    avgTmp: avg
  }
}

module.exports = async (req, res, next) => {
  const citiesThatIlike = config.local.cities

  const promises = []

  const returnObj = {}

  citiesThatIlike.map(city => {
    promises.push(currentWeatherForecast(city))
  })

  Promise.all(promises)
    .then(result => {
      let avgTemperatures = []
      for (let city of result) {
        avgTemperatures.push(averageTemperature(city.data))
      }

      let wetterCity = highestUmidity(result)
      let hottestCity = highestTemperature(result)

      returnObj.avgTemperatures = avgTemperatures
      returnObj.wetterCity = wetterCity
      returnObj.hottestCity = hottestCity

      res.status(200).json(returnObj)
    })
    .catch(error => {
      console.error('Error:', error)
      res.status(400).json({ error: 'An error has occured' })
    })
}
