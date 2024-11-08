# Documentation de L'API stream-Camer

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/video/:name?limit=&search=``**

### objectif du end point:
renvoyer toutes les videos de l'auteur de nom **name** trier dans l'ordre 
des plus vues au moins vues.

### Methode de la requête : **GET**
### paramètre de la requête : **name**
### corps de la requête : **aucun**
### Query de la requête : **search: string**, **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const actorName = 'petit pays ';
const limit = 15;
const search = 'la vie'

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabVideoActor = axiosRequest.get(`/video/${actorName}?limit=${limit}&search=${search}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "title":"bla bla",
            "actorName":"petit pays",
            "duration":"",
            "path":"/home/data/petit-pays.mp4",
            "createdAt":"",
            "updatedAt":"",
            "deletedAt":"",
            "nbreLikes":1,
            "nbreViews":2,
            "nbreComment":1
        ]
    }

```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/video?limit=&search=``**

### Methode de la requête : **GET**
### objectif du end-point:
renvoyer toutes lees videos de la platform trier dans l'ordre des plus vue

### corps de la requête : **aucun**
### Query de la requête : **search: string**, **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const limit = 15;
const search = 'la vie'

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabVideo = axiosRequest.get(`/video?limit=${limit}&search=${search}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "title":"bla bla",
            "duration":"",
            "actorName":"petit pays",
            "path":"/home/data/petit-pays.mp4",
            "createdAt":"",
            "updatedAt":"",
            "deletedAt":"",
            "nbreLikes":1,
            "nbreViews":2,
            "nbreComment":1
        ]
    }

```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/video/:id?token=?&quality=``**

### Methode de la requête : **GET**
### objectif du end-point:
streamer la video identifiant **id**
### corps de la requête : **aucun**
### Query de la requête : **token: string** **quality string**
## exemple d'utilisation

```jsx
    function Video(){
        const token = `jeton obtenu lors de l'authentifiaction `;
        const id = 1;
        const quality = '4080p'
        const url = `https://localhost:3000/video/${id}`;
        return <video width= controls>
            <source src=`${url}?token=${token}&quality=${quality}` type="video/mp4"/>
        </video>
    }
```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/audio/:name?limit=&search=``**

### objectif du end point:
renvoyer toutes les audios de l'auteur de nom **name** trier par ordre des plus vues

### Methode de la requête : **GET**
### paramètre de la requête : **name**
### corps de la requête : **aucun**
### Query de la requête : **search: string**, **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const actorName = 'petit pays ';
const limit = 15;
const search = 'la vie'

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabAudioActor = axiosRequest.get(`/video/${actorName}?limit=${limit}&search=${search}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "title":"bla bla",
            "duration":""
            "actorName":"petit pays",
            "path":"/home/data/petit-pays.mp4",
            "createdAt":"",
            "updatedAt":"",
            "deletedAt":"",
            "nbreLikes":1,
            "nbreViews":2,
            "nbreComment":1
        ]
    }

```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/audio?limit=&search=``**

### Methode de la requête : **GET**
### objectif du end-point:
renvoyer toutes le audios de la platform trier par ordre des plus vues

### corps de la requête : **aucun**
### Query de la requête : **search: string**, **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const limit = 15;
const search = 'la vie'

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabAudio = axiosRequest.get(`/audio?limit=${limit}&search=${search}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "title":"bla bla",
            "duration":"",
            "actorName":"petit pays",
            "path":"/home/data/petit-pays.mp3",
            "createdAt":"",
            "updatedAt":"",
            "deletedAt":"",
            "nbreLikes":1,
            "nbreViews":2,
            "nbreComment":1
        ]
    }

```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/audio/:id?token=&quality=``**

### Methode de la requête : **GET**
### objectif du end-point:
streamer l'audio identifiant **id**
### corps de la requête : **aucun**
### Query de la requête : **token: string**  **quality string**
## exemple d'utilisation

```jsx
    function Audio(){
        const token = `jeton obtenu lors de l'authentifiaction `;
        const id = 1;
        const quality= '250k';
        const url = `https://localhost:3000/video/${id}`;
        return < audio>
            <source  src=`${url}?token=${token}&quality=${quality}` type="audio/mp3" />
        </audio>
    }
```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/like/audio?limit=&search=``**

### Methode de la requête : **GET**
### objectif du end-point:
renvoyer toutes les audios aimer par un utilisateur

### corps de la requête : **aucun**
### Query de la requête : **search: string**, **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const limit = 15;
const search = 'la vie'
const token = "jeton de l'utilisateur "

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Authorization:`Bearer ${jeton}`,
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabAudio = axiosRequest.get(`/like/audio?limit=${limit}&search=${search}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "title":"bla bla",
            "duration":"",
            "actorName":"petit pays",
            "path":"/home/data/petit-pays.mp3",
            "createdAt":"",
            "updatedAt":"",
            "deletedAt":"",
            "nbreLikes":1,
            "nbreViews":2,
            "nbreComment":1
        ]
    }

