import { Request, Response, NextFunction } from 'express';
import { ServerError, PromScrapeModel as PromScrapeJob } from "../../backend-types";

const ImageModel = require('../../db/ImageModel');
const PromGlobalModel = require('../../db/PromGlobalModel');
const PromScrapeModel = require('../../db/PromScrapeModel');

interface MongoController {
  saveScan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  checkForScan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  savePromConfigs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const mongoController: MongoController = {} as MongoController;

mongoController.saveScan = async (req, res, next) => {
  try {
    const { userIP, imagesList, timeStamp } = req.body;
    const savedScan = new ImageModel({ userIP, imagesList, timeStamp });
    await savedScan.save();
    res.locals.saved = true;

    // For checking front-end
    res.locals.savedScan = savedScan;
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `mongoController.saveScan Error: ${error}` },
      status: 500,
      message: `mongoController.saveScan Error: ${error}`,
    };
    return next(errObj);
  }
}

mongoController.getHistory = async (req, res, next) => {
  try {
    // get all the data from latest -> oldest
    res.locals.history = await ImageModel.find();
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `mongoController.getHistory Error: ${error}` },
      status: 500,
      message: `mongoController.getHistory Error: ${error}`,
    };
    return next(errObj);
  }
};

mongoController.checkForScan = async (req, res, next) => {
  try {
    const result = ImageModel.findOne({ timeStamp: res.locals.timeStamp });
    res.locals.scanExists = result ? true : false;
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `mongoController.checkForScan Error: ${error}` },
      status: 500,
      message: `mongoController.checkForScan Error: ${error}`,
    };
    return next(errObj);
  }
}

mongoController.savePromConfigs = async (req, res, next) => {
  const { global, scrape_configs } = req.body;

  try {
    // save global settings
    const result = await PromGlobalModel.create(global);

    // save each scrape config
    scrape_configs.forEach(async (job: PromScrapeJob) => {
      await PromScrapeModel.create(job);
    });

    res.locals.success = true;
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `mongoController.savePromConfigs Error: ${error}` },
      status: 500,
      message: `mongoController.savePromConfigs Error: ${error}`,
    };
    return next(errObj);
  }
}

export default mongoController;
