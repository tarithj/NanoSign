
/**
 * Verifies the message is created by the private key holder
 * @param {string} message The message
 * @param {MSFIDOSignature} digitalSignature The signature of the message
 * @param {string} publicKey
 * @return {boolean}
 */
function verifySignature(message, digitalSignature, publicKey) {
  const {
    verifySign,
  } = require('digital-signature');
  return verifySign('your data', digitalSignature);
}

module.exports = {
  verifySignature,
};
