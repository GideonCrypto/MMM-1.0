import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// query
export class CreateAssetDto {
    @ApiProperty({ example: 'Bitcoin' })
    @IsString()
    name!: string;

    @ApiProperty({ example: 'BTC' })
    @IsString()
    symbol!: string;

    @ApiProperty({ example: 'bitcoin' })
    @IsString()
    marketId!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: '100' })
    @IsNumber()
    price!: number;

    @ApiProperty({ example: '1758881614617' })
    @IsNumber()
    timestamp!: number;

    @ApiPropertyOptional({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    @IsOptional()
    marks?: string;

    @ApiPropertyOptional({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    @IsOptional()
    notes?: string;
}

export class GetAssetDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    assetId!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;
}

export class GetAssetsDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;
}
//  responce