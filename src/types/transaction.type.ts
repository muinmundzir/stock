import { itemType } from "./item.type";

export type transactionType = {
  id: number;
  itemName: string;
  stockHistory: number;
  soldAmount?: number;
  amount?: number;
  itemType: string;
  transactionDate: string;
  item?: itemType;
};
