export async function selectDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  // Use on_search_1_items which is populated by on_search_6/save-data.yaml
  const items = sessionData?.on_search_1_items?.[0] ?? sessionData?.on_search_5_items?.[0] ?? [];
  existingPayload.message.order.provider.id =
    sessionData?.on_search_1_provider_id?.[0] ?? sessionData?.search_5_provider_id ?? "P1";

  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 5);

  existingPayload.message.order.provider.time = {
    label: "AVAILABLE",
    range: {
      start: currentDate.toISOString(),
      end: futureDate.toISOString(),
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
