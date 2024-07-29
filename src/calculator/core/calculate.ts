import type Material from "../model/material";
import type { Item, MaterialGraph } from "./types";

export function calculateIngredients(
  itemList: Item[],
  materialGraph: MaterialGraph
) {
  for (const index in itemList) {
    const item = materialGraph[itemList[index].id];
    calculateChanges(item, itemList[index].amount, true);
  }
}

export function calculateChanges(
  theItem: Material,
  changes: number,
  init = false
) {
  if (changes === 0) return;
  const currentAmount = theItem.amount;

  theItem.has += changes; // 计算变化

  let deductedAmount = theItem.maxAmount + theItem.has;

  if (deductedAmount < 0) deductedAmount = 0;

  if (init) {
    theItem.maxAmount = deductedAmount;
    theItem.has = 0;
  }

  theItem.amount = deductedAmount;

//   console.log(
//     `%c${changes}%c${theItem.name}%c${currentAmount}->${theItem.amount}/${theItem.maxAmount}%cHas:${theItem.has}`,
//     `color: #fff; background: ${
//       changes > 0 ? "#00CC6A" : "#E81123"
//     }; padding: 5px;font-weight: bold; font-size: 14px;`,
//     "color: #fff; background: #4C4A48; padding: 5px;font-weight: bold; font-size: 14px;",
//     "color: #fff; background: #F7630C; padding: 5px;font-weight: bold; font-size: 14px;",
//     "color: #fff; background: #CA5010; padding: 5px;font-weight: bold; font-size: 14px;"
//   );

  if (!theItem.isBasic) {
    const recipe = theItem.recipe!;
    const changeMultiplier =
      Math.ceil(theItem.amount / recipe.resultAmount) -
      Math.ceil(currentAmount / recipe.resultAmount);

    // 若不是基础素材先计算子配方
    for (const [ingredient, amount] of recipe.ingredients) {
      const ingredientChanges = amount * changeMultiplier; // 计算子配方变化

      if (ingredientChanges === 0) continue; // 如果不需要变化则计算下一个子配方

      calculateChanges(ingredient, ingredientChanges, init);
    }
  }
}
