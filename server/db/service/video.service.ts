import { Literal } from 'sequelize/types/utils';
import { Video , sequelizeConnect, sequelizeConnect2 , Image} from '../../db';
import { VideoServiceInterface } from './interface';
import { Op } from 'sequelize';
import { __urlImage } from '../../global_dir';

export const optionsSubrequestVideo : [Literal , string][] = [
    [
        sequelizeConnect.literal(`(
            SELECT COUNT(*) FROM "liked" WHERE
                "nameTable" = 'video'AND
                "dataId" = "Video"."id"
        )`),`nbreLikes`
    ],
    [
        sequelizeConnect.literal(`(
            SELECT COUNT(*) FROM "comment" WHERE
                "nameTable" = 'video'AND
                "dataId" = "Video"."id"
        )`),`nbreComments`
    ],
    [
        sequelizeConnect.literal(`(
            SELECT COUNT(*) FROM "view" WHERE
                "nameTable" = 'video'AND
                "dataId" = "Video"."id"
        )`),`nbreViews`
    ]
];

class VideoService implements VideoServiceInterface{

    create<
        T extends 
        { title: string; duration: number; actorName: string; path: string; name:string;}
    >(value: T){
        return new Promise<Video>(async(resolve, reject) => {
            try {
                const newVideo = await sequelizeConnect.transaction(async t=>{
                    return await Video.create(value);
                })
                newVideo.miniature = await sequelizeConnect2.transaction(async t=>{
                    const miniature = await newVideo.createImage({
                        picturesName:`miniature-default.jpeg`,
                        urlPictures:`${__urlImage}/public/miniature-default.jpeg`
                    },{transaction:t});
                    return miniature.urlPictures;
                });
                resolve(newVideo);
            } catch (error) {
                reject(error);
            }
        })
    }

    delete(instance: Video){
        return new Promise<void>(async (resolve, reject) => {
            try {
                await Video.destroy({
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
            title?: string; duration?: number; actorName?: string; path?: string; name?:string;
        }
    >(instance: Video, value: T){
        return new Promise<Video>(async (resolve, reject) => {
            try {
                const VideoUpdate = await sequelizeConnect.transaction(async t=>{
                    return await instance.update(value , {
                        hooks:value.path || value.duration ?true:false
                    });
                });
                resolve(VideoUpdate);
            } catch (error) {
                reject(error);
            }
        })
    }

    findById(id: number){
        return new Promise<Video|null>(async(resolve, reject) => {
            try {
                const dataFind = await sequelizeConnect.transaction(async t=>{
                    return await Video.findByPk(id,{
                        attributes:{
                            include:optionsSubrequestVideo
                        }
                    });
                });
                if(dataFind !== null){
                    dataFind.miniature = await sequelizeConnect2.transaction(async t =>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:dataFind.id,
                                nameTable:Video.tableName
                            },
                            transaction:t
                        });
                        return picture?.urlPictures;
                    });
                    resolve({...dataFind?.dataValues , miniature: dataFind?.miniature} as Video);
                }else resolve(dataFind);
            } catch (error) {
                reject(error);
            }
        })
    }

    findByActorName(name: string, limit?: number, search?: string){
        return new Promise<{count:number , rows:Video[]}>(async(resolve, reject) => {
            try {
                const tableData = await sequelizeConnect.transaction(async t=>{
                    return Video.findAndCountAll({
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
                            include:optionsSubrequestVideo
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
                                nameTable:Video.tableName
                            },
                            transaction:t
                        });
                        elts.miniature = picture?.urlPictures;
                        return {...elts.dataValues, miniature: elts.miniature } as Video;
                    }))
                })
                resolve(tableData);
            } catch (error) {
                reject(error);
            }
        })
    }

    findAll(limit?: number, search?: string){
        return new Promise<{count:number , rows:Video[]}>(async(resolve, reject) => {
            try {
                const tableData = await sequelizeConnect.transaction(async t=>{
                    return Video.findAndCountAll({
                        where:{
                            title:{
                                [Op.like] : {
                                    [Op.any]:search?search.split('').map(chaine=>`%${chaine}%`):['']
                                }
                            }
                        },
                        attributes:{
                            include:optionsSubrequestVideo
                        },
                        limit,
                        order:[
                            [`createdAt`,'DESC'],
                            [sequelizeConnect.literal(`"nbreLikes"`),'DESC'],
                            [sequelizeConnect.literal(`"nbreComments"`),'DESC'],
                            [sequelizeConnect.literal(`"nbreViews"`),'DESC'],
                        ]
                    });
                });
                tableData.rows = await sequelizeConnect2.transaction(async t=>{
                    return await Promise.all(tableData.rows.map(async elts=>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:elts.id,
                                nameTable:Video.tableName
                            },
                            transaction:t
                        });
                        elts.miniature = picture?.urlPictures;
                        return {...elts.dataValues, miniature: elts.miniature } as Video;
                    }))
                })
                resolve(tableData);
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default new VideoService();
