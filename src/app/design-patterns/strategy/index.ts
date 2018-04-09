/**FLYING STRATEGY */
interface Fly {
    fly(): string
}
//#1
class ItFlySlow implements Fly {
    fly(): string {
        return 'fly slow'
    }
}
//#2
class ItFlyFast implements Fly {
    fly(): string {
        return 'fly fast'
    }
}
//#3
class cantFly implements Fly {
    fly(): string {
        return 'not flying';
    }
}

/**ABTRACT CLASS USING THE STRATEGIES */
abstract class Animal {
    constructor(private flyBehaviour: Fly) {

    }

    public TryFly(): string {
        return this.flyBehaviour.fly();
    }
    /**To be able to change beaviour at run time */
    set flyAblity(flyBehaviour: Fly) {
        this.flyBehaviour = flyBehaviour;
    }
}

/**SUB CLASSES */
//Dog
class Dog extends Animal {
    constructor() {
        super(new cantFly());
    }
}
//Bird
class Bird extends Animal {
    constructor() {
        super(new ItFlyFast());
    }
}

/*RUN CODE;*/
const dog:Dog = new Dog();
const bird:Dog = new Dog();
//change dog behaviour at run time
dog.flyAblity = new ItFlySlow();
