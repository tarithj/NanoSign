const code200 = 200;
const prompt = require('prompts');

/**
 * Exits the process with an error
 * @param {Error} error
 */
function close(error) {
  console.error(error);
  wait(code200)
}

function wait(code = 0) {
  (async ()=>{
    await prompt({
      type: 'text',
      name: 'text',
      message: 'Type anything to exit',
    });
    process.exit(0);
  })();
}

module.exports = {
  close,
  wait,
};
