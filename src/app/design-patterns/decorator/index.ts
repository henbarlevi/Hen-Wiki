interface Pizza {
    getDescription(): string
    Cost: number
}

export class PlainPizza implements Pizza {
    getDescription(): string {
        return 'Thin Dough'
    }

    get Cost(): number {
        return 5.0;
    };
}

/**DECORATOR  CLASS */
abstract class ToppiingDecorator implements Pizza {

    constructor(protected tempPizza: Pizza) {

    }
    getDescription(): string {
        return this.tempPizza.getDescription();
    }
    get Cost(): number {
        return this.tempPizza.Cost;
    };
}

/**TOPPING INSTANCES */
//1
class CheeseTopping extends ToppiingDecorator {
    constructor(tempPizza: Pizza) {
        super(tempPizza);
    }
    getDescription(): string {
        return this.tempPizza.getDescription() + 'With Chesse';
    }
    get Cost(): number {
        return this.tempPizza.Cost + 4.00;
    };
}
//2
class olivsTopping extends ToppiingDecorator {
    constructor(tempPizza: Pizza) {
        super(tempPizza);
    }
    getDescription(): string {
        return this.tempPizza.getDescription() + 'With Olivs';
    }
    get Cost(): number {
        return this.tempPizza.Cost + 2.00;
    };
}

const plainPizza: PlainPizza = new PlainPizza();
const pizzaWithCheese = new CheeseTopping(plainPizza);
const pizzaWithCheeseAndOlivs = new olivsTopping(pizzaWithCheese);

console.log(pizzaWithCheeseAndOlivs.Cost);
console.log(pizzaWithCheeseAndOlivs.getDescription());
