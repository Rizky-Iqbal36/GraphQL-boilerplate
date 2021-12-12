module.exports.resolver = {
  Query: {
    helloWorld: (parent: any, args: any, context: any, info: any) => {
      return "helloworld";
    },
  },
};
