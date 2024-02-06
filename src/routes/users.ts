import express, {IRouter} from 'express';

import { protect } from '../controllers/authentication';
import { find, update } from '../controllers/users';

const router: IRouter = express.Router();

router.use(protect);
router.get('/', find);
router.patch('/', update);

export default router;