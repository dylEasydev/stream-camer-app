import { Video } from '../init';
import { unlink } from 'node:fs/promises';

Video.afterUpdate((instance)=>{
    return new Promise<void>(async(resolve, reject) => {
        try {
            const path_director = instance.previous().path;
            await unlink(path_director); 
            resolve();
        } catch (error) {
            reject(error);
        }
    })
})

Video.afterDestroy((instance)=>{
    return new Promise<void>(async(resolve, reject) => {
        try {
            await unlink(instance.path); 
            resolve();
        } catch (error) {
            reject(error);
        }
    })
})

export { Video }