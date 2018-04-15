/**EXAMPLE 1 */
interface iEnemy {
    Fire(): void;
    Move(): void;
}


class SmallEnemy implements iEnemy {
    Fire(): void {
        console.log('enemy do small damage');
    }
    Move(): void {
        console.log('enemy moving fast')
    }
}
class BigEnemy implements iEnemy {
    Fire(): void {
        console.log('enemy do Big damage');
    }
    Move(): void {
        console.log('enemy moving Slow')
    }
}


/**
 * Factory
 */
interface iEnemyFactory {
    createEnemy(): iEnemy;
}
//factory 1
class RandomEnemyFactory implements iEnemyFactory {
    createEnemy(): iEnemy {
        return Math.random() > 0.5 ? new BigEnemy() : new SmallEnemy();
    }
}
//factory 2
/**@description craete enemy based on his previous creations , will always try to equalize the creations number from each type */
class BalanceEnemyFactory implements iEnemyFactory {
    private static smallEnemies: number = 0;
    private static bigEnemies: number = 0
    createEnemy(): iEnemy {
        if (BalanceEnemyFactory.smallEnemies > BalanceEnemyFactory.bigEnemies){
            BalanceEnemyFactory.bigEnemies++;
            return  new BigEnemy(); 
        }else{
            BalanceEnemyFactory.smallEnemies++;
            return  new SmallEnemy(); 
        }
          
    }
}
//RUN CODE 

const balanceEnemyFactory: iEnemyFactory = new BalanceEnemyFactory();
const enemy1 = balanceEnemyFactory.createEnemy();
const enemy2 = balanceEnemyFactory.createEnemy();
const enemy3 = balanceEnemyFactory.createEnemy();
enemy1.Fire();
enemy2.Fire();
enemy3.Fire();

