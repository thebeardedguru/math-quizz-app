'use client';
import { Lock, Flame } from 'lucide-react';
import { getStripe } from '@/lib/stripe-client';
import { useRouter } from 'next/navigation';
import { PRICE_ID } from '@/lib/utils';

const UpgradePlan = () => {
  const onNavigateToUpgrade = async (price: string) => {
    try {
      const { sessionId } = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
      }).then((res) => res.json());

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.log('Subscribe Button Error', error);
    }
  };
  return (
    <button
      onClick={() => onNavigateToUpgrade(PRICE_ID)}
      className='rounded-md bg-primary hover:bg-primary-shadow p-10 sm:h-80 sm:w-80'
    >
      <div className='flex items-center flex-col cursor-pointer w-full h-full'>
        <div className='flex-1 flex items-center flex-col'>
          <h2 className='text-2xl text-center font-bold mb-4'>
            Subscribe to Upload Documents and Create Quizzes
          </h2>
          <Lock className='w-12 h-12' />
        </div>
        <div className='flex w-full flex-col items-center'>
          <div className='bg-white p-3 rounded-full text-black flex flex-row w-2/3 justify-around gap-2 items-center'>
            <Flame className='size-10' />
            <p className='text-xl font-bold'>Upgrade</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default UpgradePlan;
