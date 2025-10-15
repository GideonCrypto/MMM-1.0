import { Body, Controller, Delete, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto, GetPortfoliosDto } from './dto/portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly service: PortfolioService) {}

    @Post('createPortfolio')
    @ApiOkResponse({
            description: 'Success',
            type: [CreatePortfolioDto],
        })
    createPortfolio(@Body() createPortfolioDto: CreatePortfolioDto) {
        try {
            return this.service.createPortfolio(createPortfolioDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('getPortfolios')
    @ApiOkResponse({
            description: 'Success',
            type: [GetPortfoliosDto],
        })
    getPortfolios(@Body() getPortfoliosDto: GetPortfoliosDto) {
        try {
            const portfolio = this.service.getPortfolios(getPortfoliosDto);
            return portfolio
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Delete(':portfolioId')
    @ApiOkResponse({ description: 'Portfolio deleted successfully' })
    async deletePortfolio(@Param('portfolioId') portfolioId: string) {
        try {
            const result = await this.service.deletePortfolio(portfolioId);
            return result;
        } catch (error) {
            console.error('Delete portfolio error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
