// import express from "express";
// import cors from "cors";
// import adminRoutes from "./routes/adminRoutes.js"; // Import the admin routes
// import { authenticateAdmin } from "./middlewares/authMiddleware.js"; // Import the auth middleware

// const app = express();

// // Middleware to parse JSON requests
// app.use(express.json());

// // ✅ Enable CORS for all origins (you can change it to a specific origin if needed)
// app.use(cors({ origin: "*", credentials: true }));

// // Default route (optional)
// app.get("/", (req, res) => {
//   res.send("Welcome to the Admin Backend API");
// });

// // **Route for creating the first admin** (does not require authentication)
// app.post("/api/create-admin", createAdmin);  // No authentication for this route

// // **Middleware for authentication** - Apply only to routes that need admin authentication
// app.use("/api", authenticateAdmin);  // Apply authentication middleware

// // **Admin routes that require authentication** - Apply to all routes under `/admin` after authentication middleware
// // app.use("/api", adminRoutes);  // All routes here require admin authentication

// // Export the app
// export default app;