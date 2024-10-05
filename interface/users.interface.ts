import { Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    username: string;
    password: string;
    isEmailVerified: boolean;
    role: 'user' | 'admin';
    isPremiumMember: boolean
    createdAt?: Date;
    updatedAt?: Date;
}