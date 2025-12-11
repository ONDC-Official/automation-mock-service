import { Input, SessionData } from "../../../session-types";
import { removeTagsByCodes } from "../../../../../../utils/generic-utils";
import { log } from "util";

const getPayemntFields = (paymentType: string) => {
  if (paymentType === "ON-ORDER" || paymentType === "ON-FULFILLMENT") {
    return { collected_by: "BPP" };
  }

  if (paymentType === "POST-FULFILLMENT") {
    return {
      collected_by: "BAP",
      "@ondc/org/settlement_basis": "invoicing",
      "@ondc/org/settlement_window": "P15D",
    };
  }
};

export const initGenerator = async (
  existingPayload: any,
  sessionData: SessionData,
  inputs: any,
  action_id: string,
) => {
  existingPayload.message.order.provider.id = sessionData.provider_id;
  // existingPayload.message.order.provider.locations[0].id =
  //   sessionData.location_id;

  sessionData?.on_search_items?.forEach((item: any) => {
    console.log("on_search_items", sessionData.on_search_items);
    const fulfillment_id = action_id === "init_REVERSE_QC_LOGISTICS" ? sessionData?.on_search_return_fulfillment.id : sessionData.on_search_fulfillment.id

    if (item.fulfillment_id === fulfillment_id) {
      let isBaseItem = false;
      let isCodTagPresent = false;
      let isRiderTagPresent = false;
      let isSurgeTagPresent = false;

      if (item?.tags?.length) {
        item.tags[0].list.forEach((val: any) => {
          if (val.value === "base" && item?.parent_item_id === "") {
            isBaseItem = true;
          }
          if (val.value === "cod") {
            isCodTagPresent = true;
          }
          if (val.value === "surge") {
            isSurgeTagPresent = true;
          }
          if (val.value === "rider" || val.value === "order") {
            isRiderTagPresent = true;
          }
        });
      }

      // cod yes && base > select
      // !rate_basis && !base > select with tag
      //

      if (!isCodTagPresent && !isRiderTagPresent && !isSurgeTagPresent) {
        existingPayload.message.order.items[0] = {
          id: item.id,
          fulfillment_id: sessionData?.rate_basis
            ? ""
            : fulfillment_id,
          category_id: item.category_id,
          tags:
            sessionData?.is_cod === "yes" || sessionData?.rate_basis
              ? item?.tags
              : undefined,
        };
      }

      // if (!isBaseItem && !sessionData?.rate_basis) {
      //   existingPayload.message.order.items[0] = {
      //     id: item.id,
      //     fulfillment_id: sessionData.on_search_fulfillment.id,
      //     category_id: item.category_id,
      //   };
      // } else if (sessionData?.is_cod === "yes" && isBaseItem) {
      //   existingPayload.message.order.items[0] = {
      //     id: item.id,
      //     fulfillment_id: sessionData.on_search_fulfillment.id,
      //     category_id: item.category_id,
      //     tags: item?.tags,
      //   };
      // } else if (!(sessionData?.is_cod === "yes") && isBaseItem) {
      //   existingPayload.message.order.items[0] = {
      //     id: item.id,
      //     fulfillment_id:
      //       sessionData?.rate_basis === "rider" ||
      //       sessionData?.rate_basis === "order"
      //         ? ""
      //         : sessionData.on_search_fulfillment.id,
      //     category_id: item.category_id,
      //     tags: sessionData?.is_cod === "yes" ? item?.tags : undefined,
      //   };
      // }

      if (
        sessionData?.is_cod === "yes" &&
        item.tags[0].list[0].value === "cod"
      ) {
        existingPayload.message.order.items[1] = {
          id: item.id,
          fulfillment_id:
            sessionData?.rate_basis === "rider" ||
              sessionData?.rate_basis === "order"
              ? ""
              : fulfillment_id,
          category_id: item.category_id,
          tags: item?.tags,
        };
      }
    }
  });

  const startTags = [];

  if (action_id === "call_masking_init_LOGISTICS") {
    let tag: any = {
      code: "masked_contact",
      list: [
        {
          code: "type",
          value: inputs?.mask_type || "ivr_pin", // default ivr_pin
        },
        {
          code: "setup",
          value: inputs?.ivr_number || "1800180000", // default IVR number
        },
        {
          code: "token",
          value:
            inputs?.mask_type === "ivr_pin"
              ? inputs?.pin || "12345" // pin required
              : inputs?.mask_type === "ivr_without_pin"
                ? "" // empty string
                : inputs?.contact_number || "9876543210", // 10-digit number for api_endpoint
        },
      ],
    };

    startTags.push(tag);
  }

  // Build START object
  let startObj = {
    location: {
      id: "S1",
      gps: sessionData.start_location,
      address: {
        name: "My store name 1",
        building: "My building name 1",
        locality: "My street name 1",
        city: "my city 1",
        state: "my state 1",
        country: "India",
        area_code: sessionData.start_area_code,
      },
    },
    contact: {
      phone: "9886098860",
      email: "abcd.efgh@gmail.com",
      ...(startTags.length > 0 && { tags: startTags }),
    },
    ...(sessionData?.fulfillment?.start?.instructions && {
      instructions: sessionData.fulfillment.start.instructions,
    }),
  };

  // Build END object
  let endObj = {
    location: {
      gps: sessionData.end_location,
      address: {
        name: "My house or building #",
        building: "My building name 2",
        locality: "My street name 2",
        city: "my city name 2",
        state: "my state 2",
        country: "India",
        area_code: sessionData.end_area_code,
      },
    },
    contact: {
      phone: "9123426789",
      email: "xyz.qweq@gmail.com",
      ...(startTags.length > 0 && { tags: startTags }),
    },
    ...(sessionData?.fulfillment?.end?.instructions && {
      instructions: sessionData.fulfillment.end.instructions,
    }),
  };

  // 🔄 Swap when REVERSE QC
  if (action_id === "init_REVERSE_QC_LOGISTICS") {
    [startObj, endObj] = [endObj, startObj];
  }

  existingPayload.message.order.fulfillments[0] = {
    id:
      sessionData?.rate_basis === "rider" || sessionData?.rate_basis === "order"
        ? ""
        : action_id === "init_REVERSE_QC_LOGISTICS"
          ? sessionData.on_search_return_fulfillment.id
          : sessionData.on_search_fulfillment.id,
    type:
      action_id === "init_REVERSE_QC_LOGISTICS"
        ? sessionData.on_search_return_fulfillment.type
        : sessionData.on_search_fulfillment.type,

    start: startObj,
    end: endObj,

    tags: removeTagsByCodes(
      action_id === "init_REVERSE_QC_LOGISTICS"
        ? sessionData.on_search_return_fulfillment.tags
        : sessionData.on_search_fulfillment.tags,
      ["distance"]
    ),
  };


  let isLinkedOrderPresent = false;

  existingPayload.message.order.fulfillments[0].tags.map((tag: any) => {
    if (tag.code === "linked_provider") {
      isLinkedOrderPresent = true;
    }
  });

  if (!isLinkedOrderPresent) {
    existingPayload.message.order.fulfillments[0].tags.push({
      code: "linked_provider",
      list: [
        {
          code: "id",
          value: sessionData.provider_id,
        },
        {
          code: "name",
          value: "Seller1",
        },
      ],
    });
  }

  existingPayload.message.order.billing.created_at =
    existingPayload.context.timestamp;
  existingPayload.message.order.billing.updated_at =
    existingPayload.context.timestamp;

  existingPayload.message.order.payment = {
    type: sessionData.payment_type,
    ...getPayemntFields(sessionData.payment_type as string),
  };

  return existingPayload;
};
