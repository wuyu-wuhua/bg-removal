'use client'

import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { getStripe } from '@/lib/stripe';
import { useLanguage } from '@/contexts/language-context';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
}

interface StripePaymentProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credits: number) => void;
}

function CheckoutForm({ plan, onSuccess, onClose }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // 创建支付意图
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: plan.price,
            planId: plan.id,
            planName: plan.name,
          }),
        });

        const data: any = await response.json();

        if (data.error) {
          if (data.error === 'Unauthorized') {
            setError(t('dashboard.paymentModal.loginFirst'));
            // 延迟跳转到登录页面
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else {
            setError(data.error);
          }
          return;
        }

        if (!data.clientSecret) {
          setError(t('dashboard.paymentModal.paymentInitFailed'));
          return;
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(t('dashboard.paymentModal.createPaymentFailed'));
        console.error('Error creating payment intent:', err);
      }
    };

    createPaymentIntent();
  }, [plan]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError(t('dashboard.paymentModal.paymentFormNotLoaded'));
      setIsLoading(false);
      return;
    }

    try {
      // 确认支付
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        },
      );

      if (stripeError) {
        setError(stripeError.message || t('dashboard.paymentModal.paymentFailed'));
        setIsLoading(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // 确认支付成功，添加积分
        const confirmResponse = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        });

        const confirmData: any = await confirmResponse.json();

        if (confirmData.error) {
          if (confirmData.error === 'Unauthorized') {
            setError(t('dashboard.paymentModal.loginFirst'));
            // 延迟跳转到登录页面
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else {
            setError(confirmData.error);
          }
          setIsLoading(false);
          return;
        }

        // 支付成功
        onSuccess(confirmData.credits);
        onClose();
      }
    } catch (err) {
      setError(t('dashboard.paymentModal.paymentProcessFailed'));
      console.error('Payment error:', err);
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('dashboard.paymentModal.purchase')} {plan.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t('dashboard.paymentModal.getCredits')} {plan.credits} {t('dashboard.credits')}，{t('dashboard.paymentModal.price')} ${plan.price}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('dashboard.paymentModal.creditCardInfo')}
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('dashboard.paymentModal.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={!stripe || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? t('dashboard.paymentModal.processing') : `${t('dashboard.paymentModal.pay')} $${plan.price}`}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function StripePayment({ plan, isOpen, onClose, onSuccess }: StripePaymentProps) {
  const { t } = useLanguage();
  const [stripePromise] = useState(() => {
    return getStripe('zh');
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('dashboard.paymentModal.securePayment')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <Elements stripe={stripePromise}>
            <CheckoutForm plan={plan} onSuccess={onSuccess} onClose={onClose} isOpen={isOpen} />
          </Elements>
        </div>
      </div>
    </div>
  );
} 