```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/like/video?limit=&search=``**

### Methode de la requête : **GET**
### objectif du end-point:
renvoyer toutes les video aimer par un utilisateur

### corps de la requête : **aucun**
### Query de la requête : **search: string**, **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const limit = 15;
const search = 'la vie'
const token = "jeton de l'utilisateur "

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Authorization:`Bearer ${jeton}`,
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabVideo = axiosRequest.get(`/like/video?limit=${limit}&search=${search}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "title":"bla bla",
            "duration":"",
            "actorName":"petit pays",
            "path":"/home/data/petit-pays.mp4",
            "createdAt":"",
            "updatedAt":"",
            "deletedAt":"",
            "nbreLikes":1,
            "nbreViews":2,
            "nbreComment":1
        ]
    }

```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/comment/audio?limit=&search=``**

### Methode de la requête : **GET**
### objectif du end-point:
renvoyer toutes les audios commenté par un utilisateur

### corps de la requête : **aucun**
### Query de la requête : **search: string**, **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const limit = 15;
const search = 'la vie'
const token = "jeton de l'utilisateur "

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Authorization:`Bearer ${jeton}`,
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabAudio = axiosRequest.get(`/comment/audio?limit=${limit}&search=${search}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "title":"bla bla",
            "duration":"",
            "actorName":"petit pays",
            "path":"/home/data/petit-pays.mp3",
            "createdAt":"",
            "updatedAt":"",
            "deletedAt":"",
            "nbreLikes":1,
            "nbreViews":2,
            "nbreComment":1
        ]
    }

```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/comment/video?limit=&search=``**

### Methode de la requête : **GET**
### objectif du end-point:
renvoyer toutes les video vue par un utilisateur

### corps de la requête : **aucun**
### Query de la requête : **search: string**, **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const limit = 15;
const search = 'la vie'
const token = "jeton de l'utilisateur "

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Authorization:`Bearer ${jeton}`,
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabVideo = axiosRequest.get(`/comment/video?limit=${limit}&search=${search}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "title":"bla bla",
            "duration":"",
            "actorName":"petit pays",
            "path":"/home/data/petit-pays.mp4",
            "createdAt":"",
            "updatedAt":"",
            "deletedAt":"",
            "nbreLikes":1,
            "nbreViews":2,
            "nbreComment":1
        ]
    }

```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/view/audio?limit=&search=``**

### Methode de la requête : **GET**
### objectif du end-point:
renvoyer toutes les audios vue par un utilisateur

### corps de la requête : **aucun**
### Query de la requête : **search: string**, **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const limit = 15;
const search = 'la vie'
const token = "jeton de l'utilisateur "

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Authorization:`Bearer ${jeton}`,
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabAudio = axiosRequest.get(`/view/audio?limit=${limit}&search=${search}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "title":"bla bla",
            "duration":"",
            "actorName":"petit pays",
            "path":"/home/data/petit-pays.mp3",
            "createdAt":"",
            "updatedAt":"",
            "deletedAt":"",
            "nbreLikes":1,
            "nbreViews":2,
            "nbreComment":1
        ]
    }

```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/view/video?limit=&search=``**

### Methode de la requête : **GET**
### objectif du end-point:
renvoyer toutes les video vue par un utilisateur

### corps de la requête : **aucun**
### Query de la requête : **search: string**, **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const limit = 15;
const search = 'la vie'
const token = "jeton de l'utilisateur "

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Authorization:`Bearer ${jeton}`,
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabVideo = axiosRequest.get(`/view/video?limit=${limit}&search=${search}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "title":"bla bla",
            "duration":"",
            "actorName":"petit pays",
            "path":"/home/data/petit-pays.mp4",
            "createdAt":"",
            "updatedAt":"",
            "deletedAt":"",
            "nbreLikes":1,
            "nbreViews":2,
            "nbreComment":1
        ]
    }

```

## end-point   url : **``https://127.0.0.1:${process.env.PORT}/hist?limit=``**

### Methode de la requête : **GET**
### objectif du end-point:
renvoyer historiques utilisateur

### corps de la requête : **aucun**
### Query de la requête : **limit: number**
### exemple d'utilisation
>[!IMPORTANT]
> c'est un exemple minimal fait avec **axios**
> un exemple global sera fournis en bas de page
```js
import axios from 'axios';

const limit = 15;
const token = "jeton de l'utilisateur ";

const axiosRequest = axios.create({
    baseURL:'https://localhost:3000/',
    timeout:3000,
    headers:{
        Authorization:`Bearer ${jeton}`,
        Connection:"keep-alive",
        Upgrade:"h2"
    }
});

