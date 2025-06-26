import dotenv  from 'dotenv';
import express, {Request, Response, NextFunction, RequestHandler} from 'express';
import cors    from "cors";
import path    from 'path';
import router  from './routes';

const port = process.env.PORT || 3000;
dotenv.config()
const app = express();

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

app.use('/static', express.static(path.join(__dirname,'public')));

app.use(cors());
app.use(express.json())
app.use(router);

app.listen(port,()=>{
    console.log(`Listening at http://localhost:${port}`)
});