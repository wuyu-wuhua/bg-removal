import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log('Payment succeeded:', paymentIntent.id);

        // 更新支付意图状态
        const { error: updateError } = await supabase
          .from('bg_stripe_payment_intents')
          .update({
            status: 'succeeded',
            updated_at: new Date().toISOString(),
          })
          .eq('id', paymentIntent.id);

        if (updateError) {
          console.error('Failed to update payment intent:', updateError);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log('Payment failed:', paymentIntent.id);

        // 更新支付意图状态
        const { error: updateError } = await supabase
          .from('bg_stripe_payment_intents')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', paymentIntent.id);

        if (updateError) {
          console.error('Failed to update payment intent:', updateError);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    );
  }
} 