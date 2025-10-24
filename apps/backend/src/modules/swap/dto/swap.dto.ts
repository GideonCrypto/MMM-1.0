import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// query
export class CreateSwapDto {
    @ApiProperty({ example: '1f0d1728-285e-45e0-8951-d65bf7ee6d17' })
    @IsString()
    assetIdChange!: string;

    @ApiProperty({ example: '45bfcc8f-1b0f-4129-b713-ecba66676906' })
    @IsString()
    assetIdReceive!: string;

    @ApiProperty({ example: 0 })
    @IsNumber()
    fee!: number;

    @ApiPropertyOptional({ example: null })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    changeAmount!: number;

    @ApiProperty({ example: 2 })
    @IsNumber()
    receiveAmount!: number;

    @ApiProperty({ example: 120000 })
    @IsNumber()
    priceChange!: number;

    @ApiProperty({ example: 200 })
    @IsNumber()
    priceReceive!: number;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: 1758881614617 })
    @IsNumber()
    timestamp!: number;
}

export class GetSwapsDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;
}

export class UpdateSwapDto {
    @ApiProperty({ example: '1f0d1728-285e-45e0-8951-d65bf7ee6d17' })
    @IsString()
    id!: string;

    @ApiProperty({ example: '1f0d1728-285e-45e0-8951-d65bf7ee6d17' })
    @IsString()
    assetIdChange!: string;

    @ApiProperty({ example: '45bfcc8f-1b0f-4129-b713-ecba66676906' })
    @IsString()
    assetIdReceive!: string;

    @ApiProperty({ example: 0 })
    @IsNumber()
    fee!: number;

    @ApiPropertyOptional({ example: null })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    changeAmount!: number;

    @ApiProperty({ example: 2 })
    @IsNumber()
    receiveAmount!: number;

    @ApiProperty({ example: 120000 })
    @IsNumber()
    priceChange!: number;

    @ApiProperty({ example: 200 })
    @IsNumber()
    priceReceive!: number;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: 1758881614617 })
    @IsNumber()
    timestamp!: number;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    sellTransactionId!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    buyTransactionId!: string;
}

// responce