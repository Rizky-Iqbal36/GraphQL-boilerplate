const TscWatchClient = require('tsc-watch/client');
const watch = new TscWatchClient();
const util = require('util');
const { exec } = require("child_process");

const fn = async() => {
  const command = util.promisify(exec)
  console.time("✅ Clearing dist");
  await command("rm -rf dist")
    .then(() => {
      console.timeEnd("✅ Clearing dist");
    })
    .catch(error => {
      console.log(`Error: ${error}`)
    });
  
  watch.on('started', () => {
    console.log('Compilation started');
  });

  watch.start(
    '--noClear',
    '--onSuccess', `node ./dist/app/server/`,
    '--project', 'tsconfig.build.json',
  );
}

fn();