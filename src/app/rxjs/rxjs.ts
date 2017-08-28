import * as Rx from 'rxjs';

export class rxjsExmaples{
     constructor() {
    //this.creatObservable(); //  new Rx.Observable ,subscribe
    //this.createIntervalObservable(); //, Observable.interval , unsubscribe, next,complete
    // this.tryMyTakeFilter();
    // this.bultInOperators();
    // this.subjects();
    //this.hotVsCold();
    //this.builtInOperators2();
    //this.combineObservables();
    this.errorHandling();

  }
  title = 'app works!';
  creatObservable() {

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
  }
  createIntervalObservable() {
    const observable = Rx.Observable.interval(1000);
    const observer = { next: (index) => console.log(index) };
    let subscription = observable.subscribe(observer);
    setTimeout(function () {
      subscription.unsubscribe();
    }, 10000);

  }
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

  bultInOperators() {
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
  }
  subjects() {
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

  }

  hotVsCold() {
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
  }

  builtInOperators2() {
    //------do , map finally
    // Rx.Observable.range(1, 10)
    //   .finally(() => console.log('completed!!')) // on complete
    //   .do((i) => console.log('from do : ' + i))//doesnt affect the stream
    //   .map(i => i * 2)
    //   .subscribe(i => console.log(i))
    //OUTPUT
    //from do :1 ,2 from do:2,4......completed!!
    //--------------------------------------------------------------------------------------------------

    // //------filter
    // Rx.Observable.interval(100)
    // .startWith(-10)
    // .filter(i=>i%2 ===0)
    // .subscribe(i=>console.log(i));
    //OUTPUT -10,0,2,4..
    //--------------------------------------------------------------------------------------------------

    //------Merge 
    //merge the 2 observable to 1 stream of data
    // Rx.Observable.interval(1000)
    //   .merge(Rx.Observable.interval(500))
    //   .subscribe(i => console.log(i)); //OUTPUT : 0 , 0, 1, 2, 1 ,3, 4,2
    //Or
    // Rx.Observable.merge(
    //   Rx.Observable.interval(1000).map(i=>'second :'+i),
    //   Rx.Observable.interval(500).map(i=>'half second :'+i),

    // ).take(10).subscribe(console.log);
    //--------------------------------------------------------------------------------------------------

    //-----Concat - concat the strams of data on after another
    // Rx.Observable.concat(
    //   Rx.Observable.interval(100).take(5),
    //   Rx.Observable.range(10, 3)
    // ).subscribe(console.log); //OUTPUT 0,1,2,3,4,10,11,12
    //--------------------------------------------------------------------------------------------------

    // //-------MergeMap - Projects each source value to an Observable which is merged in the output Observable.
    // let getTracks = () => {
    //   return new Promise((res, rej) => {
    //     setTimeout(function () {
    //       res(['track1', 'track2'])
    //     }, 2000);
    //   })
    // }
    // Rx.Observable.fromPromise(getTracks()).subscribe(console.log); //OUTPUT ['track1','track2]
    // let observable$: Rx.Observable<Array<string>> = Rx.Observable.fromPromise(getTracks())
    // observable$.mergeMap(tracks => Rx.Observable.from(tracks)).subscribe(console.log)//OUTPUT : 'track1','track2'


    // let querypromise = (query: string): Promise<string> => {
    //   return new Promise((res, rej) => {
    //     setTimeout(function () {
    //       res('THE QUERY IS :' + query);
    //     }, 1000);
    //   })
    // }

    // Rx.Observable.of("my query")
    //   .do(() => console.log('before merge'))
    //   .mergeMap((q) => querypromise(q))
    //   .do(() => console.log('after merge'))
    //   .subscribe(console.log); //OUTPUT : before merge, after merge, THE QUERY IS : my query

    //--------------------------------------------------------------------------------------------------
    //-----------switchmap - same as mergemap but it  cares only about the last source value and forsake the others
    //emit immediately, then every 5s
    // const source = Rx.Observable.timer(0, 5000);
    // //switch to new inner observable when source emits, emit items that are emitted 
    // const example = source.switchMap(() => Rx.Observable.interval(500));
    // //output: 0,1,2,3,4,5,6,7,8,9...0,1,2,3,4,5,6,7,8

    // //in merge map it would have been 0,1,2,3,4,5,6,7,8 ,9,0 10,1 11,2 ...... 19,9,0
    // const subscribe = example.subscribe(val => console.log(val));
    // //--------------------------------------------------------------------------------------------------
    //reduce + scan
    //reduce emit value only after it stream finishes and reduce has final value
    // Rx.Observable.range(1, 10)
    //   .reduce((prev, current) => prev + current)
    //   .subscribe((i) => console.log('reduce :' + i)); //OUTPUT reduce 55
    // //scan - same as reduce but it emit each valu reduce sepertly
    // Rx.Observable.range(1, 10)
    //   .scan((prev, current) => prev + current)
    //   .subscribe(i => console.log(`scan ${i}`)); //OUTPUT scan 1, scan 3, scan 6....scan 55
    // //so with scan we can
    // Rx.Observable.interval(100).scan((p, c) => p + c).subscribe(console.log);
    // //and it will print valu for each source data
    // // but because Reduce on the other hand wait for the source to finish it wont do anything
    // Rx.Observable.interval(100).reduce((p, c) => p + c).subscribe(i=>console.log('reduce'+i));//OUTPUT: NONE

    // //--------------------------------------------------------------------------------------------------
    //Buffer + ToArray

    // Rx.Observable.interval(100).bufferCount(10)
    // .subscribe(console.log); //OUTPUT : [0,1,2....9], [9,10....19],...   

    // Rx.Observable.interval(100).bufferTime(300)
    // .subscribe(console.log); //OUTPUT : [0,1,2], [4,5,6],...   

    //The buffer method periodically gathers items emitted by a source Observable into buffers, and emits these buffers as its own emissions.

    // const stopSubject$ = new Rx.Subject();
    // Rx.Observable.interval(100).buffer(stopSubject$).subscribe(console.log);// OUTPUT [0,1,2,3,4]
    // //the buffer method get an observable that singles when to flush the data
    // setTimeout(function() {
    //   stopSubject$.next();
    // }, 500); 

    // Rx.Observable.range(1,10)
    // .toArray().subscribe(console.log); //OUTPUT : [1,2...10]
    //toArray collect all data stream into array and pass it forward when observable finished
    // //--------------------------------------------------------------------------------------------------
    // first ,last ,skip , take ,takeUntil, skipUntil
    const observable$ = Rx.Observable.create(observer => { //NOTE -cold observable
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.next(4);

    });

    // observable$.first().subscribe(console.log); //OUTPUT 1 - NOTE - will get error if no element exists
    // observable$.last().subscribe(console.log); //OUTPUT none - it waits unti it complete - NOTE - will get error if no element exists
    //observable$.single().subscribe(console.log); //OUTPUT error - there isnt single element, there are multi

    // observable$.skip(2).subscribe(console.log); //OUTPUT 3,4 -
    // observable$.take(3).subscribe(console.log); //OUTPUT 1,2,3

    // observable$.takeUntil(i=>i<3).subscribe(console.log); //OUTPUT 1,2,3

    //Rx.Observable.interval(100).skipWhile(i=>i<4).takeWhile(i=>i<10).subscribe(console.log);//OUTPUT 4...9
    Rx.Observable.interval(100).skipUntil(Rx.Observable.timer(350)).takeUntil(Rx.Observable.timer(1000)).subscribe(console.log);//OUTPUT 3...8


  }

