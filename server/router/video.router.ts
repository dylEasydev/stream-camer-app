import { VideoController } from '../controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class VideoRouter extends BaseRouter<VideoController>{
    public initRoute(): void {
        this.routerServeur.post('/',auth.secureMiddleware,auth.verifPermToken('created:item'),this.controllerService.createVideo);
        this.routerServeur.delete('/:id',auth.secureMiddleware,auth.verifPermToken('deleted:item'),this.controllerService.deletedVideo);
        this.routerServeur.get('/name/:name',auth.verifTokenExist,this.controllerService.findByActorName);
        this.routerServeur.get('/',auth.verifTokenExist,this.controllerService.findAll);
        this.routerServeur.get('/:id',this.controllerService.findVideoById);
        this.routerServeur.get('/stream/:id',this.controllerService.streamVideo);
    }
}

export default new VideoRouter(new VideoController()).routerServeur;
