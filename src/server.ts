import { App } from './App';
import * as dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT || '3000';

new App().start(PORT);
