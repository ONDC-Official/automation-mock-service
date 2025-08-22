/**
 * On_Select Generator for TRV14
 * 
 * Logic:
 * 1. Filter items from sessionData.items based on sessionData.selected_items
 * 2. Merge selected quantities from selected_items into full item details
 * 3. Calculate quote breakup (BASE_FARE, ADD_ONS, TAX=0) - excluding parent items
 * 4. Handle fulfillments from session data
 * 
 * Note: Parent items (items without price/quantity) are included in response for 
 * demonstration purposes but excluded from price calculations
 */

/**
 * Merges add-on selection data with full add-on details
 * @param fullAddOns - Complete add-on details from sessionData.items
 * @param selectedAddOns - Selection data from sessionData.selected_items
 * @returns Merged add-ons with selection quantities
 */


/**
 * Creates item payload by merging full item details with selection data
 * @param fullItem - Complete item from sessionData.items
 * @param selectedItem - Selection data from sessionData.selected_items
 * @returns Merged item payload with selection quantities
 */


/**
 * Calculates quote breakup for selected items
 * @param items - Array of items with selection data
 * @returns Quote object with breakup and total price
 */

export async function onSelectDefaultGenerator(existingPayload: any, sessionData: any) {
  let breakup: any[]=[];
  let totalAmt: any;
  sessionData.selected_items.forEach((selectedItem: any) => {
    // Find the full item details from sessionData.items
    const fullItem = sessionData.items.find((item: any) => item.id === selectedItem.id);
    const generalInfo = fullItem.tags?.find(
      (f: any) => f.descriptor?.code=== "GENERAL_INFO"
    );

     breakup = generalInfo.list
    .filter((entry: any) =>
      ["BASE_PRICE", "CONVIENCE_FEE", "PROCESSING_FEE", "TAX"].includes(
        entry.descriptor?.code
      )
    )
    .map((entry: any) => ({
      title: entry.descriptor.code,
      price: {
        value: entry.value,
        currency: fullItem.price.currency,
      },
    }));

   totalAmt = breakup.reduce(
    (sum: number, b: any) => sum + Number(b.price.value || 0),
    0
  );
  const filteredTags = fullItem.tags.map((tag: { descriptor: { code: string; }; list: any[]; }) => {
    if (tag.descriptor.code === "GENERAL_INFO") {
      return {
        descriptor: tag.descriptor,
        list: tag.list.filter((l: { descriptor: { code: string; }; }) => l.descriptor.code === "COVERAGE_AMOUNT")
      };
    }
    if (["INCLUSIONS", "EXCLUSIONS"].includes(tag.descriptor.code)) {
      return tag; // keep as is
    }
    return null;
  }).filter(Boolean);

existingPayload.message.order.items = [
  {
    ...fullItem,
    tags: filteredTags
  }
];

  });
  existingPayload.message.order.quote = {
    ...(existingPayload.message.order.quote || {}),
    breakup,
    price: {
      currency: "INR",
      value: String(totalAmt),
    },
  };
  // Update payload with filtered items
 const provider =sessionData.on_search_provider

  existingPayload.message.order.provider={
    descriptor:provider.descriptor,
    id:provider.id,
    tags:provider.tags

  }

 
  
  return existingPayload;
} 