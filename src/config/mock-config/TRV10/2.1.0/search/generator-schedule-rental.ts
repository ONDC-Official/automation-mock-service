import { SessionData } from "../../session-types";

export async function searchMultipleStopsScheduleRentalGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const { city_code, scheduled_time, start_gps } = sessionData?.user_inputs;
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 6);
  existingPayload.message.intent.fulfillment.stops[0].time.timestamp =
    futureDate;

  if (city_code) {
    existingPayload.context.location.city.code = city_code;
  }

  if (start_gps || scheduled_time) {
    const startStop = existingPayload.message.intent.fulfillment.stops.find(
      (s: any) => s.type === "START"
    );
    if (startStop) {
      if (start_gps) {
        startStop.location.gps = start_gps;
      }
      if (scheduled_time) {
        //convert scheduled_time to IST
        const updatedTime = new Date(
          new Date(scheduled_time).toLocaleString(undefined, {
            timeZone: "Asia/Kolkata",
          })
        )
          .toLocaleString("sv-SE", { hour12: false })
          .replace(" ", "T");
        console.log("time", updatedTime, updatedTime + ".000Z");

        startStop.time = {
          ...(startStop.time || {}),
          timestamp: updatedTime + ".000Z",
        };
      }
    }
  }

  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;
  return existingPayload;
}
