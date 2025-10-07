import { Body, Controller, Delete, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateAssetDto, GetAssetDto, GetAssetsDto } from './dto/asset.dto';
import { AssetService } from './asset.service';

@Controller('assets')
export class AssetController {
    constructor(private readonly service: AssetService) {}

    @Post('createAsset')
    @ApiOkResponse({
            description: 'Success',
            type: [CreateAssetDto],
        })
    createAsset(@Body() createAssetDto: CreateAssetDto) {
        try {
            return this.service.createAsset(createAssetDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('getAsset')
    @ApiOkResponse({
            description: 'Success',
            type: [GetAssetDto],
        })
    getAsset(@Body() getAssetDto: GetAssetDto) {
        try {
            return this.service.getAsset(getAssetDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('getAssets')
    @ApiOkResponse({
            description: 'Success',
            type: [GetAssetsDto],
        })
    getAssets(@Body() getAssetDto: GetAssetsDto) {
        try {
            return this.service.getAssets(getAssetDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Delete(':assetId')
    @ApiOkResponse({ description: 'Asset deleted successfully' })
    async deleteTransaction(@Param('assetId') assetId: string) {
        try {
            const result = await this.service.deleteAsset(assetId);
            return result;
        } catch (error) {
            console.error('Delete asset error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
