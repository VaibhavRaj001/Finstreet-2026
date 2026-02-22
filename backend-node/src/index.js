require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const attachPassportStrategies = require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const teamRoutes = require("./routes/team.routes");

const app = express();
connectDB();

// Trust proxy is needed when running behind reverse proxies so secure cookies are honored
app.set("trust proxy", 1);

const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
attachPassportStrategies(passport);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/events", apiLimiter, eventRoutes);
app.use("/api/teams", apiLimiter, teamRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is up. See /api/health" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});