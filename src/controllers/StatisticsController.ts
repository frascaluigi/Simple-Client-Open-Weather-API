import { Request, Response, NextFunction } from 'express';
import { currentWeatherForecast } from '../helpers/recovers-forecasts';
import { AxiosResponse } from 'axios';
import { config } from '../loadConfiguration';
import { fiveDaysForecast } from '../helpers/recovers-forecasts';
import _ from 'lodash';

export interface ResponseInterface {
	cityName: string;
	value: number;
}

export interface AvgTemperatureInterface extends ResponseInterface {}
export interface HottestCityInterface extends ResponseInterface {}
export interface WetterCityInterface extends ResponseInterface {}

export interface CityMetricsInterface {
	avgTemperatures: AvgTemperatureInterface[];
	wetterCity: WetterCityInterface;
	hottestCity: HottestCityInterface;
}

class StatisticsController {
	private static highestUmidity = (cities: any) => {
		let wetterCity: WetterCityInterface = <WetterCityInterface>{
			cityName: null,
			value: 0,
		};

		for (let city of cities) {
			const name = city.data.name;
			const humidity = _.get(_.get(city, 'data'), 'main').humidity;
			if (humidity > wetterCity.value) {
				wetterCity.cityName = name;
				wetterCity.value = humidity;
			}
		}
		return wetterCity;
	};

	private static highestTemperature = (cities: any): HottestCityInterface => {
		let hottestCity: HottestCityInterface = <HottestCityInterface>{
			cityName: null,
			value: 0,
		};

		for (let city of cities) {
			let temp = _.get(_.get(city, 'data'), 'main').temp;
			if (temp > hottestCity.value) {
				hottestCity.cityName = city.data.name;
				hottestCity.value = temp;
			}
		}
		return hottestCity;
	};

	private static averageTemperature = (city: any): AvgTemperatureInterface => {
		const main = _.get(city, 'main');
		const avg = (main.temp_min + main.temp_max) / 2;

		const avgTempResponse: AvgTemperatureInterface = {
			cityName: city.name,
			value: avg,
		};

		return avgTempResponse;
	};

	static citiesStatisticsResponse = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const citiesThatIlike = config.get('server').cities;

		const promises: Promise<AxiosResponse>[] = [];
		citiesThatIlike.map((city: any) => {
			promises.push(currentWeatherForecast(city));
		});

		Promise.all(promises)
			.then((result) => {
				let avgTemperatures: AvgTemperatureInterface[] = [];

				result.map((city) =>
					avgTemperatures.push(
						StatisticsController.averageTemperature(city.data)
					)
				);

				const wetterCity = StatisticsController.highestUmidity(result);
				const hottestCity = StatisticsController.highestTemperature(result);

				const response: CityMetricsInterface = {
					avgTemperatures,
					hottestCity,
					wetterCity,
				};

				res.status(200).json(response);
			})
			.catch((err) => {
				console.error('Error:', err);
				res.status(400).json({ error: 'An error has occured' });
			});
	};

	static fiveDaysResponse = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const citiesThatIlike = config.get('server').cities;
		const parameter = req.params.city;
		if (_.find(citiesThatIlike, (elem) => elem === parameter.toLowerCase())) {
			const fiveDays = await fiveDaysForecast(parameter);
			if (!fiveDays) res.status(400).json({ error: 'An error occured' });

			let list = _.get(_.get(fiveDays, 'data'), 'list');
			let city = _.get(_.get(fiveDays, 'data'), 'city');

			let allTemperatures = [];
			let allPressures = [];
			let allHumidity = [];

			for (let l of list) {
				allTemperatures.push(_.get(_.get(l, 'main'), 'temp'));
				allPressures.push(_.get(_.get(l, 'main'), 'pressure'));
				allHumidity.push(_.get(_.get(l, 'main'), 'humidity'));
			}

			let returnObj = {
				city: city,
				temperatures: allTemperatures,
				pressures: allPressures,
				humidity: allHumidity,
			};

			res.status(200).json(returnObj);
		} else {
			console.log(`city ${parameter} not found`);
			res.status(200).json({
				info: `We're sorry we have no weather information about ${parameter.toUpperCase()} in environment: ${
					config.get('server').env
				}`,
			});
		}
	};
}

export default StatisticsController;
