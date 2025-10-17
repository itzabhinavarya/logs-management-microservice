import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(query?: { active?: boolean, search?: string, sort?: string }) {
        var where: any = {
            isActive: true
        }
        const orderBy: any = {
            createdAt: "desc"
        }
        if (typeof query?.active === 'boolean') {
            where.isActive = query.active;
        }
        if (query?.search) {
            where.name = {
                contains: query.search,
            }
        }
        if (query?.sort) {
            orderBy.createdAt = query.sort
        }

        return await this.prisma.project.findMany({
            where: where,
            orderBy: orderBy
        })
    }

    async get(id: number) {
        return await this.prisma.project.findUnique({
            where: {
                id: id,
                isActive: true,
            }
        })
    }

    async create(data: any) {
        return await this.prisma.project.create({
            data: data
        })
    }

    async update(id: number, data: any) {
        return await this.prisma.project.update({
            where: {
                id: id,
                isActive: true
            },
            data: {
                ...data,
                updatedAt: new Date()
            }
        })
    }

    async delete(id: number) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: { tasks: true },
        });

        if (!project || !project.isActive) {
            throw new Error('Project not found or already inactive');
        }

        // 2️⃣ Prevent deletion if it has tasks
        if (project.tasks && project.tasks.length > 0) {
            throw new Error('Cannot delete project because it has associated tasks');
        }

        return await this.prisma.project.update({
            where: {
                id: id,
                isActive: true,
            },
            data: {
                isActive: false,
                isDeleted: true,
            }
        })
    }

}
