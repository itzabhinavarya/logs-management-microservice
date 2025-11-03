import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    // Helper to hash password
    private hashPassword(password: string): string {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    // Helper to generate OTP
    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Helper to get OTP expiry (10 minutes from now)
    private getOTPExpiry(): Date {
        return new Date(Date.now() + 10 * 60 * 1000);
    }

    async signup(data: any) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const otp = this.generateOTP();
        const hashedPassword = this.hashPassword(data.password);

        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                city: data.city,
                phone: data.phone,
                otp: otp,
                otpExpiry: this.getOTPExpiry(),
                isVerified: false
            }
        });

        // TODO: Send OTP via email
        console.log(`OTP for ${user.email}: ${otp}`);

        return user;
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        if (!user.isVerified) {
            throw new UnauthorizedException('Please verify your account first');
        }

        const hashedPassword = this.hashPassword(password);
        if (user.password !== hashedPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async verifyOtp(email: string, otp: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.isVerified) {
            throw new BadRequestException('Account is already verified');
        }

        if (!user.otp || !user.otpExpiry) {
            throw new BadRequestException('No OTP found. Please request a new one');
        }

        if (new Date() > user.otpExpiry) {
            throw new BadRequestException('OTP has expired. Please request a new one');
        }

        if (user.otp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }

        const updatedUser = await this.prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                otp: null,
                otpExpiry: null
            }
        });

        return updatedUser;
    }

    async resendOtp(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.isVerified) {
            throw new BadRequestException('Account is already verified');
        }

        const otp = this.generateOTP();

        await this.prisma.user.update({
            where: { email },
            data: {
                otp: otp,
                otpExpiry: this.getOTPExpiry()
            }
        });

        // TODO: Send OTP via email
        console.log(`New OTP for ${email}: ${otp}`);

        return { message: 'OTP sent successfully' };
    }

    async resetPassword(email: string, otp: string, newPassword: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.otp || !user.otpExpiry) {
            throw new BadRequestException('No OTP found. Please request password reset first');
        }

        if (new Date() > user.otpExpiry) {
            throw new BadRequestException('OTP has expired. Please request a new one');
        }

        if (user.otp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }

        const hashedPassword = this.hashPassword(newPassword);

        const updatedUser = await this.prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                otp: null,
                otpExpiry: null
            }
        });

        return updatedUser;
    }

    async requestPasswordReset(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const otp = this.generateOTP();

        await this.prisma.user.update({
            where: { email },
            data: {
                otp: otp,
                otpExpiry: this.getOTPExpiry()
            }
        });

        // TODO: Send OTP via email
        console.log(`Password reset OTP for ${email}: ${otp}`);

        return { message: 'Password reset OTP sent successfully' };
    }

    async getAll(query?: {
        active?: boolean,
        verified?: boolean,
        search?: string,
        sort?: string,
        page?: number;
        limit?: number;
    }) {
        const where: any = {
            isActive: true,
            isDeleted: false
        };

        const orderBy: any = {
            createdAt: "desc"
        };

        if (typeof query?.active === 'boolean') {
            where.isActive = query.active;
        }

        if (typeof query?.verified === 'boolean') {
            where.isVerified = query.verified;
        }

        if (query?.search) {
            where.OR = [
                {
                    name: {
                        contains: query.search,
                    }
                },
                {
                    email: {
                        contains: query.search,
                    }
                }
            ];
        }

        if (query?.sort) {
            orderBy.createdAt = query.sort;
        }

        const page = query?.page ?? 1;
        const limit = query?.limit ?? 10;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
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
        return await this.prisma.user.findUnique({
            where: {
                id: id,
                isActive: true,
                isDeleted: false
            }
        });
    }

    async update(id: number, data: any) {
        return await this.prisma.user.update({
            where: {
                id: id,
                isActive: true,
                isDeleted: false
            },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }

    async delete(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { 
                projects: true,
                tasks: true 
            },
        });

        if (!user || !user.isActive) {
            throw new NotFoundException('User not found or already inactive');
        }

        // Prevent deletion if user has projects or tasks
        if (user.projects && user.projects.length > 0) {
            throw new BadRequestException('Cannot delete user because they have associated projects');
        }

        if (user.tasks && user.tasks.length > 0) {
            throw new BadRequestException('Cannot delete user because they have associated tasks');
        }

        return await this.prisma.user.update({
            where: {
                id: id,
                isActive: true,
                isDeleted: false
            },
            data: {
                isActive: false,
                isDeleted: true,
            }
        });
    }
}
