const Samarithan = require("../sam");

const sam = new Samarithan();
sam.configure({
  apiKey: "01689269d4832494.af16b2dba96d9968",
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
