import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProjectDto } from 'src/project/dto/create-project-dto';

export class UpdateProjectDto extends PartialType(OmitType(CreateProjectDto, ['userId'] as const)) { }