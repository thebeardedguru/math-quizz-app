import { clsx } from 'clsx';
import { cn } from '@/lib/utils';

type Props = {
  isCorrect: boolean | null | undefined;
  correctAnswer: string;
};

const ResultCard = (props: Props) => {
  const { isCorrect } = props;

  if (isCorrect === null || isCorrect === undefined) {
    return null;
  }

  const text = isCorrect
    ? 'Correct!'
    : 'Incorrect! the correct answer is: ' + props.correctAnswer;

  const borderClasses = clsx({
    'border border-green-500': isCorrect,
    'border-red-600': !isCorrect,
  });

  return (
    <div
      className={cn(
        borderClasses,
        'border-2',
        'rounded-lg',
        'p-4',
        'text-center',
        'text-lg',
        'font-semibold',
        'm-4',
        'bg-secondary'
      )}
    >
      {text}
    </div>
  );
};

export default ResultCard;
