export async function confirmDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  if (existingPayload.context) {
    existingPayload.context.bap_id = sessionData?.bap_id;
    existingPayload.context.bap_uri = sessionData?.bap_uri;
    existingPayload.context.bpp_id = sessionData?.bpp_id;
    existingPayload.context.bpp_uri = sessionData?.bpp_uri;
    if (existingPayload.context.location?.city) {
      existingPayload.context.location.city.code = sessionData?.city_code;
    }
  }
  existingPayload.message.order.id = sessionData?.on_confirm_orderID ?? "01";
  existingPayload.message.order.fulfillments = [
    {
      id: sessionData?.confirm_fulfillments?.flat()?.[0]?.id ?? "customer-1",
      tags: [
        {
          descriptor: {
            code: "UPDATE_REQUEST",
          },
          list: [
            {
              descriptor: {
                code: "contact.email",
              },
              value: "newemail@ondc.org",
            },
          ],
        },
      ],
    },
  ];
  return existingPayload;
}
