import { Request, Response } from 'express';
export declare const uploadResume: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCandidates: (req: Request, res: Response) => Promise<void>;
export declare const searchCandidates: (req: Request, res: Response) => Promise<void>;
export declare const matchCandidates: (req: Request, res: Response) => Promise<void>;
export declare const updateCandidateStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=candidateController.d.ts.map