const _ = require('lodash')

const env = process.env.NODE_ENV
const config = require('../config/config.json')[env]

const currentWeatherForecast = require('../helpers/recovers-forecasts')
  .currentWeatherForecast

module.exports = async (req, res, next) => {
  const citiesThatIlike = config.local.cities
  const parameter = req.params.city
  if (
    _.find(citiesThatIlike, elem => {
      return elem === parameter.toLowerCase()
    })
  ) {
    await currentWeatherForecast(parameter)
      .then(cityForecast => {
        res.status(200).json(cityForecast.data)
      })
      .catch(error => {
        console.log('Error:', error)
        res.status(400).json({ error: 'An error occured' })
      })
  } else {
    console.log("don't found")
    res.status(200).json({
      info: `We're sorry we have no weather information about ${
        req.params.city
      }`
    })
  }
}
