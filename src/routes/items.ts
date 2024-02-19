import express, {IRouter} from 'express';

import { protect } from '../controllers/authentication';
import { find, update, remove, create, destroy, analysis, unique } from '../controllers/items';

const router: IRouter = express.Router();

router.use(protect);
router.post("/", create);
router.patch("/", update);
router.get("/:filter", find);
router.delete("/:id", remove);
router.patch("/destroy/:id", destroy);

// New route for retrieving unique "icon" values
router.get('/data/unique', unique);
router.get("/data/analysis", analysis);

export default router;