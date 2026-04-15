export type PaymentDeadlineState = {
  isExpired: boolean;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
  deadlineTime: Date | null;
};

export const calculateTimeRemaining = (deadlineTime: Date | null): PaymentDeadlineState => {
  if (!deadlineTime) {
    return {
      isExpired: false,
      hoursLeft: 0,
      minutesLeft: 0,
      secondsLeft: 0,
      deadlineTime: null,
    };
  }

  const now = new Date();
  const differenceMs = deadlineTime.getTime() - now.getTime();

  // Backend scheduler checks: payment_deadline < now
  // If difference is <= 0, order is expired
  if (differenceMs <= 0) {
    return {
      isExpired: true,
      hoursLeft: 0,
      minutesLeft: 0,
      secondsLeft: 0,
      deadlineTime,
    };
  }

  const totalSeconds = Math.floor(differenceMs / 1000);
  const hoursLeft = Math.floor(totalSeconds / 3600);
  const minutesLeft = Math.floor((totalSeconds % 3600) / 60);
  const secondsLeft = totalSeconds % 60;

  return {
    isExpired: false,
    hoursLeft,
    minutesLeft,
    secondsLeft,
    deadlineTime,
  };
};
