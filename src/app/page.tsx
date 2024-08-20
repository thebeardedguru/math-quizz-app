import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  return (
    <div className='flex flex-col flex-1'>
      <main className='flex justify-center flex-1'>
        <div className='items-center flex flex-col sm:flex-row gap-20 justify-center mx-auto p-10 w-full sm:py-20 sm:w-[1000px]'>
          <div className='text-center flex gap-6 flex-col'>
            <h1 className='text-3xl font-bold'>Get Your Quizz On!</h1>
            <h3 className='text-md'>
              Sign in to start your timed Math Quizz.
              <br /> Complete each question before the time runs out.
            </h3>
            <Button
              variant='default'
              className='mt-4 h-14 w-full text-white'
              asChild
            >
              <Link href={!session ? '/api/auth/signin' : '/quizz/2'}>
                {!session ? 'Sign in' : 'Get Started'}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
