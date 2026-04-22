import { SessionData } from "../../session-types";

function generateNearbyLocations(startGps: any, endGps: any) {
  const [startLat, startLon] = startGps.split(",").map(Number);

  const getRandomOffset = () => (Math.random() - 0.5) * 0.01;

  return [
    {
      gps: `${(startLat + getRandomOffset()).toFixed(6)},${(
        startLon + getRandomOffset()
      ).toFixed(6)}`,
      id: "L1",
    },
    {
      gps: `${(startLat + getRandomOffset()).toFixed(6)},${(
        startLon + getRandomOffset()
      ).toFixed(6)}`,
      id: "L2",
    },
    {
      gps: `${(startLat + getRandomOffset()).toFixed(6)},${(
        startLon + getRandomOffset()
      ).toFixed(6)}`,
      id: "L3",
    },
    {
      gps: `${(startLat + getRandomOffset()).toFixed(6)},${(
        startLon + getRandomOffset()
      ).toFixed(6)}`,
      id: "L4",
    },
  ];
}

export async function onSearchMultipleStopsRentalGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const { start_location, end_location, stops } = sessionData;

  if (!start_location) {
    throw new Error("Start location is required");
  }

  const provider = existingPayload.message.catalog.providers[0];

  for (const fulfillment of provider.fulfillments) {
    if (fulfillment.stops && Array.isArray(fulfillment.stops)) {
      for (const stop of fulfillment.stops) {
        if (stop.type === "START") {
          stop.location.gps = start_location;

          if (stop.location?.circle) {
            stop.location.circle.gps = start_location;
          }
        }

        if (stop.type === "END") {
          if (stop.location?.gps) {
            stop.location.gps = start_location;
          }

          if (stop.location?.circle) {
            stop.location.circle.gps = start_location;
          }
        }
      }
    }
  }

  if (provider.locations) {
    const locations = generateNearbyLocations(start_location, start_location);
    provider.locations = locations;
  }

  // Extract BAP_TERMS from search_tags
  const searchTags = (sessionData as any).search_tags?.flat() ?? [];
  const bapTerms = searchTags.find(
    (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
  );
  const bapList: any[] = bapTerms?.list ?? [];
  const fromBap = (code: string) =>
    bapList.find((item: any) => item?.descriptor?.code === code);

  // Base BPP_TERMS list
  let bppList = [
    { descriptor: { code: "BUYER_FINDER_FEES_PERCENTAGE" }, value: "1" },
    { descriptor: { code: "SETTLEMENT_WINDOW" }, value: "PT60M" },
    { descriptor: { code: "SETTLEMENT_BASIS" }, value: "DELIVERY" },
    { descriptor: { code: "SETTLEMENT_TYPE" }, value: "UPI" },
    { descriptor: { code: "MANDATORY_ARBITRATION" }, value: "true" },
    { descriptor: { code: "COURT_JURISDICTION" }, value: "New Delhi" },
    { descriptor: { code: "DELAY_INTEREST" }, value: "5" },
    {
      descriptor: { code: "STATIC_TERMS" },
      value: "https://example-test-bpp.com/static-terms.txt",
    },
  ];

  // Override BUYER_FINDER_FEES_PERCENTAGE and DELAY_INTEREST from BAP_TERMS
  const codesToOverride = ["BUYER_FINDER_FEES_PERCENTAGE", "DELAY_INTEREST"];
  bppList = bppList.map((item) => {
    if (codesToOverride.includes(item.descriptor.code)) {
      const bapItem = fromBap(item.descriptor.code);
      if (bapItem) return { ...item, value: bapItem.value };
    }
    return item;
  });

  existingPayload.message.catalog.tags = [
    {
      descriptor: { code: "BPP_TERMS", name: "BPP Terms of Engagement" },
      list: bppList,
    },
  ];
  return existingPayload;
}
