import { SessionData } from "../../session-types";
const fulfillment_tags = [
    {
      "descriptor": {
        "code": "ROUTE_INFO",
        "name": "Route Information"
      },
      "display": true,
      "list": [
        {
          "descriptor": {
            "code": "ENCODED_POLYLINE",
            "name": "Path"
          },
          "value": "_p~iF~ps|U_ulLnnqC_mqNvxq`@"
        },
        {
          "descriptor": {
            "code": "WAYPOINTS",
            "name": "Waypoints"
          },
          "value": "[{\"gps\":\"12.909982, 77.611822\"},{\"gps\":\"12.909982,77.611822\"},{\"gps\":\"12.909982,77.611822\"},{\"gps\":\"12.909982, 77.611822\"}]"
        }
      ]
    }
  ]
const item_tags = [
    {
      "descriptor": {
        "code": "FARE_POLICY",
        "name": "Daytime Charges"
      },
      "display": true,
      "list": [
        {
          "descriptor": {
            "code": "MIN_FARE"
          },
          "value": "30"
        },
        {
          "descriptor": {
            "code": "MIN_FARE_DISTANCE_KM"
          },
          "value": "2"
        },
        {
          "descriptor": {
            "code": "PER_KM_CHARGE"
          },
          "value": "15"
        },
        {
          "descriptor": {
            "code": "PICKUP_CHARGE"
          },
          "value": "10"
        },
        {
          "descriptor": {
            "code": "WAITING_CHARGE_PER_MIN"
          },
          "value": "2"
        },
        {
          "descriptor": {
            "code": "NIGHT_CHARGE_MULTIPLIER"
          },
          "value": "1.5"
        },
        {
          "descriptor": {
            "code": "NIGHT_SHIFT_START_TIME"
          },
          "value": "22:00:00"
        },
        {
          "descriptor": {
            "code": "NIGHT_SHIFT_END_TIME"
          },
          "value": "05:00:00"
        }
      ]
    },
    {
      "descriptor": {
        "code": "INFO",
        "name": "General Information"
      },
      "display": true,
      "list": [
        {
          "descriptor": {
            "code": "DISTANCE_TO_NEAREST_DRIVER_METER"
          },
          "value": "661"
        },
        {
          "descriptor": {
            "code": "ETA_TO_NEAREST_DRIVER_MIN"
          },
          "value": "3"
        }
      ]
    }
  ]
  function generateQuoteFromItems(items: any[], oldPrice: number) {
    if (!Array.isArray(items) || items.length === 0) return null;
  
    // Extract currency (assuming all items have the same currency)
    const currency = items[0].price.currency;
  
    // Calculate total new price
    const newPrice = items.reduce((total, item) => total + parseFloat(item.price.value), 0);
    const additionalAmount = newPrice - oldPrice; // Difference between new and old price
  
    // Calculate total base fare and distance fare
    let totalMinFare = 0;
    let totalDistanceFare = 0;
  
    items.forEach((item) => {
      const price = parseFloat(item.price.value);
      const minFare = parseFloat(
        item.tags.find((tag: any) => tag.descriptor.code === "FARE_POLICY")
          ?.list.find((t: any) => t.descriptor.code === "MIN_FARE")?.value || "0"
      );
  
      totalMinFare += minFare;
      totalDistanceFare += oldPrice - minFare;
    });
  
    return {
      breakup: [
        {
          price: { currency, value: totalMinFare.toString() },
          title: "BASE_FARE",
        },
        {
          price: { currency, value: totalDistanceFare.toString() },
          title: "DISTANCE_FARE",
        },
        ...(additionalAmount > 0
          ? [
              {
                price: { currency, value: additionalAmount.toString() },
                title: "BUYER_ADDITIONAL_AMOUNT",
              },
            ]
          : []),
      ],
      price: { currency, value: newPrice.toString() },
      ttl: "PT200S",
    };
  }
function filterFulfillmentsByItem(item: any, fulfillments: any[]) {
    if (!item?.fulfillment_ids || !Array.isArray(fulfillments)) {
      return [];
    }
  
    return fulfillments.filter((fulfillment) => item.fulfillment_ids.includes(fulfillment.id));
  }

function filterItemsById(sessionData: any, selected_item_id: string) {
    if (sessionData?.items && Array.isArray(sessionData.items)) {
      return sessionData.items.filter((item: any) => item.id === selected_item_id);
    }
    return [];
  }

export async function onSelectMultipleStopsPreOrderGenerator(existingPayload: any, sessionData: SessionData) {
    const selected_item_id = sessionData.selected_item_id
    const item = filterItemsById(sessionData,selected_item_id)
    item[0]["tags"] = item_tags
    existingPayload.message.order.items = item
    const old_price = existingPayload.message.order.items[0].price.value
    if(sessionData.updated_price){
      existingPayload.message.order.items[0].price.value = sessionData.updated_price
    }
    const filteredFulfillments = filterFulfillmentsByItem(item[0],sessionData.fulfillments)
    filteredFulfillments[0]["tags"] = fulfillment_tags
    existingPayload.message.order.quote = generateQuoteFromItems(item,old_price)
    existingPayload.message.order.fulfillments = filteredFulfillments
    existingPayload.message.order.quote.breakup = existingPayload.message.order.quote.breakup.filter(
      (breakup: any) => breakup.title !== "ADD_ONS"
    );
    existingPayload.message.order.provider.id = sessionData.provider_id
    return existingPayload;
}