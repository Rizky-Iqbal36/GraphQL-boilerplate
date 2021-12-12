/* eslint no-throw-literal: "off"*/
import { FastifyReply } from 'fastify'
import fs from 'fs'
import { resolve } from 'path'
import { IMiddleware } from 'graphql-middleware'
import {
  IResolverMiddlewareRoutes,
  IRegisterLocalMiddleware,
  IGlobalMiddleware,
  IRegisterGlobalMiddleware,
  IFastifyRequest,
  IMiddlewareRegister
} from '@root/interfaces'

/**
 * For better understanding about MiddlewareHandler please read the following references
 * @see https://www.npmjs.com/package/graphql-middleware
 * @see https://www.codeguru.com/csharp/understanding-onion-architecture/
 * @see https://github.com/dotansimha/graphql-yoga/issues/521
 * @see https://github.com/maticzav/graphql-middleware/issues/162
 * @see https://www.graphql-modules.com/docs/legacy/introduction/context/
 */

class MiddlewareHandler {
  private resolverRoutes: IResolverMiddlewareRoutes = {
    Mutation: {},
    Query: {}
  }
  private localResolverRoute = { Mutation: {}, Query: {} }
  private globalMiddlewares: IRegisterGlobalMiddleware = {}
  private localMiddlewares: IMiddleware[] = []

  private checkResolverRoutes(key: string) {
    Object.keys(this.resolverRoutes).forEach(field => {
      if ((this.resolverRoutes as any)[field].hasOwnProperty(key)) {
        throw new Error(`${key} already declared, please use another method name`)
      }
    })
  }

  public registerResolverRoutes(Query?: string[], Mutation?: string[]) {
    Query?.forEach(value => {
      this.checkResolverRoutes(value)
      this.resolverRoutes.Query[value] = function () {}
    })
    Mutation?.forEach(value => {
      this.checkResolverRoutes(value)
      this.resolverRoutes.Mutation[value] = function () {}
    })
  }

  private includeResolver(resolver: string[], middleWareFunc: IMiddleware) {
    if (!resolver || resolver.length === 0) {
      ;(this.localResolverRoute as any) = {
        Mutation: middleWareFunc,
        Query: middleWareFunc
      }
    } else {
      resolver.forEach(key => {
        let found = false
        try {
          Object.keys(this.resolverRoutes).forEach(field => {
            if ((this.resolverRoutes as any)[field].hasOwnProperty(key)) {
              ;(this.localResolverRoute as any)[field][key] = middleWareFunc
              throw true
            }
          })
        } catch (result) {
          found = result as boolean
        }
        if (!found) {
          throw new Error(`${key} not registered on resolverRoutes`)
        }
      })
    }

    return this.localResolverRoute
  }

  private excludeResolver(resolver: string[], middleWareFunc: IMiddleware) {
    const mergedResolverRoutes = {
      ...this.resolverRoutes.Mutation,
      ...this.resolverRoutes.Query
    }

    resolver.forEach(key => {
      if (!Object.keys(mergedResolverRoutes).includes(key)) {
        throw new Error(`${key} not registered on resolverRoutes`)
      }
    })

    Object.keys(this.resolverRoutes).forEach(field => {
      Object.keys((this.resolverRoutes as any)[field]).forEach(key => {
        ;(this.localResolverRoute as any)[field][key] = (this.resolverRoutes as any)[field][key]
        if (!resolver.includes(key)) {
          ;(this.localResolverRoute as any)[field][key] = middleWareFunc
        } else {
          delete (this.localResolverRoute as any)[field][key]
        }
      })
    })
    return this.localResolverRoute
  }

  public registerLocalMiddleware({ exclude = false, middleWareFunc, resolver }: IRegisterLocalMiddleware) {
    this.localResolverRoute = { Mutation: {}, Query: {} }
    this.localResolverRoute = exclude
      ? this.excludeResolver(resolver, middleWareFunc)
      : this.includeResolver(resolver, middleWareFunc)

    this.localMiddlewares.push(this.localResolverRoute)
  }

  public registerGlobalMiddleware(middlewareFunction: IGlobalMiddleware) {
    this.globalMiddlewares[middlewareFunction.constructor.name] = middlewareFunction
  }

  public registerMiddleware() {
    fs.readdirSync(__dirname).forEach(file => {
      if (file !== 'index.js') {
        const { localMiddleware, globalMiddleware }: IMiddlewareRegister = require(resolve(__dirname, `./${file}`))

        if (localMiddleware) {
          this.registerLocalMiddleware(localMiddleware)
        } else if (globalMiddleware) {
          if (!globalMiddleware.useMiddleware) {
            throw new Error('Please add useMiddleware function in order to activate middleware')
          }
          this.registerGlobalMiddleware(globalMiddleware)
        }
      }
    })
  }

  public getMiddlewares() {
    return this.localMiddlewares
  }

  async context(request: IFastifyRequest, reply: FastifyReply) {
    let contextPayload = {}
    await Promise.all(Object.values(this.globalMiddlewares)).then(async keys => {
      await Promise.all(
        keys.map(async middleware => {
          contextPayload = {
            ...contextPayload,
            ...(await middleware.useMiddleware(request, reply))
          }
        })
      )
    })
    return { req: request, rep: reply, ...contextPayload }
  }
}

export default new MiddlewareHandler()
