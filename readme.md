# Samarithan - Simple logging and Incident management

Incident management, Logging, Oncall

## Prerequisites

Before you can start using Samarithan, you'll need to complete the following steps:

1. **Sign Up at Our Website**: To access the Samarithan API and obtain an API key, you must first sign up at our website [Samarithan](https://roaring-biscotti-b91532.netlify.app).

2. **Obtain Your API Key**: After signing up and logging in to your dashboard, you'll find your unique API key on your dashboard. This API key is required to configure Samarithan and make API requests.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Adding a User](#adding-a-user)
  - [Getting a User by ID](#getting-a-user-by-id)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with Samarithan, you can install it using npm or yarn:

```bash
npm install samarithan
# or
yarn add samarithan
```

## Configuration

Before using Samarithan, you need to configure it with your API key. You can do this as follows:

```javascript
const samarithan = require("samarithan");

const sam = new samarithan();
sam.configure({ apiKey: "your-api-key" });
```

## Usage

### Log every error and exception

```javascript
sam.logAll({
  app: "samthan",
});
```

### Catch error and create incidents

```javascript
function run() {
  setTimeout(() => {
    try {
      foo();
    } catch (error) {
      sam.captureException(error);
    }
  }, 99);
}

run();
```

### Create incidents

```javascript
const incident = {
  title: "Payment system is not working",
  description: "Our payment service on us-east is down",
  severity: "High",
};

const success = await sam.createIncident(incident);

if (success) {
  console.log("incident added successfully.");
} else {
  console.error("Failed to add incident.");
}
```

## Error Handling

Samarithan provides basic error handling for API requests. If an error occurs during an API request, an error message will be logged to the console, and the function will return `false`. You can customize error handling to suit your application's needs.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or want to contribute to the development of Samarithan, please check out our [contribution guidelines](CONTRIBUTING.md).

## License

Samarithan is licensed under the [MIT License](LICENSE).
