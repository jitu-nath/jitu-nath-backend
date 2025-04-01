import { Schema, model } from "mongoose";
import { TDocument } from "./document.interface";

const documentSchema = new Schema<TDocument>(
  {
    balamNo: {
      type: String,
      required: [true, "Balam number is required"],
    },
    dholilNo: {
      type: String,
      required: [true, "Dholil number is required"],
    },
    pageNo: {
      type: String,
      required: [true, "Page number is required"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    images: {
      type: [String],
      default: [],
      },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const Document = model<TDocument>("Document", documentSchema);
