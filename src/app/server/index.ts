import {FastifyInstance} from 'fastify';
import config from '@app/config';

export default class Server {
  public appConfig;

  constructor(public app:FastifyInstance) {
    this.appConfig = config.app;
  }

  public start() {
    return new Promise<void>(async (res, rej)=>{
      try {
        if (['development', 'production'].includes(this.appConfig.env)) {
          await this.app.listen(this.appConfig.port);
          console.log(`🚀 Server ready at http://localhost:${this.appConfig.port}`);
        }
        res();
      } catch (err) {
        rej(err);
      }
    });
  }
}
