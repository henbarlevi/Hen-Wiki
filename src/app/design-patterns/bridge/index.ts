/*
 Implementor
 With the Bridge Design Pattern you create 2 layers of abstraction
 In this example I'll have an abstract class representing
 different types of devices. I also have an abstract class
 that will represent different types of remote controls
 This allows me to use an infinite variety of devices and remotes
*/
abstract class EntertainmentDevice {
    volumeLevel: number = 0;
    constructor(public deviceState: number, public maxSetting: number) { }
    abstract buttonFivePressed(): void;
    abstract buttonSixPressed(): void;

    buttonSevenPressed(): void {
        this.volumeLevel++;
        console.log("Volume at: " + this.volumeLevel);
    }

    buttonEightPressed(): void {
        this.volumeLevel--;
        console.log("Volume at: " + this.volumeLevel);

    }
    abstract mute(): void;
    abstract pause(): void;
    
}
/*
Concrete Implementor
Here is an implementation of the EntertainmentDevice
abstract class.I'm specifying what makes it different
from other devices
*/
class TVDevice extends EntertainmentDevice {

    buttonFivePressed(): void {
        console.log("Channel Down");
        this.deviceState--;
    }
    buttonSixPressed(): void {
        console.log("Channel Up");
        this.deviceState++;
    }
    mute(): void {
        console.log('TVmuted');
    }
    pause(): void {
        console.log('TV Paused');
    }
}

class DvDDevice extends EntertainmentDevice {

    buttonFivePressed(): void {
        console.log("Prev Chapter");
        this.deviceState--;
    }
    buttonSixPressed(): void {
        console.log("Next Chapter");
        this.deviceState++;
    }
    mute(): void {
        console.log('DVD muted');
    }
    pause(): void {
        console.log('DVD Paused');
    }
}
/*
 This is an abstract class that will represent numerous
ways to work with each EntertainmentDevice
*/

abstract class RemoteControl {
    // A reference to a generic device using aggregation
    constructor(protected device: EntertainmentDevice) {
    }
    buttonFivePressed(): void {
        this.device.buttonFivePressed();
    }
    buttonSixPressed(): void {
        this.device.buttonSixPressed();
    }
    abstract buttonNinePressed(): void;//in each remote - btn 9 behave differently
}

/*
    Refined Abstraction
    If I decide I want to further extend the remote I can
*/
class RemoteMute extends RemoteControl {

    public buttonNinePressed(): void {
       this.device.mute();
    }
}
/*
Refined Abstraction
If I decide I want to further extend the remote I can
*/

 class RemotePause extends RemoteControl {

    public  buttonNinePressed():void {
        this.device.pause();
    }
 }
//RUN CODE
/**as you can see i can combine ANY Entertainment device WITH ANY remote 
 * and by using the bridge pattern the code above is minimal
 */
const tv = new TVDevice(0,10);
const dvd = new TVDevice(0,4);

const remotePause = new RemotePause(tv);
const remotePause2 = new RemotePause(dvd);

const remoteMute = new RemoteMute(tv);
const remoteMute2 = new RemoteMute(dvd);

remoteMute.buttonNinePressed();
remoteMute2.buttonNinePressed();
remotePause.buttonNinePressed();
remotePause2.buttonNinePressed();

