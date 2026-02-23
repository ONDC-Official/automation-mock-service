export async function selectDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  const items = sessionData?.on_search_4_items?.[0] ?? sessionData?.on_search_1_items?.[0] ?? [];
  existingPayload.message.order.provider.id =
    sessionData?.on_search_4_provider_id ?? sessionData?.on_search_1_provider_id ?? "P1";
  existingPayload.message.order.provider.time =
    sessionData?.search_4_provider_time ?? sessionData?.search_1_provider_time ?? {
      label: "AVAILABLE",
      range: {
        start: "2023-12-25T00:00:00.000Z",
        end: "2023-12-27T00:00:00.000Z",
      },
    };

  // If no items in payload, use defaults from session
  if (!existingPayload.message.order.items || existingPayload.message.order.items.length === 0) {
    existingPayload.message.order.items = [
      {
        id: items[0]?.id ?? "P1",
        location_ids: [...(items[0]?.location_ids ?? [])],
        quantity: {
          selected: {
            count: 1,
          },
        },
        add_ons: [{ id: items[0]?.add_ons?.[1]?.id ?? "full-board" }],
      },
    ];
  }

  return existingPayload;
}
