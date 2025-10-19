import { Router } from 'express';

const router = Router();

//check login


router.get('/', (req, res) => {
    res.send("helo wolrd");
});


// router.use('/test', testRoutes);
export default router;