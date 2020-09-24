const prompts = require('prompts');

const commands = [
  {title: 'generateKey', value: 'generateKey'},
  {title: 'sign', value: 'sign'},
  {title: 'verify', value: 'verify'},
];

/**
 * Lets the user select a command
 * @return {Promise<any>}
 */
async function selectACommand() {
  const response = await prompts({
    type: 'select',
    name: 'command',
    message: 'Select a command',
    choices: commands,
  });
  return response.command;
}

/**
 * Gets input form the user according to the command
 * @param {string} command
 * @return {Promise<{password: any, name: *, location: *}> |
 * Promise<{password: any, keyLocation: *, fileLocation: *}> |
 * Promise<{publicKeyLocation: *, fileLocation: *}> }
 */
async function inputParameters(command) {
  if (command === 'generateKey') {
    const generateKeyQuestions = [
      {
        type: 'password',
        name: 'password',
        message: 'Type a password to be used while ' +
         'encrypting the private key',
      },
      {
        type: 'text',
        name: 'name',
        message: 'Type the name you want your public ' +
         'key to display (example: bob)',
      },
      {
        type: 'text',
        name: 'location',
        message: 'Type a location to save the key-pair (default: ./)',
        default: './',
      },
    ];
    const response = await prompts(generateKeyQuestions);
    return {
      password: response.password,
      name: response.name,
      location: response.location,
    };
  } else if (command === 'sign') {
    const signQuestions = [
      {
        type: 'password',
        name: 'password',
        message: 'Type a password to be used while ' +
         'decrypting the private key',
      },
      {
        type: 'text',
        name: 'keyLocation',
        message: 'Type the location of your private key',
      },
      {
        type: 'text',
        name: 'fileLocation',
        message: 'Type the location of the file you want to sign',
      },
    ];
    const response = await prompts(signQuestions);
    return {
      password: response.password,
      keyLocation: response.keyLocation,
      fileLocation: response.fileLocation,
    };
  } else if (command === 'verify') {
    const verifyQuestions = [
      {
        type: 'text',
        name: 'publicKeyLocation',
        message: 'Type the location of the public key',
      },
      {
        type: 'text',
        name: 'fileLocation',
        message: 'Type the location of the file you want to verify ' +
         '(NOTE: the .nSingSig file must have the same name as the file)',
      },
    ];
    const response = await prompts(verifyQuestions);
    return {
      publicKeyLocation: response.publicKeyLocation,
      fileLocation: response.fileLocation,
    };
  }
}

module.exports = {
  selectACommand,
  inputParameters,
};
