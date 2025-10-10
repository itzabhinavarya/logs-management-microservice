import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }
    async getAllUsers() {
        return await this.prisma.user.findMany();
    }
    async createUser(data: any) {
        return await this.prisma.user.create({data});
    }
    async getUser(id: number) {
        return await this.prisma.user.findFirst({
            where: {
                id: id
            }
        });
    }
    async updateUser(id: number, data: any) {
        return await this.prisma.user.update({
            where: {
                id: id
            },
            data: data
        });
    }
    async deleteUser(id: number) {
        return await this.prisma.user.delete({
            where: {
                id: id
            }
        })
    }
}
