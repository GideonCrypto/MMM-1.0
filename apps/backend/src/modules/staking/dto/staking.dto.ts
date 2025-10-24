import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// query
export class CreateStakingDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    assetId!: string;

    @ApiProperty({ example: 0 })
    @IsNumber()
    value!: number;

    @ApiProperty({ example: 0 })
    @IsNumber()
    reward!: number;

    @ApiProperty({ example: 0 })
    @IsNumber()
    rewardSold!: number;

    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    coinToReceive!: string;

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
}

export class UpdateStakingDto extends CreateStakingDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    id!: string;
}

// responce