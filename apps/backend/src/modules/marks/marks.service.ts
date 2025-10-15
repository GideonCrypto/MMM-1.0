import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMarkDto, GetMarksDto } from './dto/marks.dto';

@Injectable()
export class MarksService {
    constructor(private prisma: PrismaService,) {}

    async createMark(data: CreateMarkDto){
        const check = await this.prisma.marks.findFirst({
            where: {
                name: data.name,
                userId: data.userId,
            }
        });

        if (check) {
            return 'Mark already exist'
        } else {
            return await this.prisma.marks.create({
                data: {
                    name: data.name,
                    userId: data.userId
                },
            });
        }
    }

    async getMarks(data: GetMarksDto){
        const marks = await this.prisma.marks.findMany({
                where: {
                    userId: data.userId,
                }
        });
        return marks
    }

    async deleteMark(markId: string) {
        const mark = await this.prisma.marks.findUnique({
            where: { id: markId },
        });

        if (!mark) {
            throw new NotFoundException('Mark not found');
        }

        await this.prisma.marks.delete({
            where: { id: markId },
        });

        return { message: 'Mark deleted successfully' };
    }
}
