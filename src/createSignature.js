/**
 * Creates a signature from the private key
 * @param {*} privateKey
 * @param {*} message
 * @return {string}
 */
function createSignature(privateKey, message) {
  const {
    setPrivateKey,
    createSign,
  } = require('digital-signature');
  setPrivateKey(privateKey);
  return createSign(message);
}

module.exports = {
  createSignature,
};
