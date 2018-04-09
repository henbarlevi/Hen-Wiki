import { iFighter,KickAbility,PunchAbility,BeginnerFighter,ExpertFighter} from './decorator';

import * as dec from './decorator'

export function runExamples(){
    decoratorExample();
}

function decoratorExample(){
    let fighter :any = new BeginnerFighter();
    fighter.name = 'jhon';

    fighter.sayHello(); // BEGINNER figher my name is jhon , my abilities:
    //adding fighter abilities:
    fighter = new KickAbility(fighter);
    fighter = new PunchAbility(fighter);
    fighter.sayHello();//BEGINNER figher my name is jhon , my abilities:
                                    //  *kick
                                    //  *Punch
   
}
