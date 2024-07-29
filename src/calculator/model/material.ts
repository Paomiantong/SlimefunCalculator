import type Recipe from './recipe';

export default class Material {
  has = 0;
  own = 0;
  fathers: { [key: string]: number } = {};
  // {itemID: amountPerItem}
  amount = 0;
  maxAmount = 0;
  id: string;
  name: string;
  icon?: number;
  isBasic: boolean;
  recipe: Recipe | null;
  layer: number;
  maxLayer: number;

  constructor(
    id = '0',
    name = '',
    isBasic = false,
    recipe: Recipe | null = null
  ) {
    this.id = id;
    this.name = name;
    this.isBasic = isBasic;
    this.recipe = recipe;
    this.layer = 0;
    this.maxLayer = -1;
  }
}
