import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 1 })
  @Expose()
  userId: number;

  @ApiProperty({ example: 'E-commerce Platform' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'A full-featured e-commerce platform' })
  @Expose()
  description: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T14:45:00Z', required: false })
  @Expose()
  updatedAt?: Date;

  // Exclude sensitive fields from 
  @Exclude()
  isActive: boolean;

  @Exclude()
  isDeleted: boolean;

  @Exclude()
  isModified: boolean;

  @Exclude()
  isArchived: boolean;

  constructor(partial: Partial<ProjectResponseDto>) {
    Object.assign(this, partial);
  }
}
