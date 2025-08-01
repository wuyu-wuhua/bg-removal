import Stripe from 'stripe';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: Stripe.PaymentIntent.Status;
  client_secret: string;
  metadata: Record<string, string>;
  created: number;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface PaymentSuccessResponse {
  success: boolean;
  credits: number;
  transactionId: string;
  message: string;
}

export interface PaymentErrorResponse {
  error: string;
  status?: number;
}

export interface StripePaymentProps {
  plan: PaymentPlan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credits: number) => void;
}

export interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'recharge' | 'consumption' | 'refund';
  description: string;
  reference_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DeductCreditsRequest {
  amount: number;
  type: string;
  description?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
}

export interface CreditTransactionResponse {
  success: boolean;
  error?: string;
  data: {
    transactionId: string;
    newBalance: number;
  };
} 