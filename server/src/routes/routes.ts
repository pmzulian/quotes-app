import { Router } from "express";
import { getQuotes, addQuote, updateQuote, deleteQuote } from "../controllers/QuoteController";

const router: Router = Router();

router.get("/api/listAll", getQuotes);
router.post("/api/addQuote", addQuote);
router.put("/api/:id", updateQuote);
router.delete("/api/:id", deleteQuote);

export default router;
