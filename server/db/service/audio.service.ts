import { Literal } from 'sequelize/types/utils';
import { Audio , sequelizeConnect, sequelizeConnect2 , Image} from '../../db';
import { AudioServiceInterface } from './interface';
import { Op } from 'sequelize';
import { __urlImage } from '../../global_dir';


export const optionsSubrequestAudio : [Literal , string][] = [
    [
        sequelizeConnect.literal(`(
            SELECT COUNT(*) FROM "liked" WHERE
                "nameTable" = 'audio'AND
                "dataId" = "Audio"."id"
            LIMIT 1
        )`),`nbreLikes`
    ],
    [
        sequelizeConnect.literal(`(
            SELECT COUNT(*) FROM "comment" WHERE
                "nameTable" = 'audio'AND
                "dataId" = "Audio"."id"
            LIMIT 1
        )`),`nbreComments`
    ],
    [
        sequelizeConnect.literal(`(
            SELECT COUNT(*) FROM "view" WHERE
                "nameTable" = 'audio'AND
                "dataId" = "Audio"."id"
            LIMIT 1
        )`),`nbreViews`
    ]
];

class AudioService implements AudioServiceInterface{

    create<
        T extends 
        { title: string; duration: number; actorName: string; path: string; }
    >(value: T){
        return new Promise<Audio>(async(resolve, reject) => {
            try {
                const newAudio = await sequelizeConnect.transaction(async t=>{
                    return await Audio.create(value);
                })
                newAudio.miniature = await sequelizeConnect2.transaction(async t=>{
                    const miniature = await newAudio.createImage({
                        picturesName:`miniature-default.jpeg`,
                        urlPictures:`${__urlImage}/public/miniature-default.jpeg`
                    },{transaction:t});
                    return miniature.urlPictures;
                });
                resolve(newAudio);
            } catch (error) {
                reject(error);
            }
        })
    }

    delete(instance: Audio){
        return new Promise<void>(async (resolve, reject) => {
            try {
                await Audio.destroy({
                    where:{
                        id:instance.id
                    },
                    hooks:true
                })
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }

    update<
        T extends { 
            title?: string; duration?: number; actorName?: string; path?: string; 
        }
    >(instance: Audio, value: T){
        return new Promise<Audio>(async (resolve, reject) => {
            try {
                const audioUpdate = await sequelizeConnect.transaction(async t=>{
                    return await instance.update(value , {
                        hooks:value.path || value.duration ?true:false
                    });
                });
                resolve(audioUpdate);
            } catch (error) {
                reject(error);
            }
        })
    }

    findById(id: number){
        return new Promise<Audio|null>(async(resolve, reject) => {
            try {
                const dataFind = await sequelizeConnect.transaction(async t=>{
                    return await Audio.findByPk(id,{
                        attributes:{
                            include:optionsSubrequestAudio
                        }
                    });
                });
                if(dataFind !== null){
                    dataFind.miniature = await sequelizeConnect2.transaction(async t =>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:dataFind.id,
                                nameTable:Audio.tableName
                            },
                            transaction:t
                        });
                        return picture?.urlPictures;
                    });
                    resolve({...dataFind?.dataValues , miniature: dataFind?.miniature} as Audio);
                }else resolve(dataFind);
            } catch (error) {
                reject(error);
            }
        })
    }

    findByActorName(name: string, limit?: number, search?: string){
        return new Promise<{count:number , rows:Audio[]}>(async(resolve, reject) => {
            try {
                const tableData = await sequelizeConnect.transaction(async t=>{
                    return Audio.findAndCountAll({
                        where:{
                            [Op.and]:[
                                {
                                    actorName:name
                                },
                                {
                                    title:{
                                        [Op.like] : {
                                            [Op.any]:search?search.split('').map(chaine=>`%${chaine}%`):['']
                                        }
                                    }
                                }
                            ]
                        },
                        attributes:{
                            include:optionsSubrequestAudio
                        },
                        order:[
                            [`createdAt`,'DESC'],
                            [sequelizeConnect.literal(`"nbreLikes"`),'DESC'],
                            [sequelizeConnect.literal(`"nbreComments"`),'DESC'],
                            [sequelizeConnect.literal(`"nbreViews"`),'DESC'],
                        ],
                        limit
                    });
                });
                tableData.rows = await sequelizeConnect2.transaction(async t=>{
                    return await Promise.all(tableData.rows.map(async elts=>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:elts.id,
                                nameTable:Audio.tableName
                            },
                            transaction:t
                        });
                        elts.miniature = picture?.urlPictures;
                        return {...elts.dataValues, miniature: elts.miniature } as Audio;
                    }))
                })
                resolve(tableData);
            } catch (error) {
                reject(error);
            }
        })
    }

    findAll(limit?: number, search?: string){
        return new Promise<{count:number , rows:Audio[]}>(async(resolve, reject) => {
            try {
                const tableData = await sequelizeConnect.transaction(async t=>{
                    return Audio.findAndCountAll({
                        where:{
                            title:{
                                [Op.like] : {
                                    [Op.any]:search?search.split('').map(chaine=>`%${chaine}%`):['']
                                }
                            }
                        },
                        attributes:{
                            include:optionsSubrequestAudio
                        },
                        order:[
                            [`createdAt`,'DESC'],
                            [sequelizeConnect.literal(`"nbreLikes"`),'DESC'],
                            [sequelizeConnect.literal(`"nbreComments"`),'DESC'],
                            [sequelizeConnect.literal(`"nbreViews"`),'DESC'],
                        ],
                        limit
                    });
                });
                tableData.rows = await sequelizeConnect2.transaction(async t=>{
                    return await Promise.all(tableData.rows.map(async elts=>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:elts.id,
                                nameTable:Audio.tableName
                            },
                            transaction:t
                        });
                        elts.miniature = picture?.urlPictures;
                        return {...elts.dataValues, miniature: elts.miniature } as Audio;
                    }))
                })
                resolve(tableData);
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default new AudioService();