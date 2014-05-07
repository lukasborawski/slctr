/*
 Slctr v.0.3
 ------------------------------------------------------------------
 Info: Slctr is a simple jQuery plugin created for selecting
 an area of graphic document and get coordinates of this selection.
 (c) Lukas Borawski - lukas.borawski@gmail.com | 2013/2014
 ------------------------------------------------------------------
 MIT License: www.opensource.org/licenses/MIT
 */

var $selectCoordsDt;

;(function ($, window, document) {

    // default options
    var slctr, name = "slctr",
        defaults = {
            slctrBox: '#slctrBox',
            insdElmnts: 'img',
            globalWidth: 'undefined',
            cursorDistance: 2
        };

    // constructor
    function plugin (options) {
        this.settings = $.extend({}, defaults, options);
        this.init();
    }

    // dedicated functions & variables
    $.fn.doesExist = function(){
        return this.length > 0;
    };
    var createEl = function(element, properties) {
        var elmt = document.createElement(element);
        for (var prop in properties) {
            elmt[prop] = properties[prop];
        }
        return elmt;
    }

    plugin.prototype = {
        init: function () {
            var mainBox = $(this.settings.slctrBox);
            mainBox.doesExist() ? slctr = true : slctr = console.log('App failed');

            if (slctr) {
                // selectArea
                var insideElmnt = mainBox.find('>' + this.settings.insdElmnts),
                    selectAreaNode = createEl("div", {className: 'selectArea'}),
                    _selectMark, $selectCoords,
                    int = 400, t = this;

                // selectArea
                // global width calculate
                var counter = 0,
                    insideElmntsLength = mainBox.find('>' + this.settings.insdElmnts).length;
                insideElmnt.data('data', 'insideObject');
                insideElmnt.data('insideObject', insideElmnt.data('insideObject')).load(function(){
                    counter ++;
                    function slctrBox_display(){
                        mainBox.width(defaultWidth).css('visibility', 'visible');
                        insideElmnt.wrapAll(selectAreaNode);
                    }
                    if (counter >= insideElmntsLength){
                        if (t.settings.globalWidth === "undefined"){
                            var defaultWidth = insideElmnt.first().width();
                            slctrBox_display();
                        }
                        else {
                            mainBox.width(t.settings.globalWidth);
                            slctrBox_display();
                        }
                    }
                });

                // selectMark
                // selection reset fn.
                function selectMark_reset(event_off, self){
                    select = false;
                    prevX = 0; prevY = 0;
                    _selectMark.remove();
                    if (event_off){
                        self.off('mousemove');
                        self.off('mousedown');
                    }
                }

                // mouse events
                var select, prevX, prevY = false;

                $(document.body).on('mousedown', '.selectArea', function(e) {
                    e.preventDefault();
                    select = true;

                    // selectCoords
                    // build and destroy select coords input
                    $selectCoords = $('#selectCoords');
                    if ($selectCoords.doesExist()){
                        $selectCoords.remove();
                    }
                    var selectCoordsNode = createEl('input', {type: "hidden", id: "selectCoords"});
                    $(document.body).append(selectCoordsNode).one();

                    // selectMark
                    // position calculate
                    var selectMarkNode = createEl("div", {className: 'selectMark'});
                    mainBox.append(selectMarkNode);
                    _selectMark = $('.selectMark');

                    // selectMark
                    // direction logic
                    function closestDirection(x,y,w,h) {
                        var topEdgeDist = distMetric(x,y,w/2,0);
                        var bottomEdgeDist = distMetric(x,y,w/2,h);
                        var leftEdgeDist = distMetric(x,y,0,h/2);
                        var rightEdgeDist = distMetric(x,y,w,h/2);
                        var min = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist);

                        switch (min) {
                            case leftEdgeDist:
                                return "left";
                            case rightEdgeDist:
                                return "right";
                            case topEdgeDist:
                                return "top";
                            case bottomEdgeDist:
                                return "bottom";
                        }
                    }
                    function distMetric(x,y,x2,y2) {
                        var xDiff = x - x2;
                        var yDiff = y - y2;

                        return (xDiff * xDiff) + (yDiff * yDiff);
                    }

                    // selectMark
                    // default values
                    var xShifted = 0, yShifted = 0;
                    var offset = $(this).offset();

                    // selectMark
                    // size calculate
                    $(this).unbind('mousemove').on('mousemove', function(e) {
                        if (select){
                            var edge = closestDirection(e.pageX, e.pageY, $(this).width(), $(this).height());

                            if (edge == "left" || edge == "top"){
                                // selectMark
                                // behavior dependent of left move
                                var x2 = (e.pageX - offset.left),
                                    y2 = (e.pageY - offset.top);

                                _selectMark.css({
                                    left: x2 - t.settings.cursorDistance,
                                    top: y2 - t.settings.cursorDistance
                                });
                                $(this).unbind('mousemove').on('mousemove', function(e) {
                                    if (select) {
                                        prevY && (yShifted += e.pageY - prevY);
                                        prevX && (xShifted += e.pageX - prevX);
                                        prevX = e.pageX;
                                        prevY = e.pageY;
                                        _selectMark.css({
                                            width: xShifted,
                                            height: yShifted
                                        });
                                    }
                                });
                            }
                            else {
                                // selectMark
                                // behavior dependent of right move
                                $(this).unbind('mousemove').on('mousemove', function(e) {
                                    var x2 = (e.pageX - offset.left),
                                        y2 = (e.pageY - offset.top);

                                    prevY && (yShifted += e.pageY - prevY);
                                    prevX && (xShifted += e.pageX - prevX);
                                    prevX = e.pageX;
                                    prevY = e.pageY;
                                    _selectMark.css({
                                        width: -xShifted,
                                        height: -yShifted,
                                        top: y2 + t.settings.cursorDistance,
                                        left: x2 + t.settings.cursorDistance
                                    });
                                });
                            }
                        }
                    });

                    // selectMark
                    // generating cords end of the event
                    $(document).unbind('mouseup').on('mouseup', '.selectArea', function() {
                        selectMark_reset(true, $('.selectArea'));
                        var x2 = (e.pageX - offset.left),
                            y2 = (e.pageY - offset.top);

                        // data coords displaying
                        $selectCoords = $('#selectCoords');
                        xShifted < 0 ?
                            $selectCoords.data({"x": x2, "y": y2, "w": -xShifted, "h": -yShifted}) :
                            $selectCoords.data({"x": x2, "y": y2, "w": xShifted, "h": yShifted});
                        $selectCoordsDt = $selectCoords.data();
                        // callback data
                        if (typeof t.settings.callback === "function"){
                            t.settings.callback($selectCoordsDt);
                        }
                    });
                    setTimeout(function (){
                        _selectMark.on('mouseenter', function(){
                            selectMark_reset();
                        });
                    }, int);
                });
            }
        }
    };

    // initialize
    $.fn[name] = function (options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + name)) {
                $.data(this, "plugin_" + name, new plugin(options));
            }
        });
    };

})(jQuery, window, document);