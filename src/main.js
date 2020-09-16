const fs = require('fs');
const {generateKeys, decryptKey} = require('./generateKey');
const {createSignature} = require('./createSignature');
const {verifySignature} = require('./verifySignature');
require('./splash');

const y = require('yargs')
    .command('generateKey [password] [location]', 'generates keys', (yargs) => {
      yargs
          .positional('password', {
            describe: 'password used to encrypt the private key',
            default: 'none',
          })
          .positional('location', {
            describe: 'location to save files',
            default: './',
          });
    }, (argv) => {
      saveKeys(argv.location, argv.password);
    })

// eslint-disable-next-line max-len
    .command('sign [password] [keyLocation] [fileLocation]', 'signs the file with the private key', (yargs) => {
      yargs
          .positional('password', {
            describe: 'password used to decrypt the private key',
            default: 'none',
          })
          .positional('keyLocation', {
            describe: 'private key location',
          })
          .positional('fileLocation', {
            describe: 'file location',
          });
    }, (argv) => {
      // eslint-disable-next-line max-len
      if (argv.fileLocation === undefined || argv.keyLocation === undefined || argv.password === undefined) {
        console.error('args are undefined');
      } else {
        signFile(argv.fileLocation, argv.keyLocation, argv.password);
      }
    })

// eslint-disable-next-line max-len
    .command('verify [publicKeyLocation] [fileLocation]', 'signs the file with the private key', (yargs) => {
      yargs
          .positional('publicKeyLocation', {
            describe: 'public key location',
          })
          .positional('fileLocation', {
            describe: 'file location',
          });
    }, (argv) => {
      // eslint-disable-next-line max-len
      if (argv.publicKeyLocation === undefined || argv.fileLocation === undefined) {
        console.error('args are undefined');
      } else {
        verifyFile(argv.fileLocation, argv.publicKeyLocation);
      }
    })

    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    })
    .argv;

// eslint-disable-next-line require-jsdoc
function verifyFile(fileLocation, publicKeyLocation) {
  fs.readFile(publicKeyLocation, function(error, data) {
    if (error !== null) {
      console.error(error);
      process.exit(200);
    } else {
      const publicKeyData = data.toString();

      fs.readFile(fileLocation, function(error, data) {
        if (error !== null) {
          console.error(error);
          process.exit(200);
        } else {
          const fileData = data;
          fs.readFile(fileLocation + '.nSignSig', function(error, data) {
            if (error !== null) {
              console.error(error);
              process.exit(200);
            } else {
              console.log(
                  verifySignature(
                      fileData,
                      data.toString(),
                      publicKeyData),
              );
            }
          });
        }
      });
    }
  });
}

// eslint-disable-next-line require-jsdoc
function signFile(fileLocation, privateKeyLocation, privateKeyPassword) {
  fs.readFile(fileLocation, function(error, data) {
    if (error !== null) {
      console.error(error);
      process.exit(200);
    } else {
      const fileData = data;
      fs.readFile(privateKeyLocation, function(error, data) {
        if (error !== null) {
          console.error(error);
          process.exit(200);
        } else {
          // eslint-disable-next-line max-len
          const keyData = decryptKey(keyData.toString('utf-8'), privateKeyPassword);
          const sigData = createSignature(keyData, fileData);
          saveFile(fileLocation + '.nSignSig', sigData, function(error) {
            if (error !== null) {
              console.error(error);
              process.exit(200);
            } else {
              console.log('Successfully created .nSignSig');
            }
          });
        }
      } );
    }
  });

  // eslint-disable-next-line no-unused-vars,require-jsdoc
  function saveFile(location, data, cb) {
    fs.writeFile(location, data, cb);
  }
}

// eslint-disable-next-line require-jsdoc
function saveKeys(location, password) {
  const {publicKey, encryptedPrivateKey} = generateKeys(password);
  const random = (Math.random()*1000).toFixed(0);
  location = location || process.cwd();
  fs.writeFile((location) + `/publicKey_${random}.nSign`,
      publicKey,
      function(error) {
        if (error !== null) {
          console.error(error);
          process.exit(200);
        } else {
          console.log('public key successfully save to ' + location);
        }
      });

  fs.writeFile((location || process.cwd()) + `/privateKey_${random}.nSignE`,
      encryptedPrivateKey,
      function(error) {
        if (error !== null) {
          console.error(error);
          process.exit(200);
        } else {
          console.log('private key successfully save to ' + location);
        }
      });
}


