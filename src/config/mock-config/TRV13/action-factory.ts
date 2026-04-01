import { MockSelectClass } from "./2.0.0/select/class";
import { MockOnSelectClass } from "./2.0.0/on_select/class";
import { SelectCityBased } from "./2.0.0/select/select_1/class";
import { SelectIncremental } from "./2.0.0/select/select_2/class";
import { SelectTimeRangeBased } from "./2.0.0/select/select_3/class";
import { SelectProviderSpecific } from "./2.0.0/select/select_4/class";
import { OnSelectCityBased } from "./2.0.0/on_select/on_select_1/class";
import { OnSelectIncremental } from "./2.0.0/on_select/on_select_2/class";
import { OnSelectTimeRangeBased } from "./2.0.0/on_select/on_select_3/class";
import { OnSelectProviderSpecific } from "./2.0.0/on_select/on_select_4/class";
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
import { InitCityBased } from "./2.0.0/init/init_1/class";
import { InitTimeRangeBased } from "./2.0.0/init/init_3/class";
import { InitProviderSpecific } from "./2.0.0/init/init_4/class";
import { OnInitCityBased } from "./2.0.0/on_init/on_init_1/class";
import { OnInitTimeRangeBased } from "./2.0.0/on_init/on_init_3/class";
import { OnInitProviderSpecific } from "./2.0.0/on_init/on_init_4/class";
import { ConfirmCityBased } from "./2.0.0/confirm/confirm_1/class";
import { ConfirmTimeRangeBased } from "./2.0.0/confirm/confirm_3/class";
import { ConfirmProviderSpecific } from "./2.0.0/confirm/confirm_4/class";
import { OnConfirmCityBased } from "./2.0.0/on_confirm/on_confirm_1/class";
import { OnConfirmTimeRangeBased } from "./2.0.0/on_confirm/on_confirm_3/class";
import { OnConfirmProviderSpecific } from "./2.0.0/on_confirm/on_confirm_4/class";
import { StatusCityBased } from "./2.0.0/status/status_1/class";
import { StatusTimeRangeBased } from "./2.0.0/status/status_3/class";
import { StatusProviderSpecific } from "./2.0.0/status/status_4/class";
import { OnStatusCityBased } from "./2.0.0/on_status/on_status_1/class";
import { OnStatusTimeRangeBased, OnStatusUnsoliciated } from "./2.0.0/on_status/on_status_3/class";
import { OnStatusProviderSpecific } from "./2.0.0/on_status/on_status_4/class";
import { SearchCityBased } from "./2.0.0/search/search_1/class";
import { SearchIncremental } from "./2.0.0/search/search_2/class";
import { SearchTimeRangeBased } from "./2.0.0/search/search_3/class";
import { SearchProviderSpecific } from "./2.0.0/search/search_4/class";
import { OnSearchCityBased } from "./2.0.0/on_search/on_search_1/class";
import { OnSearchIncremental } from "./2.0.0/on_search/on_search_2/class";
import { OnSearchTimeRangeBased } from "./2.0.0/on_search/on_search_3/class";
import { OnSearchProviderSpecific } from "./2.0.0/on_search/on_search_4/class";
import { SearchTTLBased } from "./2.0.0/search/search_5/class";
import { OnSearchTTLBased } from "./2.0.0/on_search/on_search_5/class";

export function getMockAction(actionId: string) {
  switch (actionId) {
    case "search_1":
      return new SearchCityBased();
    case "on_search_1":
      return new OnSearchCityBased();
    case "search_2":
      return new SearchIncremental();
    case "on_search_2":
      return new OnSearchIncremental();
    case "search_3":
      return new SearchTimeRangeBased();
    case "on_search_3":
      return new OnSearchTimeRangeBased();
    case "search_4":
      return new SearchProviderSpecific();
    case "on_search_4":
      return new OnSearchProviderSpecific();
    case "select":
      return new MockSelectClass();
    case "on_select":
      return new MockOnSelectClass();
    case "select_1":
      return new SelectCityBased();
    case "on_select_1":
      return new OnSelectCityBased();
    case "select_2":
      return new SelectIncremental();
    case "on_select_2":
      return new OnSelectIncremental();
    case "select_3":
      return new SelectTimeRangeBased();
    case "on_select_3":
      return new OnSelectTimeRangeBased();
    case "select_4":
      return new SelectProviderSpecific();
    case "on_select_4":
      return new OnSelectProviderSpecific();
    case "init":
      return new MockInitClass();
    case "on_init":
      return new MockOnInitClass();
    case "init_1":
      return new InitCityBased();
    case "on_init_1":
      return new OnInitCityBased();
    case "init_3":
      return new InitTimeRangeBased();
    case "on_init_3":
      return new OnInitTimeRangeBased();
    case "init_4":
      return new InitProviderSpecific();
    case "on_init_4":
      return new OnInitProviderSpecific();
    case "confirm":
      return new MockConfirmClass();
    case "on_confirm":
      return new MockOnConfirmDefaultClass();
    case "confirm_1":
      return new ConfirmCityBased();
    case "on_confirm_1":
      return new OnConfirmCityBased();
    case "confirm_3":
      return new ConfirmTimeRangeBased();
    case "on_confirm_3":
      return new OnConfirmTimeRangeBased();
    case "confirm_4":
      return new ConfirmProviderSpecific();
    case "on_confirm_4":
      return new OnConfirmProviderSpecific();
    case "status":
      return new MockStatusDefaultClass();
    case "on_status":
      return new MockOnStatusDefaultClass();
    case "status_1":
      return new StatusCityBased();
    case "on_status_1":
      return new OnStatusCityBased();
    case "status_3":
      return new StatusTimeRangeBased();
    case "on_status_3":
      return new OnStatusTimeRangeBased();
    case "on_status_unsoliciated":
      return new OnStatusUnsoliciated();    
    case "status_4":
      return new StatusProviderSpecific();
    case "on_status_4":
      return new OnStatusProviderSpecific();
    case "update":
      return new MockUpdateClass();
    case "on_update":
      return new MockOnUpdateClass();
    case "cancel":
      return new MockCancelClass();
    case "on_cancel":
      return new MockOnCancelDefaultClass();
    case "search_5":
      return new SearchTTLBased();
    case "on_search_5":
      return new OnSearchTTLBased();    
    default:
      throw new Error(`Action with ID ${actionId} not found`);
  }
}
