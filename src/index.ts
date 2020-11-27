import express, {Request, Response} from 'express';

const app = express();


app.use('/', (req: Request, res: Response) => {
    res.send('Hi');
});

app.listen(3000, () => {
    console.log('123');
});
