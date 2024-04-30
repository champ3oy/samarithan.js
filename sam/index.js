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
        ENDPOINTS.INCIDENT,
        {
          title: e?.message,
          description: e.stack?.toString(),
          severity: "Low",
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

      return;
    });

    process.on("uncaughtException", (err) => {
      console.log("Uncaught Exception:", err.message);
      this.createLog({
        title: err.message,
        description: err.stack,
        slug: err.name,
        app: app ?? "default",
      });

      return;
    });
  }
}

module.exports = Samarithan;
