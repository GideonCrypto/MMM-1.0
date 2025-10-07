import { Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
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
            const item = this.service.addItem(data);
            return item;
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
            const item = this.service.syncAllCoins();
            return item;
        } catch (error) {
            console.error('Add item error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
