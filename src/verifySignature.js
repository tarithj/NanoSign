
/**
 * Verifies the message is created by the private key holder
 * @param {*} message The message
 * @param {string} digitalSignature The signature of the message
 * @param {*} publicKey
 * @return {boolean}
 */
function verifySignature(message, digitalSignature, publicKey) {
  const {
    verifySign,
    setPublicKey,
  } = require('digital-signature');
  setPublicKey(publicKey);
  return verifySign(message, digitalSignature);
}

module.exports = {
  verifySignature,
};
