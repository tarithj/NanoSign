
/**
 * Verifies the message is created by the private key holder
 * @param {string} message The message
 * @param {string} digitalSignature The signature of the message
 * @param {string} publicKey
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
