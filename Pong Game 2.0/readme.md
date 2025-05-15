# Entry code for the creative coding week 03 project

Author: Uwe Hahne, Nov 2024

This code can be used to start the implementation.

## Files

[index.html](index.html) contains nothing but the connections to the stylesheet and the necessary scripts. You can edit the `<body>` element as you like.

[script.js](script.js) contains an exemplary script that illustrates how to use the events from the ESP pins or for debugging by pressing the numbers according to this mapping:
 - 1 = 12
 - 2 = 13
 - 3 = 14
 - 4 = 27
 - 5 = 32
 - 6 = 33

If you press `1` the script calls the function `handleTouch12()` which calls the function `changeColor()` which changes the background. This is just an example to illustrate the mechanism and should be changed for your project.

[style.css](style.css) contains some styling that can be edited if needed.

[dat.gui.min.js](./libraries/dat.gui.min.js) and [eia1_voyager_sdk.js](./libraries/eia1_voyager_sdk.js) are needed to receive the signals from the ESP and should not be changed.