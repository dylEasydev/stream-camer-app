import ffmpeg from 'fluent-ffmpeg';
import { __basedir } from '../global_dir';
import { extname } from 'node:path';

export const resolution = [
    {key:480 , size:'720:480' , cadence:500},
    {key:720 , size:'1280:720', cadence:1000},
    {key:1080 , size:'1920:1080', cadence:2000},
    {key:144 , size:'320:180', cadence:200},
    {key:360,size:'640:320' , cadence:300}
]

export function transCodeVideo( path :string,name:string, format:number,cadence?:number ){
    return new Promise<void>((resolve, reject) => {
        const ext = extname(path);
        const metaData = resolution.find(value=>value.key===format)
        ffmpeg(path)
            .output(`${__basedir}/ressources/video/${name}-${format}p${ext}`)
            .videoCodec('libx264')
            .audioCodec('aac')
            .videoBitrate(cadence? cadence:metaData?.cadence as number)
            .videoFilter(`scale=${metaData?.size}`)
            .outputOptions(['-preset','medium'])
            .on('error',err=>reject(err))
            .on('end',()=>resolve())
            .run()
        
    })
}

export function transCodeAudio( path :string,name:string, format:number ){
    return new Promise<void>((resolve, reject) => {
        const ext = extname(path);
        ffmpeg(path)
            .output(`${__basedir}/ressources/video/${name}-${format}${ext}`)
            .audioCodec('aac')
            .audioBitrate(format)
            .on('error',err=>reject(err))
            .on('end',()=>resolve())
            .run()
    })
}
