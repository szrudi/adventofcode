const fs = require('fs');
const readline = require('readline');
const path = require('path');

let allIngredients = [];

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    for await (const line of rl) {
        // mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
        const capturingRegex = /(?<ingredients>[a-z ]*) \(contains (?<allergens>[a-z, ]*)\)/;
        const found = line.match(capturingRegex);
        data.push({
            ingredients: found.groups.ingredients.split(" "),
            allergens: found.groups.allergens.split(", ")
        });
        allIngredients.push(...found.groups.ingredients.split(" "));
    }
    return data;
}

processLineByLine().then(foods => {
    // console.log(foods);
    const foodsForAllergens = getFoodsForAllergens(foods);
    findPossibleIngredientsForAllergens(foodsForAllergens);
    // foodsForAllergens.forEach(f => console.log("foodsForAllergens:", f));

    console.log("****** Part 1 **********************");
    let allPossible = foodsForAllergens.reduce((allPossible, a) =>
        allPossible.concat(...a.possible), [])
    let safeFoodsAppearance = allIngredients.filter(i => !allPossible.includes(i));
    console.log(safeFoodsAppearance.length);

    console.log("****** Part 2 **********************");
    // possibleAllergens.forEach(f => console.log(f.allergen, f.possible));
    let knownAllergens = [];
    while (foodsForAllergens.length > 0) {
        foodsForAllergens.sort((i1, i2) => i1.possible.size - i2.possible.size);
        let allergen = foodsForAllergens.shift();
        knownAllergens.push(allergen);
        if (allergen.possible.size === 1) {
            for (let possibleAllergen of foodsForAllergens) {
                const knownAllergenName = allergen.possible.values().next().value;
                // console.log("remove", knownAllergenName, "from", possibleAllergen.possible)
                possibleAllergen.possible.delete(knownAllergenName);
            }
        } else {
            console.log("we have a problem");
        }
    }

    knownAllergens.sort((i1, i2) => {
        if (i1.allergen === i2.allergen) {
            return 0;
        }

        return i1.allergen < i2.allergen ? -1 : 1;
    })
    knownAllergens.forEach(f => console.log(f.allergen, f.possible));
    console.log("\n", knownAllergens.reduce((a, i) => a.concat(...i.possible), []).join(","));
});

function getFoodsForAllergens(foods) {
    /** @type {Map<string, Object>} */
    let foodsForAllergens = new Map();
    for (let food of foods) {
        for (const allergen of food.allergens) {
            if (!foodsForAllergens.has(allergen)) {
                foodsForAllergens.set(allergen, {allergen, foods: [food.ingredients]});
            } else {
                foodsForAllergens.get(allergen).foods.push(food.ingredients);
            }
        }
    }
    return Array.from(foodsForAllergens.values());
}

function findPossibleIngredientsForAllergens(foodsForAllergens) {
    for (let allergen of foodsForAllergens) {
        allergen.possible = new Set();
        for (let food of allergen.foods) {
            ingredient_search:
                for (let ingredient of food) {
                    for (let otherFood of allergen.foods) {
                        if (!otherFood.includes(ingredient)) {
                            continue ingredient_search;
                        }
                    }
                    allergen.possible.add(ingredient);
                }
        }
    }
}
