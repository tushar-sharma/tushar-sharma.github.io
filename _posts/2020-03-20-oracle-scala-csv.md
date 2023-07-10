---
layout: post
title: Connecting to Oracle database form Scala using JDBC for large data
category: blog
tags:
  - jdbc
  - scala
  - oracle
  - database
name: oracle-scala-csv
thumb: https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTg30prcSNXwDpUnRH71m49YDm9VCaqSfBpZ9UH_oZWDvPke0JU
published: true
---

I was looking to write a scala script to fetch large data from Oracle database. I was earlier using the Alteryx software to fetch data (around 1 million rows) from oracle which took around 7 minutes. Licensed softwares like Alteryx or Informatica, etc are great, but I was looking for a free solution.<!-- truncate_here -->


I was looking to write a scala script to fetch large data from Oracle database. I was earlier using the Alteryx software to fetch data (around 1 million rows) from oracle which took around 7 minutes. Licensed softwares like Alteryx or Informatica, etc are great, but I was looking for a free solution. 

We need ojdbc6.jar to connect to the Oracle 12 c database. We will create a Scala script to fetch data from the oracle database & save it to the output file (CSV format).


Lets create a simple function `timed` to time our execution



<script src="https://gist.github.com/tushar-sharma/19b89ae593a079fea029924216dd490e.js"></script>


Now create  function `connOracle` to connect to Oracle


<script src="https://gist.github.com/tushar-sharma/2095d844b5b48639bb612cf5ec332f21.js"></script>

This took me *150  minutes* to fetch data 1 million records. That was not the performance I was looking for 😟

However I realized that I can increase JDBC performance by tweaking optimal fetch value. The default fetch size is 10 for JDBC. Since I have more than million rows in the database, I should increase the fetch size to 1000. 

<script src="https://gist.github.com/tushar-sharma/04c35e6a858012c8969b6071f9c736aa.js"></script>


The execution time improved drastically  and reduced to approx *8 minutes*. 

Lastly it’s trivial to save the output to flat file (CSV format) 


<script src="https://gist.github.com/tushar-sharma/a47b868d724e24fef187e3d994db451e.js"></script>

Also below is the `build.sbt` for resolving dependency 

```sh
name := “Oracle Connection”
Version := “0.1”
scalaVersion := “2.12.4”

libraryDependencies += “au.com.bytecode” % “opencsv” % “2.4”
```
