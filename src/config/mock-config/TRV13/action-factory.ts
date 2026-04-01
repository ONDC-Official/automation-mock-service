import { MockSelectClass } from "./2.0.1/select/class";
import { MockOnSelectClass } from "./2.0.1/on_select/class";
import { MockInitClass } from "./2.0.1/init/class";
import { MockOnInitClass } from "./2.0.1/on_init/class";
import { MockConfirmClass } from "./2.0.1/confirm/class";
import { MockOnConfirmDefaultClass } from "./2.0.1/on_confirm/class";
import { MockStatusDefaultClass } from "./2.0.1/status/class";
import { MockOnStatusDefaultCityCodeClass, MockOnStatusDefaultClass, MockOnStatusDefaultUnsoliciatedClass } from "./2.0.1/on_status/class";
import { MockCancelClass } from "./2.0.1/cancel/class";
import { MockOnCancelDefaultClass } from "./2.0.1/on_cancel/class";
import { MockUpdateClass } from "./2.0.1/update/class";
import { MockOnUpdateClass } from "./2.0.1/on_update/class";
import { search_5_Hotel } from "./2.0.1/search/search_5/class";
import { MockOnSearch_5 } from "./2.0.1/on_search/on_search_5/class";
import { search_1_Hotel } from "./2.0.1/search/search_1/class";
import { search_6_Hotel } from "./2.0.1/search/search_6/class";
import { search_7_Hotel } from "./2.0.1/search/search_7/class";
import { MockOnSearch_1 } from "./2.0.1/on_search/on_search_1/class";
import { MockOnSearch_2 } from "./2.0.1/on_search/on_search_2/class";
import { MockOnSearch_3 } from "./2.0.1/on_search/on_search_3/class";
import { MockOnSearch_4 } from "./2.0.1/on_search/on_search_4/class";
import { MockOnSearch_6 } from "./2.0.1/on_search/on_search_6/class";
import { MockOnSearch_7 } from "./2.0.1/on_search/on_search_7/class";

export function getMockAction(actionId: string) {
  switch (actionId) {
    case "search_1":
      return new search_1_Hotel();
    case "on_search_1":
      return new MockOnSearch_1();
    // case "search_2":
    //   return new searchIncremental();
    case "on_search_2":
      return new MockOnSearch_2();
    // case "search_3":
    //   return new searchAvailablityOfHotel();
    case "on_search_3":
      return new MockOnSearch_3();
    // case "search_4":
    //   return new searchSpecificHotel();
    case "on_search_4":
      return new MockOnSearch_4();
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
      return new search_5_Hotel();
    case "on_search_5":
      return new MockOnSearch_5(); 
    case "search_6":
      return new search_6_Hotel();
    case "on_search_6":
      return new MockOnSearch_6();
    case "search_7":
      return new search_7_Hotel();
    case "on_search_7":
      return new MockOnSearch_7();
    // GPS-Based Flow - _5 suffixed actions (reuse existing classes)
    case "select_5":
      return new MockSelectClass();
    case "on_select_5":
      return new MockOnSelectClass();
    case "init_5":
      return new MockInitClass();
    case "on_init_5":
      return new MockOnInitClass();
    case "confirm_5":
      return new MockConfirmClass();
    case "on_confirm_5":
      return new MockOnConfirmDefaultClass();
    case "status_5":
      return new MockStatusDefaultClass();
    case "on_status_5":
      return new MockOnStatusDefaultClass();
    case "on_status_city_code":
      return new MockOnStatusDefaultCityCodeClass(); 
    case "on_status_unsoliciated":
      return new MockOnStatusDefaultUnsoliciatedClass();    
    case "update_5":
      return new MockUpdateClass();
    case "on_update_5":
      return new MockOnUpdateClass();
    case "cancel_5":
      return new MockCancelClass();
    case "on_cancel_5":
      return new MockOnCancelDefaultClass();
    case "on_cancel_unsolicited":
      return new MockOnCancelDefaultClass();       
    default:
      throw new Error(`Action with ID ${actionId} not found`);
  }
}
