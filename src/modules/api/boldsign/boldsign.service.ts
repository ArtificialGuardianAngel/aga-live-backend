import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { SendDocumentToDto } from "./dto/send.doc.dto";
import { BoldsingDocumentListResponse } from "./types";

@Injectable()
export class BoldsignService {
  private readonly tempalteId: string;
  private readonly client: AxiosInstance;
  public readonly pageSize = 10;
  constructor(configService: ConfigService) {
    const apiUrl = configService.getOrThrow("BOLDSIGN_API_URL");
    const apiKey = configService.getOrThrow("BOLDSIGN_API_KEY");
    this.tempalteId = configService.getOrThrow("BOLDSIGN_TEMPLATE_ID");
    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        Accept: "application/json",
        "X-API-KEY": apiKey,
      },
    });
    this.getDocuments = this.getDocuments.bind(this);
  }

  async sendDocumentTo(data: SendDocumentToDto) {
    const response = await this.client.post<{ documentId: string }>(
      "v1/template/send",
      {
        roles: [
          {
            roleIndex: 1,
            signerName: data.name,
            signerEmail: data.email,
            existingFormFields: [
              {
                id: "DonationAmount",
                value: Number(data.amount).toLocaleString(),
              },
              {
                id: "EndorserEmail",
                value: data.endorser,
              },
              {
                id: "WishNo1",
                value: data.wishes[1],
              },
              {
                id: "WishNo2",
                value: data.wishes[2],
              },
              {
                id: "WishNo3",
                value: data.wishes[3],
              },
            ],
          },
        ],
      },
      {
        params: {
          templateId: this.tempalteId,
        },
        headers: {
          "Content-Type": "application/json;odata=minimal;odata.streaming=true",
        },
      },
    );

    return response.data;
  }

  async getDocuments(cursor = 1) {
    const response = await this.client<BoldsingDocumentListResponse>(
      "v1/document/list",
      {
        params: {
          page: cursor,
          pageSize: this.pageSize,
        },
      },
    );
    return { data: response.data, next: () => this.getDocuments(cursor + 1) };
  }

  revoke(documentId: string) {
    return this.client.post(
      "/v1/document/revoke",
      {
        message: "Timeout",
      },
      {
        params: { documentId },
        headers: {
          "Content-Type": "application/json;odata=minimal;odata.streaming=true",
        },
      },
    );
  }
}
