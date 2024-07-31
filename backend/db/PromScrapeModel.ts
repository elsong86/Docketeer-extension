// Model to store Scrape Configs after reading it off of prometheus.yaml file
// Click on export button on Configuration Page for functionality

import mongoose, { Schema } from 'mongoose';
import { PromScrapeModel } from '../backend-types';

// Main schema for the 'Prometheus Scrape Configs Setting' object
const PromScrapeSchema: Schema = new Schema({
  honor_labels: { type: Boolean, required: false },
  job_name: { type: String, required: false },
  metrics_path: { type: String, required: false },
  params: { type: Object, required: false },
  relabel_configs: { type: Array, required: false, default: undefined },
  scrape_interval: { type: String, required: false },
  evaluation_interval: { type: String, required: false },
  static_configs: { type: Array, required: false, default: undefined },
});

module.exports = mongoose.model<PromScrapeModel>('PromScrapeModel', PromScrapeSchema);
