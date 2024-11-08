import { workerData ,parentPort} from 'node:worker_threads';
import { transCodeVideo } from './helper';

Promise.all(workerData.resolution.map(async (resol:number)=>{
    try {
        return await transCodeVideo(workerData.videoPath , workerData.name,resol,workerData.bitrate)
    } catch (error) {
        console.log(error)
    }
})).then(()=>{
    parentPort?.postMessage('finish')
}).catch(error=>{
    parentPort?.postMessage(error)
})

