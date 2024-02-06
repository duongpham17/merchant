import express, {IRouter} from 'express';

import { protect } from '../controllers/authentication';
import { find, update, remove, create, many } from '../controllers/items';

const router: IRouter = express.Router();

router.use(protect);
router.get("/:filter", find);
router.post("/", create);
router.patch("/", update);
router.delete("/:id", remove);
router.patch("/many/:filter", many)

export default router;