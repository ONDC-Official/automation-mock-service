import { deepUpdate, populateFulfillmentUpdate } from "../common_generator";
import { getTimestampFromDuration } from "../../../../../../utils/generic-utils";
import { SessionData } from "../../../session-types";
import { at } from "lodash";

interface Tag {
  code: string;
  list: { code: string; value: string }[];
}

function removeTagsByCodes(tags: Tag[], codesToRemove: string[]): Tag[] {
  return tags.filter((tag) => !codesToRemove.includes(tag.code));
}

export const onUpdateGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  action_id: string
) => {
  console.log("update_fulfillments", JSON.stringify(sessionData.update_fulfillments));

  existingPayload.message.order.id = sessionData.order_id;

  if (sessionData?.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  existingPayload = populateFulfillmentUpdate(existingPayload, sessionData);

  console.log("existing payload-existingPayload", JSON.stringify(existingPayload));


  if (action_id === "on_update_E_WAY_BILL_LOGISTICS") {
    existingPayload.message.order.fulfillments =
      existingPayload.message.order.fulfillments.map((fulfillment: any) => {
        fulfillment["@ondc/org/awb_no"] = "1227262193237777";

        const expiryDate = getTimestampFromDuration(
          existingPayload.context.timestamp,
          "P2D"
        );
        fulfillment["@ondc/org/ewaybillno"] = "EBN1";
        fulfillment["@ondc/org/ebnexpirydate"] = expiryDate;

        fulfillment.tags.push({
          code: "shipping_label",
          list: [
            {
              code: "type",
              value: "pdf",
            },
            {
              code: "url",
              value: "https://shipping_label.com/pdf/url",
            },
          ],
        });
        fulfillment.tags.push({
          code: "ebn",
          list: [
            {
              code: "id",
              value: "EBN1",
            },
            {
              code: "expiry_date",
              value: expiryDate,
            },
          ],
        });
        return fulfillment;
      });
  }

  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfillmet: any) => {
      fulfillmet.tags = removeTagsByCodes(fulfillmet.tags, [
        "state",
        "rto_action",
        "weather_check",
      ]);

      return fulfillmet;
    });

  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  existingPayload.message.order.quote = sessionData.quote;
  if (Array.isArray(sessionData.cancellation_terms) &&
    sessionData.cancellation_terms.length > 0) {
    existingPayload.message.order.cancellation_terms =
      sessionData.cancellation_terms;
  }

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  if (sessionData?.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData?.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData?.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  if (sessionData.linked_order) {
    existingPayload.message.order["@ondc/org/linked_order"] =
      sessionData.linked_order;
  }

  if (sessionData.on_confirm_tags) {
    existingPayload.message.order.tags = sessionData.on_confirm_tags
  }

  if (action_id === "on_update_DELIVERY_ADDRESS") {
    const deliveryFulfillment = existingPayload.message.order.fulfillments.find(
      (fulfillment: any) => {
        return fulfillment.type === "Delivery";
      }
    );
    const updatedFulfillmentEnd = sessionData.update_fulfillments
      ?.find((fulfillment: any) => fulfillment.type === "Delivery")
      ?.end;
    const result = deepUpdate(deliveryFulfillment.end, updatedFulfillmentEnd)
    console.log("result of the fulfillment", JSON.stringify(result));

  }

  // if (action_id === "on_update_E_WAY_BILL_LOGISTICS") {
  //   let ebnObj = {
  //     "code": "ebn",
  //     "list": [
  //       {
  //         "code": "id",
  //         "value": "EBN1"
  //       },
  //       {
  //         "code": "expiry_date",
  //         "value": "2025-06-30T12:00:00.000Z"
  //       }
  //     ]
  //   }
  //   existingPayload.message.order.fulfillments.forEach((fulfillment: any) => {
  //     if (!Array.isArray(fulfillment.tags)) {
  //       fulfillment.tags = [];
  //     }
  //     fulfillment.tags.push(ebnObj);
  //   });
  // }

  if (action_id === "on_update_E_POD_AT_PICKUP_LOGISTICS") {
    let at_pickup_obj = {
      code: "fulfillment_proof",
      list: [
        { code: "state", value: "Order-picked-up" },
        { code: "type", value: "webp" },
        { code: "url", value: "public link to webp" }
      ]
    };

    const deliveryFulfillment = existingPayload.message.order.fulfillments.find(
      (fulfillment: any) => fulfillment.type === "Delivery"
    );
    deliveryFulfillment.tags.push(at_pickup_obj)



    deliveryFulfillment.state.descriptor.code = "At-pickup";
  }



  if (action_id === "on_update_E_POD_AT_DELIVERY_LOGISTICS") {
    // let at_delivery_obj = {
    //   code: "fulfillment_proof",
    //   list: [
    //     { code: "state", value: "Order-picked-up" },
    //     { code: "type", value: "webp" },
    //     { code: "url", value: "public link to webp" }
    //   ]
    // };

    let at_delivery_obj = {
      code: "fulfillment_proof",
      list: [
        { code: "state", value: "Order-delivered" },
        { code: "type", value: "webp" },
        { code: "url", value: "public link to webp" }
      ]
    };

    const deliveryFulfillment = existingPayload.message.order.fulfillments.find(
      (fulfillment: any) => fulfillment.type === "Delivery"
    );

    deliveryFulfillment.tags.push(at_delivery_obj)


    deliveryFulfillment.state.descriptor.code = "At-delivery";
  }


  if (action_id === "on_update_refund_igm") {
    let igm_obj = {
      "code": "igm_request",
      "list":
        [
          {
            "code": "id",
            "value": `${sessionData.issue_id}`
          }
        ]
    }
    existingPayload.message.order.tags.push(igm_obj);
  }

  return existingPayload;
};
