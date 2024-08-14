---
theme: default
layout: cover
background: "/ng.svg"
highlighter: shiki
fonts:
  mono: JetBrains Mono
---

# Declarative Programming

With examples in Angular

---
layout: two-cols-header
---

# Declarative vs Imperative

::left::

# Imperative

```ts
let someValue;
let doubles;

function init() {
  someValue = someObservable$.subscribe(
    (data) => someValue = data;
  );
  setDoubles();
}

function setDoubles() {
  doubles = someValue * 2;
}
```

::right::

# Declarative

```ts
const someValue = someObservable$;
const doubles = someObservable$.pipe(
  map((value) => value * 2)
);

someSignal = computed(() => someOtherSignal() * 2);
const message = "Hello there!"; // Declarative if constant!
```

---

# Misconceptions About Declarative Programming

#### Declarative style **doesn't** mean:

- Less code 
- Better performance (although it often is more performant)
- Usage of RxJS
- Usage of Signals

<br>

#### Declarative style is:

- The way we approach the problem
- The way we implement the solution
- How we manage the events and data flow

<br>

It's the state of the mind!

---

# Constraints to Stay Declarative

- Never reassign variables
- Encapsulate all you need to know about the variable (class property) in its declaration
- (In Angular) Avoid calling `subscribe` on observables and use `async` pipe instead
- Think of event/data sources and derive what you need from there
- Think of constructing a reactive graph and then translate that to the technology you use

---
layout: two-cols
---

# Example

imperative

```ts
class ChartComponent {
  chartData: ChartData;

  initChart() {
    this.fetchFromServer().subscribe((data) => {
      this.chartData = data;
    });
  }
}
```

```html
<chart [data]="chartData"></chart>
```

::right::

<img src="/imp-1.svg"  style="margin: 4rem 0 0 4rem;"/>

---
layout: two-cols
---

# Example

Declarative

```ts
class ChartComponent {
  chartData$ = this.fetchFromServer();
}
```

```html
<chart [data]="chartData$ | async"></chart>
```

::right::

<img src="/dec-1.svg"  style="margin: 4rem 0 0 4rem;"/>

---
layout: two-cols
---

# Derived Values

imperative


```ts
class ChartComponent {
  chartData: ChartData;
  isGaining = false;

  initChart() {
    this.fetchFromServer().subscribe((data) => {
      this.chartData = data;
      this.isGaining = 
        data.finalGain - data.startingGain > 0;
    });
  }
}
```

::right::

<img src="/imp-2.svg"  style="margin: 4rem 0 0 4rem;"/>

---
layout: two-cols
---

# Derived Values

Declarative


```ts
class ChartComponent {
  chartData$ = this.fetchFromServer();
  isGaining$ = this.chartData.pipe(
    map((data) => data.finalGain - data.startingGain > 0)
  );
}
```

::right::

<img src="/dec-2.svg"  style="margin: 4rem 0 0 4rem;"/>

---
layout: two-cols
---

# Reactivity

Imperative
```ts
class ChartComponent {
  selectedTimeline = '1M';
  chartData: ChartData;
  isGaining = false;

  initChart() {
    this.fetchFromServer(this.selectedTimeline)
      .subscribe((data) => {
        this.chartData = data;
        this.isGaining = 
          data.finalGain - data.startingGain > 0;
      });
  }

  onTimelineChange(timeline: string) {
    this.selectedTimeline = timeline;
    initChart();
  }
}
```

::right::

<img src="/imp-3.svg"  style="margin: 4rem 0 0 2rem;"/>

---
layout: two-cols
---

# Reactivity

Declarative

```ts
class ChartComponent {
  selectedTimeline$ = new BehaviorSubject('1M');
  chartData$ = this.selectedTimeline$.pipe(
    switchMap(
      (timeline) => this.fetchFromServer(timeline)
    )
  );
  isGaining$ = this.chartData.pipe(
    map((data) => data.finalGain - data.startingGain > 0)
  );
}
```

::right::

<img src="/dec-3.svg"  style="margin: 4rem 0 0 4rem;"/>

---

# Note

- Declarative programming is possible only on the higher level of programming
- There is no 100% declarative code 
- All code is imperative at a lower level
- RxJS or signals don't automatically mean declarative
- Don't overuse it!

---

# Conclusion

Declarative programming is..?

---
layout: image-right
image: "/frieren-ng-guide.webp"
---

<div class="h-full flex flex-col justify-center text-xl">

# Questions?

Thank you...

</div>

---

# Nice Resources

- [Joshua Morony](https://www.youtube.com/playlist?list=PLvLBrJpVwC7oDMei6JYcySgH1hMBZti_a)
- [Code Like a Human](https://www.youtube.com/watch?v=E7Fbf7R3x6I)
