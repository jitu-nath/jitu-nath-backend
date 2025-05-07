import { z } from "zod";

const createDocumentValidation = z.object({
  body: z.object({
    balamNo: z.string().nonempty("Balam number is required"),
    pageNo: z.string().nonempty("Page number is required"),
    dholilNo: z.string().nonempty("Dholil number is required"),
    year: z.number().int().nonnegative("Year must be a positive integer"),
    images: z.array(z.string()).optional(),
  }),
});
const updateDocumentValidation = z.object({
  body: z.object({
    balamNo: z.string().optional(),
    pageNo: z.string().optional(),
    year: z
      .number()
      .int()
      .nonnegative("Year must be a positive integer")
      .optional(),
    images: z.array(z.string()).optional(),
  }),
});

export const DocumentValidation = {
  createDocumentValidation,
  updateDocumentValidation,
};
