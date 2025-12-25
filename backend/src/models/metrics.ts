import { Schema, model } from 'mongoose';
import type { Document, Model } from 'mongoose';

export interface Metric {
	searchTerm: string;
	count: number;
	poster_url: string;
	movie_id: number;
	title: string;
}

export type MetricDocument = Metric & Document;

const MetricSchema = new Schema<MetricDocument>(
	{
		searchTerm: { type: String, required: true, trim: true },
		count: { type: Number, required: true, default: 0, min: 0 },
		poster_url: { type: String, required: true, trim: true },
		movie_id: { type: Number, required: true },
		title: { type: String, required: true, trim: true }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

MetricSchema.index({ searchTerm: 1, movie_id: 1 }, { unique: true });
MetricSchema.index({ count: -1 });

const Metrics: Model<MetricDocument> = model<MetricDocument>('Metric', MetricSchema);

export default Metrics;
