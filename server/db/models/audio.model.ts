import { CreateOptions, InferAttributes } from 'sequelize';
import { AudioInterface } from '../interface';
import { Image } from '../../db';
import { Item } from './item.model';

export class Audio extends Item implements AudioInterface{
    createImage(
        value?: { urlPictures?: string; picturesName?: string; }, 
        options?: CreateOptions<InferAttributes<Image>>
    ){
        return new Promise<Image>(async (resolve, reject) => {
            try {
                const image = await Image.create({
                    foreignId:this.id,
                    nameTable:Audio.tableName,
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