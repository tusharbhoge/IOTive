
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import firmwareRoutes from "./routes/firmwareRoutes.js";

dotenv.config(); // Ensure .env is correctly loaded

const app = express();

// ✅ Enable CORS for all origins
app.use(cors({ origin: "*", credentials: true }));

// ✅ JSON Middleware
app.use(express.json()); 

// ✅ Mount admin routes correctly
app.use("/api", adminRoutes); 

app.use("/api", firmwareRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