const tabVideo = axiosRequest.get(`/hist/video?limit=${limit}`).then(res=>{return res.data});

```

### Format de la response

```json
    {
        "message":"un message du serveur",
        "data":[
            "id":1,
            "userId":2,
            "searcTerms":"yyhr",
            "createdAt":"",
            "updatedAt":""
        ]
    }

```
## exemple Génerale

```jsx

import { StreamServiceInterface } from './interface';
import { Audio , Video , Hist} from '../interface';
import axios,{ AxiosInstance } from 'axios';
import { RequestError } from './domain.service';

export class StreamService implements StreamServiceInterface{
    public axiosRequest: AxiosInstance;

    constructor(jeton?:string){
        this.axiosRequest = axios.create({
            baseURL:'http://localhost:3003/',
            timeout:3000,
            headers:{
                Authorization:`Bearer ${jeton}`,
                Connection:"keep-alive",
                Upgrade:"h2"
            }
        })
    }
    getVideoActor(name:string,limit?:number,search?:string){
        return new Promise<{message:string; data:Video[] ;}>(async(resolve, reject) => {
            try {
                const tabVideo = await this.axiosRequest.get<
                {message:string; data:any;}
                >(`/video/${name}?limit=${limit}&?search=${search}`,{
                    validateStatus:(status:number)=>{return status < 500}
                });
                if(tabVideo.status < 200 || tabVideo.status > 300){
                    reject(
                        new RequestError(
                            tabVideo.status,
                            tabVideo.data.data,
                            tabVideo.data.message
                        )
                    )
                }else resolve(tabVideo.data as {message:string,data:Video[]}); 
            } catch (error) {
               reject(error);
            }
        })
    }

     getVideo(limit?:number,search?:string){
        return new Promise<{message:string; data:Video[] ;}>(async(resolve, reject) => {
            try {
                const tabVideo = await this.axiosRequest.get<
                {message:string; data:any;}
                >(`/video?limit=${limit}&?search=${search}`,{
                    validateStatus:(status:number)=>{return status < 500}
                });
                if(tabVideo.status < 200 || tabVideo.status > 300){
                    reject(
                        new RequestError(
                            tabVideo.status,
                            tabVideo.data.data,
                            tabVideo.data.message
                        )
                    )
                }else resolve(tabVideo.data as {message:string,data:Video[]}); 
            } catch (error) {
               reject(error);
            }
        })
    }
    
     getAudioActor(name:string,limit?:number,search?:string){
        return new Promise<{message:string; data:Audio[] ;}>(async(resolve, reject) => {
            try {
                const tabAudio = await this.axiosRequest.get<
                {message:string; data:any;}
                >(`/audio/${name}?limit=${limit}&?search=${search}`,{
                    validateStatus:(status:number)=>{return status < 500}
                });
                if(tabAudio.status < 200 || tabAudio.status > 300){
                    reject(
                        new RequestError(
                            tabAudio.status,
                            tabAudio.data.data,
                            tabAudio.data.message
                        )
                    )
                }else resolve(tabAudio.data as {message:string,data:Audio[]}); 
            } catch (error) {
               reject(error);
            }
        })
    }
    getAudio(limit?:number,search?:string){
        return new Promise<{message:string; data:Video[] ;}>(async(resolve, reject) => {
            try {
                const tabAudio = await this.axiosRequest.get<
                {message:string; data:any;}
                >(`/audio?limit=${limit}&?search=${search}`,{
                    validateStatus:(status:number)=>{return status < 500}
                });
                if(tabAudio.status < 200 || tabAudio.status > 300){
                    reject(
                        new RequestError(
                            tabAudio.status,
                            tabAudio.data.data,
                            tabAudio.data.message
                        )
                    )
                }else resolve(tabAudio.data as {message:string,data:Audio[]}); 
            } catch (error) {
               reject(error);
            }
        })
    }
    getVideoViews(limit?:number,search?:string){
        return new Promise<{message:string; data:Video[] ;}>(async(resolve, reject) => {
            try {
                const tabVideo = await this.axiosRequest.get<
                {message:string; data:any;}
                >(`/like?limit=${limit}&?search=${search}`,{
                    validateStatus:(status:number)=>{return status < 500}
                });
                if(tabVideo.status < 200 || tabVideo.status > 300){
                    reject(
                        new RequestError(
                            tabVideo.status,
                            tabVideo.data.data,
                            tabVideo.data.message
                        )
                    )
                }else resolve(tabVideo.data as {message:string,data:Video[]}); 
            } catch (error) {
               reject(error);
            }
        })
    }
       // pareil pour les autre end-poin à appeler
}

```