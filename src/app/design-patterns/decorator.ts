
interface  iFighter {
    name:string
    sayHello();

}
class ExpertFighter implements iFighter{
    name:string;
    sayHello(){
         console.log(`EXPERT figher my name is ${this.name} , my abilities:`);
    }
}
class BeginnerFighter implements iFighter{
    name:string
    sayHello(){
         console.log(`BEGINNER figher my name is ${this.name} , my abilities:`);
    }
}
//DECORATTOR ABSTRACT CLASS
abstract class FighterAbilitiesDecorator implements iFighter{ 
    private decoratedFighter:iFighter;
    name:string
    constructor(protected fighter:iFighter){
        this.name = fighter.name;
    }
    public sayHello(){
        return this.fighter.sayHello()
    }
}
//DECORATOR EXAMPLES
//1
class KickAbility extends FighterAbilitiesDecorator{
    constructor(fighter:iFighter){
        super(fighter);
    }
    public sayHello(){
        this.fighter.sayHello();
         console.log('*kick');
    }

}
//2
class PunchAbility extends FighterAbilitiesDecorator{
    constructor(fighter:iFighter){
        super(fighter);
    }
    public sayHello(){
        this.fighter.sayHello();
         console.log('*Punch');
    }

}
export { iFighter,ExpertFighter,BeginnerFighter,KickAbility,PunchAbility};