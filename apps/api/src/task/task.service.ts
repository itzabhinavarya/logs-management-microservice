import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDTO, UpdateTaskDTO } from 'src/task/dto';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateTaskDTO) {
        return await this.prisma.task.create({ data: data })
    }

    async update(id: number, data: UpdateTaskDTO) {
        return await this.prisma.task.update({
            where: {
                id: id,
                isActive: true,
                isArchived: false
            },
            data: {
                ...data,
                isModified: true,
                updatedAt: new Date()
            }
        })
    }

    async archive(id: number) {
        return await this.prisma.task.update({
            where: {
                id: id,
                isActive: true,
                isArchived: false
            },
            data: {
                isActive: false,
                isArchived: true
            }
        })
    }

    async getAll(query?: {
        archive?: boolean,
        active?: boolean,
        userId?: number,
        projectId?: number,
        search?: string,
        sort?: string,
        page?: number;
        limit?: number;
    }) {
        const where: any = {
            isActive: true,
            isArchived: false
        }

        const orderBy: any = {
            createdAt: "desc"
        }

        if (typeof query?.active === 'boolean') {
            where.isActive = query.active
        }

        if (typeof query?.archive === 'boolean') {
            where.isArchived = query.archive;
        }

        if (query?.userId) {
            where.userId = query.userId;
        }

        if(query?.projectId){
            where.projectId = query.projectId;
        }

        if (query?.search) {
            where.name = {
                contains: query.search
            }
        }

        if (query?.sort) {
            orderBy.createdAt = query.sort
        }

        const page = query?.page ?? 1;
        const limit = query?.limit ?? 10;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.task.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async get(id: number) {
        return this.prisma.task.findFirst({
            where: {
                id: id,
                isActive: true,
                isArchived: false
            }
        })
    }

    async delete(id: number) {
        return this.prisma.task.update({
            where: {
                id: id,
                isArchived: false
            },
            data: {
                isActive: false,
                isDeleted: true
            }
        })
    }
}
