module.exports = {
  apps: [
    {
      name: "server_app",
      script: "./server.js",
      restartDelay: 10000,
      instances: 1,
      watch: true,
      ignore_watch: ["node_modules"],
      max_memory_restart: "700M",
      exec_mode: "cluster",
    },
  ],
};
