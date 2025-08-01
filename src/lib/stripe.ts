import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromises: Record<string, Promise<Stripe | null>> = {};

export const getStripe = (locale?: string) => {
  const lang = locale === 'zh' ? 'zh' : 'en';

  if (!stripePromises[lang]) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
    }

    stripePromises[lang] = loadStripe(publishableKey, {
      locale: lang,
    });
  }
  return stripePromises[lang];
}; 