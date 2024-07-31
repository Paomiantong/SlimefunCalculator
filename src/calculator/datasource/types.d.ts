interface RAWReceipe {
  id: string;
  name: string;
  recipeType: string;
  recipe: (null | { material: string; name: string; amount?: number })[];
  output: number;
  research: string;
  researchCost: number;
}
