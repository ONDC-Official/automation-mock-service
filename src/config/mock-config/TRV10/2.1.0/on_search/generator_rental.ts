import { SessionData } from "../../session-types";

function generateNearbyLocations(startGps:any, endGps:any) {
    const [startLat, startLon] = startGps.split(',').map(Number);

    const getRandomOffset = () => (Math.random() - 0.5) * 0.01; // Small offset (~1km)

    return [
        { gps: `${(startLat + getRandomOffset()).toFixed(6)},${(startLon + getRandomOffset()).toFixed(6)}`, id: "L1" },
        { gps: `${(startLat + getRandomOffset()).toFixed(6)},${(startLon + getRandomOffset()).toFixed(6)}`, id: "L2" },
        { gps: `${(startLat + getRandomOffset()).toFixed(6)},${(startLon + getRandomOffset()).toFixed(6)}`, id: "L3" },
        { gps: `${(startLat + getRandomOffset()).toFixed(6)},${(startLon + getRandomOffset()).toFixed(6)}`, id: "L4" }
    ];
}
export async function onSearchMultipleStopsRentalGenerator(existingPayload: any, sessionData: SessionData) {
    console.log(existingPayload.message.catalog.providers[0].fulfillments)
    for(let fulfillment of existingPayload.message.catalog.providers[0].fulfillments){
        if(fulfillment.type === "START"){
            fulfillment.stops = sessionData.stops
        }
    }
    if(existingPayload.message.catalog.providers[0].locations){
        const locations = generateNearbyLocations(sessionData.start_location,sessionData.end_location)
        existingPayload.message.catalog.providers[0].locations = locations
    }
    return existingPayload;
}