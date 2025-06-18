
import { SessionData } from "../../../../session-types";
import { getRandomItem } from "../../api-objects/utils";
import { RET12FASHION125Catalog } from "../../on_search/on_search/catalog";
import { breakup, breakupItem, SelectedItems } from "../on_select/generator";
export async function on_select_out_of_stock_generator(
    existingPayload: any,
    sessionData: SessionData
) {
    const selectedItemsObj = sessionData.selected_items as SelectedItems;
    console.log("Selected Items: ", selectedItemsObj);
    const catalog = RET12FASHION125Catalog;
    let out_of_stocks_item_ids = [];
    existingPayload.message.order.items = selectedItemsObj.map((item) => {
        return {
            id: item.id,
            fulfillment_id: "F1",
        };
    });
    const catalogItems = catalog.catalog["bpp/providers"][0].items.filter((i) => {
        console.log("Catalog Item: ", i.id);
        const idMap = selectedItemsObj.map((item) => item.id);
        console.log("ID Map: ", idMap);
        return idMap.includes(i.id);
    });
    console.log("Catalog Items: ", catalogItems);
    let totalPrice = 0;
    const breakupObject = [];
    const randomOutOfStockItem = getRandomItem(
        catalogItems.map((item) => item.id)
    );
   for (const i of catalogItems) {
    const item = JSON.parse(JSON.stringify(breakupItem)); 

    item["@ondc/org/item_id"] = i.id;
    item.title = i.descriptor.name;

    // Set quantity and price to 0
    item["@ondc/org/item_quantity"] = { count: 0 };
    item.price = { value: "0.00" };
    item.item.price = { value: "0.00" };

    if (item.item?.quantity?.available) {
        item.item.quantity.available.count = "0";
    }
    if (item.item?.quantity?.maximum) {
        item.item.quantity.maximum.count = "0";
    }

    item["@ondc/org/title_type"] = "0";
      if (
        sessionData.out_of_stock_item_ids?.includes(i.id) ||
        i.id === randomOutOfStockItem
    ) {
        item.item.quantity.available.count = "0";
        item.item.quantity.maximum.count = "0";
        item["@ondc/org/title_type"] = "0";
        out_of_stocks_item_ids.push({item_id: i.id, error: "40002"});
    }

    breakupObject.push(item);
}

 existingPayload.error = {
            type: "DOMAIN-ERROR",
            code: "40002",
            message: JSON.stringify(out_of_stocks_item_ids),
  };

    existingPayload.message.order.quote.breakup = breakupObject;
    existingPayload.message.order.quote.price.value = `${totalPrice.toFixed(2)}`;
    return existingPayload;
}