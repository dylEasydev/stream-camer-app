import { VideoInterface } from '../interface';
import { CreateOptions, InferAttributes } from 'sequelize';
import { Item } from './item.model';
import { Image } from '../../db';

export class Video extends Item implements VideoInterface{
    createImage(
        value?: { urlPictures?: string; picturesName?: string; }, 
        options?: CreateOptions<InferAttributes<Image>>
    ){
        return new Promise<Image>(async (resolve, reject) => {
            try {
                const image = await Image.create({
                    foreignId:this.id,
                    nameTable:Video.tableName,
                    urlPictures:value?.urlPictures,
                    picturesName:value?.picturesName
                },options);
                resolve(image);
            } catch (error) {
                reject(error);
            }
        })
    }
}