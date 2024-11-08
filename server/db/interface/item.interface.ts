import { 
    CreationOptional, Model, NonAttribute,CreateOptions,
    InferAttributes
} from 'sequelize';
import { ImageInterface } from './image.interface';

export interface ItemInterface extends Model{
    id:CreationOptional<number>;

    title:string;
    duration:number;
    actorName:string;
    path:string;
    name:string;

    miniature? : NonAttribute<string>;

    createImage(
        value?:{urlPictures?:string; picturesName?:string},
        options?:CreateOptions<InferAttributes<ImageInterface>>
    ):Promise<ImageInterface>;

    readonly createdAt:CreationOptional<Date>;
    readonly updatedAt:CreationOptional<Date>;
    readonly deletedAt:CreationOptional<Date>;
}