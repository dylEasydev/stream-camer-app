import { HistInterface } from "../../interface";

export interface HistInterfaceService{
    createHist(userId:number , searchTerms:string):Promise<HistInterface>;
    findHist(userId:number , limit?:number):Promise<HistInterface[]>;
}