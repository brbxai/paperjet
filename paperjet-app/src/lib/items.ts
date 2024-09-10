import { SerializedItem, Item } from "@/data/items";
import Decimal from "decimal.js";

export const parseItemForBackend = (item: Item) => {
  return {
    ...item,
    defaultPrice: item.defaultPrice ? item.defaultPrice.toString() : null,
  };
};

export const parseItemForFrontend = (item: SerializedItem) => {
  return {
    ...item,
    defaultPrice: item.defaultPrice ? new Decimal(item.defaultPrice) : null,
  };
};