module.exports.resolver = {
  Mutation: {
    exampleMutation: (parent: any, args: any, context: any, info: any) => {
      console.log(args)
      return 'this is an example mutation'
    }
  },

  Query: {
    exampleQuery: (parent: any, args: any, context: any, info: any) => {
      return 'this is an example query'
    }
  }
}
