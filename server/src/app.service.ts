import { Injectable, Inject } from '@nestjs/common';
import { AppConfigService } from './config/config.service';
import fetch from 'node-fetch';

@Injectable()
export class AppService {
  constructor(
    @Inject(AppConfigService) private appConfigService: AppConfigService
  ) { }

  async getWeatherData(city: string): Promise<any> {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=he&appid=${this.appConfigService.weatherApiKey}`;

    const response = await fetch(apiUrl);
    return await response.json();
  }
}
