/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document } from "./document.model";
import { TDocument } from "./document.interface";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../builder/QueryBuilder";

const createDocument = async (payload: TDocument) => {
  const documents = await Document.find({
    year: payload.year,
    dholilNo: payload.dholilNo,
  });

  if (documents.length > 0) {
    throw new AppError(400, "Documentalready exists");
  }

  const newDocument = await Document.create(payload);
  return newDocument;
};

const getAllDocuments = async (query: any) => {
  const documentQuery = new QueryBuilder(Document.find(), query)
    .filter()
    .sort()
    .fields()
    .search(["title", "author", "year"]); // Adjust the fields as necessary
  // .paginate();

  const documents = await documentQuery.modelQuery;

  const meta = await documentQuery.countTotal();

  return { documents, meta };
};

const getDocumentById = async (id: string) => {
  const document = await Document.findById(id);
  if (!document) {
    throw new AppError(404, "Document not found");
  }
  return document;
};

const updateDocument = async (id: string, payload: Partial<TDocument>) => {
  const document = await Document.findById(id);
  if (!document) {
    throw new AppError(404, "Document not found");
  }
  const updatedDocument = await Document.findByIdAndUpdate(
    id,
    { ...payload, updatedAt: new Date() },
    { new: true },
  );
  return updatedDocument;
};

const deleteDocument = async (id: string) => {
  const document = await Document.findByIdAndDelete(id);
  if (!document) {
    throw new AppError(404, "Document not found");
  }
  return document;
};

const findDocumentsByYear = async (year: number) => {
  const documents = await Document.find({ year });
  return documents;
};

const findDocumentsByBalamNo = async (balamNo: string) => {
  const documents = await Document.find({ balamNo });
  return documents;
};

const findDocumentsByDholilNo = async (dholilNo: string) => {
  const documents = await Document.find({ dholilNo });
  return documents;
};

export const DocumentService = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  findDocumentsByYear,
  findDocumentsByBalamNo,
  findDocumentsByDholilNo,
};

export default DocumentService;
