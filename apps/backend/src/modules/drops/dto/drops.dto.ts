import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// query
export class CreateDropDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    assetId!: string;

    @ApiProperty({ example: 1758881614617 })
    @IsNumber()
    fee?: number;

    @ApiProperty({ example: 1758881614617 })
    @IsNumber()
    timestamp!: number;

    @ApiPropertyOptional({ example: null })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiPropertyOptional({ example: null })
    @IsString()
    @IsOptional()
    marks?: string;

    @ApiProperty({ example: 0 })
    @IsNumber()
    value!: number;

    @ApiProperty({ example: 0 })
    @IsNumber()
    sold?: number;

    @ApiProperty({ example: 0 })
    @IsNumber()
    price: number;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    transactions?: string;
}

export class UpdateDropDto extends CreateDropDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    id!: string;
}

// responce