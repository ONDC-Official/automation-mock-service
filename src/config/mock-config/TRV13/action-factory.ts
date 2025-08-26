import { MockSelectClass } from "./2.0.0/select/class";
import { MockOnSelectClass } from "./2.0.0/on_select/class";
import { MockInitClass } from "./2.0.0/init/class";
import { MockOnInitClass } from "./2.0.0/on_init/class";
import { MockConfirmClass } from "./2.0.0/confirm/class";
import { MockOnConfirmDefaultClass } from "./2.0.0/on_confirm/class";
import { MockStatusDefaultClass } from "./2.0.0/status/class";
import { MockOnStatusDefaultClass } from "./2.0.0/on_status/class";
import { MockCancelClass } from "./2.0.0/cancel/class";
import { MockOnCancelDefaultClass } from "./2.0.0/on_cancel/class";
import { MockUpdateClass } from "./2.0.0/update/class";
import { MockOnUpdateClass } from "./2.0.0/on_update/class";
import { searchCityBased } from "./2.0.0/search/search_city_based/class";
import { searchIncremental } from "./2.0.0/search/search_incremental/class";
import { searchAvailablityOfHotel } from "./2.0.0/search/search_availablity_of_hotel/class";
import { searchSpecificHotel } from "./2.0.0/search/search_specific_hotel/class";
import { MockOnSearchParticularCity } from "./2.0.0/on_search/on_search_particular_city/class";
import { MockOnSearchDeltaChange } from "./2.0.0/on_search/on_search_delta_changes/class";
import { MockOnSearchAvailableAccomodation } from "./2.0.0/on_search/on_search_available_accomodation/class";
import { MockOnSearchSellerParticularProvider } from "./2.0.0/on_search/on_search_particular_provider/class";
import { searchTTLBased } from "./2.0.0/search/search_5/class";
import { MockOnSearchTTLBased } from "./2.0.0/on_search/on_search_5/class";

export function getMockAction(actionId: string) {
  switch (actionId) {
    case "search_1":
      return new searchCityBased();
    case "on_search_1":
      return new MockOnSearchParticularCity();
    case "search_2":
      return new searchIncremental();
    case "on_search_2":
      return new MockOnSearchDeltaChange();
    case "search_3":
      return new searchAvailablityOfHotel();
    case "on_search_3":
      return new MockOnSearchAvailableAccomodation();
    case "search_4":
      return new searchSpecificHotel();
    case "on_search_4":
      return new MockOnSearchSellerParticularProvider();
    case "select":
      return new MockSelectClass();
    case "on_select":
      return new MockOnSelectClass();
    case "init":
      return new MockInitClass();
    case "on_init":
      return new MockOnInitClass();
    case "confirm":
      return new MockConfirmClass();
    case "on_confirm":
      return new MockOnConfirmDefaultClass();
    case "status":
      return new MockStatusDefaultClass();
    case "on_status":
      return new MockOnStatusDefaultClass();
    case "update":
      return new MockUpdateClass();
    case "on_update":
      return new MockOnUpdateClass();
    case "cancel":
      return new MockCancelClass();
    case "on_cancel":
      return new MockOnCancelDefaultClass();
    case "search_5":
      return new searchTTLBased();
    case "on_search_5":
      return new MockOnSearchTTLBased();    
    default:
      throw new Error(`Action with ID ${actionId} not found`);
  }
}
