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
// on_search
import { MockOnSearchSellerPagination1Class } from "./2.0.0/on_search/on_search_seller_pagination/on_search_seller_pagination_1/class";
import { MockOnSearchSellerPagination2Class } from "./2.0.0/on_search/on_search_seller_pagination/on_search_seller_pagination_2/class";
import { MockOnSearchSellerPagination3Class } from "./2.0.0/on_search/on_search_seller_pagination/on_search_seller_pagination_3/class";
import { MockOnSearchIncrementalPull1Class } from "./2.0.0/on_search/on_search_incremental_pull/on_search_incremental_pull_1/class";
import { MockOnSearchIncrementalPull2Class } from "./2.0.0/on_search/on_search_incremental_pull/on_search_incremental_pull_2/class";
import { MockOnSearchIncrementalPull3Class } from "./2.0.0/on_search/on_search_incremental_pull/on_search_incremental_pull_3/class";
// on_confirm
import { MockOnConfirmTechnicalCancellationClass } from "./2.0.0/on_confirm/on_confirm_technical_cancellation/class";
import { MockOnConfirmUserCancellationClass } from "./2.0.0/on_confirm/on_confirm_user_cancellation/class";
import { MockOnConfirmPartialCancellationClass } from "./2.0.0/on_confirm/on_confirm_partial_cancellation/class";
// status
import { MockStatusUserCancellationClass } from "./2.0.0/status/status_user_cancellation/class";
import { MockStatusTechnicalCancellationClass } from "./2.0.0/status/status_technical_cancellation/class";
// on_status
import { MockOnStatusUserCancellationClass } from "./2.0.0/on_status/on_status_user_cancellation/class";
import { MockOnStatusTechnicalCancellationClass } from "./2.0.0/on_status/on_status_technical_cancellation/class";
// cancel
import { MockCancelSoftUserCancellationClass } from "./2.0.0/cancel/cancel_soft_user_cancellation/class";
import { MockCancelSoftPartialCancellationClass } from "./2.0.0/cancel/cancel_soft_partial_cancellation/class";
import { MockCancelSoftTechnicalCancellationClass } from "./2.0.0/cancel/cancel_soft_technical_cancellation/class";
import { MockCancelConfirmUserCancellationClass } from "./2.0.0/cancel/cancel_confirm_user_cancellation/class";
import { MockCancelConfirmTechnicalCancellationClass } from "./2.0.0/cancel/cancel_confirm_technical_cancellation/class";
// on_cancel
import { MockOnCancelSoftUserCancellationClass } from "./2.0.0/on_cancel/on_cancel_soft_user_cancellation/class";
import { MockOnCancelSoftPartialCancellationClass } from "./2.0.0/on_cancel/on_cancel_soft_partial_cancellation/class";
import { MockOnCancelSoftTechnicalCancellationClass } from "./2.0.0/on_cancel/on_cancel_soft_technical_cancellation/class";
import { MockOnCancelConfirmUserCancellationClass } from "./2.0.0/on_cancel/on_cancel_confirm_user_cancellation/class";
import { MockOnCancelConfirmTechnicalCancellationClass } from "./2.0.0/on_cancel/on_cancel_confirm_technical_cancellation/class";

export function getMockAction(actionId: string) {
	switch (actionId) {
		case "search_seller_pagination":
			return new MockOnSearchSellerPagination1Class();
		case "on_search_seller_pagination_1":
			return new MockOnSearchSellerPagination1Class();
		case "on_search_seller_pagination_2":
			return new MockOnSearchSellerPagination2Class();
		case "on_search_seller_pagination_3":
			return new MockOnSearchSellerPagination3Class();
		case "search_incremental_pull":
			return new MockOnSearchIncrementalPull1Class();
		case "on_search_incremental_pull_1":
			return new MockOnSearchIncrementalPull1Class();
		case "on_search_incremental_pull_2":
			return new MockOnSearchIncrementalPull2Class();
		case "on_search_incremental_pull_3":
			return new MockOnSearchIncrementalPull3Class();
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
		case "cancel":
			return new MockCancelClass();
		case "on_cancel":
			return new MockOnCancelDefaultClass();
		case "on_confirm_technical_cancellation":
			return new MockOnConfirmTechnicalCancellationClass();
		case "status_technical_cancellation":
			return new MockStatusTechnicalCancellationClass();
		case "on_status_technical_cancellation":
			return new MockOnStatusTechnicalCancellationClass();
		case "cancel_soft_technical_cancellation":
			return new MockCancelSoftTechnicalCancellationClass();
		case "on_cancel_soft_technical_cancellation":
			return new MockOnCancelSoftTechnicalCancellationClass();
		case "cancel_confirm_technical_cancellation":
			return new MockCancelConfirmTechnicalCancellationClass();
		case "on_cancel_confirm_technical_cancellation":
			return new MockOnCancelConfirmTechnicalCancellationClass();
		case "on_confirm_user_cancellation":
			return new MockOnConfirmUserCancellationClass();
		case "status_user_cancellation":
			return new MockStatusUserCancellationClass();
		case "on_status_user_cancellation":
			return new MockOnStatusUserCancellationClass();
		case "cancel_soft_user_cancellation":
			return new MockCancelSoftUserCancellationClass();
		case "on_cancel_soft_user_cancellation":
			return new MockOnCancelSoftUserCancellationClass();
		case "cancel_confirm_user_cancellation":
			return new MockCancelConfirmUserCancellationClass();
		case "on_cancel_confirm_user_cancellation":
			return new MockOnCancelConfirmUserCancellationClass();
		case "on_confirm_partial_cancellation":
			return new MockOnConfirmPartialCancellationClass();
		case "cancel_soft_partial_cancellation":
			return new MockCancelSoftPartialCancellationClass();
		case "on_cancel_soft_partial_cancellation":
			return new MockOnCancelSoftPartialCancellationClass();
		default:
			throw new Error(`Action with ID ${actionId} not found`);
	}
} 