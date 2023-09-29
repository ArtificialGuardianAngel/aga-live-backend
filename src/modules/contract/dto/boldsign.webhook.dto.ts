import { BoldsignDocumentStatus } from "src/modules/api/boldsign/types";

export class BoldsignWebhookDTO {
  event: {
    id: string;
    created: number;
    eventType: "Sent" | "Revoked" | "Completed";
    clientId: null | string;
    environment: string;
  };

  data: {
    object: "document";
    documentId: string;
    status: BoldsignDocumentStatus;
    senderDetail: { name: "A.G.A. NUAH"; emailAddress: "alex@nuah.org" };
    signerDetails: any;
    ccDetails: any;
    onBehalfOf: null;
    createdDate: number;
    expiryDate: number;
    enableSigningOrder: false;
    disableEmails: false;
    revokeMessage: null;
    errorMessage: null;
    labels: [];
    isCombinedAudit: false;
  };
  document: {
    object: "document";
    documentId: string;
    messageTitle: "Give and Earn Program Confirmation";
    documentDescription: "Please fill in all required fields.";
    status: BoldsignDocumentStatus;
    senderDetail: { name: "A.G.A. NUAH"; emailAddress: "alex@nuah.org" };
    signerDetails: any;
    ccDetails: any;
    onBehalfOf: null;
    createdDate: 1695910028;
    expiryDate: 1701125999;
    enableSigningOrder: false;
    disableEmails: false;
    revokeMessage: null;
    errorMessage: null;
    labels: [];
    isCombinedAudit: false;
  };
}
