import { Schema, model } from 'mongoose';
import type { Document, Model } from 'mongoose';

interface Movie {
    id: number;
    title: string;
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface User {
    fullName: string;
    email: string;
    password: string;
    bio?: string;
    savedMovies?: Movie[];
    profilePictureUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserDocument extends User, Document { }

const userSchema = new Schema<UserDocument>({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    savedMovies: { type: [Object], default: [] },
    profilePictureUrl: { type: String, default: '' },
}, {
    timestamps: true
});

const UserModel: Model<UserDocument> = model<UserDocument>('User', userSchema);

export default UserModel;