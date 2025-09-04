export async function selectDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  const items = sessionData?.on_search_5_items[0] ?? [];
  existingPayload.message.order.provider.id =
    sessionData?.search_5_provider_id ?? "P1";
  existingPayload.message.order.provider.time =
    sessionData?.search_5_provider_time ?? {
      label: "AVAILABLE",
      range: {
        start: "2023-12-25T00:00:00.000Z",
        end: "2023-12-27T00:00:00.000Z",
      },
    };
  existingPayload.message.order.items = [
    {
      id: items[0]?.id ?? "Accommodation-1",
      location_ids: [...(items[0]?.location_ids ?? [])],
      quantity: {
        selected: {
          count: 1,
        },
      },
      add_ons: [{ id: items[0]?.add_ons?.[1]?.id ?? "full-board" }],
    },
  ];
  return existingPayload;
}
