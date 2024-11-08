import { Dialect , Sequelize, Transaction } from 'sequelize';
import cls from 'cls-hooked';

const transacNamespace = cls.createNamespace('very_own_namespace');
Sequelize.useCLS(transacNamespace);

const dbName = process.env.DB_NAME as string ;
const dbUser = process.env.DB_USER as string ;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER as Dialect; 
const dbPassword = process.env.DB_PASSWORD;

const sequelizeConnect = new Sequelize(dbName,dbUser,dbPassword,{
    host:dbHost,
    dialect:dbDriver,
    logging: false,
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    define:{
        freezeTableName: true
    }
});

const dbName2 = process.env.DB_NAME_2 as string ;
const dbUser2 = process.env.DB_USER_2 as string ;
const dbHost2 = process.env.DB_HOST_2;
const dbDriver2 = process.env.DB_DRIVER_2 as Dialect; 
const dbPassword2 = process.env.DB_PASSWORD_2;

const sequelizeConnect2 = new Sequelize(dbName2,dbUser2,dbPassword2,{
    host:dbHost2,
    dialect:dbDriver2,
    logging: false,
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    define:{
        freezeTableName: true
    }
});

export { sequelizeConnect  , sequelizeConnect2  };