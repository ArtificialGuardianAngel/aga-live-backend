const name = process.env.INSTANCE_NAME || "aga-live_backend";

module.exports = {
  apps: [
    {
      name,
      script: "dist/main.js",
    },
  ],
};
