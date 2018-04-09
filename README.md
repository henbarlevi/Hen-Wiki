### 1.  [Rxjs☘️](#Rxjs)
### 2. [Jquery☘️](#Jquery)
### 3. [Design Patterns☘️](#designpatterns)
### 4. [Neo4j (Cypher)☘️](#Cypher)
### 5. [Regex☘️](#Regex☘️)


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
# ===============================
# Jquery <a name="Jquery"></a>☘️ 
# ===============================
# ===============================
# Design Patterns <a name="designpatterns"></a> ☘️ 
> - [Strategy](#designpatterns.a)
> - [Decorator](#designpatterns.decorator)
# ===============================
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

const plainPizza: PlainPizza = new PlainPizza();
const pizzaWithCheese = new CheeseTopping(plainPizza);
const pizzaWithCheeseAndOlivs = new olivsTopping(pizzaWithCheese);

console.log(pizzaWithCheeseAndOlivs.Cost);//11.00
console.log(pizzaWithCheeseAndOlivs.getDescription());//'Thin Dough with cheese with olivs

 ```
---
# ===============================
# Cypher <a name="Cypher"></a> ☘️ 
# ===============================
```ts
 1 MATCH (n) DETACH DELETE (n) - delete all nodes in db
 2 MERGE (a:ACTOR {id:99}) - create this node if not exist 
 3 MATCH (m:MOVIE {name:"fight club"}) WITH m MATCH (m)<-[:ACTED_IN]-(a:ACTOR) return m,a  - return all actors that played in the fight club movie (and the movie node)
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


-------special cases
- [a-c] - all chars from a through c (NOTICE that - can behave like literal or not literal dash)
- [^a-z] - all chars that are NOT a through (^ instead [] behave differently if its at the begining)