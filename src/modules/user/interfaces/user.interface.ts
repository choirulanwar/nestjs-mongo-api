import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly phoneNumber: string;
  readonly isEmailVerified: boolean;
  readonly isActive: boolean;
  readonly activeUntil: number;
  readonly profilePictureURL: string;
  readonly role: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}
