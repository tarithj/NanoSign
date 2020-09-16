const resourceHacker = require('node-resourcehacker');

// Use the beta release of Resource Hacker.
process.env['SOURCE_RESOURCE_HACKER'] = 'http://www.angusj.com/resourcehacker/resource_hacker.zip';


resourceHacker({
  operation: 'addoverwrite',
  input: 'nsign.exe',
  output: 'nsign.exe',
  resource: './icons/nsign.ico',
  resourceType: 'ICONGROUP',
  resourceName: '1',
}, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Done.');
});
