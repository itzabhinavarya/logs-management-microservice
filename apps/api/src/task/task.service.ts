import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any) {
        return await this.prisma.task.create({ data: data })
    }

    async update(id, data) {
        return await this.prisma.task.update({
            where: {
                id: id,
                isActive: true
            },
            data: {
                ...data,
                isModified: true,
                updatedAt: new Date()
            }
        })
    }

    async getAll() {
        return this.prisma.task.findMany({
            where: {
                isActive: true
            }
        })
    }

    async get(id) {
        return this.prisma.task.findFirst({
            where: {
                id: id,
                isActive: true
            }
        })
    }

    async delete(id) {
        return this.prisma.task.delete({
            where: {
                id: id,
                isActive: true
            }
        })
    }
}
