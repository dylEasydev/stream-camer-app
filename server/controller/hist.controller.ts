import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Token } from '../db';
import { histService } from '../db/service';
import { CodeStatut, statusResponse } from '../helper';

export class HistController extends BaseController{

    async findHist(req:Request, res:Response){
        try {
            const userToken = req.body.token as Token;
            const limit = typeof req.query.limit === 'string'?parseInt(req.query.limit , 10):undefined;
            const tabHist = await histService.findHist(userToken.userId , limit);
            return statusResponse.sendResponseJson(
                CodeStatut.VALID_STATUS,
                res,
                `historique de l'utilisateur`,
                tabHist
            );
        } catch (error) {
            return statusResponse.sendResponseJson(
                CodeStatut.SERVER_STATUS,
                res,
                `Erreur au niveau du serveur !`,
                error
            );
        }
    }
}