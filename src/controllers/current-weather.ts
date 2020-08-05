import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { config } from '../loadConfiguration';
import { currentWeatherForecast } from '../helpers/recovers-forecasts';

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const apiKey = req.get('x-api-key');
		const city: string = req.params.city;
		const citiesThatIlike:string[] = config.get('server').cities;

		if(citiesThatIlike.includes(city)){
			const cityForecast = await currentWeatherForecast(city, apiKey);
			if (!cityForecast) throw new Error('error with current forecast');
			res.status(200).json(cityForecast.data);
		}else {
			console.log(`city ${city} not found`);
			res.status(404).json({
				info: `We're sorry we have no weather information about ${city.toUpperCase()} in environment: ${config.get(
					'env'
				)}`,
			});
		}
	} catch (error) {
		console.error('error: ', error);
		res.status(400).json({ error: `An error has occured: ${error.message}` });
	}
};
