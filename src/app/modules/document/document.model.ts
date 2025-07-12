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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    
  },
  {
    timestamps: true,
  },
);

// Add indexes for better query performance
documentSchema.index({ dholilNo: 1, year: 1 }); // For duplicate checking
documentSchema.index({ year: 1, isDeleted: 1 }); // For counting and filtering
documentSchema.index({ balamNo: 1 }); // For balamNo queries
documentSchema.index({ isDeleted: 1 }); // For general filtering

export const Document = model<TDocument>("Document", documentSchema);
