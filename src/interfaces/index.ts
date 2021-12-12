import { IMiddleware } from 'graphql-middleware'
import { FastifyRequest, FastifyReply } from 'fastify'

export interface GraphQLContext {
  req?: IFastifyRequest
  rep?: FastifyReply
  [key: string]: any
}

export interface ILocalizeMessage {
  key: string
  vars?: object
}
// Interface for middleware handler

export interface IBaseResolverMiddlewareRoute {
  [key: string]: IMiddleware | Function
}

export interface IResolverMiddlewareRoutes {
  Query: IBaseResolverMiddlewareRoute
  Mutation: IBaseResolverMiddlewareRoute
}

export interface IRegisterLocalMiddleware {
  middleWareFunc: IMiddleware
  resolver: string[]
  exclude?: boolean
}

export interface IGlobalMiddleware {
  useMiddleware: (request: IFastifyRequest, reply?: FastifyReply) => any
}

export interface IMiddlewareRegister {
  localMiddleware: IRegisterLocalMiddleware
  globalMiddleware: IGlobalMiddleware
}

export interface IFastifyRequest extends FastifyRequest {
  headers: FastifyRequest['headers'] | { [key: string]: any }
}

export interface IRegisterGlobalMiddleware {
  [key: string]: IGlobalMiddleware
}
