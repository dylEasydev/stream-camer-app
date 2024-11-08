import { 
    CreationOptional,InferAttributes, InferCreationAttributes, Model 
} from 'sequelize';
import { User } from './user.intreface';

export interface HistInterface extends Model<
    InferAttributes<HistInterface>,
    InferCreationAttributes<HistInterface>
>{

    id:CreationOptional<number>;

    userId:User['id'];
    searchTerms:string;

    readonly createdAt:CreationOptional<Date>;
    readonly updatedAt:CreationOptional<Date>;
    readonly deletedAt:CreationOptional<Date>;
}