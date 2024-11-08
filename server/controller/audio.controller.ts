import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { audioService, histService } from '../db/service';
import { CodeStatut, statusResponse, UploadMulter,ExtensionError } from '../helper';
import { stat } from 'node:fs/promises';
import { existsSync,createReadStream } from 'node:fs';
import { extname,join } from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import { Token } from '../db';
import {unlink} from 'node:fs/promises';
import { __basedir } from '../global_dir';
import util from 'node:util';
import { ValidationError } from 'sequelize';
import { Worker } from 'node:worker_threads'


const formatValid = [ 32, 64, 128, 192, 256 ];

export class AudioController extends BaseController{

    async createAudio(req:Request , res: Response ){
        try {
            const userToken = req.body.token as Token;
            const upload = new UploadMulter('audio',2048).uploader();
            await upload(req, res);
            if(!req.file){
                return statusResponse.sendResponseJson(
                    CodeStatut.CLIENT_STATUS,
                    res,
                    `Aucune audio fourni !`
                )
            }
            const ffprobe:(path:string)=>Promise<ffmpeg.FfprobeData> = util.promisify(ffmpeg.ffprobe);
            const metaData = await ffprobe(req.file.path);
            const value = {
                title:req.body.title,
                duration:metaData.format.duration?metaData.format.duration:0,
                path:req.file.path,
                actorName:userToken.userName
            };
            const cadence = metaData.format.bit_rate ;     
            const audio = await audioService.create(value);

            const worker = new Worker(join(__basedir , '/server','/worker.js'),{
                workerData:{
                    path:'./worker_audio.ts',
                    videoPath:audio.path,
                    name:audio.name,
                    resolution:cadence ?formatValid.map(f=>{
                        if(f <= cadence) return f;
                    }):formatValid
                }
            })

            worker.emit('message',(result:string)=>{
                console.log(result);
            })

            return statusResponse.sendResponseJson(
                CodeStatut.CREATE_STATUS,
                res,
                `nouvel Audio upload`,
                audio
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

    async findAudioById(req:Request , res:Response){
        if(req.params.id){
            try {
                const id = isNaN(parseInt(req.params.id ,10))?0:parseInt(req.params.id , 10);
                const audioFind = await audioService.findById(id);

                if(audioFind === null)
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucune vidéo d'identifiant ${req.params.id}`
                    )
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `audio bien trouvée`,
                    audioFind
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

    async deletedAudio(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token;
                const id = isNaN(parseInt(req.params.id ,10))?0:parseInt(req.params.id , 10);
                const audioFind = await audioService.findById(id);

                if(audioFind === null)
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucune vidéo d'identifiant ${req.params.id}`
                    )
                if(audioFind.actorName !== userToken.userName){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `aucune permissions`
                    )
                }
                await audioService.delete(audioFind);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `audio bien supprimer`,
                    audioFind
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

    async streamAudio(req:Request , res:Response){
        if(req.params.id){
            try {
                let readPath:string;
                const id = isNaN(parseInt(req.params.id ,10))?0:parseInt(req.params.id , 10);
                let quality = typeof req.query.quality === 'string'?req.query.quality :undefined;
        
                const audioFind = await audioService.findById(id);

                if(audioFind === null)
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucune vidéo d'identifiant ${req.params.id}`
                    )
                if(quality){
                    if(Date.now() < audioFind.createdAt.getMilliseconds()+3600){
                        readPath = audioFind.path; 
                    }else{
                        const path_director= join(__basedir ,`/ressources/video`,`${audioFind.name}-${quality}${extname(audioFind.path)}`);
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
                    readPath = audioFind.path; 
                }
                const range = req.headers.range;
                if(!range){
                    res.type(extname(audioFind.path).substring(1))
                    createReadStream(readPath).pipe(res);
                }else{
                    const audioStat = await stat(audioFind.path);
                    const parts = range.replace(/bytes=/,'').split('-');
                    const start = parseInt(parts[0] as string ,10);
                    const end = parts[1]? parseInt(parts[1] , 10 ): audioStat.size -1;

                    res.type(extname(audioFind.path).substring(1));
                    
                    res.writeHead(CodeStatut.STREAM_STATUS,{
                        'content-range':`bytes ${start}-${end}/${audioStat.size}`,
                        'accept-ranges':`bytes`,
                        'content-length':end-start+1
                    });
                    createReadStream(readPath,{start,end}).pipe(res);
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
                    
                    const tableAudio = await audioService.findByActorName(req.params.name, limit , search);
                    if(userToken) await histService.createHist(userToken.userId , search); 
                    return statusResponse.sendResponseJson(
                        CodeStatut.VALID_STATUS,
                        res,
                        `${tableAudio.count} Audios trouvé pour la recherche ${search} !`,
                        tableAudio.rows
                    );
                }

                const tableAudio = await audioService.findByActorName(req.params.name, limit);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `${tableAudio.count} Audios trouvé !`,
                    tableAudio.rows
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
                
                const tableAudio = await audioService.findAll(limit , search);
                if(userToken) await histService.createHist(userToken.userId , search);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `${tableAudio.count} Audios trouvé pour la recherche ${search} !`,
                    tableAudio.rows
                );
            }

            const tableAudio = await audioService.findAll(limit);
            return statusResponse.sendResponseJson(
                CodeStatut.VALID_STATUS,
                res,
                `${tableAudio.count} Audios trouvé !`,
                tableAudio.rows
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