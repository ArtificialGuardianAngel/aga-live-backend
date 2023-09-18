import { Injectable } from "@nestjs/common";
import { SmartPaySDK } from "@coinsmart/smartpay-sdk";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class SmartpayService {
  private readonly smartpay: SmartPaySDK;
  constructor(config: ConfigService) {
    const apiKey = config.getOrThrow("SMARTPAY_API_KEY");
    const secretKey = config.getOrThrow("SMARTPAY_SECRET_KEY");
    this.smartpay = new SmartPaySDK(apiKey, secretKey);
  }

  async createInvoce(email: string, amount: number) {
    const invoice = await this.smartpay.createInvoice({
      productSymbol: "USD",
      amount: amount,
      email,
      sendEmail: true,
      customId: email,
    });

    return invoice.invoiceUrl;
  }
}
