
import express from "express";
import {config} from 'dotenv'
config();
import cors from 'cors';
import { database_connect } from "./database/connection.js";
import routerHandler from "./utilites/controller-handler.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import uploadCourseImage from "./middelware/upload-middleware.js";


async function bootstrap() {
    await database_connect();
  
    const whitelist = [process.env.front_end_url];
    const corsOptions = {
      origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    };

  
    const app = express();
    app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

    app.use(express.json());
    app.use(cors(corsOptions));
    routerHandler(app);
  
    app.get('/', (req, res) => {
      res.status(200).json({ message: "server is running" });
    });
  
    const server = app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  }
  
    
export default bootstrap;