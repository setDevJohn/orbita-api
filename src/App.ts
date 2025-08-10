import express, { Application } from 'express';
import { routes } from './routes';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const allowedOrigins = [
  process.env.WHITELIST1 as string, 
  process.env.WHITELIST2 as string
]

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();

    this.app.get('/', (req, res) => {
      res.json({ message: 'Hello World!' })
    })
  }


  config() {
    this.app.use(cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)){
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    }));
    this.app.use(morgan('dev'));
    this.app.use(express.json());

    this.app.use(cookieParser());

    this.app.use(routes);
  }

  async start(PORT: string) {
    this.app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  
  }
}