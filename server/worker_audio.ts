import { workerData ,parentPort} from 'node:worker_threads';
import { transCodeAudio } from './helper';

Promise.all(workerData.resolution.map(async (resol:number)=>{
    try {
        return await transCodeAudio(workerData.videoPath , workerData.name,resol)
    } catch (error) {
        console.log(error)
    }
})).then(()=>{
    parentPort?.postMessage('finish')
}).catch(error=>{
    parentPort?.postMessage(error)
})

