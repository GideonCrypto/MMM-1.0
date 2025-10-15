import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePortfolioDto, GetPortfoliosDto } from './dto/portfolio.dto';

@Injectable()
export class PortfolioService {
    constructor(private prisma: PrismaService,) {}

    async createPortfolio(data: CreatePortfolioDto){
        const check = await this.prisma.portfolio.findFirst({
            where: {
                name: data.name,
                userId: data.userId,
            }
        });

        if (check) {
            return 'Portfolio already exist'
        } else {
            return await this.prisma.portfolio.create({
                data: {
                    name: data.name,
                    userId: data.userId
                },
            });
        }
    }

    async getPortfolios(data: GetPortfoliosDto){
        const portfolio = await this.prisma.portfolio.findMany({
                where: {
                    userId: data.userId,
                }
        });
        return portfolio
    }

    async deletePortfolio(portfolioId: string) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
        });

        if (!portfolio) {
            throw new NotFoundException('Portfolio not found');
        }

        await this.prisma.portfolio.delete({
            where: { id: portfolioId },
        });

        return { message: 'Portfolio deleted successfully' };
    }
}
