var reporter = require('nodeunit').reporters.default;

process.on('uncaughtException', function(err) {
  console.error(err.stack);
});

reporter.run(['tests']);
