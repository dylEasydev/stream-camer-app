import { AudioController } from '../controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class AudioRouter extends BaseRouter<AudioController>{
    public initRoute(): void {
        this.routerServeur.post('/',auth.secureMiddleware,auth.verifPermToken('created:item'),this.controllerService.createAudio);
        this.routerServeur.delete('/:id',auth.secureMiddleware,auth.verifPermToken('deleted:item'),this.controllerService.deletedAudio);
        this.routerServeur.get('/name/:name',auth.verifTokenExist,this.controllerService.findByActorName);
        this.routerServeur.get('/',auth.verifTokenExist,this.controllerService.findAll);
        this.routerServeur.get('/:id',this.controllerService.findAudioById);
        this.routerServeur.get('/stream/:id',auth.secureMiddleware,auth.verifPermToken('read:item'),this.controllerService.streamAudio);
    }
}

export default new AudioRouter(new AudioController()).routerServeur;