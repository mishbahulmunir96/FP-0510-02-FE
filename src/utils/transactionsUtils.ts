export const isCheckInTime = (checkInDate: string | null): boolean => {
  if (!checkInDate) return false;
  const checkInTime = new Date(checkInDate);
  checkInTime.setUTCHours(7, 0, 0, 0);
  return new Date() >= checkInTime;
};

export const isCheckOutTime = (checkOutDate: string | null): boolean => {
  if (!checkOutDate) return false;
  const checkOutTime = new Date(checkOutDate);
  checkOutTime.setUTCHours(2, 0, 0, 0);
  return new Date() >= checkOutTime;
};
