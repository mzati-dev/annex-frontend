import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api.constants';

export interface PurchaseItem {
    lessonId: string;
}

export interface PaymentDetails {
    amount: number;
    paymentMethod: string;
    transactionId?: string; // Optional for mock payments
}

export interface PurchaseResponse {
    id: string;
    amount: number;
    purchaseDate: string;
    paymentMethod: string;
    transactionId?: string;
    lesson: {
        id: string;
        title: string;
        price: number;
    };
}

export class PurchaseApiService extends BaseApiService {
    async checkout(
        items: PurchaseItem[],
        paymentDetails: PaymentDetails
    ): Promise<PurchaseResponse[]> {
        return this.post(API_ENDPOINTS.PURCHASES.CHECKOUT, {
            items,
            amount: paymentDetails.amount,
            paymentMethod: paymentDetails.paymentMethod,
            transactionId: paymentDetails.transactionId
        });
    }

    async getUserPurchases(): Promise<PurchaseResponse[]> {
        return this.get(API_ENDPOINTS.PURCHASES.BASE);
    }
}

export const purchaseApiService = new PurchaseApiService();

// import { BaseApiService } from './base-api.service';
// import { API_ENDPOINTS } from './api.constants';

// export interface PurchaseItem {
//     lessonId: string;
// }

// export interface PurchaseResponse {
//     id: string;
//     amount: number;
//     purchaseDate: string;
//     lesson: {
//         id: string;
//         title: string;
//         price: number;
//     };
// }

// export class PurchaseApiService extends BaseApiService {
//     async checkout(items: PurchaseItem[]): Promise<PurchaseResponse[]> {
//         return this.post(API_ENDPOINTS.PURCHASES.CHECKOUT, { items });
//     }

//     async getUserPurchases(): Promise<PurchaseResponse[]> {
//         return this.get(API_ENDPOINTS.PURCHASES.BASE);
//     }
// }

// export const purchaseApiService = new PurchaseApiService();