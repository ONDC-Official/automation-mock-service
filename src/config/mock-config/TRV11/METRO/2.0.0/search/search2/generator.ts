import { SessionData } from "../../../../session-types";


function getRandomStations(data: any) {
    // Flatten all stops across all fulfillments
    const allStops = data.flatMap((fulfillment: any) => fulfillment.stops);

    // Get two unique random indices
    let firstIndex = Math.floor(Math.random() * allStops.length);
    let secondIndex: number;
  
    do {
      secondIndex = Math.floor(Math.random() * allStops.length);
    } while (secondIndex === firstIndex); // Ensure the indices are different
  
    // Return the randomly selected stops
    return {
      start_station: allStops[firstIndex].location.descriptor.code,
      end_station: allStops[secondIndex].location.descriptor.code
    };
  }

export async function search2Generator(existingPayload: any,sessionData: SessionData){
    existingPayload.context.bpp_uri = sessionData.subscriber_url
    const stops = existingPayload.message.intent.fulfillment.stops;
    stops[0].location.descriptor.code = "start_station"
    stops[1].location.descriptor.code = "end_station"
    if(sessionData.user_inputs){
      const {start_stop_code, end_stop_code, city_code, collector} = sessionData.user_inputs
      if(start_stop_code){
        stops[0].location.descriptor.code = start_stop_code
      }
      if(end_stop_code){
        stops[1].location.descriptor.code = end_stop_code
      }
      if(city_code){
        existingPayload.context.location.city.code = city_code
      }
      if(collector){
        existingPayload.message.intent.payment.collected_by = collector
      }
    }

    return existingPayload;
}