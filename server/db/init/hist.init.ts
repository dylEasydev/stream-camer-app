import { sequelizeConnect } from '../config';
import { Hist } from '../models';
import { DataTypes } from 'sequelize';

Hist.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            isInt:{msg:`Besion d'un entier pour user-id !`}
        }
    },
    searchTerms:{
        type:DataTypes.STRING,
        allowNull:false
    },
    deletedAt:DataTypes.DATE,
    createdAt:DataTypes.DATE,
    updatedAt:DataTypes.DATE
},{
    sequelize:sequelizeConnect,
    timestamps:true,
    paranoid:true,
    tableName:'hist'
})

export { Hist };