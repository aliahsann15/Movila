import type { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.js';

const parseLimit = (value: string | undefined, fallback = 50) => {
	const num = Number.parseInt(value || '', 10);
	if (Number.isNaN(num) || num <= 0) return fallback;
	return Math.min(num, 200);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const limit = parseLimit(req.query.limit as string | undefined);
		const users = await UserModel.find()
			.select('-password')
			.sort({ createdAt: -1 })
			.limit(limit);
		res.status(200).json({ success: true, data: users });
	} catch (err) {
		next(err);
	}
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserModel.findById(req.params.id).select('-password');
		if (!user) {
			res.status(404).json({ success: false, error: 'User not found' });
			return;
		}
		res.status(200).json({ success: true, data: user });
	} catch (err) {
		next(err);
	}
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { fullName, email, password, bio, profilePictureUrl } = req.body;

		if (!fullName || !email || !password) {
			res.status(400).json({ success: false, error: 'Missing required fields' });
			return;
		}

		// Ensure unique email
		const existing = await UserModel.findOne({ email });
		if (existing) {
			res.status(409).json({ success: false, error: 'Email already in use' });
			return;
		}

		const user = await UserModel.create({
			fullName,
			email,
			password,
			bio: bio || '',
			profilePictureUrl: profilePictureUrl || ''
		});

		const sanitized = user.toObject();
		delete (sanitized as any).password;

		res.status(201).json({ success: true, data: sanitized });
	} catch (err) {
		next(err);
	}
};

export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updates: Record<string, unknown> = {};
		const allowed = ['fullName', 'email', 'password', 'bio', 'profilePictureUrl'];

		for (const key of allowed) {
			if (Object.prototype.hasOwnProperty.call(req.body, key)) {
				updates[key] = req.body[key];
			}
		}

		if (Object.keys(updates).length === 0) {
			res.status(400).json({ success: false, error: 'No valid fields to update' });
			return;
		}

		// If email is changing ensure uniqueness
		if (updates.email) {
			const exists = await UserModel.findOne({ email: updates.email, _id: { $ne: req.params.id } });
			if (exists) {
				res.status(409).json({ success: false, error: 'Email already in use' });
				return;
			}
		}

		const user = await UserModel.findByIdAndUpdate(
			req.params.id,
			{ $set: updates },
			{ new: true, runValidators: true }
		).select('-password');

		if (!user) {
			res.status(404).json({ success: false, error: 'User not found' });
			return;
		}

		res.status(200).json({ success: true, data: user });
	} catch (err) {
		next(err);
	}
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await UserModel.findByIdAndDelete(req.params.id);
		if (!result) {
			res.status(404).json({ success: false, error: 'User not found' });
			return;
		}
		res.status(200).json({ success: true, message: 'User deleted' });
	} catch (err) {
		next(err);
	}
};

export const getSavedMovies = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log('Fetching saved movies for user:', req.params.id);
		const user = await UserModel.findById(req.params.id).select('savedMovies');
		if (!user) {
			res.status(404).json({ success: false, error: 'User not found' });
			return;
		}
		res.status(200).json({ success: true, data: user.savedMovies || [] });
	} catch (err) {
		next(err);
	}
};

export const addSavedMovie = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserModel.findById(req.params.id);
		if (!user) {
			res.status(404).json({ success: false, error: 'User not found' });
			return;
		}

		const movie = req.body?.movie;
		if (!movie || typeof movie.id !== 'number' || !movie.title) {
			res.status(400).json({ success: false, error: 'Invalid movie payload' });
			return;
		}

		const exists = (user.savedMovies || []).some((m: any) => m?.id === movie.id);
		if (exists) {
			res.status(200).json({ success: true, message: 'Movie already saved', data: user.savedMovies });
			return;
		}

		user.savedMovies = [...(user.savedMovies || []), movie];
		await user.save();

		res.status(200).json({ success: true, data: user.savedMovies });
	} catch (err) {
		next(err);
	}
};

export const removeSavedMovie = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserModel.findById(req.params.id);
		if (!user) {
			res.status(404).json({ success: false, error: 'User not found' });
			return;
		}

		const movieId = Number.parseInt(String(req.params.movieId || req.body?.movieId), 10);
		if (!Number.isFinite(movieId)) {
			res.status(400).json({ success: false, error: 'Invalid movie id' });
			return;
		}

		const before = user.savedMovies?.length || 0;
		user.savedMovies = (user.savedMovies || []).filter((m: any) => m?.id !== movieId);
		const after = user.savedMovies.length;

		if (before === after) {
			res.status(404).json({ success: false, error: 'Movie not found in saved list' });
			return;
		}

		await user.save();
		res.status(200).json({ success: true, data: user.savedMovies });
	} catch (err) {
		next(err);
	}
};

