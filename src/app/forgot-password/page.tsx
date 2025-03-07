import LandingPageLayout from "@/components/LandingPageLayout";
import ForgotPasswordComponent from "@/features/auth/forgot-password";


const ForgotPassword = () => {
  return (
    <div>
      <LandingPageLayout>
        <ForgotPasswordComponent />
      </LandingPageLayout>
    </div>
  );
};

export default ForgotPassword;
