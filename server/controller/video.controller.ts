import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { videoService, histService } from '../db/service';
import { CodeStatut, statusResponse,UploadMulter,ExtensionError, resolution } from '../helper';
import { stat } from 'node:fs/promises';
import { extname ,join} from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import { Token } from '../db';
import util from 'node:util';
import { createReadStream,existsSync} from 'node:fs'
import {unlink } from 'node:fs/promises';
import {__basedir} from '../global_dir';
import { ValidationError } from 'sequelize';
import { Worker } from 'node:worker_threads';

export class VideoController extends BaseController{

    async createVideo(req:Request , res: Response ){
        try {
            const userToken = req.body.token as Token;

            const upload = new UploadMulter('video',102400).uploader();
            await upload(req, res);
            if(!req.file){
                return statusResponse.sendResponseJson(
                    CodeStatut.CLIENT_STATUS,
                    res,
                    `Aucune video fourni !`
                )
            }
            const ffprobe:(path:string)=>Promise<ffmpeg.FfprobeData> = util.promisify(ffmpeg.ffprobe);
            const metaData = await ffprobe(req.file.path);
            const value = {
                title:req.body.title,
                duration:metaData.format.duration?metaData.format.duration:0,
                path:req.file.path,
                name:req.file.filename,
                actorName:userToken.userName
            }; 

            const width = metaData.streams[0]?.width as number;
            const heigth = metaData.streams[0]?.height as number;
            const cadence = metaData.format.bit_rate

            const resolutionFilter = resolution.filter(resol=>{
                if(resol.key <= width && resol.key <= heigth)return resol;
            })
            
            const video = await videoService.create(value);
            const worker = new Worker(join(__basedir , '/server','/worker.js'),{
                workerData:{
                    path:'./worker.ts',
                    videoPath:video.path,
                    name:video.name,
                    bitrate : cadence,
                    resolution:resolutionFilter.map(resol=>resol.key)
                }
            })
            worker.emit('message',(result:string)=>{
                console.log(result);
            })
          
            return statusResponse.sendResponseJson(
                CodeStatut.CREATE_STATUS,
                res,
                `nouvel video upload`,
                video
            )

        } catch (error) {
            if(req.file){
                const path_director = join(req.file.path);
                unlink(path_director).catch(err=>{
                    return statusResponse.sendResponseJson(
                        CodeStatut.SERVER_STATUS,
                        res,
                        err.message,
                        err
                    )
                })
            }
                
            if(error instanceof ExtensionError){
                return statusResponse.sendResponseJson(
                    CodeStatut.CLIENT_STATUS,
                    res,
                    error.message,
                    error
                )
            }

            if(error instanceof ValidationError){
                return statusResponse.sendResponseJson(
                    CodeStatut.CLIENT_STATUS,
                    res,
                    error.message,
                    error
                )
            }
            
            return statusResponse.sendResponseJson(
                CodeStatut.SERVER_STATUS,
                res,
                `Erreur du serveur veillez réesayer plus tard !`,
                error
            )
        }
    }

