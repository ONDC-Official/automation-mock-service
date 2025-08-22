import { MockSearchClass } from "./2.0.0/search/search/class";
import { MockOnSearchClass } from "./2.0.0/on_search/on_search/class";
import { MockSelectClass } from "./2.0.0/select/class";
import { MockOnSelectHospicashInsurencClass } from "./2.0.0/on_select/on_select_hospicash_insurence/class";
import { MockInitTransitInsurenceClass } from "./2.0.0/init/init_transit_insurence/class";
import { MockOnInitTransitClass } from "./2.0.0/on_init/on_init_transit_insurence/class";
import { MockConfirmTransitClass } from "./2.0.0/confirm/confirm_transit_insurence/class";
import { MockSearchInsurenceProviderClass } from "./2.0.0/search/search_insurence_provider/class";
import { MockOnSearchInsurenceProvidersClass } from "./2.0.0/on_search/on_search_insurence_providers/class";
import { MockSearchPurchaseJourneyTransitClass } from "./2.0.0/search/search_purchase_journey_transit/class";
import { MockOnSearchPurchaseJourneyTransitClass } from "./2.0.0/on_search/on_search_purchase_journey_transit/class";
import { MockOnSelectTransitInsurenceClass } from "./2.0.0/on_select/on_select_transit_insurence/class";
import { MockInitHospicashClass } from "./2.0.0/init/init_hospicash_insurence/class";
import { MockOnInitHospicashClass } from "./2.0.0/on_init/on_init_hospicash_insurence/class";
import { MockConfirmHospicashClass } from "./2.0.0/confirm/confirm_hospicash_insurence/class";
import { MockOnConfirmHospicashClass } from "./2.0.0/on_confirm/on_confirm_hospicash_insurence/class";
import { MockOnConfirmTransitClass } from "./2.0.0/on_confirm/on_confirm_transit_insurence/class";
import { MockOnupdateTransitClass } from "./2.0.0/on_update/on_update_transit/class";
import { MockOnupdateHospicashClass } from "./2.0.0/on_update/on_update_hospicash/class";
import { MockSearchPurchaseJourneyHospicashClass } from "./2.0.0/search/search_purchase_journey_hospicash/class";
import { MockOnSearchPurchaseJourneyHospicashClass } from "./2.0.0/on_search/on_search_purchase_journey_hospicash/class";

export function getFIS13MockAction(actionId: string) {
	console.log("actionIdactionIdactionIdactionId",actionId)
	switch (actionId) {
		case "search":
			return new MockSearchClass();
		case "search_purchase_journey_transit":
			return new MockSearchPurchaseJourneyTransitClass();
		case "search_purchase_journey_hospicash":
			return new MockSearchPurchaseJourneyHospicashClass();
		case "search_insurence_provider":
			return new MockSearchInsurenceProviderClass();
		case "on_search_purchase_journey_hospicash":
			return new MockOnSearchPurchaseJourneyHospicashClass();
		case "on_search_purchase_journey_transit":
			return new MockOnSearchPurchaseJourneyTransitClass();
		case "on_search":
			return new MockOnSearchClass();
		case "on_search_insurence_provider":
			return new MockOnSearchInsurenceProvidersClass();
		case "select":
			return new MockSelectClass();
		case "on_select":
			return new MockOnSelectTransitInsurenceClass();
		case "on_select_hospicash":
			return new MockOnSelectHospicashInsurencClass();
		case "init":
			return new MockInitTransitInsurenceClass();
		case "init_hospicash":
			return new MockInitHospicashClass();
		case "on_init":
			return new MockOnInitTransitClass();
		case "on_init_hospicash":
			return new MockOnInitHospicashClass();
		case "confirm":
			return new MockConfirmTransitClass();
		case "confirm_hospicash":
			return new MockConfirmHospicashClass();
		case "on_confirm":
			return new MockOnConfirmTransitClass();
		case "on_confirm_hospicash":
			return new MockOnConfirmHospicashClass();
		case "on_update":
			return new MockOnupdateTransitClass();
		case "on_update_hospicash":
			return new MockOnupdateHospicashClass();
		default:
			throw new Error(`Action with ID ${actionId} not found`);
	}
} 