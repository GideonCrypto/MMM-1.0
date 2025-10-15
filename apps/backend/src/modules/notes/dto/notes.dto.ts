import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// query
export class CreateNoteDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: 'Test' })
    @IsString()
    name!: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    isArchived!: boolean;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsArray()
    linkedTo!: string;

    @ApiProperty({ example: ["35198333-3ff5-46c7-8eef-3c97d6b7652f", "034caa3f-042b-4f36-a0dd-f1cd2f2e6c31"]})
    @IsArray()
    @IsOptional()
    marks!: string[];

    @ApiProperty({ example: 'Test' })
    @IsString()
    content?: string;
}

export class UpdateNoteDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    id!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: 'Test' })
    @IsString()
    @IsOptional()
    name!: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    isArchived!: boolean;

    @ApiProperty({ example: ["35198333-3ff5-46c7-8eef-3c97d6b7652f", "034caa3f-042b-4f36-a0dd-f1cd2f2e6c31"]})
    @IsArray()
    @IsOptional()
    marks!: string[];

    @ApiProperty({ example: '# BTC анализ\nПроверка уровня поддержки 60k.\n\n#btc #strategy\n\n```math\n2 * (3 + 4)\n```\n\n```mermaid\ngraph TD\nBTC-->ETH\nETH-->SOL\n```' })
    @IsString()
    @IsOptional()
    content?: string;
}

export class DeleteNoteDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    id!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;
}
//  responce