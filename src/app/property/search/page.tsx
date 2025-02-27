<<<<<<< HEAD
import SearchPropertiesPage from "@/features/search";
import React from "react";

const SearchProperty = () => {
  return <SearchPropertiesPage />;
=======

import LandingPageLayout from "@/components/LandingPageLayout";
import SearchPropertiesPage from "@/features/search";
import { divIcon } from "leaflet";
import React from "react";

const SearchProperty = () => {
  return (
    <div>
      <LandingPageLayout>
        <SearchPropertiesPage />;
      </LandingPageLayout>
    </div>
  );
>>>>>>> 60563809696a3bc6abddc669975a77d75293a9ab
};

export default SearchProperty;
