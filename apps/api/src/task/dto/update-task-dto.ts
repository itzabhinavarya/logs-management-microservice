import { PartialType } from "@nestjs/swagger";
import { CreateTaskDTO } from "src/task/dto/create-task-dto";

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) { }