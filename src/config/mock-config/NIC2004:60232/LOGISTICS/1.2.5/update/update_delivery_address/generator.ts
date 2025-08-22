import { SessionData } from "../../../../session-types";
import { removeTagsByCodes } from "../../../../../../../utils/generic-utils";

export async function updateDeliveryAddressGenerator(
  existingPayload: any,
  sessionData: SessionData,
  action_id:string
) {
  console.log("session data after on_cofirm",sessionData.on_confirm_tags);
  
  existingPayload.message.order.id = sessionData.order_id;

  existingPayload.message.order.items = sessionData.items.map((item: { id: any; category_id: any; }) => ({
    id: item.id,
    category_id: item.category_id
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
        console.log("will come in this");

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
            if (action_id === "update_DELIVERY_ADDRESS") {
                fulfillment.end = {
                    person: {
                        name: "Buyer1"
                    },
                    contact: {
                        phone: "9886098860",
                        email: "buyer1@example.com" // <-- you can add more fields here
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
