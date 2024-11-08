import { DataTypes } from 'sequelize';
import { sequelizeConnect } from '../config';
import { Video } from '../models';

Video.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{msg:`pas de titre vide !`},
            notNull:{msg:`pas de titre null !`}
        }
    },
    actorName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{msg:`pas de nom vide !`},
            notNull:{msg:`pas de nom null !`}
        }
    },
    path:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{msg:`pas de chemin vide !`},
            notNull:{msg:`pas de chemin null !`}
        }
    },
    duration:{
        type:DataTypes.STRING,
        allowNull:false
    },
    name:{
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
    tableName:'video'
})

export {Video};
