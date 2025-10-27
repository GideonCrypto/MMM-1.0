import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { AddItemToLibraryDto } from './dto/library.dto';

@Controller('library')
export class LibraryController {
    constructor(private readonly service: LibraryService) {}

    @Post('addItem')
    @ApiOkResponse({
                description: 'Success',
                type: [AddItemToLibraryDto],
            })
    update(@Body() data: AddItemToLibraryDto) {
        try {
            return this.service.addItem(data);
        } catch (error) {
            console.error('Add item error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('sync')
    @ApiOkResponse({
                description: 'Success',
                type: [AddItemToLibraryDto],
            })
    sync() {
        try {
            return this.service.syncAllCoins();
        } catch (error) {
            console.error('Add item error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('libraryByName/:name')
    @ApiOkResponse({
        description: 'Lib by name',
        example: {
            "id": "9a03e175-21e0-48bb-babe-bcb75563712c",
            "name": "Solana",
            "symbol": "sol",
            "geckoId": "solana"
        },
    })
    async getDropByUserId(@Param('name') name: string) {
        try {
            return await this.service.getLibByName(name);
        } catch (error) {
            console.error('Get lib error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('libraryByGeckoId/:geckoId')
    @ApiOkResponse({
        description: 'Lib by geckoId',
        example: {
            "id": "9a03e175-21e0-48bb-babe-bcb75563712c",
            "name": "Solana",
            "symbol": "sol",
            "geckoId": "solana"
        },
    })
    async getDropByGeckoId(@Param('geckoId') geckoId: string) {
        try {
            return await this.service.getLibByGeckoId(geckoId);
        } catch (error) {
            console.error('Get lib error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
