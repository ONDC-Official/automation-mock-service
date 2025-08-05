export function removeItemQuantitiesFromQuote(quote: any) {
  return {
    ...quote,
    breakup: quote.breakup.map((item: any) => {
      // Remove item.quantity if present
      let updatedItem = { ...item };
      if (updatedItem.item?.quantity) {
        const { quantity, ...restItem } = updatedItem.item;
        updatedItem.item = restItem;
      }


      return updatedItem;
    })
  };
}
