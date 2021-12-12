import fs from 'fs'
import { resolve } from 'path'

import MiddlewareHandler from '@app/middlewares'

const typeDefs: string[] = []
const resolvers: any[] = []
const Mutation: string[] = []
const Query: string[] = []

const typeDefFiles = fs.readdirSync(__dirname + '/typeDefs')
const resolverFiles = fs.readdirSync(__dirname + '/resolvers')

typeDefFiles.forEach((file: string) => {
  const typeDef = require(resolve(__dirname, `./typeDefs/${file}`)).typeDef

  typeDefs.push(typeDef)
})

resolverFiles.forEach((file: string) => {
  if (file != 'index.js') {
    const resolver = require(resolve(__dirname, `./resolvers/${file}`)).resolver

    resolver?.Mutation ? Mutation.push(...Object.keys(resolver.Mutation)) : null
    resolver?.Query ? Query.push(...Object.keys(resolver.Query)) : null

    resolvers.push(resolver)
  }
})
MiddlewareHandler.registerResolverRoutes(Query, Mutation)

export { typeDefs, resolvers }
