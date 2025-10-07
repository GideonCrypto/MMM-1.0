import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// query
export class AddItemToLibraryDto {
    @ApiProperty({ example: 'Bitcoin' })
    @IsString()
    name!: string;

    @ApiProperty({ example: 'BTC' })
    @IsString()
    symbol!: string;

    @ApiProperty({ example: 'bitcoin' })
    @IsString()
    geckoId!: string;
}

//  responce