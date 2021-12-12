import fs from "fs";
import { resolve } from "path";

const typeDefs: string[] = [];
const resolvers: any[] = [];

const typeDefFiles = fs.readdirSync(__dirname + "/typeDefs");
const resolverFiles = fs.readdirSync(__dirname + "/resolvers");

typeDefFiles.forEach((file: string) => {
  const typeDef = require(resolve(__dirname, `./typeDefs/${file}`)).typeDef;

  typeDefs.push(typeDef);
});

resolverFiles.forEach((file: string) => {
  if (file != "index.js") {
    const resolver = require(resolve(
      __dirname,
      `./resolvers/${file}`
    )).resolver;

    resolvers.push(resolver);
  }
});

export { typeDefs, resolvers };
