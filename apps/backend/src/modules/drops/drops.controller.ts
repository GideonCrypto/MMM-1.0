import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateTransactionDto } from '../transaction/dto/transaction.dto';
import { DropsService } from './drops.service';
import { CreateDropDto, UpdateDropDto } from './dto/drops.dto';

@Controller('drops')
export class DropsController {
    constructor(private readonly service: DropsService) {}

    @Post('createDrop')
    @ApiOkResponse({
            description: 'Success',
            type: [CreateDropDto],
        })
    createStaking(@Body() createDropDto: CreateDropDto) {
        try {
            return this.service.createDrop(createDropDto);
        } catch (error) {
            console.error('Create drop error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Patch('updateDrop')
    @ApiOkResponse({
                description: 'Success',
                type: [UpdateDropDto],
            })
    updateStaking(@Body() updateDropDto: UpdateDropDto) {
        try {
            return this.service.updateDrop(updateDropDto);;
        } catch (error) {
            console.error('Update drop error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('sellReward')
    @ApiOkResponse({
            description: 'Success',
            type: [CreateTransactionDto],
        })
    sellReward(@Body() createTransactionDto: CreateTransactionDto) {
        try {
            return this.service.sellReward(createTransactionDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('dropId/:id')
    @ApiOkResponse({
        description: 'Drop by id',
        example: {
            "id": "0ddfb9d0-d66e-4f9d-973e-c183e6d8373c",
            "userId": "08ffce73-4e68-4c90-8e09-c77722dc6c80",
            "assetId": "08ffce73-4e68-4c90-8e09-c77722dc6c80",
            "fee": "1758881614617",
            "timestamp": "2025-09-26T10:13:34.617Z",
            "notes": null,
            "marks": null,
            "value": "1",
            "sold": "0",
            "price": "0",
            "transactions": "08ffce73-4e68-4c90-8e09-c77722dc6c80"
        },
    })
    async getDropById(@Param('id') id: string) {
        try {
            return await this.service.getDropById(id);
        } catch (error) {
            console.error('Get drop error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('dropUser/:userId')
    @ApiOkResponse({
        description: 'Drop by userId',
        example: [{
            "id": "0ddfb9d0-d66e-4f9d-973e-c183e6d8373c",
            "userId": "08ffce73-4e68-4c90-8e09-c77722dc6c80",
            "assetId": "08ffce73-4e68-4c90-8e09-c77722dc6c80",
            "fee": "1758881614617",
            "timestamp": "2025-09-26T10:13:34.617Z",
            "notes": null,
            "marks": null,
            "value": "1",
            "sold": "0",
            "price": "0",
            "transactions": "08ffce73-4e68-4c90-8e09-c77722dc6c80"
        }],
    })
    async getDropByUserId(@Param('userId') userId: string) {
        try {
            return await this.service.getDropsByUser(userId);
        } catch (error) {
            console.error('Get drop error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Delete(':dropId')
    @ApiOkResponse({ description: 'Drop deleted successfully' })
    async deleteStaking(@Param('dropId') dropId: string) {
        try {
            return await this.service.deleteDrop(dropId);
        } catch (error) {
            console.error('Delete drop error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
