Slctr
---

Slctr is a simple jQuery plugin created for selecting an area of graphic document and get coordinates of this selection. The view of selection is displayed as a simple transparent rectangle. Simple style is built on SASS.

### Markup 

    <div id="slctrBox">
        <img src="img/page11_000.jpg">
        <img src="img/page11_001.jpg">
        <img src="img/page11_002.jpg">
        ...
    </div>
    
All you have to do is add items to the ``#slctrBox``.

### Usage

    $('body').slctr();
    
To fire up the Slctr call plugin for ``body``.

##### Settings

    slctrBox: '#slctrBox',
    insdElmnts: 'img',
    globalWidth: 'undefined',
    cursorDistance: 10
    
This is default settings which of course you can change.

* ``slctrBox`` - id of selected container,
* ``insdElmnts`` - type of elements contained in, 
* ``globalWidth`` - if it's stay as 'undefined' plugin will automaticly calculate width from inside elements and assign it to Sltr container, if value will be defined container width will be the same as this value
* ``coursorDistance`` - distance of the cursor from the selected area

### Data
The selected coordinates is displaying as a data values of a hidden input ``#selectCoords``. To get this values use ``$selectCoordsDt`` object. Also use ``console.dir($selectCoordsDt);`` to see them at the browser console. 


In addition, the selection values can be read by using the callback function.

    $('body').slctr({
        callback : function(e){
            console.log(e);
        }
    });

### Style
Behind the appearance of a selected area correspond to the variables generated by SCSS file. Change it to change Slctr visual presentation.

	$crctBorderColor: #b5d7bc;
	

### Preview
This is how Slctr looks like.
![Slctr Preview](http://f.cl.ly/items/0a27451e3z253p3y3Z14/preview.jpg "Slctr Preview")

##### Notes
Please note that is **0.4** version. Feel free to use the plugin anywhere and any way you want. Let me know if you find a bug or if it is worth something to change.

**MIT License: [www.opensource.org/licenses/MIT](http://opensource.org/licenses/MIT "License").**

**Credits: [Wojciech Górecki](http://stackoverflow.com/users/823235/avall "Wojciech Górecki").**
