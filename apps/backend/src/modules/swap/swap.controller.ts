import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { SwapService } from './swap.service';
import { CreateSwapDto, GetSwapsDto, UpdateSwapDto } from './dto/swap.dto';

@Controller('swaps')
export class SwapController {
    constructor(private readonly service: SwapService) {}

    @Post('createSwap')
    @ApiOkResponse({
            description: 'Success',
            type: [CreateSwapDto],
        })
    createSwap(@Body() createSwapDto: CreateSwapDto) {
        try {
            return this.service.createSwap(createSwapDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('getSwaps')
    @ApiOkResponse({
            description: 'Success',
            type: [GetSwapsDto],
        })
    getTransactions(@Body() getSwapsDto: GetSwapsDto) {
        try {
            return this.service.getSwaps(getSwapsDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Delete(':swapId')
    @ApiOkResponse({ description: 'Swap deleted successfully' })
    async deleteSwap(@Param('swapId') swapId: string) {
        try {
            const result = await this.service.deleteSwap(swapId);
            return result;
        } catch (error) {
            console.error('Delete swap error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Patch('updateSwap')
    @ApiOkResponse({
                description: 'Success',
                type: [UpdateSwapDto],
            })
    update(@Body() updateSwapDto: UpdateSwapDto) {
        try {
            const swap = this.service.updateSwap(updateSwapDto);;
            return swap;
        } catch (error) {
            console.error('Update swap error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
