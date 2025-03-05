import LandingPageLayout from "@/components/LandingPageLayout";
import ResetPasswordComponent from "@/features/auth/reset-password";

const ResetPassword = ({ params }: { params: { token: string } }) => {
  return (
    <div>
      <LandingPageLayout>
        <ResetPasswordComponent token={params.token} />
      </LandingPageLayout>
    </div>
  );
};

export default ResetPassword;
