export async function confirmDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  existingPayload.message.order.id = sessionData?.on_confirm_orderID ?? "01";
  existingPayload.message.order.fulfillments = [
    {
      id: sessionData?.confirm_fulfillments[0][0]?.id ?? "customer-1",
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
