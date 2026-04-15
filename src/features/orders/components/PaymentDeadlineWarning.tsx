import { AlertCircle, Clock } from 'lucide-react';

type PaymentDeadlineStatus = {
  isExpired: boolean;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
};

type PaymentDeadlineWarningProps = {
  deadline: PaymentDeadlineStatus;
};

export function PaymentDeadlineWarning({ deadline }: PaymentDeadlineWarningProps) {
  const isUrgent = deadline.hoursLeft === 0 && deadline.minutesLeft < 15;

  return (
    <div
      className={`p-4 rounded-lg border flex items-start gap-3 ${
        deadline.isExpired
          ? 'border-destructive bg-destructive/10'
          : isUrgent
            ? 'border-yellow-200 bg-yellow-50'
            : 'border-blue-200 bg-blue-50'
      }`}
    >
      {deadline.isExpired ? (
        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
      ) : (
        <Clock className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
      )}
      <div>
        {deadline.isExpired ? (
          <>
            <p className="font-semibold text-destructive">Payment deadline expired</p>
            <p className="text-sm text-destructive/80">
              Your order will be automatically cancelled. Please create a new order.
            </p>
          </>
        ) : isUrgent ? (
          <>
            <p className="font-semibold text-orange-900">Payment deadline approaching</p>
            <p className="text-sm text-orange-800">
              You have {deadline.minutesLeft}m {deadline.secondsLeft}s to upload payment proof before your order is cancelled.
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-blue-900">Time to upload payment proof</p>
            <p className="text-sm text-blue-800">
              {deadline.hoursLeft}h {deadline.minutesLeft}m {deadline.secondsLeft}s remaining
            </p>
          </>
        )}
      </div>
    </div>
  );
}
