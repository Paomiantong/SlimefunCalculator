import rawReceipes from "./recipe.json";
const items = rawReceipes.map((v: RAWReceipe) => {
  return {
    id: v.id,
    name: v.name,
  };
});

const receipes: { [key: string]: RAWReceipe } = {};
for (const v of rawReceipes) {
  receipes[v.id] = v;
}

const skip = new Set([
  "ALUMINUM_DUST",
  "IRON_DUST",
  "MAGNESIUM_DUST",
  "ZINC_DUST",
  "SILVER_DUST",
  "LEAD_DUST",
  "TIN_DUST",
  "COPPER_DUST",
  "GOLD_DUST",
  "SIFTED_ORE",
]);

export { items, receipes, skip };
