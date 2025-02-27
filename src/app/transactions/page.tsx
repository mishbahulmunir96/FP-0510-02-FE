import LandingPageLayout from "@/components/LandingPageLayout";
import TransactionPage from "@/features/transactions";
import UserAuthGuard from "@/hoc/userAuthGuard";

const Transaction = () => {
  return (
    <LandingPageLayout>
      <TransactionPage />
    </LandingPageLayout>
  );
};

export default UserAuthGuard(Transaction);
