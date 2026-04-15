import { useState, useEffect } from 'react';
import { calculateTimeRemaining, type PaymentDeadlineState } from '../utils/deadline';

export function usePaymentDeadline(paymentDeadlineString: string | undefined) {
  const [deadline, setDeadline] = useState<PaymentDeadlineState>({
    isExpired: false,
    hoursLeft: 1,
    minutesLeft: 0,
    secondsLeft: 0,
    deadlineTime: null,
  });

  // Initialize deadline from payment_deadline string
  useEffect(() => {
    if (!paymentDeadlineString) return;

    const paymentDeadline = new Date(paymentDeadlineString);
    setDeadline(calculateTimeRemaining(paymentDeadline));
  }, [paymentDeadlineString]);

  // Update countdown every second
  useEffect(() => {
    if (!deadline.deadlineTime) return;

    const interval = setInterval(() => {
      setDeadline(calculateTimeRemaining(deadline.deadlineTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline.deadlineTime]);

  return deadline;
}
