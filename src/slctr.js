/*
 Slctr v.0.2
 ------------------------------------------------------------------
 Info: Slctr is a simple jQuery plugin created for selecting
 an area of graphic document and get coordinates of this selection.
 (c) Lukas Borawski - lukas.borawski@gmail.com | 2013
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
            cursorDistance: 10
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
                insideElmnt.data('data', 'insideObject');
                var insideElmntsLength = mainBox.find('>' + this.settings.insdElmnts).length, counter = 0;
                insideElmnt.data('insideObject', insideElmnt.data('insideObject')).load(function(){
                    counter ++;
                    function slctrBox_display(){
                        var defaultWidth = insideElmnt.first().width();
                        mainBox.width(defaultWidth).css('visibility', 'visible');
                        insideElmnt.wrapAll(selectAreaNode);
                    }
                    if (counter >= insideElmntsLength){
                        if (t.settings.globalWidth === "undefined"){
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
                    var offset = $(this).offset(),
                        x2 = (e.pageX - offset.left),
                        y2 = (e.pageY - offset.top);
                    var selectMarkNode = createEl("div", {className: 'selectMark'});
                    mainBox.append(selectMarkNode);
                    _selectMark = $('.selectMark');
                    _selectMark.css({
                        left: x2 - t.settings.cursorDistance,
                        top: y2 - t.settings.cursorDistance
                    });

                    // selectMark
                    // size calculate
                    var xShifted = 0, yShifted = 0;
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
                            xShifted > 0 ? _selectMark.addClass('correct') : _selectMark.removeClass('correct');
                        }
                    });
                    $(document).unbind('mouseup').on('mouseup', function() {
                        selectMark_reset(true, $('.selectArea'));

                        // coords data displaying
                        $selectCoords = $('#selectCoords');
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
