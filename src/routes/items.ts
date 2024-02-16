import express, {IRouter} from 'express';

import { protect } from '../controllers/authentication';
import { find, update, remove, create, destroy, analysis, unique } from '../controllers/items';

const router: IRouter = express.Router();

router.use(protect);
router.get("/analysis", analysis);
router.get('/unique', unique);
router.post("/", create);
router.patch("/", update);
router.get("/:filter", find);
router.delete("/:id", remove);
router.patch("/destroy/:id", destroy)

export default router;