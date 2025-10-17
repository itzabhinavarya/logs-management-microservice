import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(query?: { active?: boolean, search?: string }) {
        var where: any = {
            isActive: true
        }
        if (typeof query?.active === 'boolean') {
            where.isActive = query.active;
        }
        if (query?.search) {
            where.name = {
                contains: query.search,
            }
        }
        return await this.prisma.project.findMany({
            where: where,
            orderBy: {
                createdAt: "desc"
            }
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
