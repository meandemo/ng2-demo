Demo & Tutorial: Angular2 with Typescript
=============

![logo](./mdassets/ng2_ts_html5_logo.png)

# Intro

This repository introduces useful angular2 components which mimic behaviors found on many 
web sites and implemented with javascript using jquery or bootstrap frameworks.

# Latest News

Our first demo shows how a sticky div or sticky navbar behavior can be achieved with a simple angular2 component.
A Second demo demonstrate a slider component implemented using SVG which can be easily customized.

# Changes

8-jan-2016:
The code has been aligned with NG2 version 2.0.0-beta.
We are using production mode to avoid the 'has changed after it was checked' error messages. 


# Getting Started


1. clone this repository

2. `npm install`

3. `tsd reinstall --save --overwrite`

4. `gulp init`

5. `gulp demo`

6. open web page on http://localhost:8080, don't forget to activate the livereload button


## Beware

If you are using cygwin, you will have to open a powershell terminal for all the above steps.
I ran into trouble with nodemon when launching from patty.  

# Features

A live demo is available here: http://meandemo.github.io.

## A Sticky div

Our first angular2 component is a sticky div, found on many web sites ( http://www.w3schools.com/w3css).
This implementation relies on angular2 framework exclusively.

The web page has all the information, enjoy! 

## An SVG Slider

Using the power of angular2, we demonstrate an SVG based slider which can be easily customized to fit
your needs.

## Misc Info

Tested ok on Chrome 47.0.2526.80 m & win7 
