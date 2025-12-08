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

  return existingPayload;
}
