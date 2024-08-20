'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { quizzSubmissions } from '@/db/schema';

import { InferInsertModel, eq } from 'drizzle-orm';

type Submission = InferInsertModel<typeof quizzSubmissions>;

export async function saveSubmission(sub: Submission, quizzId: number) {
  const { score } = sub;
  const session = await auth();
  const userId = session?.user?.id;

  const newSubmission = await db
    .insert(quizzSubmissions)
    .values({
      score,
      quizzId,
    })
    .returning({ insertedId: quizzSubmissions.id });

  const submissionId = newSubmission[0].insertedId;

  return submissionId;
}
