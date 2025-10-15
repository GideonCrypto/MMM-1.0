import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// query
export class CreateTransactionDto {
    @ApiProperty({ example: 'buy' })
    @IsString()
    type!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    assetId!: string;

    @ApiProperty({ example: '1758881614617' })
    @IsNumber()
    timestamp!: number;

    @ApiProperty({ example: '1' })
    @IsNumber()
    quantity!: number;

    @ApiProperty({ example: '100' })
    @IsNumber()
    price!: number;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiPropertyOptional({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    @IsOptional()
    marks?: string;

    @ApiPropertyOptional({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiPropertyOptional({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    @IsOptional()
    portfolio?: string;
}

export class GetTransactionDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    assetId!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    transactionId!: string;
}

export class GetTransactionsDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    assetId!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;
}
// responce