import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "Secure Offline Face Auth Backend",
    version: "1.0.0"
  });
});

export default app;