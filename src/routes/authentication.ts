import express, {IRouter} from 'express';

import { protect, persist, login, confirmWithCode, confirmWithEmail } from '../controllers/authentication';

const router: IRouter = express.Router();

router.get('/persist', protect, persist);
router.post('/email', login);
router.post('/authenticate', confirmWithCode);
router.get('/authenticate/:token', confirmWithEmail);

export default router;