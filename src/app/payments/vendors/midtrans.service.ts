import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';

export interface MidtransCreateTrxDto {
  transaction_details: {
    order_id: number;
    gross_amount: number;
  };
}

export interface MidtransTrxResponse {
  token: string;
  redirect_url: string;
}

export interface MidtransTrxNotification {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  gross_amount: string;
  currency: string;
  fraud_status: 'accept' | 'deny';
}

@Injectable()
export class MidtransService {
  private snap: any;

  constructor(private readonly configService: ConfigService) {
    this.snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: this.configService.get('MIDTRANS_SERVER_KEY'),
    });
  }

  public async createTransaction(
    params: MidtransCreateTrxDto,
  ): Promise<MidtransTrxResponse> {
    return this.snap.createTransaction(params);
  }
}
