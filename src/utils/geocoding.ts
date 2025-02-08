import opencage from "opencage-api-client";

export async function getCoordinates(
  province: string,
  city: string,
): Promise<[number, number] | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

  if (!apiKey) {
    console.error("OpenCage API key is not set");
    return null;
  }

  try {
    const response = await opencage.geocode({
      q: `${city}, ${province}, Indonesia`,
      key: apiKey,
    });

    if (response.results.length > 0) {
      const { lat, lng } = response.results[0].geometry;
      return [lat, lng];
    } else {
      console.error("No results found for the given location");
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}
