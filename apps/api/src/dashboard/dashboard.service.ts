import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getStats() {
        // Users
        const totalUsers = await this.prisma.user.count();
        const recentUsers = await this.prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
                },
            },
        });

        // Projects
        const totalProjects = await this.prisma.project.count();
        const activeProjects = await this.prisma.project.count({ where: { isActive: true } });
        const archivedProjects = await this.prisma.project.count({ where: { isArchived: true } });
        const deletedProjects = await this.prisma.project.count({ where: { isDeleted: true } });

        // Tasks
        const totalTasks = await this.prisma.task.count();
        const activeTasks = await this.prisma.task.count({ where: { isActive: true } });
        const archivedTasks = await this.prisma.task.count({ where: { isArchived: true } });
        const deletedTasks = await this.prisma.task.count({ where: { isDeleted: true } });

        return {
            users: {
                total: totalUsers,
                recentUsers,
            },
            projects: {
                total: totalProjects,
                active: activeProjects,
                archived: archivedProjects,
                deleted: deletedProjects,
            },
            tasks: {
                total: totalTasks,
                active: activeTasks,
                archived: archivedTasks,
                deleted: deletedTasks,
            },
        };
    }
}
