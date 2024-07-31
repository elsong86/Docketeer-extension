// Types
import { Request, Response, NextFunction } from 'express';
import { ServerError } from '../../backend-types';
import yaml from 'js-yaml';
import fs from 'fs';

interface ConfigController {
  /**
   * @method
   * @abstract
   * @returns @param {void}
   */
  getYaml: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * @method
   * @abstract
   * @returns @param {void}
   */
  updateYaml: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const configController: ConfigController = {
  getYaml: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = yaml.load(fs.readFileSync('../prometheus/prometheus.yml', 'utf8'));
      res.locals.yaml = doc;
      return next();
    } catch (error) {
      const errObj: ServerError = {
        log: { err: `configController.getYaml Error: ${error}` },
        status: 500,
        message: 'internal server error'
      };
      return next(errObj);
    }
  },
  updateYaml: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const yamlContent = yaml.dump(req.body);
      fs.writeFileSync('../prometheus/prometheus.yml', yamlContent, 'utf8');
      res.locals.updated = true;
      return next();
    } catch (error) {
      const errObj: ServerError = {
        log: { err: `configController.updateYaml Error: ${error}` },
        status: 500,
        message: 'internal server error'
      };
      return next(errObj);
    }
  }
};

export default configController;
