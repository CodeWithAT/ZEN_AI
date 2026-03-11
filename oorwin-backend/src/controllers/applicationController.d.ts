import { Request, Response, NextFunction } from 'express';
export declare const createApplication: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateApplicationStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPipeline: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=applicationController.d.ts.map