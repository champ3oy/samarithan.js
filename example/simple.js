const Samarithan = require("../sam");

const sam = new Samarithan();
sam.configure({
  apiKey: "b88a8674c562faef.34cd971a18ca49f8",
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

// // exception
// function runWrap() {
//   setTimeout(() => {
//     try {
//       foo();
//     } catch (error) {
//       sam.captureException(error);
//     }
//   }, 99);
// }

// runWrap();
