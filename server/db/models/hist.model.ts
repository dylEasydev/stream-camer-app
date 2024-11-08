import { 
    InferAttributes, InferCreationAttributes, Model ,
    CreationOptional
} from 'sequelize';
import { HistInterface , User } from '../interface';

export class Hist extends Model <
    InferAttributes<Hist>,
    InferCreationAttributes<Hist>
>implements HistInterface{

    declare id:CreationOptional<number>;

    declare userId:User['id'];
    declare searchTerms:string;

    declare readonly createdAt:CreationOptional<Date>;
    declare readonly updatedAt:CreationOptional<Date>;
    declare readonly deletedAt:CreationOptional<Date>;
}