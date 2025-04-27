/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document } from "./document.model";
import { TDocument } from "./document.interface";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../builder/QueryBuilder";

const createDocument = async (payload: TDocument) => {
  const documentCount = await Document.countDocuments({year: payload.year}); 
  const documentNumber = documentCount + 1; 

  const newDocument = await Document.create({
    ...payload,
    dholilNo: documentNumber,
  });
  return newDocument;
};

const getAllDocuments = async (query: any) => {
  const documentQuery = new QueryBuilder(Document.find({isDeleted:false}), query)
    .filter()
    .sort()
    .fields()
    .search(["title",  "year"]); 

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
  const document = await Document.findByIdAndUpdate(
    id,
    { isDeleted: true, updatedAt: new Date() },
    { new: true },
  );
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
