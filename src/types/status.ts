export const getStatusColor = (status: string) => {
  switch (status) {
    case "WAITING_FOR_PAYMENT":
      return "bg-yellow-100 text-yellow-800";
    case "WAITING_FOR_PAYMENT_CONFIRMATION":
      return "bg-blue-100 text-blue-800";
    case "PROCESSED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "CHECKED_IN":
      return "bg-purple-100 text-purple-800";
    case "CHECKED_OUT":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatStatus = (status: String) => {
  switch (status) {
    case "WAITING_FOR_PAYMENT":
      return "Waiting Payment";
    case "WAITING_FOR_PAYMENT_CONFIRMATION":
      return "Waiting Confirmation";
    case "CANCELLED":
      return "Cancelled";
    case "PROCESSED":
      return "Paid";
    case "CHECKED_IN":
      return "Checked In";
    case "CHECKED_OUT":
      return "Checked Out";
    default:
      return status;
  }
};
