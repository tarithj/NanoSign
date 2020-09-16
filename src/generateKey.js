const keyPair = require('keypair');
const Cryptr = require('cryptr');

/**
 * Generates 2048 bit key pair and encrypts the with the password
 * @param {string} password
 * @return {Object}
 */
function generateKeys(password) {
  const keys = keyPair({
    bits: 2048,
  });
  const publicKey = keys.public;
  const privateKey = encryptKey(password, keys.private);
  return {
    publicKey: publicKey,
    encryptedPrivateKey: privateKey,
  };
}

/**
 * Encrypts the private key with the password
 * @param {string} password
 * @param {string} privateKey
 * @return {PromiseLike<ArrayBuffer>}
 */
function encryptKey(password, privateKey) {
  const cryptr = new Cryptr(password);
  return cryptr.encrypt(privateKey);
}

/**
 * Decrypts the key with the password
 * @param {string} key
 * @param {string} password
 * @return {PromiseLike<ArrayBuffer>}
 */
function decryptKey(key, password) {
  const cryptr = new Cryptr(password);
  return cryptr.decrypt(key);
}
module.exports = {
  generateKeys,
  decryptKey,
};