    async findVideoById(req:Request , res:Response){
        if(req.params.id){
            try {
                const id = isNaN(parseInt(req.params.id ,10))?0:parseInt(req.params.id , 10);
                const videoFind = await videoService.findById(id);

                if(videoFind === null)
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucune vidéo d'identifiant ${req.params.id}`
                    )
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `video bien trouvée`,
                    videoFind
                )
            } catch (error) {
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `erreur au niveau du serveur`,
                    error
                )
            }
        }
    }

    async deletedVideo(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token;
                const id = isNaN(parseInt(req.params.id ,10))?0:parseInt(req.params.id , 10);
                const videoFind = await videoService.findById(id);

                if(videoFind === null)
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucune vidéo d'identifiant ${req.params.id}`
                    )
                if(videoFind.actorName !== userToken.userName){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `aucune permissions`
                    )
                }
                await videoService.delete(videoFind);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `video bien supprimer`,
                    videoFind
                )
            } catch (error) {
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `erreur au niveau du serveur`,
                    error
                )
            }
        }
    }

    async streamVideo(req:Request , res:Response){
        if(req.params.id){
            try {
                let readPath:string;
                const id = isNaN(parseInt(req.params.id ,10))?0:parseInt(req.params.id , 10);
                let quality = typeof req.query.quality === 'string'?req.query.quality :undefined;
        
                const videoFind = await videoService.findById(id);
                if(videoFind === null)
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucune vidéo d'identifiant ${req.params.id}`
                    )    
                if(quality){
                    if(Date.now() < videoFind.createdAt.getMilliseconds()+3600){
                        readPath = videoFind.path; 
                    }else{
                        const path_director= join(__basedir ,`/ressources/video`,`${videoFind.name}-${quality}${extname(videoFind.path)}`);
                        if(existsSync(path_director)){
                            readPath = path_director;
                        }else{
                            return statusResponse.sendResponseJson(
                                CodeStatut.CLIENT_STATUS,
                                res,
                                `qualité pour cette video non supporter`
                            )
                        }
                    }
                }else{
                    readPath = videoFind.path; 
                }
                const range = req.headers.range;
                if(!range){
                    res.type(extname(videoFind.path).substring(1))
                    createReadStream(readPath).pipe(res);
                }else{
                    const videostat = await stat(videoFind.path);
                    const parts = range.replace(/bytes=/,'').split('-');
                    const start = parseInt(parts[0] as string ,10);
                    const end = parts[1]? parseInt(parts[1] , 10 ): videostat.size -1;

                    res.type(extname(videoFind.path).substring(1))
                    res.writeHead(CodeStatut.STREAM_STATUS,{
                        'content-range':`bytes ${start}-${end}/${videostat.size}`,
                        'accept-ranges':`bytes`,
                        'content-length':end-start+1
                    });
                    createReadStream(readPath,{start,end}).pipe(res)
                } 
            } catch (error) {
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur , réessayer plus tard `,
                    error
                );
            }
        }
    }

    async findByActorName (req:Request , res:Response){
        if(req.params.name){
            try {
                const userToken = req.body.token as Token|undefined;
                const limit = typeof req.query.limit === 'string'?parseInt(req.query.limit , 10):undefined;

                if(req.query.search){
                    const search = typeof req.query.search === 'string' ? req.query.search : '';
                    if(search.length < 2)
                        return statusResponse.sendResponseJson(
                            CodeStatut.CLIENT_STATUS,
                            res,
                            `Besion de minimun 2 carractères pour la recherche !`
                        );
                    
                    const tablevideo = await videoService.findByActorName(req.params.name, limit , search);
                    if(userToken) await histService.createHist(userToken.userId , search);
                    return statusResponse.sendResponseJson(
                        CodeStatut.VALID_STATUS,
                        res,
                        `${tablevideo.count} videos trouvé pour la recherche ${search} !`,
                        tablevideo.rows
                    );
                }

                const tablevideo = await videoService.findByActorName(req.params.name, limit);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `${tablevideo.count} videos trouvé !`,
                    tablevideo.rows
                );
            } catch (error) {
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur , réessayer plus tard `,
                    error
                );
            }
        }
    }

    async findAll(req:Request , res:Response){
        try {
            const limit = typeof req.query.limit === 'string'?parseInt(req.query.limit , 10):undefined;
            const userToken = req.body.token as Token|undefined;

            if(req.query.search){
                const search = typeof req.query.search === 'string' ? req.query.search : '';
                if(search.length < 2)
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        `Besion de minimun 2 carractères pour la recherche !`
                    );
                
                const tablevideo = await videoService.findAll(limit , search);
                if(userToken) await histService.createHist(userToken.userId , search);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `${tablevideo.count} videos trouvé pour la recherche ${search} !`,
                    tablevideo.rows
                );
            }

            const tablevideo = await videoService.findAll(limit);
            return statusResponse.sendResponseJson(
                CodeStatut.VALID_STATUS,
                res,
                `${tablevideo.count} videos trouvé !`,
                tablevideo.rows
            );
        } catch (error) {
        	
            return statusResponse.sendResponseJson(
                CodeStatut.SERVER_STATUS,
                res,
                `Erreur au niveau du serveur , réessayer plus tard `,
                error
            );
        }
    }
}
