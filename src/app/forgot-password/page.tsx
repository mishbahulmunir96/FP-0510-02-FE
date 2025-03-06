import LandingPageLayout from "@/components/LandingPageLayout";
import ForgotPasswordComponent from "@/features/auth/forgot-password";
import GoogleAuthGuard from "@/hoc/googleAuthGuard";

const ForgotPassword = () => {
  return (
    <div>
      <LandingPageLayout>
        <ForgotPasswordComponent />
      </LandingPageLayout>
    </div>
  );
};

export default GoogleAuthGuard(ForgotPassword);
