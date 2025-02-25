import DashboardUserLayout from "@/features/user/dashboard/DashboardUserLayout";
import TransactionDetailPage from "@/features/user/dashboard/transactions/TransactionDetailPage";
import UserAuthGuard from "@/hoc/userAuthGuard";

const TransactionDetail = ({ params }: { params: { id: string } }) => {
  return (
    <DashboardUserLayout>
      <TransactionDetailPage transactionId={Number(params.id)} />
    </DashboardUserLayout>
  );
};

export default UserAuthGuard(TransactionDetail);
