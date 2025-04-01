import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DocumentService } from "./document.service";

/* eslint-disable @typescript-eslint/no-explicit-any */

const createDocument = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.createDocument(req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Document created successfully",
    data: result,
    success: true,
  });
});

const getAllDocuments = catchAsync(async (req: Request, res: Response) => {
  const { meta, documents } = await DocumentService.getAllDocuments(req.query);

  sendResponse(res, {
    statusCode: 200,
    message: "Documents retrieved successfully",
    data: documents,
    meta: meta,
    success: true,
  });
});

const getDocumentById = catchAsync(async (req: Request, res: Response) => {
  const document = await DocumentService.getDocumentById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    message: "Document retrieved successfully",
    data: document,
    success: true,
  });
});

const updateDocument = catchAsync(async (req: Request, res: Response) => {
  const document = await DocumentService.updateDocument(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Document updated successfully",
    data: document,
    success: true,
  });
});

const deleteDocument = catchAsync(async (req: Request, res: Response) => {
  const document = await DocumentService.deleteDocument(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    message: "Document deleted successfully",
    data: document,
    success: true,
  });
});

const findDocumentsByYear = catchAsync(async (req: Request, res: Response) => {
  const documents = await DocumentService.findDocumentsByYear(
    Number(req.params.year),
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Documents retrieved successfully",
    data: documents,
    success: true,
  });
});

const findDocumentsByBalamNo = catchAsync(
  async (req: Request, res: Response) => {
    const documents = await DocumentService.findDocumentsByBalamNo(
      req.params.balamNo,
    );

    sendResponse(res, {
      statusCode: 200,
      message: "Documents retrieved successfully",
      data: documents,
      success: true,
    });
  },
);

const findDocumentsByDholilNo = catchAsync(
  async (req: Request, res: Response) => {
    const documents = await DocumentService.findDocumentsByDholilNo(
      req.params.dholilNo,
    );

    sendResponse(res, {
      statusCode: 200,
      message: "Documents retrieved successfully",
      data: documents,
      success: true,
    });
  },
);

export const DocumentController = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  findDocumentsByYear,
  findDocumentsByBalamNo,
  findDocumentsByDholilNo,
};