  combineObservables() {
    //http://rxmarbles.com/#zip
    Rx.Observable.range(1, 10)
      .zip(Rx.Observable.interval(1000), (left, right) => {//NOTE - left -first observable items , right -second observable items
        return `got ${left} value , after ${right} secondes`
      })
      .subscribe(console.log); //OUTPUT - 'got 1 after 0 secondes' , 'got 2 after 1 seconds'

    //http://rxmarbles.com/#withLatestFrom
    //Rx.Observable.interval(200).withLatestFrom(Rx.Observable.interval(500)).subscribe(console.log);//OUTPUT -after 200mls [1,0], after "" [2,1],[3,1],[4,2],[5,2]
    //http://rxmarbles.com/#combineLatest
    //similar to withLatest but it emit value wether one of the observables emits data
    Rx.Observable.interval(200).combineLatest(Rx.Observable.interval(500)).subscribe(console.log);//OUTPUT -after 200mls [1,0],[2,0],[3,0],-->[4,0],[4,1]<--

  }
  errorHandling() {
    // //if we dont handle errors -> the observable will stop is streaming and will unsubscriibe
    // Rx.Observable.concat(
    //   Rx.Observable.of(42),
    //   Rx.Observable.throw(new Error('blah')),
    //   Rx.Observable.of(10)
    // ).subscribe(console.log); // 42 , Error raise! . not getting 10 - observable got unsubscribed automatically
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