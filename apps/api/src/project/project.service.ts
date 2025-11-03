import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(query?: {
        archive?: boolean,
        active?: boolean,
        userId?: number,
        search?: string,
        sort?: string,
        page?: number;
        limit?: number;
    }) {
        var where: any = {
            isActive: true,
            isArchived: false
        }

        const orderBy: any = {
            createdAt: "desc"
        }

        if (typeof query?.active === 'boolean') {
            where.isActive = query.active;
        }

        if (typeof query?.archive === 'boolean') {
            where.isArchived = query.archive;
        }

        if (query?.userId) {
            where.userId = query.userId;
        }

        if (query?.search) {
            where.name = {
                contains: query.search,
            }
        }
        if (query?.sort) {
            orderBy.createdAt = query.sort
        }

        const page = query?.page ?? 1;
        const limit = query?.limit ?? 10;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.project.count({ where }),
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
        return await this.prisma.project.findUnique({
            where: {
                id: id,
                isActive: true,
                isArchived: false
            }
        })
    }

    async create(data: any & { userId: number }) {
        return await this.prisma.project.create({
            data: data
        })
    }

    async update(id: number, data: any) {
        return await this.prisma.project.update({
            where: {
                id: id,
                isActive: true,
                isArchived: false
            },
            data: {
                ...data,
                updatedAt: new Date()
            }
        })
    }

    async archive(id: number) {
        return await this.prisma.project.update({
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
                isArchived: false
            },
            data: {
                isActive: false,
                isDeleted: true,
            }
        })
    }

}
