import { Body, Controller, Delete, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiService } from './api.service';
import { UpdateUserAssetsPriceDto } from './dto/api.dto';

@Controller('api')
export class ApiController {
    constructor(private readonly service: ApiService) {}

    @Patch('updatePrices')
    @ApiOkResponse({
                description: 'Success',
                type: [UpdateUserAssetsPriceDto],
            })
    update(@Body() updatePrices: UpdateUserAssetsPriceDto) {
        try {
            const prices = this.service.updatePrices(updatePrices);;
            return prices;
        } catch (error) {
            console.error('Update prices error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('getCandles')
    @ApiOkResponse({
                description: 'Success',
                type: [UpdateUserAssetsPriceDto],
            })
    getCandleData() {
        try {
            const candles = this.service.getCandleData();;
            return candles;
        } catch (error) {
            console.error('Get candles error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
