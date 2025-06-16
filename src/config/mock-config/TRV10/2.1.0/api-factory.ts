import { cancelMultipleStopsSoftGenerator } from "./cancel/generator-soft-cancel";
import { confirmMultipleStopsGenerator } from "./confirm/generator_multiple_stops";
import { initMultipleStopsGenerator } from "./init/generator_multiple_stops";
import { onCancelSoftGenerator } from "./on_cancel/on_cancel_soft/generator_soft_cancel";
import { onConfirmMultipleStopsGenerator } from "./on_confirm/on_confirm_driver_assigned/generator_multiple_stops";
import { onInitMultipleStopsGenerator } from "./on_init/generator_multiple_stops";
import { onSearchMultipleStopsGenerator } from "./on_search/generator_multiple_stops";
import { onSearchMultipleStopsRentalGenerator } from "./on_search/generator_rental";
import { onSelectMultipleStopsGenerator } from "./on_select/generator_multiple_stops";
import { onStatusRideArrivedGenerator } from "./on_status/generator_ride_arrived";
import { onStatusRidePaidGenerator } from "./on_status/generator_ride_paid";
import { onStatusRideEnrouteGenerator } from "./on_status/generator_ride_pickup";
import { onStatusRideStartedGenerator } from "./on_status/generator_ride_started";
import { onTrackMultipleStopsGenerator } from "./on_track/generator_multiple_stops";
import { onUpdateRideSoftUpdateGenerator } from "./on_update/generator_ride_soft_update";
import { onUpdateRideUpdatedGenerator } from "./on_update/generator_ride_updated";
import { onUpdateUpdateQuoteGenerator } from "./on_update/generator_update_quote";
import { searchGenerator } from "./search/generator";
import { onSearchGenerator} from "./on_search/generator"
import { searchMultipleStopsGenerator } from "./search/generator_multiple_stops";
import { searchMultipleStopsRentalGenerator } from "./search/generator_rental";
import { searchMultipleStopsRentalEndGenerator } from "./search/generator_rental_end";
import { selectMultipleStopsGenerator } from "./select/generator";
import { statusMultipleStopsGenerator } from "./status/generator_multiple_stops";
import { trackMultipleStopsGenerator } from "./track/generator_multiple_stops";
import { updateFulfillmentSoftGenerator } from "./update_/generator_fulfillment";
import { updateFulfillmentHardGenerator } from "./update_/generator_fulfillment_hard";
import { updateQuoteGenerator } from "./update_/generator_quote";
import { onSelectGenerator } from "./on_select/generator";
import { initGenerator } from "./init/generator";
import { onInitGenerator } from "./on_init/generator";
import { confirmGenerator } from "./confirm/generator";
import { onConfirmGenerator } from "./on_confirm/on_confirm_driver_assigned/generator";
import { trackGenerator } from "./track/generator";
import { onUpdateGenerator } from "./on_update/generator";
import { statusGenerator } from "./status/generator";
import { onConfirmDriverNotFound } from "./on_confirm/on_confirm_driver_not_found/generator";
import { onConfirmDriverNotAssignedGenerator } from "./on_confirm/on_confirm_driver_not_assigned/generator";
import { onCancelAsyncGenerator } from "./on_cancel/on_cancel_async/generator";
import { cancelMultipleStopsHardGenerator } from "./cancel/generator-hard-cancel";
import { onCancelHardGenerator } from "./on_cancel/on_cancel_hard/generator";
import { onCancelRiderNotFoundGenerator } from "./on_cancel/on_cancel_rider_not_found/generator";
import { onUpdateMultipleStopsGenerator } from "./on_update/generator_multiple_stops";
import { onStatusRideAssignedGenerator } from "./on_status/generator_ride_assigned";
import { onUpdateRideEndedGenerator } from "./on_update/generator_ride_ended";
import { selectPreOrderBidGenerator } from "./select/generator-pre-order-bid";
import { selectMultipleStopsRentalGenerator } from "./select/generator-rental";
import { onSelectMultipleStopsRentalGenerator } from "./on_select/generator-rental";
import { searchMultipleStopsScheduleRentalGenerator } from "./search/generator-schedule-rental";
import { onSearchScheduleRentalGenerator } from "./on_search/generator_schedule_rental";
import { onUpdateRideAssignedGenerator } from "./on_update/generator_ride_assigned";
import { searchMultipleStopsScheduleTripGenerator } from "./search/generator-schedule-trip";
import { onSelectMultipleStopsPreOrderGenerator } from "./on_select/generator-pre-order-bid";
import { onConfirmMultipleStopsRentalGenerator } from "./on_confirm/generator-rental";


