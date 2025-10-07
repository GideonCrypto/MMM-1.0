import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(6)
    name!: string;

    @ApiProperty({ example: 'securePassword123' })
    @IsString()
    @MinLength(6)
    password!: string;
}

export class GetUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(6)
    name!: string;

    @ApiProperty({ example: 'securePassword123' })
    @IsString()
    @MinLength(6)
    password!: string;
}