import 'module-alias/register'
import fastify, { FastifyInstance } from 'fastify'
import moment from 'moment'
import 'moment-duration-format'

import Server from '@app/server/server'

export default class Container {
  private server: Server
  public app: FastifyInstance

  constructor() {
    this.server = new Server(fastify())
    this.app = this.server.app
  }

  public async load() {
    this.app.get('/health-check', async (req, rep) => {
      rep.send({
        status: 'OK',
        uptime: moment.duration(process.uptime(), 'seconds').format('h [hrs] : m [min] : s [sec]', { trim: false })
      })
    })
    await this.server.start()
  }
}
