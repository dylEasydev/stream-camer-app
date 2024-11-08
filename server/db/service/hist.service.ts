import { Hist, sequelizeConnect } from '../../db';
import { HistInterface } from '../interface';
import { HistInterfaceService } from './interface';

class Histservice implements HistInterfaceService{

    createHist(userId: number, searchTerms: string){
        return new Promise<Hist>(async(resolve, reject) => {
            try {
                const newSearch = await sequelizeConnect.transaction(async t=>{
                    return await Hist.create({
                        userId,
                        searchTerms
                    });
                })
                resolve(newSearch);
            } catch (error) {
                reject(error);
            }
        })
    }

    findHist(userId: number, limit?: number) {
        return new Promise<Hist[]>(async (resolve, reject) => {
            try {
                const tabHist = await sequelizeConnect.transaction(async t =>{
                    return await Hist.findAll({
                        where:{
                            userId
                        },
                        limit
                    });
                }); 
                resolve(tabHist);
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default new Histservice();