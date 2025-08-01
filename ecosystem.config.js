const { watch } = require("fs");

module.exports = {
  apps: [
    {
      name: "user-service",
      script: "dist/main.js",
      cwd: "./user_service",
    },
    {
      name: "product-service",
      script: "dist/main.js",
      cwd: "./product_service",
    },
    {
      name: "order-service",
      script: "dist/main.js",
      cwd: "./order_service",
    },
    {
      name: "api-gateway",
      script: "node",
      args: "src/index.js",
      cwd: "./BE/api-gateway",
    },
    {
      name: "frontend",
      script: "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npx-cli.js",
      args: "next start",
      cwd: "./FE",
    }
  ],  
}
