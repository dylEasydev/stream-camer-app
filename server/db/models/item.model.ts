import { 
    CreateOptions,
    CreationOptional,InferAttributes,Model,NonAttribute 
} from 'sequelize';
import { ItemInterface } from '../interface';
import { Image } from './image.model';

export abstract class Item extends Model implements ItemInterface{
    declare id:CreationOptional<number>;

    declare title:string;
    declare duration:number;
    declare actorName:string;
    declare path:string;
    declare name:string;

    declare miniature? : NonAttribute<string>;

    abstract createImage(
        value?: { urlPictures?: string; picturesName?: string; }, 
        options?: CreateOptions<InferAttributes<Image>>
    ):Promise<Image>
    
    declare readonly createdAt:CreationOptional<Date>;
    declare readonly updatedAt:CreationOptional<Date>;
    declare readonly deletedAt:CreationOptional<Date>;
}