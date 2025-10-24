import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { StakingService } from './staking.service';
import { CreateStakingDto, UpdateStakingDto } from './dto/staking.dto';
import { CreateTransactionDto } from '../transaction/dto/transaction.dto';

@Controller('staking')
export class StakingController {
    constructor(private readonly service: StakingService) {}

    @Post('createStaking')
    @ApiOkResponse({
            description: 'Success',
            type: [CreateStakingDto],
        })
    createStaking(@Body() createStakingDto: CreateStakingDto) {
        try {
            return this.service.createStaking(createStakingDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Patch('updateStaking')
    @ApiOkResponse({
                description: 'Success',
                type: [UpdateStakingDto],
            })
    updateStaking(@Body() updateStakingDto: UpdateStakingDto) {
        try {
            const swap = this.service.updateStaking(updateStakingDto);;
            return swap;
        } catch (error) {
            console.error('Update swap error:', error);
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

    @Get('stakingId/:id')
    @ApiOkResponse({
        description: 'Staking by id',
        example: {
            id: "5bfe39ee-ad8f-4668-8094-9d4af2631cfe",
            userId: "08ffce73-4e68-4c90-8e09-c77722dc6c80",
            assetId: "08ffce73-4e68-4c90-8e09-c77722dc6c80",
            value: "5",
            reward: "0",
            rewardSold: "0",
            coinToReceive: "08ffce73-4e68-4c90-8e09-c77722dc6c80",
            timestamp: "2025-09-26T10:13:34.617Z",
            notes: null,
            marks: null
        },
    })
    async getStakingById(@Param('id') id: string) {
        try {
            const result = await this.service.getStakingById(id);
            return result;
        } catch (error) {
            console.error('Get staking error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Get('stakingUser/:userId')
    @ApiOkResponse({
        description: 'Staking by userId',
        example: {
            id: "5bfe39ee-ad8f-4668-8094-9d4af2631cfe",
            userId: "08ffce73-4e68-4c90-8e09-c77722dc6c80",
            assetId: "08ffce73-4e68-4c90-8e09-c77722dc6c80",
            value: "5",
            reward: "0",
            rewardSold: "0",
            coinToReceive: "08ffce73-4e68-4c90-8e09-c77722dc6c80",
            timestamp: "2025-09-26T10:13:34.617Z",
            notes: null,
            marks: null
        },
    })
    async getStakingByUserId(@Param('userId') userId: string) {
        try {
            const result = await this.service.getStakesByUser(userId);
            return result;
        } catch (error) {
            console.error('Get staking error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Delete(':stakingId')
    @ApiOkResponse({ description: 'Staking deleted successfully' })
    async deleteStaking(@Param('stakingId') stakingId: string) {
        try {
            const result = await this.service.deleteStaking(stakingId);
            return result;
        } catch (error) {
            console.error('Delete staking error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
