import type Material from "../model/material";

export interface MaterialGraph {
  [x: string]: Material;
}

export interface Item {
  id: string;
  name: string;
  amount: number;
}
