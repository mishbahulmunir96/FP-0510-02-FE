import LandingPageLayout from "@/components/LandingPageLayout";
import PropertyDetailPage from "@/features/property/PropertyDetailPage";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <LandingPageLayout>
        <PropertyDetailPage propertySlug={params.slug} />;
      </LandingPageLayout>
    </div>
  );
}
