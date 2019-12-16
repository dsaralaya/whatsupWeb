import { Request, Response } from 'express';



export default class AnswersController {
    public async getall(req: Request, res: Response) {
        return res.status(200).json({ updated: true });
    }

    public async getbyid(req: Request, res: Response) {
        return res.status(200).json({ updated: true });
    }


    public async create(req: Request, res: Response) {
        return res.status(200).json({ updated: true });
    }

    public async update(req: Request, res: Response) {
        return res.status(200).json({ updated: true });

    }

    public async delete(req: Request, res: Response) {
        return res.status(200).json({ updated: true });

    }

}