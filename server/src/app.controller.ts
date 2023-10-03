import {
  Query,
  Controller,
  Get,
  InternalServerErrorException,
  HttpException,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  // GET /weather handler
  @Get('weather')
  @UseGuards(JwtAuthGuard) // Only allow logged users to access this endpoint
  @UseInterceptors(CacheInterceptor) // Auto-cache weather data
  @CacheTTL(1000 * 60 * 5) // Cache for 5 minutes
  async getWeather(@Query('city') city: string) {
    try {
      // Fetch the weather data for the specified city using the app service
      return await this.appService.getWeatherData(city)
    } catch (error) {
      // re-throw error if its an instance of "HttpException" (an HttpException is an intentional error)
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException(error.toString());
    }
  }
}