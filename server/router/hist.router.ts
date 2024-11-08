import { HistController } from '../controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class CommentRouter extends BaseRouter<HistController>{
    public initRoute(): void {
        this.routerServeur.get('/',auth.secureMiddleware ,this.controllerService.findHist);
    }
}

export default new CommentRouter(new HistController()).routerServeur;