const Samarithan = require("../sam");

const sam = new Samarithan();
sam.configure({
  apiKey: "api-key",
});
sam.logAll({
  app: "samthan",
});

// function
function runWrap() {
  setTimeout(() => {
    foo(); // Intentionally calling an undefined function to throw an error
  }, 99);
}
runWrap();

// exception
function runWrap() {
  setTimeout(() => {
    try {
      foo();
    } catch (error) {
      sam.captureException(error);
    }
  }, 99);
}

runWrap();
