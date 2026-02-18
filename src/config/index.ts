import express, {type Application} from "express";
import cors from "cors"; // Enables secure cross-origin requests
import morgan from "morgan"; // Logs incoming requests and responses to the terminal (useful for debugging)

const logger = morgan;

// Middleware configuration
export default function config(app : Application) {
  // ℹ️ Enables Express to trust reverse proxies (e.g., when deployed behind services like Heroku or Vercel)
  app.set("trust proxy", 1);
  
  // ℹ️ Configures CORS to allow requests only from the specified origins
  const isProd = process.env.NODE_ENV === "production";

  const allowedOrigins =
  (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map(s => s.trim())
    .filter((v): v is string => !!v);
  
  console.log("Allowed CORS origins:", allowedOrigins);
  if (isProd && allowedOrigins.length === 0) {
  throw new Error("CORS_ORIGINS must be defined in production");
  }
  app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : "*" }));  
  
// ℹ️ Logs requests in the development environment
  app.use(logger("dev")); 

// ℹ️ Parses incoming JSON requests
  app.use(express.json()); 

// ℹ️ Parses incoming request bodies with URL-encoded data (form submissions)
  app.use(express.urlencoded({ extended: false }));
}