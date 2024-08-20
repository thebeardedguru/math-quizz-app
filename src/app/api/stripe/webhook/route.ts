import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import {
  createSubscription,
  deleteSubscription,
} from '@/app/actions/userSubscriptions';

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.created',
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  if (!sig) return;
  const webHookSecret =
    'whsec_99a9a8d315fe4fe1013e352c91df08cd11c3759849269e8239725f99ccb73ea0';
  // process.env.NODE_ENV === 'production'
  //   ? process.env.STRIPE_WEBHOOK_SECRET
  //   : process.env.STRIPE_WEBHOOK_LOCAL_SECRET;

  console.log('stripe webhook', { body, sig, webHookSecret });

  if (!webHookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  const event = stripe.webhooks.constructEvent(body, sig, webHookSecret);

  const data = event.data.object as Stripe.Subscription;

  if (relevantEvents.has(event.type)) {
    switch (event.type) {
      case 'customer.subscription.created': {
        await createSubscription({
          stripeCustomerId: data.customer as string,
        });
        break;
      }
      case 'customer.subscription.deleted': {
        await deleteSubscription({
          stripeCustomerId: data.customer as string,
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  return new Response(
    JSON.stringify({
      received: true,
    }),
    { status: 200 }
  );
}
