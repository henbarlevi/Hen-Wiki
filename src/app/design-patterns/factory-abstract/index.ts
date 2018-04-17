
/**
 * for example lets assume we creating enemies for a game . but each enemy can 
 * contain only specific kinds of weapon
 * (for example smart enemies can only use smart weapons)
 */

/**WEAPON */
interface IWeapon {
    fire(): void
}

abstract class Weapon implements IWeapon {
    abstract fire(): void;
}

class smartSmallWeapon extends Weapon {
    fire(): void {
        console.log('shooting [smart] and [small] bullets');
    }
}
class smartBigWeapon extends Weapon {
    fire(): void {
        console.log('shooting [smart] and [Big] bullets');
    }
}
class stupidSmallWeapon extends Weapon {
    fire(): void {
        console.log('shooting [stupid] and [small] bullets');
    }
}
class stupidBigWeapon extends Weapon {
    fire(): void {
        console.log('shooting [stupid] and [Big] bullets');
    }
}
/**ENEMY */
interface IEnemy {
    Weapon: IWeapon
    fireWeapon(): void;
    move(): void;
}

abstract class Enemy implements IEnemy {
    constructor(private weapon: IWeapon) { }
    get Weapon() {
        return this.weapon;
    }
    fireWeapon(): void {
        this.weapon.fire();
    }
    abstract move(): void;
}

class StupidEnemy extends Enemy {
    move(): void {
        console.log('enemy moving [stupid] and slow')
    }
}
class SmartEnemy extends Enemy {
    move(): void {
        console.log('enemy moving [smart] and fast')

    }
}

/**ABSTRACT FACTORY */
interface IEnemyFactory<T extends Enemy> {
    createEnemy(weapon: IWeapon): T
    createWeapon(): IWeapon
}
//factory 1
class RandomSmartEnemyFactory implements IEnemyFactory<SmartEnemy> {
    createEnemy(weapon: IWeapon): SmartEnemy {
        return new SmartEnemy(weapon);
    }
    createWeapon(): IWeapon {
        return Math.random() > 0.5 ? new smartBigWeapon() : new smartSmallWeapon();
    }
}
//factory 1
class RandomStupidEnemyFactory implements IEnemyFactory<StupidEnemy> {
    createEnemy(weapon: IWeapon): StupidEnemy {
        return new SmartEnemy(weapon);
    }
    createWeapon(): IWeapon {
        return Math.random() > 0.5 ? new stupidBigWeapon() : new stupidSmallWeapon();
    }
}

//RUN CODE 
const smartEnemyfactory = new RandomSmartEnemyFactory();
const smartWeapon = smartEnemyfactory.createWeapon();
const smartEnemy = smartEnemyfactory.createEnemy(smartWeapon);

smartEnemy.fireWeapon();
smartEnemy.move();
