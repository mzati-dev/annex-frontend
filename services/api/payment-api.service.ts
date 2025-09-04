import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api.constants';

// This interface matches the DTO on your NestJS backend for Mobile Money
interface MobileMoneyPayload {
    amount: number;
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
    provider: 'airtel' | 'mpamba';
    lessonId: string;
}

// This interface matches the DTO on your NestJS backend for Bank Transfers
interface BankPaymentPayload {
    amount: number;
    email: string;
    lessonId: string;
}

export class PaymentApiService extends BaseApiService {
    initiateMobileMoney(payload: MobileMoneyPayload) {
        return this.post(API_ENDPOINTS.PAYMENTS.INITIATE_MOBILE_MONEY, payload);
    }

    initiateBankTransfer(payload: BankPaymentPayload) {
        return this.post(API_ENDPOINTS.PAYMENTS.INITIATE_BANK_TRANSFER, payload);
    }
}

// Export a single instance, following your existing pattern
export const paymentApiService = new PaymentApiService();