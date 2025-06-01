module.exports = {
  apps: [
    {
      name: "wallet-api",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 4003,
        HOST: '0.0.0.0'
      }
    }
  ]
};
