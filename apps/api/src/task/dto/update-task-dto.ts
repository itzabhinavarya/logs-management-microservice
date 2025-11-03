import { PartialType, OmitType } from "@nestjs/swagger";
import { CreateTaskDTO } from "src/task/dto/create-task-dto";

export class UpdateTaskDTO extends PartialType(OmitType(CreateTaskDTO, ['projectId'] as const)) { }