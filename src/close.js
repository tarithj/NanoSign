const code200 = 200;

/**
 * Exits the process with an error
 * @param {Error} error
 */
function close(error) {
  console.error(error);
  process.exit(code200);
}
module.exports = {
  close,
};
