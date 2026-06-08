import { SessionData } from "../../../session-types";
import { removeTagsByCodes } from "../../../../../../utils/generic-utils";

export async function updateGenerator(
  existingPayload: any,
  sessionData: SessionData,
  inputs:any,
  action_id:string
) {
  console.log("session data after on_cofirm",sessionData.on_confirm_tags);
  
  existingPayload.message.order.id = sessionData.order_id;

  existingPayload.message.order.items = sessionData.items.map((item: { id: any; category_id: any; }) => ({
    id: item.id,
    category_id: item.category_id,
    descriptor: item.descriptor

  }));

  if (sessionData?.fulfillments) {
    let agentDetails: any = {
      count: 0,
      details: [],
    };

    sessionData?.fulfillments[0].tags.map((tag: any) => {
      if (tag.code === "rider_details") {
        agentDetails.count += 1;
        const tempData: any = {};
        tag.list.forEach((item: any) => {
          if (item.code === "name") {
            tempData.name = item.value;
          }

          if (item.code === "phone") {
            tempData.phone = item.value;
          }

          if (item.code === "vehicle_registration") {
            tempData.registration = item.value;
          }
        });
        agentDetails.details.push({
          agent: {
            name: tempData.name,
            phone: tempData.phone,
          },
          vehicle: {
            registration: tempData.registration,
          },
        });
      }
    });

    existingPayload.message.order.fulfillments = sessionData?.fulfillments?.map(
      (fulfillment: any, index: number) => {
        // Update start instructions only if code is NOT "5"
        const existingStartCode = fulfillment?.start?.instructions?.code;
        if (existingStartCode !== "5") {
          fulfillment.start = {
            instructions: {
              code: "2",
              short_desc: "123123",
              long_desc: "additional instructions for pickup",
              additional_desc: {
                content_type: "text/html",
                url: "http://description.com",
              },
            },
          };
        }

        // Update end instructions only if code is NOT "5"
        const existingEndCode = fulfillment?.end?.instructions?.code;
        if (existingEndCode !== "5" && action_id === "static_otp_update_LOGISTICS" ) {
          fulfillment.end = {
            instructions: {
              code: "2",
              short_desc: "987657",
              long_desc: "additional instructions for delivery",
              additional_desc: {
                content_type: "text/html",
                url: "http://description.com",
              },
            },
          };
        }

        if (action_id === "update_DELIVERY_ADDRESS") {
                fulfillment.end = {
                    location: {
                        gps: inputs.delivery_location_gps,
                        address: {
                            name: inputs.delivery_address_name,
                            building: inputs.delivery_address_building,
                            locality: inputs.delivery_address_locality,
                            city: inputs.delivery_address_city,
                            state: inputs.delivery_address_state,
                            country: inputs.delivery_address_country,
                            area_code: String(inputs.delivery_address_area_code),
                        },
                    },
                    contact: {
                        phone: String(inputs.delivery_contact_phone),
                        email: inputs.delivery_contact_email,
                    },
                    person: {
                        name: inputs.delivery_person_name,
                    },
                };
            }

        // Update tags
        let preTags = removeTagsByCodes(fulfillment.tags, [
          "weather_check",
          "rto_action",
          "cod_settlement_detail",
          "state",
        ]);
          console.log("preTags",JSON.stringify(preTags));
        preTags = [
          ...preTags,
          {
            code: "state",
            list: [
              {
                code: "ready_to_ship",
                value: "yes",
              },
              ...(sessionData.category_id === "Immediate Delivery"
                ? [
                    {
                      code: "order_ready",
                      value: "yes",
                    },
                  ]
                : []),
            ],
          },
        ];

        fulfillment.tags = preTags;

        // Agent and vehicle assignment
        if (sessionData?.rate_basis) {
          if (index > agentDetails.count) {
            index = 0;
          }
          fulfillment.agent = agentDetails.details[index].agent;
          fulfillment.vehicle = agentDetails.details[index].vehicle;
        }

        delete fulfillment.state;

        return fulfillment;
      }
    );
  }


  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  return existingPayload;
}
