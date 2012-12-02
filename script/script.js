/**
 * phi
 */

var gui = null;
var textShadowFolder= null;
var textShadowList  = [];
var modalElement = null;

/*
 * main
 */
tm.main(function() {
    // dat gui
    initGUI();
    addTextShadowGUI({ enable: true, open: true });
    addTextShadowGUI();
    addTextShadowGUI();
    addTextShadowGUI();
    addTextShadowGUI();
    addTextShadowGUI();
    refreshMainText();
    
    // モーダル化
    modalElement = tm.dom.Element("#myModal");
    modalElement.modal();
});


var initGUI = function() {
    var ePreviewArea    = tm.dom.Element("#preview-area");
    var eMainText       = tm.dom.Element("#main");
    var temp            = {
        text            : "Time is money.",
        fontSize        : 70,
        fontColor       : [255, 255, 255, 1.0],
        backgroundColor : [255, 255, 255, 1.0],
    };
    
    gui = new dat.GUI();
    
    // show
    gui.add(window, "showCSSValue");
    
    // util
    var utilFolder = gui.addFolder("util");
    utilFolder.add(utilFuncs, "reset");
    utilFolder.add(utilFuncs, "enableAll");
    utilFolder.add(utilFuncs, "disableAll");
    
    // base style folder
    var baseStyleFolder = gui.addFolder("base-style");
    baseStyleFolder.add(temp, "text").onChange(function(value){
        eMainText.text = value;
    });
    baseStyleFolder.add(temp, "fontSize", 6, 200, 1).onChange(function(value){
        eMainText.style.set("fontSize", value+"px");
    });
    baseStyleFolder.addColor(temp, "fontColor").onChange(function(value){
        ePreviewArea.style.set("color", arrayToRGBA(value));
    });
    baseStyleFolder.addColor(temp, "backgroundColor").onChange(function(value){
        ePreviewArea.style.set("backgroundColor", arrayToRGBA(value));
    });
    
    // 
    textShadowFolder = gui.addFolder("text-shadow");
    textShadowFolder.open();
    
}

var addTextShadowGUI = function(param) {
    if (!param) {
        param = {};
        param.enable= false;
        param.open  = false;
    }
    
    var index       = textShadowList.length + 1;
    var folder      = textShadowFolder.addFolder("0"+index);
    var textShadow  = new TextShadow();
    
    textShadow.enable = param.enable;
    
    folder.add(textShadow, "offsetX", -100, 100).step(1).onChange(refreshMainText);
    folder.add(textShadow, "offsetY", -100, 100).step(1).onChange(refreshMainText);
    folder.add(textShadow, "blur", -100, 100).step(1).onChange(refreshMainText);
    folder.addColor(textShadow, "color").onChange(refreshMainText);
    folder.add(textShadow, "enable").onChange(refreshMainText);
    if (param.open) { folder.open(); }
    
    textShadowList.push( textShadow );
};

var refreshMainText = function() {
    var eMainText               = tm.dom.Element("#main");
    var eResult                 = tm.dom.Element("#result");
    var textShadowCSSValueList  = [];
    
    for (var i=0,len=textShadowList.length; i<len; ++i) {
        if (textShadowList[i].enable === true) {
            textShadowCSSValueList.push( textShadowList[i].toCSSValue() );
        }
    }
    
    eMainText.style.set("textShadow", textShadowCSSValueList.join(','));
    
    eResult.value = "textShadow: {0};".format(textShadowCSSValueList.join(','));
};


var showCSSValue = function()
{
    modalElement.modal.open();
};
var hideCSSValue = function()
{
    modalElement.modal.close();
};


tm.dom.Element.defineInstanceMethod("modal", function() {
    var self = this;
    var backdrop = null;
    var dismissLinks = tm.dom.ElementList("[data-dismiss='modal']");
    
    this.modal.open = function() {
        self.style.set("display", "block");
        
        backdrop = tm.dom.Element(document.body).create("div");
        backdrop.attr.set("class", "modal-backdrop fade");
        backdrop.event.one("click", function() {
            self.modal.close();
        });
        setTimeout(function() {
            backdrop.attr.set("class", "modal-backdrop fade in");
        }, 0);
    }
    
    this.modal.close = function() {
        self.style.remove("display");
        
        if (backdrop) {
            backdrop.attr.set("class", "modal-backdrop fade");
            setTimeout(function() {
                if (backdrop) {
                    backdrop.remove();
                    backdrop = null;
                }
            }, 500);
        }
    }
    
    dismissLinks.forEach(function(elm) {
        elm.event.click(function() {
            self.modal.close();
        });
    });
});


/**
 * text shadow
 */
var TextShadow = tm.createClass({
    init: function() {
        this.enable  = true;
        this.reset();
    },
    reset: function()
    {
        this.offsetX = 0;
        this.offsetY = 0;
        this.blur    = 10;
        this.color   = "#000000";
    },
    toCSSValue: function()
    {
        return "{offsetX}px {offsetY}px {blur}px {color}".format(this);
    },
    getStyleColor: function() {
        return this.color;
        for (var i=0; i<3; ++i) this.color[i] = Math.floor(this.color[i]);
        return "rgba({0}, {1}, {2}, {3})".format(this.color[0], this.color[1], this.color[2], this.color[3]);
    }
});



var arrayToRGBA = function(arr)
{
    var c = {
        r: Math.floor(arr[0]),
        g: Math.floor(arr[1]),
        b: Math.floor(arr[2]),
        a: arr[3]
    };
    return "rgba({r}, {g}, {b}, {a})".format(c);
};

var utilFuncs = {
    reset: function() {
        textShadowList.forEach(function(elm){ elm.reset(); });
        refreshMainText();
    },
    
    enableAll: function() {
        textShadowList.forEach(function(elm){ elm.enable = true; });
        refreshMainText();
    },
    disableAll: function() {
        textShadowList.forEach(function(elm){ elm.enable = false; });
        refreshMainText();
    }
};










