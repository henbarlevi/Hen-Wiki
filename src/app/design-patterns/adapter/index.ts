// This is the Target Interface : This is what the client
// expects to work with. It is the adapters job to make new
// classes compatible with this one.
interface aliveCreature {
    walk(): void
    talk(): void
    eat(): void
}
// Human implements aliveCreature perfectly
// Our job is to make classes with different methods
// from aliveCreature to work with the aliveCreature interface
class Human implements aliveCreature {
    walk(): void {
        console.log('walking');
    }
    talk(): void {
        console.log('talking');
    }
    eat(): void {
        console.log('eating...');
    }
}

/**
This is the Adaptee. The Adapter sends method calls
to objects that use the aliveCreature interface
to the right methods defined in Robot
 */
class Robot {
    robotWalk(): void {
        console.log('Robo-walking');
    }
    robotTalk(): void {
        console.log('Robo-talking');
    }
    simulateEating(): void {
        console.log('simulate an eating');
    }
}
/* The Adapter must provide an alternative action for the the methods that need to be used because
 aliveCreature was implemented. This adapter does this by containing an object
 of the same type as the Adaptee (Robot) All calls to aliveCreature methods are sent
instead to methods used by Robot*/
class RobotAdapter implements aliveCreature {
    constructor(private robot: Robot) { }
    walk(): void {
        this.robot.robotWalk();
    }
    talk(): void {
        this.robot.robotTalk();
    }
    eat(): void {
        this.robot.simulateEating();
    }
}
//RUN CODE
const human: aliveCreature = new Human();
const robot = new Robot();
const robotWithAdapter: aliveCreature = new RobotAdapter(robot);

robotWithAdapter.eat();
robotWithAdapter.talk();
robotWithAdapter.walk();
