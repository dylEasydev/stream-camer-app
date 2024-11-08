import { ItemInterface } from '../../interface';

export interface ItemServiceInterface {
    create<
        T extends {
            title:string;
            duration:number;
            actorName:string;
            path:string;
            name:string;
        }
    >(value:T):Promise<ItemInterface>;
    update<
        T extends {
            title?:string;
            duration?:number;
            actorName?:string;
            path?:string;
            name?:string;
        }
    >(instance:ItemInterface,value:T):Promise<ItemInterface>
    delete(instance:ItemInterface):Promise<void>;
    findById(id:number):Promise<ItemInterface|null>;
    findByActorName(name:string , limit?:number , search?:string):Promise<{count:number , rows:ItemInterface[]}>;
    findAll( limit?:number , search?:string):Promise<{count:number , rows:ItemInterface[]}>;

}