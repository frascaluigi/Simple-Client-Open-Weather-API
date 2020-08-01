import axios, { AxiosResponse } from 'axios';

export const currentWeatherForecast = async (
	city: string,
	apiKey: string
): Promise<AxiosResponse> => {
	try {
		if (!apiKey) throw new Error('missing authorization token');
		const urlCurrentWeatherForecast = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
		return axios.get(urlCurrentWeatherForecast);
	} catch (error) {
		throw new Error(`API Open Weather Failed: ${error}`);
	}
};

export const fiveDaysForecast = async (
	city: string,
	apiKey?: string
): Promise<AxiosResponse> => {
	const urlFiveDaysForecast = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`;
	try {
		return await axios.get(urlFiveDaysForecast);
	} catch (error) {
		throw new Error(`API Open Weather Failed: ${error}`);
	}
};
