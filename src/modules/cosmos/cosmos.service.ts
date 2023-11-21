import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import crypto from "crypto";
import { Wallet } from "src/core/entities/wallet.entity";

@Injectable()
export class CosmosService {
  private readonly iv: string;
  constructor(config: ConfigService) {
    this.iv = crypto
      .createHash("sha256")
      .update(config.getOrThrow("IV"))
      .digest("hex");
  }
  async createWallet(email: string, password: string) {
    const key = [email, password].join("#"); // mail@mail.com#asdasd123
    const keyHash = crypto.createHash("sha256").update(key).digest("hex");

    const wallet: DirectSecp256k1HdWallet =
      await DirectSecp256k1HdWallet.generate(24);

    const cipher = crypto.createCipheriv("aes-256-cbc", keyHash, this.iv);

    const cipherMnemonic = Buffer.from(
      cipher.update(wallet.mnemonic, "utf-8", "hex") + cipher.final("hex"),
    ).toString("base64");

    return {
      wallet,
      cipherMnemonic,
      keyHash,
    };
  }

  getWalletMnemonic(email: string, password: string, wallet: Wallet) {
    const key = [email, password].join("#");
    const keyHash = crypto.createHash("sha256").update(key).digest("hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", keyHash, this.iv);
    const mnemonic =
      decipher.update(wallet.mnemonicHashed, "utf-8", "hex") +
      decipher.final("hex");

    return { mnemonic };
  }
}
