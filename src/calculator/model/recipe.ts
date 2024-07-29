import type Material from './material';

export default class Recipe {
  resultAmount = -1;
  ingredients: [Material, number][] = [];
  // [[item, amount]]
  constructor(resultAmount: number) {
    this.resultAmount = resultAmount;
  }
  /**
   * 添加材料
   * @param material 材料
   * @param amount 数量
   * @returns this
   */
  addIngredient(material: Material, amount: number) {
    this.ingredients.push([material, amount]);
    return this;
  }
}
