import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProjectDto {
    @ApiPropertyOptional({
        description: 'Filter by active status',
        example: true,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Search by project name',
        example: 'ecommerce',
    })
    @IsOptional()
    @IsString()
    search?: string;
}