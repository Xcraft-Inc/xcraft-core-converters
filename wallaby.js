module.exports = function () {
  return {
    files: [
      'lib/**/*.js', // adjust if required
    ],

    tests: [
      'test/*.spec.js', // adjust if required
    ],

    env: {
      type: 'node',
    },
  };
};