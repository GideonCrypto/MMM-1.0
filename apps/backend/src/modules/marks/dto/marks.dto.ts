import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// query
export class CreateMarkDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;

    @ApiProperty({ example: 'Test' })
    @IsString()
    name!: string;
}

export class GetMarksDto {
    @ApiProperty({ example: '08ffce73-4e68-4c90-8e09-c77722dc6c80' })
    @IsString()
    userId!: string;
}

//  responce