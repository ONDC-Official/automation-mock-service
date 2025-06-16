import { add } from "winston";
import { SessionData } from "../../session-types";
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
                  "code": "TOTAL_HOURS"
              },
              "value": "1"
          },
         {
              "descriptor": {
                  "code": "TOTAL_DISTANCE"
              },
              "value": "10"
          }
      ]
  }
]
function transformTags(tags:any, quantity:any) {
  const updatedTags = JSON.parse(JSON.stringify(tags)); // deep clone

  for (const tag of updatedTags) {
    if (tag.descriptor.code === "INFO" && Array.isArray(tag.list)) {
      for (const item of tag.list) {
        if (["TOTAL_HOURS", "TOTAL_DISTANCE"].includes(item.descriptor.code)) {
          const originalValue = parseFloat(item.value);
          if (!isNaN(originalValue)) {
            item.value = (originalValue * quantity).toString();
          }
        }
      }
    }
  }

  return updatedTags;
}
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
  function generateAddOnQuote(addOn: any, items: any[]) {
    for (const item of items) {
        const foundAddOn = item.add_ons.find((a:any) => a.id === addOn.id);
        if (foundAddOn) {
            // Extract price and calculate total
            const pricePerUnit = parseFloat(foundAddOn.price.value);
            const quantity = addOn.quantity.selected.count;
            const totalPrice = pricePerUnit * quantity;

            // Return the formatted output
            return {
                title: "ADD_ONS",
                item: {
                    id: item.id,
                    add_ons: [
                        {
                            id: foundAddOn.id,
                            price: {
                                currency: foundAddOn.price.currency,
                                value: foundAddOn.price.value
                            },
                            quantity: {
                                selected: {
                                    count: quantity
                                }
                            }
                        }
                    ]
                },
                price: {
                    currency: foundAddOn.price.currency,
                    value: totalPrice.toFixed(2)
                }
            };
        }
    }

    return null; // Return null if no matching add-on is found
}
export async function onSelectMultipleStopsRentalGenerator(existingPayload: any, sessionData: SessionData) {
    const selected_item_id = sessionData.selected_item_id
    const item = filterItemsById(sessionData,selected_item_id)
    existingPayload.message.order.items = item
    if(sessionData.updated_price){
      existingPayload.message.order.items[0].price.value = sessionData.updated_price
    }
    existingPayload.message.order.items[0].add_ons[0].quantity = {"selected": {
        "count": sessionData.selected_add_ons[0].quantity.selected.count
    }}
    const updated_tags = transformTags(item_tags,sessionData.selected_add_ons[0].quantity.selected.count)
    item[0]["tags"] = updated_tags
    const filteredFulfillments = filterFulfillmentsByItem(item[0],sessionData.fulfillments)
    existingPayload.message.order.quote = generateQuoteFromItems(item)
    const old_price = existingPayload.message.order.quote.price.value
    const addon = generateAddOnQuote(sessionData.selected_add_ons[0],item)
    const new_price = Number(old_price) + Number(addon?.price.value)
    existingPayload.message.order.quote.price.value = String(new_price)
    existingPayload.message.order.quote.breakup.push(addon)
    existingPayload.message.order.fulfillments = filteredFulfillments
    return existingPayload;
}