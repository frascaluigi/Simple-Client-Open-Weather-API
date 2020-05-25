import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { config } from '../loadConfiguration';
import { currentWeatherForecast } from '../helpers/recovers-forecasts';

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const apiKey = req.get('x-api-key');
		const parameter = req.params.city;
		if (!apiKey) throw new Error('missing authorization token');
		console.log('auth: ', apiKey);
		const citiesThatIlike = config.get('server').cities;
		if (_.find(citiesThatIlike, (elem) => elem === parameter.toLowerCase())) {
			const cityForecast = await currentWeatherForecast(parameter, apiKey);
			if (!cityForecast) throw new Error('error with current forecast');
			res.status(200).json(cityForecast.data);
		} else {
			console.log(`city ${parameter} not found`);
			res.status(404).json({
				info: `We're sorry we have no weather information about ${parameter.toUpperCase()} in environment: ${config.get(
					'env'
				)}`,
			});
		}
	} catch (error) {
		console.error('error: ', error);
		res.status(400).json({ error: 'An error has occured' });
	}
};
