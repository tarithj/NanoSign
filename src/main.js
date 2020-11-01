const fs = require('fs');

const {generateKeys, decryptKey} = require('./generateKey');
const {createSignature} = require('./createSignature');
const {verifySignature} = require('./verifySignature');
const {close, wait} = require('./close');
const {selectACommand, inputParameters} = require('./promptables');
require('./splash');

// START YARGS
const yar = require('yargs')
    .command('generateKey [password] [name] [location]', 'generates keys',
        (yargs) => {
          yargs
              .positional('password', {
                describe: 'password used to encrypt the private key',
                default: 'none',
              })
              .positional('location', {
                describe: 'location to save files',
                default: './',
                optional: true,
              })
              .positional('name', {
                describe: 'Your name',
                optional: true,
                default: 'Anonymous',
              });
        }, (argv) => {
          saveKeys(argv.location, argv.password, argv.name);
        })

    .command('sign [password] [keyLocation] [fileLocation]',
        'signs the file with the private key',
        (yargs) => {
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
          if (argv.fileLocation === undefined ||
           argv.keyLocation === undefined ||
           argv.password === undefined) {
            console.error('args are undefined');
          } else {
            signFile(argv.fileLocation, argv.keyLocation, argv.password);
          }
        })

    .command('verify [publicKeyLocation] [fileLocation]',
        'signs the file with the private key',
        (yargs) => {
          yargs
              .positional('publicKeyLocation', {
                describe: 'public key location',
              })
              .positional('fileLocation', {
                describe: 'file location',
              });
        }, (argv) => {
          if (argv.publicKeyLocation === undefined ||
           argv.fileLocation === undefined) {
            console.error('args are undefined');
          } else {
            verifyFile(argv.fileLocation, argv.publicKeyLocation);
          }
        })
    .command('*', 'the default command',
        function() {

        }, function() {
          (async ()=>{
            await defaultCommand();
          })();
        })

    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    })
    .argv;

// END YARGS


/**
 *
 * @param {string} fileLocation
 * @param {string} publicKeyLocation
 */
function verifyFile(fileLocation, publicKeyLocation) {
  fs.readFile(publicKeyLocation, function(errorP, dataP) {
    if (errorP !== null) {
      close(errorP);
    } else {
      const publicKeyData = JSON.parse(dataP.toString());

      fs.readFile(fileLocation, function(errorF, dataF) {
        if (errorF !== null) {
          close(errorF);
        } else {
          const fileData = dataF;
          console.log(`Verifying if ${fileLocation} is signed by `+
          `${publicKeyData.name}`);
          fs.readFile(fileLocation + '.nSignSig', function(errorSig, dataSig) {
            if (errorSig !== null) {
              close(errorSig);
            } else {
              const verified =verifySignature(fileData,
                  dataSig.toString(),
                  publicKeyData.publicKey);
              if (verified) {
                console.log(`${fileLocation} is signed by ` +
                `${publicKeyData.name}`);
              } else {
                console.log(`${fileLocation} is not signed by `+
                `${publicKeyData.name}`);
              }
              wait();
            }
          });
        }
      });
    }
  });
}


/**
 *
 * @param {string} fileLocation
 * @param {string} privateKeyLocation
 * @param {string} privateKeyPassword
 */
function signFile(fileLocation, privateKeyLocation, privateKeyPassword) {
  fs.readFile(fileLocation, function(errorF, data) {
    if (errorF !== null) {
      close(errorF);
    } else {
      const fileData = data;
      fs.readFile(privateKeyLocation, function(keyError, keyData) {
        if (keyError !== null) {
          close(keyError);
        } else {
          // eslint-disable-next-line max-len
          keyData = decryptKey(keyData.toString('utf-8'), privateKeyPassword);
          const sigData = createSignature(keyData, fileData);
          saveFile(fileLocation + '.nSignSig', sigData, function(error) {
            if (error !== null) {
              close(error);
            } else {
              console.log('Successfully created .nSignSig');
              wait();
            }
          });
        }
      } );
    }
  });

  /**
   *
   * @param {string | Buffer | URL | number} location
   * @param {string |
   * Uint8Array |
   * Uint8ClampedArray |
   * Uint16Array |
   * Uint32Array |
   * Int8Array |
   * Int16Array} data
   * @param {function} cb
   */
  function saveFile(location, data, cb) {
    fs.writeFile(location, data, cb);
  }
}

/**
 * Generates and saves keys
 * @param {string} location
 * @param {string} password
 * @param {string} name
 */
function saveKeys(location, password, name) {
  location = location || process.cwd();
  const {publicKey, encryptedPrivateKey} = generateKeys(password,
      {convertToSavable: true, name: name});

  // Random 4 digit number to be used in file names
  const random = (Math.random()*1000).toFixed(0);


  // Writes public key to disk
  fs.writeFile((location) + `/publicKey_${random}.nSign`,
      publicKey,
      function(error) {
        if (error !== null) {
          close(error);
        } else {
          console.log('public key successfully save to ' +
           location +
           `publicKey_${random}.nSign`);
        }
      });

  // Writes encrypted private key to disk
  fs.writeFile((location || process.cwd()) + `/privateKey_${random}.nSignE`,
      encryptedPrivateKey.toString(),
      null,
      function(error) {
        if (error !== null) {
          close(error);
        } else {
          console.log('private key successfully save to ' +
           location +
           `privateKey_${random}.nSignE`);
        }
      });
  wait();
}

/**
 * Runs when no command is specified
 */
async function defaultCommand() {
  const selectACommandResponse = await selectACommand();
  if (selectACommandResponse === 'generateKey') {
    const {location, password, name} = await inputParameters('generateKey');
    saveKeys('./'+ location, password, name);
  } else if (selectACommandResponse === 'sign') {
    const {password, fileLocation, keyLocation} = await inputParameters('sign');
    signFile( './'+ fileLocation, './' + keyLocation, password);
  } else if (selectACommandResponse === 'verify') {
    const {fileLocation, publicKeyLocation} = await inputParameters('verify');
    verifyFile(fileLocation, publicKeyLocation);
  }
}
global.yarg = yar;
