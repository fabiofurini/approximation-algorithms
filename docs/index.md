---
title: Approximation Algorithms
hide:
  - navigation
  - toc
---

<div class="hero" markdown>

# Approximation Algorithms

<!-- collana-riga -->
<p class="collana-riga" markdown>A course of the <b>Operations Research and Mathematics</b> series · [all the courses](#the-series)</p>
<!-- /collana-riga -->

Teaching material conceived and developed by **[Fabio Furini](https://fabiofurini.github.io/)**, associate
professor at [DIAG](https://www.diag.uniroma1.it/), Sapienza University of Rome.

**The course lecture notes, online**: what an approximation algorithm guarantees and how to prove it; algorithms, worst-case analyses and tight instances for knapsack, bin packing, the metric TSP and parallel machine scheduling; approximation schemes; the limits of approximation for vertex coloring, maximum clique and the general TSP. With definitions, results with proofs, worked examples, exercises with solutions, Colab notebooks and interactive apps.

Prerequisites: [Combinatorial Optimization Problems](https://fabiofurini.github.io/combinatorial-optimization/) for the problems and [Heuristic Algorithms](https://fabiofurini.github.io/heuristic-algorithms/) for the algorithms analysed here (greedy, First Fit, LPT, nearest neighbour…).

[Start :material-arrow-right:](approximation.md){ .md-button .md-button--primary }
[:material-pencil: Exercises](exercises/index.md){ .md-button }
[:material-gesture-tap: Lab](lab/index.md){ .md-button }
[:material-clipboard-check-outline: Quiz](self-assessment.md){ .md-button }
[:material-download: Downloads](downloads.md){ .md-button }

</div>

<!-- collana-app -->
## Try it now

Christofides' algorithm on ten cities: the tour found over the optimal tour, with a ratio below the 3/2 guarantee. Press «Run» to replay the minimum spanning tree, the matching, the Eulerian circuit and the shortcuts, or switch to double tree.

<div class="gi" data-grafico="oc-tsp-approx" data-vetrina="ch | 7 4 ; 14 8 ; 9 9 ; 19 0 ; 17 5 ; 17 10 ; 6 11 ; 3 4 ; 10 2 ; 20 12"></div>

[:material-gesture-tap: More apps in the lab](lab/index.md){ .md-button }
<!-- /collana-app -->

## The parts of the course

The chapters, by family of problems as in the menu: each card gives its chapter in the lecture notes.

<div class="grid cards" markdown>

-   :material-approximately-equal: **1. Principles of approximation algorithms**

    ---

    *Principles*

    Approximation algorithms · Approximation schemes

    [:octicons-arrow-right-24: Read the chapter](approximation.md) · [Exercises](exercises/approximation.md)

-   :material-approximately-equal: **2. Approximation algorithms for the knapsack problem**

    ---

    *Knapsack problems*

    Notation · Split item and residual capacity · The greedy algorithm · The Ext-Greedy algorithm

    [:octicons-arrow-right-24: Read the chapter](knapsack-approximation.md) · [Exercises](exercises/knapsack-approximation.md)

-   :material-approximately-equal: **3. Approximation algorithms for bin packing**

    ---

    *Packing problems*

    Notation · The Next Fit · The Any Fit class · Half-full property

    [:octicons-arrow-right-24: Read the chapter](bin-packing-approximation.md) · [Exercises](exercises/bin-packing-approximation.md)

-   :material-approximately-equal: **4. Vertex coloring: limits of approximation**

    ---

    *Coloring problems*

    Notation · The VCP is not approximable · Special cases · Examples

    [:octicons-arrow-right-24: Read the chapter](coloring-inapproximability.md) · [Exercises](exercises/coloring-inapproximability.md)

-   :material-approximately-equal: **5. Maximum clique: limits of approximation**

    ---

    *Clique problems*

    Notation · The MCP is not approximable · Special cases · Example

    [:octicons-arrow-right-24: Read the chapter](clique-inapproximability.md) · [Exercises](exercises/clique-inapproximability.md)

-   :material-approximately-equal: **6. The TSP: the general case and the metric case**

    ---

    *Routing problems*

    The general TSP is not approximable · A special case: the metric TSP · The double tree and the Christofides algorithms · Structural properties

    [:octicons-arrow-right-24: Read the chapter](tsp-approximation.md) · [Exercises](exercises/tsp-approximation.md)

-   :material-approximately-equal: **7. Approximation for P||Cmax**

    ---

    *Scheduling problems*

    Notation · The algorithms $LIST$ and $LPT$ · A property of list scheduling · Performance guarantees

    [:octicons-arrow-right-24: Read the chapter](pcmax-approximation.md) · [Exercises](exercises/pcmax-approximation.md)

</div>

<!-- collana-da-non-perdere -->
## Don't miss

<div class="grid cards" markdown>

-   :material-pencil-box-multiple: **Exercises with solutions**

    ---

    Exercises for every chapter, each with its worked solution that opens with a click.

    [:octicons-arrow-right-24: The exercises](exercises/index.md)

-   :material-clipboard-check-outline: **Self-assessment quiz**

    ---

    A new mock exam at every start: 13 questions, 33 points, with the solution and the link to the notes. Downloads also has the full question bank.

    [:octicons-arrow-right-24: Test yourself](self-assessment.md)

-   :material-gesture-tap: **Interactive lab**

    ---

    Apps running in the browser: move the parameters and watch the ideas of the course at work, one step at a time.

    [:octicons-arrow-right-24: The lab](lab/index.md)

-   :material-download: **Lecture notes in PDF**

    ---

    Lecture notes, exercise books and slides in PDF, with the same numbering as the website.

    [:octicons-arrow-right-24: Downloads](downloads.md)

-   :material-language-python: **Notebooks in Colab**

    ---

    The code of the course running in the browser, with nothing to install.

    [:octicons-arrow-right-24: The notebooks](notebooks.md)

-   :material-format-list-numbered: **Full index**

    ---

    All the chapters with their sections on one page, and how each chapter is organized.

    [:octicons-arrow-right-24: The index](full-index.md)

</div>
<!-- /collana-da-non-perdere -->

---

<!-- collana -->
## The series

All the courses of the series are built the same way: lecture notes online and in PDF, exercises with solutions, an interactive lab and self-assessment quizzes.

<div class="grid cards" markdown>

-   :material-function-variant: **[Mathematical Analysis 1](https://fabiofurini.github.io/mathematical-analysis-1/)**

    real numbers, functions, limits, derivatives and series, with interactive graphs

-   :material-matrix: **[Linear Algebra](https://fabiofurini.github.io/linear-algebra/)**

    vectors, matrices, determinants, linear systems and eigenvalues, with the computation lab

-   :material-code-braces: **[Algorithms](https://fabiofurini.github.io/algorithms/)**

    number representation, pseudo-code, sorting and searching, analysis and recursive algorithms

-   :material-vector-triangle: **[Linear Programming](https://fabiofurini.github.io/linear-programming/)**

    polyhedra, the simplex algorithm, duality and the dual simplex, with the interactive lab

-   :material-dots-grid: **[Integer Linear Programming](https://fabiofurini.github.io/integer-linear-programming/)**

    LP relaxation, valid inequalities, cutting planes, branch-and-bound and branch-and-cut

-   :material-vector-curve: **[Convex Optimization](https://fabiofurini.github.io/convex-optimization/)**

    convex sets and functions, convex optimization problems, with interactive graphs

-   :material-graph-outline: **[Network Optimization](https://fabiofurini.github.io/network-optimization/)**

    graphs, spanning trees, shortest paths, network flows, the network simplex and project management

-   :material-hexagon-multiple-outline: **[Combinatorial Optimization Problems](https://fabiofurini.github.io/combinatorial-optimization/)**

    knapsack, bin packing, coloring, TSP, scheduling and lot sizing: the problems, their formulations and ad hoc algorithms

-   :material-table-large: **[Dynamic Programming](https://fabiofurini.github.io/dynamic-programming/)**

    principles and DP algorithms for knapsack, lot sizing, coin change and rod cutting

-   :material-map-marker-path: **[Heuristic Algorithms](https://fabiofurini.github.io/heuristic-algorithms/)**

    constructive heuristics, local search, metaheuristics and MIP heuristics for combinatorial optimization problems

-   :material-approximately-equal: **Approximation Algorithms** · *this course*

    performance guarantees, approximation schemes and limits of approximation for combinatorial problems

-   :material-vector-polygon: **[MIP Modelling](https://fabiofurini.github.io/mip-modelling/)**

    integer linear programming models, from the formulation to the solution with solvers

-   :material-chart-timeline-variant: **[Operations Research Lab](https://fabiofurini.github.io/operations-research-lab/)**

    modelling and solving optimization problems with Python and solvers

</div>
<!-- /collana -->

Teaching material by **[Fabio Furini](https://fabiofurini.github.io/)** —
[DIAG](https://www.diag.uniroma1.it/), Sapienza University of Rome.

*This website is also available in [Italian](https://fabiofurini.github.io/algoritmi-di-approssimazione/).*
