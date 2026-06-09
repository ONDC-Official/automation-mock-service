export async function selectDefaultGenerator(
  existingPayload: any,
  sessionData: any,
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
  // Use on_search_1_items which is populated by on_search_6/save-data.yaml
  const items =
    sessionData?.on_search_1_items?.flat() ??
    sessionData?.on_search_5_items?.flat() ??
    [];
  existingPayload.message.order.provider.id =
    sessionData?.on_search_1_provider_id ??
    sessionData?.search_5_provider_id ??
    "P1";

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

  // Collect all item IDs the user selected (from each entry in the existing payload's items array)
  const userSelectedItems: any[] = existingPayload.message.order.items ?? [];

  // Use the actual user input to decide if an add-on was selected.
  // existingPayload comes from default.yaml (has "full-board" as template value) and
  // replaceJsonPaths runs AFTER this generator — so we must read from sessionData.user_inputs
  // to get the real user input before post-processing overwrites it with "".
  const addOnId = (sessionData as any)?.user_inputs?.add_on_id;
  const hasAddOns = addOnId && String(addOnId).trim() !== "";

  // Build one item object per selected item ID, looking each up in the catalog
  existingPayload.message.order.items =
    userSelectedItems.length > 0
      ? userSelectedItems.map((userItem: any) => {
          const userItemId = userItem?.id;
          const catalogItem = userItemId
            ? (items.find((i: any) => i.id === userItemId) ?? null)
            : null;
          return {
            id: catalogItem?.id ?? userItemId ?? "Accommodation-1",
            location_ids: [...(catalogItem?.location_ids ?? [])],
            quantity: {
              selected: {
                count: userItem?.quantity?.selected?.count ?? 1,
              },
            },
            ...(hasAddOns ? { add_ons: [{ id: String(addOnId).trim() }] } : {}),
          };
        })
      : [
          {
            id: items[0]?.id ?? "Accommodation-1",
            location_ids: [...(items[0]?.location_ids ?? [])],
            quantity: { selected: { count: 1 } },
            ...(hasAddOns ? { add_ons: [{ id: String(addOnId).trim() }] } : {}),
          },
        ];
  return existingPayload;
}
