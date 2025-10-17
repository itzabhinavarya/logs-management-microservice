import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryTaskDto {
    @ApiPropertyOptional({
        description: 'Filter by active status',
        example: true,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    active?: boolean;

    @ApiPropertyOptional({
        description: 'Filter by archive status',
        example: true,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    archive?: boolean;

    @ApiPropertyOptional({
        description: 'Search by task name',
        example: 'ecommerce',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Sort by task name',
        example: 'ecommerce',
    })
    @IsOptional()
    @IsString()
    sort?: string;
}