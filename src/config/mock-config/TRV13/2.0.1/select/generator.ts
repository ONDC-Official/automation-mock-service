export async function selectDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  // Use on_search_1_items which is populated by on_search_6/save-data.yaml
  const items = sessionData?.on_search_1_items?.flat() ?? sessionData?.on_search_5_items?.flat() ?? [];
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

  // Respect the item_id the user entered via flow input
  const userSelectedId = existingPayload.message.order.items?.[0]?.id;
  const selectedItem = userSelectedId
    ? (items.find((i: any) => i.id === userSelectedId) ?? items[0])
    : items[0];

  existingPayload.message.order.items = [
    {
      id: selectedItem?.id ?? "Accommodation-1",
      location_ids: [...(selectedItem?.location_ids ?? [])],
      quantity: {
        selected: {
          count: 1,
        },
      },
      add_ons: [{ id: selectedItem?.add_ons?.[1]?.id ?? "full-board" }],
    },
  ];
  return existingPayload;
}

