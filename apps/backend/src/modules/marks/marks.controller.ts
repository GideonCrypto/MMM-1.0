import { Body, Controller, Delete, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { MarksService } from './marks.service';
import { CreateMarkDto, GetMarksDto } from './dto/marks.dto';

@Controller('marks')
export class MarksController {
    constructor(private readonly service: MarksService) {}

    @Post('createMark')
    @ApiOkResponse({
            description: 'Success',
            type: [CreateMarkDto],
        })
    createAsset(@Body() createMarkDto: CreateMarkDto) {
        try {
            return this.service.createMark(createMarkDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('getMarks')
    @ApiOkResponse({
            description: 'Success',
            type: [GetMarksDto],
        })
    getAsset(@Body() getMarksDto: GetMarksDto) {
        try {
            const marks = this.service.getMarks(getMarksDto);
            return marks
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Delete(':markId')
    @ApiOkResponse({ description: 'Mark deleted successfully' })
    async deleteMark(@Param('markId') markId: string) {
        try {
            const result = await this.service.deleteMark(markId);
            return result;
        } catch (error) {
            console.error('Delete mark error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
