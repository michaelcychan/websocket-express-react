import { Router } from 'express';

const rootRouter = Router();

rootRouter.get('/', (req, res) => {
  console.log("Received request at /");
  res.status(200).json({ message: 'Server is up and running!' });
});

export default rootRouter;