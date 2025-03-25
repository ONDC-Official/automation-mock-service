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
  function generateQuoteFromItems(items: any[]) {
    if (!Array.isArray(items) || items.length === 0) return null;
  
    return {
      breakup: items.map((item) => {
        const price = parseFloat(item.price.value);
        const minFare = parseFloat(item.tags.find((tag: any) => tag.descriptor.code === "FARE_POLICY")
          ?.list.find((t:any) => t.descriptor.code === "MIN_FARE")?.value || "0");
        
        const distanceFare = price - minFare; 
  
        return [
          {
            price: {
              currency: item.price.currency,
              value: minFare.toString(),
            },
            title: "BASE_FARE",
          },
          {
            price: {
              currency: item.price.currency,
              value: distanceFare.toString(),
            },
            title: "DISTANCE_FARE",
          }
        ];
      }).flat(), 
  
      price: {
        currency: items[0].price.currency,
        value: items.reduce((total, item) => total + parseFloat(item.price.value), 0).toString(),
      },
      ttl: "P200s",
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

export async function onSelectMultipleStopsGenerator(existingPayload: any, sessionData: SessionData) {
    const selected_item_id = sessionData.selected_item_id
    const item = filterItemsById(sessionData,selected_item_id)
    item[0]["tags"] = item_tags
    const filteredFulfillments = filterFulfillmentsByItem(item[0],sessionData.fulfillments)
    filteredFulfillments[0]["tags"] = fulfillment_tags
    existingPayload.message.order.quote = generateQuoteFromItems(item)
    existingPayload.message.order.fulfillments = filteredFulfillments
    return existingPayload;
}