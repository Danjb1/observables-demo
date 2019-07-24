import { Gem, GemRecipe } from '@app/models';

export class GemFactory {

  private registeredRecipes: GemRecipe[] = [];
  private totalWeight = 0;
  private nextId = 0;

  register(recipe: GemRecipe) {
    this.registeredRecipes.push(recipe);
    this.totalWeight += recipe.weight;
  }

  create(): Gem {

    /*
     * Pick a recipe at random, based on their weights.
     *
     * Imagine a line between 0 and 1. All our recipes occupy some space on
     * this line, based on their weight. This algorithm simulates picking a
     * random point on this line, and choosing whichever recipe contains
     * that point.
     */

    let gem: Gem;
    const r = Math.random();
    let start = 0;

    for (const recipe of this.registeredRecipes) {

      const chance = recipe.weight / this.totalWeight;

      if (r < start + chance) {
        // Create a Gem from this recipe
        gem = {
          id: this.nextId,
          type: recipe.type,
          state: 'waiting'
        };
        this.nextId++;
        break;
      }

      start += chance;
    }

    return gem;
  }

}
