import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getJobs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createJob: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const generateJobDescriptionWithAI: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=jobController.d.ts.map