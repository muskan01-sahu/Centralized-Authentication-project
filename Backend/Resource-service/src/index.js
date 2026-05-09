require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("\n══════════════════════════════════════════");
  console.log(`  🚀 Resource Service running`);
  console.log(`  Port        : ${PORT}`);
  console.log(`  Health      : http://localhost:${PORT}/health`);
  console.log(`  Get Orders  : GET    http://localhost:${PORT}/orders`);
  console.log(`  New Order   : POST   http://localhost:${PORT}/orders`);
  console.log(`  Del Order   : DELETE http://localhost:${PORT}/orders/:id`);
  console.log("══════════════════════════════════════════\n");
});