import { Router } from "express";
import { DocumentController } from "./document.controller";
import validateRequest from "../../middlewares/validateRequest";
import { DocumentValidation } from "./document.validation";

const route = Router();

route.post(
  "/",
  validateRequest(DocumentValidation.createDocumentValidation),
  DocumentController.createDocument,
);
route.get("/", DocumentController.getAllDocuments);
route.get("/:id", DocumentController.getDocumentById);
route.patch(
  "/:id",
  validateRequest(DocumentValidation.updateDocumentValidation),
  DocumentController.updateDocument,
);
route.delete("/:id", DocumentController.deleteDocument);
route.get("/year/:year", DocumentController.findDocumentsByYear);
route.get("/balamNo/:balamNo", DocumentController.findDocumentsByBalamNo);
route.get("/dholilNo/:dholilNo", DocumentController.findDocumentsByDholilNo);

export const DocumentRoutes = route;
