const axios = require("axios");
const { ENDPOINTS } = require("../constants");

class Samarithan {
  constructor() {
    this.apiKey = null;
  }

  configure(options) {
    this.apiKey = options.apiKey;
  }

  async createIncident({ title, description, severity }) {
    if (!this.apiKey) {
      throw new Error("Please configure the apiKey first.");
    }

    if (!(title && description && severity)) {
      throw new Error("Please use valid incident object");
    }

    try {
      const response = await axios.post(
        ENDPOINTS.INCIDENT,
        {
          title,
          description,
          severity,
        },
        {
          headers: {
            authorization: this.apiKey,
          },
        }
      );

      if (response?.data?.incident) {
        return {
          status: true,
          data: {
            ...response?.data,
          },
        };
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async createLog({ title, description, slug, app, metadata }) {
    if (!this.apiKey) {
      throw new Error("Please configure the apiKey first.");
    }

    if (!(title && description && slug && app)) {
      throw new Error("Please use valid incident object");
    }

    try {
      const response = await axios.post(
        ENDPOINTS.LOG,
        {
          title,
          description,
          slug,
          app,
          metadata: JSON.stringify(metadata ?? {}),
        },
        {
          headers: {
            authorization: this.apiKey,
          },
        }
      );

      if (response?.data?.log) {
        return {
          status: true,
          data: {
            ...response?.data,
          },
        };
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async captureException(e) {
    if (!this.apiKey) {
      throw new Error("Please configure the apiKey first.");
    }

    if (!e) {
      throw new Error("No exception was passed");
    }

    try {
      const response = await axios.post(
        ENDPOINTS.LOG,
        {
          title: e.message,
          description: e.stack,
          slug: e?.name,
          app: "default",
        },
        {
          headers: {
            authorization: this.apiKey,
          },
        }
      );

      if (response?.data?.status) {
        return {
          status: true,
          data: {
            ...response?.data,
          },
        };
      } else {
        return false;
      }
    } catch (error) {
      console.error("sam error: ", error);
      return false;
    }
  }

  async logAll({ app }) {
    if (typeof process !== "undefined" && process.on) {
      // Node.js runtime
      process.on("unhandledRejection", (reason, promise) => {
        promise.catch((err) => {
          console.log("Unhandled Rejection:", err.message);
          this.createLog({
            title: err.message,
            description: err.stack,
            slug: err?.name,
            app: app ?? "default",
          });
        });
      });

      process.on("uncaughtException", (err) => {
        console.log("Uncaught Exception:", err.message);
        this.createLog({
          title: err.message,
          description: err.stack,
          slug: err.name,
          app: app ?? "default",
        });
      });
    } else if (typeof window !== "undefined") {
      // Browser environment
      window.onerror = function (message, source, lineno, colno, error) {
        this.createLog({
          title: message,
          description: source + error,
          slug: lineno,
          app: app ?? "default",
        });
        // You can adjust this part to match your logging needs in the browser
      };
    } else {
      console.warn(
        "Neither Node.js process nor window object detected. Unable to set up error logging."
      );
    }
  }
}

module.exports = Samarithan;
