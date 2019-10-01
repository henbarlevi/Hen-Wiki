> ### General
### [Rxjs☘️](#Rxjs)
### [Design Patterns☘️](#designpatterns)
### [Regex☘️](#Regex☘️)
> ### Server
### [Docker☘️](#Docker☘️)
> ### Client
### [Jquery☘️](#Jquery)
### [Angular☘️](https://github.com/henbarlevi/ang2-sbs)
> ### DB
### [Neo4j (Cypher)☘️](#Cypher)




# ===============================
# Rxjs  <a name="Rxjs"></a>☘️ 
> - [create an Observable](#Rxjs.a)
> - [Interval Observable](#Rxjs.b)
> - [Your Own Operator](#Rxjs.c)
> - [Builtin Operators](#Rxjs.d)
> - [Builtin Operators Part 2](#Rxjs.e)
> - [Subjects](#Rxjs.f)
> - [Hot Vs Cold](#Rxjs.g)
> - [Combine Observables](#Rxjs.h)
> - [Error Handling](#Rxjs.i)
> - [Migrate to V6.0+](#Rxjs.V6.0)
# ===============================

### How to create an Observable  <a name="Rxjs.a"></a>:
```ts
    //create observable
    const observable = new Rx.Observable(observer => {
      console.log('creating observable')
      setTimeout(function () {
        observer.next('an item');
        setTimeout(function () {
          observer.next('another item');
          observer.complete();
        }, 500);
      }, (1000));
    })
    //subscribe
    observable.subscribe(
      (item) => {
        console.log(item),
          error => { console.error(error) },
          () => { console.log('completed') }
      });

    setTimeout(function () {
      observable.subscribe(
        (item) => {
          console.log(item),
            error => { console.error(error) },
            () => { console.log('completed') }
        });
    }, 2000);
  ```
### create Interval Observable <a name="Rxjs.b"></a>:
```ts

    const observable = Rx.Observable.interval(1000);
    const observer = { next: (index) => console.log(index) };
    let subscription = observable.subscribe(observer);

    setTimeout(function () {
      subscription.unsubscribe();//unsubsribe after 10 sec
    }, 10000);
    //OUTPUT : 0,1,2,3,4,5,6,7,8,9
```
### How to Create Your Own Operator <a name="Rxjs.c"></a>
```ts
  //what an operator does is simply wrapping the observable with new observable that filter that passed stream from the inner observable
  take$(observable: Rx.Observable<number>, amount) {
    //creating and returing new observable
    return new Rx.Observable(observer => {
      let count = 0;
      const subscription = observable.subscribe({
        next: (item) => {
          if (count++ >= amount) {
            observer.complete();
          } else {
            observer.next(item);
          }
        },
        error: (error) => { observer.error(error) },
        complete: () => observer.complete()

      });
      //return value = function that happen when the created observable subscription invoke .unsubscribe()
      return () => subscription.unsubscribe(); //unsubsribing from the inner observable
    });
    // / creating and returing new observable

  }
  
  tryMyTakeFilter() {
    this.take$(Rx.Observable.interval(1000), 5)
      .finally(() => { console.log('take filter finished') })
      .subscribe((item) => { console.log('from take filter :' + item) })
  }
```
### Rxjs Builtin Operators <a name="Rxjs.d"></a>

```ts
    //interval + take:
    Rx.Observable.interval(1000).take(3).subscribe((index) => { console.log(index) });
    //Timer
    Rx.Observable.timer(1000).subscribe((index) => console.log('timer : ' + index), (err) => console.log(err), () => console.log('timer completed'));
    //Of
    Rx.Observable.of('hello world').subscribe((item) => console.log('Of :' + item));
    Rx.Observable.of(['hello world', 3, 4]).subscribe((item) => console.log('Of With Array :' + item));
    //from
    Rx.Observable.from(['hello', 'world', 3, 4]).subscribe((item) => console.log('From : ' + item));
    //throw
    Rx.Observable.throw(new Error('this is an error')).subscribe({ error: item => console.log(item) }); //throw an error
    //empty
    Rx.Observable.empty().subscribe({ complete: () => console.log('empty : completed') })//emits no items to the observer and complete immidetly
    //never
    Rx.Observable.never().subscribe(() => console.log('never')) //emits no items and never complets
    //range
    Rx.Observable.range(10, 20).subscribe((index) => console.log('range :' + index)) //emits 1 to 30
    //defer
    let defer$ = Rx.Observable.defer(() => { return Rx.Observable.of('hi') }); //will invoke this function when subscribing
    defer$.subscribe((item) => console.log('Defer : ' + item));

    //fs.readdir('../app',(err,files)=>console.log(files));
  ```
### Subjects <a name="Rxjs.f"></a>
  
```ts
    //subject is like an observable that we can control when it emits values
    const subject$ = new Rx.Subject();

    subject$.subscribe({
      next: (item) => console.log('subject :' + item),
      complete: () => console.log('subject completed!')
    });

    subject$.next('emit1');
    subject$.next('emit2');
    subject$.complete();
    //example with interval
    const interval$ = Rx.Observable.interval(500).take(5);
    const intervalSubject$ = new Rx.Subject();
    interval$.subscribe(intervalSubject$); //subject as next and complete methods - so its like we passing an observer (=intervalSubject) to the interval observable 

    intervalSubject$.subscribe((item) => console.log('subject Interval sub 1 : ' + item));
    intervalSubject$.subscribe((item) => console.log('subject Interval sub 2 : ' + item));
    setTimeout(function () {//NOTICE - the subject produce values wether or not somebody listening
      intervalSubject$.subscribe((item) => console.log('subject Interval suspended sub : ' + item));

    }, 1000);

    //behavior subject:
    //the moment the subscriber subscribe to the behavior subject - it gets the previous value as  emit
    const behaviourSubject$ = new Rx.BehaviorSubject<string>('hello');//behavior subjects get initial state that gey emit
    behaviourSubject$.subscribe(s => console.log('behavioirSubject : said :' + s))

    behaviourSubject$.next('hi');
    behaviourSubject$.next('hey');
    behaviourSubject$.next('bye');

    setTimeout(function () {
      behaviourSubject$.subscribe(s => console.log('behaviorSubject SUB2 :' + s));
    }, 2000);
    //IN BehaviorSubjects -the moment the subscriber subscribe to the behavior subject - it gets the last emitted value
    //but what if we want multi previous values to get emit to the new subscriber?:


    const replaySubject$ = new Rx.ReplaySubject<Number>(2); //the initial value - number of previous values a new subscriber gets
    replaySubject$.next(1);
    replaySubject$.next(2);
    replaySubject$.next(3);

    //sub after 3 emits
    replaySubject$.subscribe(c => console.log('reaplysubject :' + c));//output : replaysubject 2,replaysubject 3

    const replaysubject2$ = new Rx.ReplaySubject<string>();

    replaysubject2$.next('hello');
    replaysubject2$.next('hello');
    replaysubject2$.next('hello');
    replaysubject2$.next('hello');
    //subscribe after 4 emits
    replaysubject2$.subscribe((s) => console.log('ReplaySubject<string> :' + s)); //output : all vlaues including all prev values
    replaysubject2$.next('bye');
    replaysubject2$.next('blah');
    //https://stackoverflow.com/questions/34376854/delegation-eventemitter-or-observable-in-angular2

  
  ```
### Hot vs Cold Observable <a name="Rxjs.g"></a>

```ts
    // //HOT - u not expected to recieve history data:
    // const keyUps$ = Rx.Observable.fromEvent(document.body, 'keyups');
    // //Cold - when u subscribe to it - then it produce values and you excpect to recieve all vlaues from start to finish
    // const interval$ = Rx.Observable.interval(400);
    // //every time we subscribe to the interval we got a new set timeout

    // interval$.subscribe(i => console.log('one :' + i));

    // setTimeout(function () {
    //   interval$.subscribe(i => console.log('two :' + i));

    // }, 1000);
    //OUTPUT : one : 0, one : 1 ..2 then one:3 ,two:0 , one:4 ,two:1
    //--------------------------------------------------------------------------------------------------

    //making interval a HOT observable
    const interval2$ = Rx.Observable.interval(100).take(5).publish();//PUBILSH() =hot
    interval2$.connect();//start emit values even if nobody sub to it
    setTimeout(function () {
      interval2$.subscribe(i => console.log('sub1 :' + i));
    }, 300);
    setTimeout(function () {
      interval2$.subscribe(i => console.log('sub2 : ' + i));
    }, 400);

    //OUTPUT :  sub1 : 2, sub1 : 3,sub2 : 3, sub1 : 4,sub2 : 4, NOTICE the subscribers get the same value

    //--------------------------------------------------------------------------------------------------

    //example when to use this:
    const chatmessages$ = new Rx.Observable(observer => {
      observer.next(1);
      observer.next(2);
      setTimeout(function () {

        observer.complete();
      }, 5000);
      //return value = function that happen when the created observable subscription invoke .unsubscribe()
    }).publishLast();// OR publish() //HOt observable that no matter when u sub to it ,
    // it will emit values to the subscriber from the last vlaue before the completion
    //and  publishLast() will emit values only after the observable complete
    const connection = chatmessages$.connect();
    const sub1 = chatmessages$.subscribe((i) => { console.log('chat Sub 1 :' + i) }, () => { }, () => console.log('chat sub 1 completed'));
    const sub2 = chatmessages$.subscribe((i) => { console.log('chat Sub 2 :' + i) }, () => { }, () => console.log('chat sub 2 completed'));
    setTimeout(function () {
      sub1.unsubscribe();
      sub2.unsubscribe();

      connection.unsubscribe(); //because its a hot observable we also need to dispose the connection (observable itself)
    }, 6000);
    //OUTPUT : after 5000mls - 'chat sub 1 : 2', 'chat sub 2 : 2' 'chat sub 1 completed', 'chat sub completed'
    //NOTE - we can use publishReplay if we want to emit to the suber more previous values
    //--------------------------------------------------------------------------------------------------
    //---refcount 
    //refcount will handle the connect() and connection.unsubscribe for you
    //it will connect when there is first subscription and  will connection.unsubsribe
    //when all subs unsubscribed()

    const observable$ = new Rx.Observable(observer => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
      return () => console.log('disposed refcount observable');
    })
    const publish$ = observable$.publishReplay(2).refCount();

    const subs1 = publish$.subscribe((i) => console.log(`refCount sub1 :${i}`));
    const subs2 = publish$.subscribe((i) => console.log(`refCount sub2 :${i}`));

    subs1.unsubscribe();
    subs2.unsubscribe();
    const subs3 = publish$.subscribe((i) => console.log(`refCount sub3 :${i}`));
    //NOTE observabke$.share() = observable$.publish().refCount()
  ```
 ### more builtin operators <a name="Rxjs.e"></a>
```ts
    /*====== do , map finally =======*/
    Rx.Observable.range(1, 10)
      .finally(() => console.log('completed!!')) // on complete
      .do((i) => console.log('from do : ' + i))//doesnt affect the stream
      .map(i => i * 2)
      .subscribe(i => console.log(i))
    //OUTPUT
    //from do :1 ,2 from do:2,4......completed!!
    /*====== filter =======*/
    Rx.Observable.interval(100)
    .startWith(-10)
    .filter(i=>i%2 ===0)
    .subscribe(i=>console.log(i));
    //OUTPUT -10,0,2,4..
    /*====== Merge =======*/
    //merge the 2 observable to 1 stream of data
    Rx.Observable.interval(1000)
      .merge(Rx.Observable.interval(500))
      .subscribe(i => console.log(i)); //OUTPUT : 0 , 0, 1, 2, 1 ,3, 4,2
    //Or
    Rx.Observable.merge(
      Rx.Observable.interval(1000).map(i=>'second :'+i),
      Rx.Observable.interval(500).map(i=>'half second :'+i),
    ).take(10).subscribe(console.log);
    //-------------------------------------------------------------------------

    /*====== Concat =======*/
    // concat the strams of data on after another
    Rx.Observable.concat(
      Rx.Observable.interval(100).take(5),
      Rx.Observable.range(10, 3)
    ).subscribe(console.log); //OUTPUT 0,1,2,3,4,10,11,12
    //-------------------------------------------------------------------------

    /*====== MergeMap =======*/
    // Projects each source value to an Observable which is merged in the output Observable.
    let getTracks = () => {
      return new Promise((res, rej) => {
        setTimeout(function () {
          res(['track1', 'track2'])
        }, 2000);
      })
    }
    Rx.Observable.fromPromise(getTracks()).subscribe(console.log); //OUTPUT ['track1','track2]
    let observable$: Rx.Observable<Array<string>> = Rx.Observable.fromPromise(getTracks())
    observable$.mergeMap(tracks => Rx.Observable.from(tracks)).subscribe(console.log)//OUTPUT : 'track1','track2'


    let querypromise = (query: string): Promise<string> => {
      return new Promise((res, rej) => {
        setTimeout(function () {
          res('THE QUERY IS :' + query);
        }, 1000);
      })
    }

    Rx.Observable.of("my query")
      .do(() => console.log('before merge'))
      .mergeMap((q) => querypromise(q))
      .do(() => console.log('after merge'))
      .subscribe(console.log); //OUTPUT : before merge, after merge, THE QUERY IS : my query

    /*====== switchmap  =======*/
    // same as mergemap but it  cares only about the last source value and forsake the others
    //emit immediately, then every 5s
    const source = Rx.Observable.timer(0, 5000);
    //switch to new inner observable when source emits, emit items that are emitted 
    const example = source.switchMap(() => Rx.Observable.interval(500));
    // //output: 0,1,2,3,4,5,6,7,8,9...0,1,2,3,4,5,6,7,8

    // //in merge map it would have been 0,1,2,3,4,5,6,7,8 ,9,0 10,1 11,2 ...... 19,9,0
    // const subscribe = example.subscribe(val => console.log(val));
    // 
    /*====== reduce + scan  =======*/
    //reduce emit value only after it stream finishes and reduce has final value
    Rx.Observable.range(1, 10)
      .reduce((prev, current) => prev + current)
      .subscribe((i) => console.log('reduce :' + i)); //OUTPUT reduce 55
    //scan - same as reduce but it emit each valu reduce sepertly
    Rx.Observable.range(1, 10)
      .scan((prev, current) => prev + current)
      .subscribe(i => console.log(`scan ${i}`)); //OUTPUT scan 1, scan 3, scan 6....scan 55
    //so with scan we can
    Rx.Observable.interval(100).scan((p, c) => p + c).subscribe(console.log);
    //and it will print valu for each source data
    // but because Reduce on the other hand wait for the source to finish it wont do anything
    Rx.Observable.interval(100).reduce((p, c) => p + c).subscribe(i=>console.log('reduce'+i));//OUTPUT: NONE

    /*====== Buffer + ToArray =======*/

    Rx.Observable.interval(100).bufferCount(10)
    .subscribe(console.log); //OUTPUT : [0,1,2....9], [9,10....19],...   

    Rx.Observable.interval(100).bufferTime(300)
    .subscribe(console.log); //OUTPUT : [0,1,2], [4,5,6],...   

    //The buffer method periodically gathers items emitted by a source Observable into buffers, and emits these buffers as its own emissions.

    const stopSubject$ = new Rx.Subject();
    Rx.Observable.interval(100).buffer(stopSubject$).subscribe(console.log);// OUTPUT [0,1,2,3,4]
    //the buffer method get an observable that singles when to flush the data
    setTimeout(function() {
      stopSubject$.next();
    }, 500); 

    Rx.Observable.range(1,10)
    .toArray().subscribe(console.log); //OUTPUT : [1,2...10]
    //toArray collect all data stream into array and pass it forward when observable finished
    /*====== first ,last ,skip , take ,takeUntil, skipUntil =======*/

    const observable$ = Rx.Observable.create(observer => { //NOTE -cold observable
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.next(4);

    });

    observable$.first().subscribe(console.log); //OUTPUT 1 - NOTE - will get error if no element exists
    observable$.last().subscribe(console.log); //OUTPUT none - it waits unti it complete - NOTE - will get error if no element exists
    observable$.single().subscribe(console.log); //OUTPUT error - there isnt single element, there are multi

    observable$.skip(2).subscribe(console.log); //OUTPUT 3,4 -
    observable$.take(3).subscribe(console.log); //OUTPUT 1,2,3

    observable$.takeUntil(i=>i<3).subscribe(console.log); //OUTPUT 1,2,3

    Rx.Observable.interval(100).skipWhile(i=>i<4).takeWhile(i=>i<10).subscribe(console.log);//OUTPUT 4...9
    Rx.Observable.interval(100).skipUntil(Rx.Observable.timer(350)).takeUntil(Rx.Observable.timer(1000)).subscribe(console.log);//OUTPUT 3...8


  }

```
### Combine Observables <a name="Rxjs.h"></a>
```ts
    //http://rxmarbles.com/#zip
    Rx.Observable.range(1, 10)
      .zip(Rx.Observable.interval(1000), (left, right) => {//NOTE - left -first observable items , right -second observable items
        return `got ${left} value , after ${right} secondes`
      })
      .subscribe(console.log); //OUTPUT - 'got 1 after 0 secondes' , 'got 2 after 1 seconds'

    //http://rxmarbles.com/#withLatestFrom
    Rx.Observable.interval(200).withLatestFrom(Rx.Observable.interval(500)).subscribe(console.log);//OUTPUT -after 200mls [1,0], after "" [2,1],[3,1],[4,2],[5,2]
    //http://rxmarbles.com/#combineLatest
    //similar to withLatest but it emit value wether one of the observables emits data
    Rx.Observable.interval(200).combineLatest(Rx.Observable.interval(500)).subscribe(console.log);//OUTPUT -after 200mls [1,0],[2,0],[3,0],-->[4,0],[4,1]<--

  }
  ```
### Error Handling <a name="Rxjs.i"></a>
```ts
  
    // //if we dont handle errors -> the observable will stop is streaming and will unsubscriibe
    Rx.Observable.concat(
      Rx.Observable.of(42),
      Rx.Observable.throw(new Error('blah')),
      Rx.Observable.of(10)
    ).subscribe(console.log); // 42 , Error raise! . not getting 10 - observable got unsubscribed automatically
    //-----------------------------
    //simulate error raise:
    let getapi = () => {
      return new Promise((res, rej) => {
        setTimeout(function () {
          rej(new Error('ERORR!!!'));
        }, 100);
      })
    }

    Rx.Observable.fromPromise(getapi())
      .catch(err => {
        console.log(err);
        return Rx.Observable.of(err);
      })
      .subscribe(item => console.log('ITEM :' + item)) //OUTPUT - ERROR!! :err descripton ,'ITEM Error :ERROR!!'
    //---------------------------------
    //simulaet error raise :
    let getapiObservable = () => {
      return new Rx.Observable((observer) => {
        console.log('Getting Api');
        setTimeout(function () {
          observer.error(new Error('ERORR **'))
        }, 100);
      })
    }

    getapiObservable()
    .retry(3) // retry the request 3 times if it Fails
    .catch(err=>{console.log('Error Raised :' +err); return Rx.Observable.of(err)})
    .subscribe(i => {console.log('item :' + i)})//OUTPUT : Getting Api * 3 , Error Raised : Error ERROR **, item :Error :Error**
    //NOTE - if we wont catch - it still retry 3 times but the error will be throw to console
  }
}
```
### Migrate to Rxjs 6.0+ <a name="Rxjs.V6.0"></a>
>  ### you can find a full guide [here](https://www.academind.com/learn/javascript/rxjs-6-what-changed/#operators-update-path)
- ### the way we import changed :
```ts
//instead of
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';
//we do
import { Observable, Subject ,of } from 'rxjs';
import { map, take } from 'rxjs/operators';
```
- ### now operators must be used with pipe:
```c
//instead of
myObservable
  .map(data => data * 2)
  .subscribe(...);
//we do
myObservable
  .pipe(map(data => data * 2))
  .subscribe(...);

```
> - #### pipe takes an infinite amount of arguments and each argument is an operator you want to apply to the Observable.
```c
myObservable
  .pipe(map(data => data * 2), switchMap(...), throttle(...))
  .subscribe(...);
  ```

So you could have a chain like this
- ### some operators where renamed:
> 1. #### catch() TO catchError().
> 2. #### do() TO tap()
> 3. #### finally() TO finalize()
> 4. #### switch() TO switchAll()
- ### some Observable-creation methods were renamed
> 1. #### throw() TO throwError()
> 2. #### fromPromise() TO from()
# ===============================
# Jquery <a name="Jquery"></a>☘️ 
# ===============================
# ===============================
# Design Patterns <a name="designpatterns"></a> ☘️ 
> - [Strategy](#designpatterns.strategy)
> - [Decorator](#designpatterns.decorator)
> - [Adapter](#designpatterns.adapter)
> - [Bridge](#designpatterns.designpatterns.bridge)
> - [Factory Method](#designpatterns.factory-method)
> - [Abstract Factory](#designpatterns.abstract-factory)
> - [Composite](#designpatterns.composite)


# ===============================
## General Guide
- avoid duplicate code
- eliminate any technics that cause 1 class to affect others - super class shouldn't break code in subClass and vise versa
---
## <b>Strategy</b> <a name="designpatterns.strategy"></a>
#### <b> Should be Used When </b> - you want to define a class that will have one behaviour from a list of behaviours <br> for exmaple : Define a specific animal class (bird for ex) that will be able to choose from the following behaviours: 
- not flying
- fly slow
- fly fast
#### <b> Properties </b> :
- avoid duplicate code and conditianls
- keeps class changes from forcing other class changes
- can hide complicated/secret code from the user
- you can change object behaviour at run time
- NEGATIVE : increase number of objects/classes
 ```ts
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

 ```
 ---
## <b>Decorator</b> <a name="designpatterns.decorator"></a>
> ### the decorator allows you to modify object dynamically
#### <b> Should be Used When </b> - you want the capbabilities of inheritance with subclasses , but you need to add functionality at runtime
#### <b> Properties </b> :
- more flexiable then inheritance
- simplfy code (you add functionality using many simple classes)
- rather then rewrite old code you can extend with new code
 ```ts
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
// RUN CODE:
const plainPizza: PlainPizza = new PlainPizza();
const pizzaWithCheese = new CheeseTopping(plainPizza);
const pizzaWithCheeseAndOlivs = new olivsTopping(pizzaWithCheese);

console.log(pizzaWithCheeseAndOlivs.Cost);//11.00
console.log(pizzaWithCheeseAndOlivs.getDescription());//'Thin Dough with cheese with olivs

 ```
---
## <b>Adapter</b> <a name="designpatterns.adapter"></a>
> ### the Adapter allows 2 incompatible interfaces to work together
#### <b> Should be Used When </b> - client expects a (target) interface
#### <b> Properties </b> :
- allows the use of the available interface and the target interface
- any class can work together as long as the adapter solves the issue that all classes must implement every method defiend by the shared interface
 ```ts
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

 ```
 ---
 ## <b>Bridge</b> <a name="designpatterns.bridge"></a>
> ### the bridge allows you to progressively add functionality while separating out major differences using abstract classes
#### <b> Should be Used When </b> - you want want to be able to change both abstractions (abstract classes) and concrete classes independenty
#### <b> Properties </b> :
- minimize code
 ```ts
 
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


 ```
 ---
 ## <b>Factory Method</b> <a name="designpatterns.factory-method"></a>
> ### the Factory method let you encapsulate object creation business logic
#### <b> Should be Used When </b> 
- when you want a method to return one of serveral possible classes that share a common Super classtime/interface
- when you dont know ahead of time what class object you need + all the classes are in the same subclass hierarchy
#### <b> Properties </b> :
- let chose class creation at run time 
- encapsulate object creation
#### <b> Example </b>
we are building a game and we need a way to craete the enemies of the player but we want to create them randomly <br> and we dont know what concrete enemy class we need
 ```ts
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


 ```
 ---
 ## <b>Abstract Factory</b> <a name="designpatterns.abstract-factory"></a>
> ### Allows you to create families of related objects without specifying a concrete class
#### <b> Should be Used When </b> 
- you have many objects that can be added or changed dynamically during runtime
#### <b> Properties </b> :
-  provide an interface for creating families of related or dependent objects without specifying concret classes
- can model anything and have those objects interact through common interfaces
```ts

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

```
---
 ## <b>Composite</b> <a name="designpatterns.composite"></a>
> ###  describes a group of objects that is treated the same way as a single instance of the same type of object.<br> The intent of a composite is to "compose" objects into tree structures to represent part-whole hierarchies.
#### <b> Properties </b> :
- the composite pattern lets clients treat individual objects and compositions uniformly
```ts
/**Component */
interface SongComponent {
    Name: string,
    play(): void
}

/**Composite */
//each songCollection can contain number of songCollections/individual songs
class SongCollection implements SongComponent {
    private collection: SongComponent[] = [];
    get Name() { return this.name; }

    constructor(private name: string) { }

    play(): void {
        console.log('Start playing the song collection ' + this.name)
        for (let songComponent of this.collection) {
            songComponent.play();
        }
    }
    //can add a collectio of songs/song
    add(songComponent:SongComponent){
        this.collection.push(songComponent);
    }
    remove(songComponent:SongComponent){
        const index= this.collection.indexOf(songComponent);
        if (index > -1) {
            this.collection.splice(index, 1);
        }
    }
}
/**Leaf */
class Song implements SongComponent {
    play(): void {
        console.log('playing the song ' + this.name);
    }
    constructor(private name: string) { }
    get Name() { return this.name; }
}

//RUN CODE
const musicArchive = new SongCollection('musice archive');
const countryCollection = new SongCollection('Rock Collection');
const shakeyGravesCollection = new SongCollection('Shakey Graves Singer');
shakeyGravesCollection.add(new Song('Shakey Graves - Late July'));
shakeyGravesCollection.add(new Song('Shakey Graves - dearly departed'));
countryCollection.add(shakeyGravesCollection);
musicArchive.add(countryCollection);
```
# ===============================
# Cypher <a name="Cypher"></a> ☘️ 
# ===============================
```ts
 1 MATCH (n) DETACH DELETE (n) - delete all nodes in db
 2 MERGE (a:ACTOR {id:99}) - create this node if not exist 
 3 /*return all actors that played in the fight club movie (and the movie node):*/
   MATCH (m:MOVIE {name:"fight club"}) WITH m MATCH (m)<-[:ACTED_IN]-(a:ACTOR) return m,a  - 
 4 MATCH (m:MOVIE {name:"fight club"}) WITH m MATCH (m)<-[:ACTED_IN]-(a:ACTOR) return m,count(a)  - return the number of actors that played in the fight club movie (and the movie node)
 5 MERGE(a:ACTOR{id:98})
        ON CREATE
        SET a.name="Mark Hamill", a.counter=0
        ON MATCH
        SET a.counter=a.counter+1
        return a
 6 MATCH (m:MOVIE) WITH m MATCH (m) <-[ACTED_IN]- (a:ACTOR) return m.title, COLLECT(a.name) as names - return movie title and a collection of the actors names that played that movie
 7 MATCH (a:ACTOR) OPTINAL MATCH (a)-[r]->() return a.name type(r) - return actor name and the relationship type if exist (if not - type(r)=null)
 8 MATCH (a)-->(b)-->(c) return a,b,c LIMIT 100 - return the nodes with this pattern - limit the result returned to 100
 9 Different ways to write the same query:
   - MATCH (a)-[:ACTED_IN]->(m)<-[:DIRECTED]-(d) return a.name AS actor , m.title as MOVIE, d.name AS director
   - MATCH (a)-[:ACTED_IN]->(m), (m)<-[:DIRECTED]-(d) return a.name AS actor , m.title as MOVIE, d.name AS director
 10 we can return a path
    - MATCH p=(a)-[:ACTED_IN]->(m)<-[:DIRECTED]-(d)  RETURN p
    - MATCH p=(a)-[:ACTED_IN]->(m)<-[:DIRECTED]-(d)  RETURN nodes(p) - return the nodes of the path
    - MATCH p=(a)-[:ACTED_IN]->(m)<-[:DIRECTED]-(d)  RETURN rels(p) - return the relationships of the path
    - MATCH p1=(a)-[:ACTED_IN]->(m), p2 =(m)<-[:DIRECTED]-(d) RETURN p1,p2
 
 ===================Aggregation=================================
  1  return an actor and a director and the number of movies that they where together
    -MATCH (a)-[:ACTED_IN]->(m)<-[:DIRECTED]-(d) RETURN a.name ,d.name,count(*) 
    return the same but get the 5 with the biggest count value
    MATCH (a)-[:ACTED_IN]->(m)<-[:DIRECTED]-(d) RETURN a.name ,d.name,count(*) AS Count ORDER BY count DESC LIMIT 5
  
  2 return the movie titles where keenu reeves played as neo
    MATCH (a:ACTOR {name:"Keanu Reeves"})-[r:ACTED_IN]->(movie) WHERE "Neo" IN (r.roles) return movie.title
    different way to same query but with better performance:
    MATCH (a:ACTOR {name:"Keanu Reeves"})-[r:ACTED_IN]->(movie) WHERE ANY(x IN r.roles WHERE x="Neo")
    return movie.title

  3 actors who worked with gene and were directors of their own films
  MATCH (gene:Person {name:"Gene Hackman"})-[:ACTED_IN]->(m)<-[:ACTED_IN]-(director)
  WHERE (director)-[:DIRECTED]->() RETURN DISTINCT director.name
  
  4 Actors who worked with keanu but no when he was also working with Hugo
   MATCH (keanu:ACTOR {name:"Keanu Reeves"})-[:ACTED_IN]->(m)<-[:ACTED_IN]-(actor) ,
            (hugo:ACTOR {name:"Hugo Weaving"}) WHERE NOT (hugo)-[:ACTED_IN]->(m)
            RETURN DISTINCT actor.name



 

The comparison operators comprise:

equality: =
inequality: <>
less than: <
greater than: >
less than or equal to: <=
greater than or equal to: >=
IS NULL
IS NOT NULL
String-specific comparison operators comprise:

STARTS WITH: perform case-sensitive prefix searching on strings
ENDS WITH: perform case-sensitive suffix searching on strings
CONTAINS: perform case-sensitive inclusion searching in strings

=====================CREATE / UPDATE====================
*create node:
CREATE (m:MOVIE {title :"twilight",released:2010});
*adding/updating props:
MATCH (m:MOVIE {title :"twilight"}) SET m.rating =5 return m;
*create relationship:
MATCH (m:MOVIE {title:"fight club"}) , (brad:ACTOR {name:"Brad Pit"})
MERGE (brad)-[ACTED_IN]->(m) 
    ON CREATE 
    SET r.roles=["Tyler"]

*update relationship:
udpate kevin bacon role in "mystic river" movie from 'sean' to 'sean devine' without touching his other roles in this movie
MATCH (kevin:ACTOR {name:"kevin bacon"})-[r:ACTED_IN]->(m:MOVIE {name:"mystic river"})
SET r.roles = [n in r.roles WHERE n <>"Sean"]+"Sean Devine" 

cypher with Reg ex-------------
MATCH (m:MOVIE {title:"matrix"})<-[ACTED_IN]-(a:ACTOR ) WHERE a.name='.*Emil.*'; - return the paths where the movie is matrix and the actor name contain the value Emil

=====================DELETE =============================
YOU CANNOT DELETE a node before you remove his relationships
MATCH (emil:ACTOR {name:"Emil Eifrem"})-[r]-() DELETE r -remove node relationships
MATCH (emil:ACTOR {name:"Emil Eifrem"}) DELETE emil 
OR we can write it in one query
MATCH (emil:ACTOR {name:"Emil Eifrem"}) OPTINAL MATCH (emil)-[r]-() DELETE r ,emil
OR we can use DETACH
MATCH (emil:ACTOR {name:"Emil Eifrem"}) DETACH DELETE emil 



====================more examples===========
Unique and MERGE:
MERGE = MATCH or CREATE
adding multiple relationships:
*if actors played together in a movie , they KNOW each other, add KNOWS relationship between actors:
MATCH (a:Actor)-[:ACTED_IN]->(m)<-[:ACTED_IN]-(b:Actor)
CREATE UNIQUE (a)-[:KNOWS]-(b) - NOTICE we have to UNIQUE otherwise it will create muti relationships if the same pair of actors
played together in more than 1 movie, notice we created simetrical relationship (a KNOWS b , b KNOWS a)- by not providing a direction 
*MATCH (a)-[:ACTED_IN | :DIRECTED]->(m)<-[:ACTED_IN | :DIRECTED]-(b)
CREATE UNIQUE (a)-[:KNOWS]-(b) - create knows relationship actor or director who worked together
variable-length paths:
*friends of friends of keanu
MATCH (keanu:ACTOR {name : "keanu reeves"})-[:KNOWS*2]-(fof) RETURN DISTINCT fof.name
*friends of friends of keanu that are not firends of keanu
MATCH (keanu:ACTOR {name : "keanu reeves"})-[:KNOWS*2]-(fof) 
where NOT (fof)-[:KNOWS]-(keanu) RETURN DISTINCT fof.name
SHOTEST PATH :
*MATCH (bacon:ACTOR {name "kevin bacon"}), (charlize:ACTOR {name: "charilize theron"}),
        p=shortestPath((charilize)-[:KNOWS*]-(bacon)) RETURN length(p);

*find middle nodes that connect kevin bacon and charlize theron:
(bacon:ACTOR {name "kevin bacon"}), (charlize:ACTOR {name: "charilize theron"}),
        paths=((charilize)-[:KNOWS*]-(bacon)),
        RETURN [n in NODES(paths)[1..-1] | n.name] AS names 
```
# ===============================
# Regex <a name="Regex"></a> ☘️ 
# ===============================
- \d - digit -0-9
- \w - word - A-Z a-z 0-9
- \W - any non word - not from A-Z a-z 0-9
- \s - white space/tab
- \S - not white space
- . - any character

> #### quantifiers
- <b>*</b> -  0 or more chars
- <b>+</b> - 1 or more chars
- <b>?</b> - 0 or 1
- <b>{n}</b> - the number of chars
- <b>{min,max}</b>


> #### position 
<b>^</b>- begining of line <br>
<b>$</b>- end of line<br>
<b>\b</b> - word boundry<br>

character classes
[] - or - for exmaple [abc] - match a or b or c
alternation
(|) - or - for example (net|com) match net or com
#### examples
<b> \b\w{5}\b</b> - find any 5 letter words (babys,tom3y,arAx9)<br>
<b>colors? </b>- find color\colors words<br>
<b>\w+$ </b>- all the words at the end of a line<br>
<b>^\w+ </b>- all the words at the beginging of a line<br>
<b>^\w+$ </b>- all single word in aline <br>
<b>[.-] </b>- all . or - chars<br>
<b>[0-5]{3} </b>- all 3 numbers that contain only 0-5  (534,511 etc..)


> #### special cases
- [a-c] - all chars from a through c (NOTICE that - can behave like literal or not literal dash)
- [^a-z] - all chars that are NOT a through (^ instead [] behave differently if its at the begining)

# ===============================
# Docker <a name="Docker"></a> ☘️ 
# ===============================

### docker commands
* get docker version
```
docker -v
```
* create container and run it
```
docker run [name of image]
example:
docker run ubuntu 
```
* create container with allocate a terminal to it
```
docker run -it [name of image]
example: 
docker run -it ubuntu
```
* name a container
```
docker run -it --name  [container name] [name of image]
example: 
docker run -it --name mycontainer ubuntu
```
* list of containers running : 
``` docker ps```
* exit from container and close it:
``` exit```
* exit terminal from container but NOT close it: 
```CTRL + P + Q ```
* get terminal attach to container again
```
docker attach [container name]
example :
docker attach mycontainer
```
* delete container
```
docker rm [container name]
example 
docker rm mycontainer
(you can also add [-f] force flag to delte it)
```
#### images
* list of images : ``` docker images```
* delete image
```
docker rmi [image name]
for example: 
docker rmi ubuntu
(you can also add [-f] force flag to delte it)
```

#### Nodejs and Docker
1. create file called .Dockerile
``` DOCKERFILE
A
# The first thing we need to do is define from what image we want to build from. Here we will use the latest LTS (long term support) version 10 of node available from the Docker Hub:
FROM node:10

B
# Next we create a directory to hold the application code inside the image, this will be the working directory for your application:
WORKDIR /user/src/app

# next thing will be to install npm and nodejs on the image but this image (node:10) comes with nodejs and npm already installed

C
# copy package.json file
# NOTE - rather than copying the entire working directory, we are only copying the package.json file. in order to take advantage of cached Docker layers. http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/ .
COPY package*.json ./

D
# Install app dependencies
# If you are building your code for production
# RUN npm ci --only=productio 
# it helps provide faster, reliable, reproducible builds for production 
RUN npm install

E
# To bundle your app's source code inside the Docker image
COPY . .

F
#bind app to port
EXPOSE 3000

G
# define the command to run your app using CMD which defines your runtime. Here we will use node server.js to start your server:
CMD [ "node", "server.js" ]
```
2. create a ```.dockerignore ``` file also in the app root folder
```Dockerfile
from
```
3. run command that build an image from the commands in the ```Dockerfile```

```
docker build -t [image name] [path to Dockerfile]
for example :
docker build -t simple-docker-image .
```
4. run command that create & run a container from the built image
```
docker run [-it] -p [outside port]:[inner exposed port] [image name]
for example:
docker run -it -p 3000:8080 simple-docker-image
```
* Running your image with -d runs the container in detached mode, leaving the container running in the background.
* if you run the container in detached mode, more info [here](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/)
on how print the output of your app
* -p flag redirects a public port to a private port inside the container.

