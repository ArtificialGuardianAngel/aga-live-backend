export type DocumentCreationResponse = {
  documentId: string;
};

export enum BoldsignDocumentStatus {
  revoked = "Revoked",
  pending = "InProgress",
  completed = "Completed",
}

export type BoldsingDocumentListResponse = {
  pageDetails: {
    pageSize: number;
    page: number;
    totalRecordsCount: number;
    totalPages: number;
    sortedColumn: string;
    sortDirection: string;
  };
  result: BoldsingDocumentListResponseResultItem[];
};

export type BoldsingDocumentListResponseResultItem = {
  documentId: string;
  senderDetail: {
    name: string;
    privateMessage: string | null;
    emailAddress: string;
    isViewed: boolean;
  };
  ccDetails: {
    emailAddress: string;
    isViewed: boolean;
  }[];
  createdDate: number;
  activityDate: number;
  activityBy: string;
  messageTitle: string;
  status: BoldsignDocumentStatus;
  signerDetails: { signerEmail: string }[];
  expiryDate: number;
  enableSigningOrder: boolean;
  isDeleted: boolean;
  labels: [];
};
