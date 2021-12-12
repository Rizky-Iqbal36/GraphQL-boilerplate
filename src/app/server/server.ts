import { FastifyInstance } from 'fastify'

import config from '@app/config'
import { apolloConfig } from '@app/apollo/apolloConfig'
import { CustomApolloServer } from '@app/apollo'

export default class Server {
  public apolloServer: CustomApolloServer
  public appConfig

  constructor(public app: FastifyInstance) {
    this.apolloServer = new CustomApolloServer(apolloConfig(app))
    this.appConfig = config.app
  }

  public async start() {
    await this.apolloServer.start()
    this.app.register(this.apolloServer.createHandler({ disableHealthCheck: true }))

    if (['development', 'production'].includes(this.appConfig.env)) {
      await this.app.listen(this.appConfig.port)
      console.log(`🚀 Server ready at http://localhost:${this.appConfig.port}${this.apolloServer.graphqlPath}`)
    }
  }
}
