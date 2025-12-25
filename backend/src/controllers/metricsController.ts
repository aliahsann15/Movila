import type { Request, Response, NextFunction } from 'express';
import Metrics from '../models/metrics.js';

const parseLimit = (value: string | undefined, fallback = 50) => {
	const num = Number.parseInt(value || '', 10);
	if (Number.isNaN(num) || num <= 0) return fallback;
	return Math.min(num, 200);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const limit = parseLimit(req.query.limit as string | undefined);
		const metrics = await Metrics.find().sort({ count: -1, updatedAt: -1 }).limit(limit);
		res.status(200).json({ success: true, data: metrics });
	} catch (err) {
		next(err);
	}
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const metric = await Metrics.findById(req.params.id);
		if (!metric) {
			res.status(404).json({ success: false, error: 'Metric not found' });
			return;
		}
		res.status(200).json({ success: true, data: metric });
	} catch (err) {
		next(err);
	}
};

export const upsert = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { searchTerm, poster_url, movie_id, title, increment } = req.body;

		if (!searchTerm || !poster_url || !movie_id || !title) {
			res.status(400).json({ success: false, error: 'Missing required fields' });
			return;
		}

		const incValue = Number.isFinite(increment) ? Number(increment) : 1;

		const metric = await Metrics.findOneAndUpdate(
			{ searchTerm, movie_id },
			{
				$set: { poster_url, title },
				$inc: { count: incValue < 1 ? 1 : incValue }
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		);

		res.status(200).json({ success: true, data: metric });
	} catch (err) {
		next(err);
	}
};

export const incrementById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const inc = Number.isFinite(Number(req.body.increment)) ? Number(req.body.increment) : 1;
		const metric = await Metrics.findByIdAndUpdate(
			req.params.id,
			{ $inc: { count: inc < 1 ? 1 : inc } },
			{ new: true }
		);

		if (!metric) {
			res.status(404).json({ success: false, error: 'Metric not found' });
			return;
		}

		res.status(200).json({ success: true, data: metric });
	} catch (err) {
		next(err);
	}
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await Metrics.findByIdAndDelete(req.params.id);
		if (!result) {
			res.status(404).json({ success: false, error: 'Metric not found' });
			return;
		}
		res.status(200).json({ success: true, message: 'Metric deleted' });
	} catch (err) {
		next(err);
	}
};
