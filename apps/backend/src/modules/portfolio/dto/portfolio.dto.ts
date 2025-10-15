import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// query
export class CreatePortfolioDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: 'Test' })
    @IsString()
    name!: string;
}

export class GetPortfoliosDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;
}

//  responce