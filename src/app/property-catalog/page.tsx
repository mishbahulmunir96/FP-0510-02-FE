import LandingPageLayout from "@/components/LandingPageLayout";
import PropertyListPage from "@/features/property";
import PropertyCatalogPage from "@/features/property-catalog";
import React from "react";

const PropertyCatalog = () => {
  return (
    <div>
      <LandingPageLayout>
        <PropertyCatalogPage />
      </LandingPageLayout>
    </div>
  );
};

export default PropertyCatalog;
