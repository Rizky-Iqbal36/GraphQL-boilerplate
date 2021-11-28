const util = require('util');
const { exec } = require("child_process");

const command = util.promisify(exec)

const fn = async () => {
  console.time("✅ Clearing dist");
  await command("rm -rf dist")
    .then(() => {
      console.timeEnd("✅ Clearing dist");
    })
    .catch(error => {
      console.log(`Error: ${error}`)
    });
  
  console.time("✅ Build");
  await command("npx tsc --project tsconfig.build.json")
    .then(() => {
      console.timeEnd("✅ Build");
    })
    .catch(error => {
      console.log(`Error: ${error}`)
    });
}

fn();