export async function Generator(
    action_id: string,
    existingPayload: any,
    sessionData: any
) {
    switch (action_id) {
        case "search":
            return await searchMultipleStopsGenerator(existingPayload, sessionData);
        case "on_search":
            return await onSearchMultipleStopsGenerator(existingPayload, sessionData);
        case "select":
            return await selectMultipleStopsGenerator(existingPayload, sessionData);
        case "on_select":
            return await onSelectMultipleStopsGenerator(existingPayload, sessionData);
        case "init":
            return await initMultipleStopsGenerator(existingPayload, sessionData);
        case "on_init":
            return await onInitMultipleStopsGenerator(existingPayload, sessionData);
        case "confirm":
            return await confirmMultipleStopsGenerator(existingPayload, sessionData);
        case "on_confirm":
            return await onConfirmMultipleStopsGenerator(existingPayload, sessionData);
        case "on_status_unsolicited":
            return await onStatusRideEnrouteGenerator(existingPayload, sessionData);
        case "track":
            return await trackMultipleStopsGenerator(existingPayload, sessionData);
        case "on_track":
            return await onTrackMultipleStopsGenerator(existingPayload, sessionData);
        case "on_status_ride_arrived":
            return await onStatusRideArrivedGenerator(existingPayload, sessionData);
        case "on_status_ride_arrived_2":
            return await onStatusRideArrivedGenerator(existingPayload, sessionData);
        case "on_status_ride_started":
            return await onStatusRideStartedGenerator(existingPayload, sessionData);
        case "on_update":
            return await onUpdateRideEndedGenerator(existingPayload, sessionData);
        case "status":
            return await statusMultipleStopsGenerator(existingPayload, sessionData);
        case "on_status_solicited":
            return await onStatusRidePaidGenerator(existingPayload, sessionData);
        case "update":
            return await updateFulfillmentSoftGenerator(existingPayload, sessionData);
        case "on_update_soft_update":
            return await onUpdateRideSoftUpdateGenerator(existingPayload, sessionData);
        case "update_hard":
            return await updateFulfillmentHardGenerator(existingPayload, sessionData);
        case "on_update_ride_updated":
            return await onUpdateRideUpdatedGenerator(existingPayload, sessionData);
        case "update_quote":
            return await updateQuoteGenerator(existingPayload, sessionData);
        case "on_update_quote":
            return await onUpdateUpdateQuoteGenerator(existingPayload, sessionData);
        case "search_rental":
            return await searchMultipleStopsRentalGenerator(existingPayload, sessionData);
        case "on_search_rental":
            return await onSearchMultipleStopsRentalGenerator(existingPayload, sessionData);
        case "search_rental_end":
            return await searchMultipleStopsRentalEndGenerator(existingPayload, sessionData);
        case "on_search_rental_end":
            return await onSearchMultipleStopsGenerator(existingPayload, sessionData);
        case "cancel":
            return await cancelMultipleStopsSoftGenerator(existingPayload, sessionData);
        case "cancel_hard":
            return await cancelMultipleStopsHardGenerator(existingPayload, sessionData);
        case "on_cancel":
            return await onCancelSoftGenerator(existingPayload, sessionData);
        case "search_ride":
            return await searchGenerator(existingPayload, sessionData);
        case "on_search_ride":
            return await onSearchGenerator(existingPayload, sessionData);    
        case "select_ride":
            return await selectMultipleStopsGenerator(existingPayload, sessionData);  
        case "on_select_ride":
                return await onSelectGenerator(existingPayload, sessionData);      
        case "init_ride":
                return await initGenerator(existingPayload, sessionData);  
        case "on_init_ride":
                return await onInitGenerator(existingPayload, sessionData);      
        case "confirm_ride":
                return await confirmGenerator(existingPayload, sessionData);   
        case "on_confirm_ride":
                 return await onConfirmGenerator(existingPayload, sessionData); 
        case "on_status_ride":
                return await onStatusRideStartedGenerator(existingPayload, sessionData);
        case "track_ride":
                return await trackGenerator(existingPayload, sessionData);
        case "on_track_ride":
                return await onTrackMultipleStopsGenerator(existingPayload, sessionData); 
        case "on_update_ride":
                return await onUpdateGenerator(existingPayload, sessionData); 
        case "status_ride":
                return await statusGenerator(existingPayload, sessionData);      
        case "on_cancel_ride_cancel":
                return await onCancelSoftGenerator(existingPayload, sessionData); 
        case "on_init_driver_pruple":
                return await onInitGenerator(existingPayload, sessionData);     
        case "on_confirm_driver_not_found":
                return await onConfirmDriverNotFound(existingPayload, sessionData);     
        case "on_confirm_driver_not_assigned":
            return await onConfirmDriverNotAssignedGenerator(existingPayload, sessionData); 
        case "track_ride_update":
            return await trackGenerator(existingPayload, sessionData);
        case "on_cancel_async":
            return await onCancelAsyncGenerator(existingPayload,sessionData)
        case "on_cancel_hard":
            return await onCancelHardGenerator(existingPayload,sessionData)
        case "on_cancel_rider_not_found":
            return await onCancelRiderNotFoundGenerator(existingPayload,sessionData)
        case "select_preorder_bid":
            return await selectPreOrderBidGenerator(existingPayload, sessionData);
        case "select_rental":
            return await selectMultipleStopsRentalGenerator(existingPayload,sessionData)
        case "on_select_rental":
            return await onSelectMultipleStopsRentalGenerator(existingPayload,sessionData)
        case "search_schedule_rental":
            return await searchMultipleStopsScheduleRentalGenerator(existingPayload,sessionData)
        case "on_search_schedule_rental":
            return await onSearchScheduleRentalGenerator(existingPayload,sessionData)
        case "on_update_ride_assigned":
            return await onUpdateRideAssignedGenerator(existingPayload,sessionData)
        case "search_schedule_trip":
            return await searchMultipleStopsScheduleTripGenerator(existingPayload,sessionData)
        case "on_search_schedule_trip":
            return await onSearchMultipleStopsGenerator(existingPayload,sessionData)
        case "on_select_preorder":
            return await onSelectMultipleStopsPreOrderGenerator(existingPayload,sessionData)
        case "on_confirm_rental":
            return await onConfirmMultipleStopsRentalGenerator(existingPayload,sessionData)
        default:
                throw new Error(`Invalid request type ${action_id}`);
        }
}
