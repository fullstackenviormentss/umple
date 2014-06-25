// Copyright: All contributers to the Umple Project
// This file is made available subject to the open source license found at:
// http://umple.org/license
//
// This file holds all the functions that initialize and control the layout of the
// dynamic elements of umpleonline.

var Layout = {};
Layout.isTextVisible = true;
Layout.isDiagramVisible = true;
Layout.isPaletteVisible = true;
Layout.layoutHandler = null;
Layout.isInSmallScreenMode = false;
Layout.screenThresholdWidth = 945;
Layout.errorMessageSpace = 50;

// The handles for the main layout controlling features
var canvasHandle = "#umpleCanvasColumn";
var editorHandle = "#textEditorColumn";
var modelEditorHandle = "#topTextEditor";
var paletteHandle = "#paletteColumn";
var layoutEditorHandle = "#bottomTextEditor";

/////////////////////////////////////
// Layout initialization functions //
/////////////////////////////////////

//Initializes any constants the layout depends on
Layout.init = function()
{
  if(jQuery(window).innerWidth() > this.screenThresholdWidth)
  {
    this.layoutHandler = new LargeScreenManager();
    this.isInSmallScreenMode = false;
  }
  else
  {
    this.layoutHandler = new SmallScreenManager();
    this.isInSmallScreenMode = true;
  }
  
  jQuery(window).bind("resize", function(event)
    {
      // Stops resizing events from bubbling up from the page's resizable elements
      if(!jQuery(event.target).hasClass("ui-resizable"))
        Layout.zoomResize(); 
    });
}

Layout.initPaletteSize = function()
{
  this.layoutHandler.initPaletteSize();
}

// Initializes the canvas size
Layout.initUmpleCanvasSize = function()
{
  this.layoutHandler.initUmpleCanvasSize();
}

// Initializes the text editor size
Layout.initUmpleTextAreaSize = function()
{
  this.layoutHandler.initUmpleTextAreaSize();
}

///////////////////////////////////////////
// Functions to set sizes of UI elements //
///////////////////////////////////////////

Layout.setTextEditorSize = function(width, height) 
{
  this.layoutHandler.setTextEditorSize(width, height);
}

//Sets the size of the canvas. If either the height or width are undefined, they are unchanged.
Layout.setUmpleCanvasSize = function(width, height)
{
  this.layoutHandler.setUmpleCanvasSize(width, height);
}

//Sets the height of the model and layout text editors, depending on what is enabled
Layout.adjustTextEditorHeight = function(height) 
{  
  if(jQuery("#buttonShowHideLayoutEditor").prop('checked'))
  {
    jQuery(modelEditorHandle).outerHeight(height*0.7);
    if(Page.codeMirrorOn) this.resizeCodeMirrorEditor(height*0.7);
    jQuery(layoutEditorHandle).outerHeight(height*0.3);
  }
  else
  {
    jQuery(modelEditorHandle).outerHeight(height);
    if(Page.codeMirrorOn) this.resizeCodeMirrorEditor(height);
  }
  jQuery(editorHandle).height(height);
}

Layout.resizeCodeMirrorEditor = function(newHeight) 
{
  if(Page.codeMirrorOn)
  {
    Page.codeMirrorEditor.getWrapperElement().style.height=newHeight+"px";
    Page.codeMirrorEditor.refresh();
  }
}

////////////////////////////////////////////
// Functions to show and hide UI elements //
////////////////////////////////////////////

Layout.showHideLayoutEditor = function(doShow)
{
  var layoutEditor = jQuery(layoutEditorHandle);
  var newHeight = jQuery(editorHandle).height();
   
  if (doShow == undefined) doShow = layoutEditor.is(":visible");
  
  if (doShow)  // warning: This works backwards to intuition
  {
    layoutEditor.hide();
    this.adjustTextEditorHeight(newHeight);
  }
  else
  {
    layoutEditor.show();
    this.adjustTextEditorHeight(newHeight);
  }
}

Layout.showHideTextEditor = function(doShow)
{
  var editor = jQuery(editorHandle);
  var layoutBox = jQuery("#buttonShowHideLayoutEditor");
  var layoutListItem = jQuery("#layoutListItem");
  
  if (doShow == undefined) doShow = !this.isTextVisible; 
    
  if (doShow)
  {
    editor.show();
    this.isTextVisible = true;
    // disable the show/hide layout editor option
    layoutBox.prop('disabled', false);
    layoutBox.css('cursor', 'pointer');
    layoutListItem.css('color', 'Black');
    Page.setUmpleCode(Page.getUmpleCode()); // force reset
  }
  else
  {    
    editor.hide();
    this.isTextVisible = false;
    layoutBox.prop('disabled', true);
    layoutBox.css('cursor', 'not-allowed');
    layoutListItem.css('color', 'DimGray');
  }
  
  //Resize the elements according to the layoutHandler
  this.layoutHandler.showHideTextEditorResize();
}

Layout.showHideCanvas = function(doShow)
{ 
  var canvas = jQuery(canvasHandle);
  
  if (doShow == undefined) doShow = !this.isDiagramVisible;
  
  if (doShow)
  {
    canvas.show();
    this.isDiagramVisible = true;
    Action.manualSync = jQuery("#buttonManualSync").prop('checked');
    jQuery("#buttonShowHideCanvas").prop('checked',true);
    
    if (!Action.manualSync) 
    {
      Action.updateUmpleDiagram();
      Action.diagramInSync = true;
      Page.enableDiagram(true);
    }
    if (Action.manualSync && !Action.diagramInSync) Page.enablePaletteItem('buttonSyncDiagram', true);
    if (!Action.manualSync || Action.diagramInSync)
    {
      Page.enableCheckBoxItem("buttonPhotoReady", "photoReadyListItem", true);
      Page.enableCheckBoxItem("buttonManualSync", "manualSyncListItem", true);

      Page.enablePaletteItem('buttonAddClass', true);
      Page.enablePaletteItem('buttonAddAssociation', true);
      Page.enablePaletteItem('buttonAddGeneralization', true);
      Page.enablePaletteItem('buttonDeleteEntity', true);
    
      Page.initToggleTool('buttonAddClass');
      Page.initToggleTool('buttonAddAssociation');
      Page.initToggleTool('buttonAddGeneralization');
      Page.initToggleTool('buttonDeleteEntity');
    }
  }
  else
  {
    canvas.hide();
    this.isDiagramVisible = false;
    Action.manualSync = true;
    jQuery("#buttonShowHideCanvas").prop('checked',false);
    
    Page.enableCheckBoxItem("buttonPhotoReady", "photoReadyListItem", false);
    Page.enableCheckBoxItem("buttonManualSync", "manualSyncListItem", false);
    
    Page.enablePaletteItem('buttonAddClass', false);
    Page.enablePaletteItem('buttonAddAssociation', false);
    Page.enablePaletteItem('buttonAddGeneralization', false);
    Page.enablePaletteItem('buttonDeleteEntity', false);
    Page.enablePaletteItem('buttonSyncDiagram', false);

    Page.removeToggleTool('buttonAddClass');
    Page.removeToggleTool('buttonAddAssociation');
    Page.removeToggleTool('buttonAddGeneralization');
    Page.removeToggleTool('buttonDeleteEntity');
  }
  
  //Resize the elements according to the layoutHandler
  this.layoutHandler.showHideCanvasResize();
}

//Deals with any resize of the window. This includes browser zoom and resize within the OS.
Layout.zoomResize = function()
{ 
  if(jQuery(window).innerWidth() > Layout.screenThresholdWidth)
  {
    if(this.isInSmallScreenMode) this.toggleSmallScreenMode();
  }
  else
  {
    if(!this.isInSmallScreenMode) this.toggleSmallScreenMode();
  }
  
  this.layoutHandler.adjustAfterWindowResize();
}

// A function to switch between the small and normal screen modes
Layout.toggleSmallScreenMode = function()
{ 
  if(this.isInSmallScreenMode)
  {
    this.isInSmallScreenMode = false;
    this.layoutHandler = new LargeScreenManager();
  }
  else
  {
    this.isInSmallScreenMode = true;
    this.layoutHandler = new SmallScreenManager();
  }
  
  this.layoutHandler.transition();
}

Layout.verticallyResizing = function(event, ui) {this.layoutHandler.verticallyResizing(event, ui);}

Layout.verticallyResized = function(event, ui) {this.layoutHandler.verticallyResized(event, ui);}

Layout.editorResizing = function(event, ui) {this.layoutHandler.editorResizing(event, ui);}

Layout.editorResized = function(event, ui) {this.layoutHandler.editorResized(event, ui);}

Layout.canvasResizing = function(event, ui) {this.layoutHandler.canvasResizing(event, ui);}

Layout.canvasResized = function(event, ui) {this.layoutHandler.canvasResized(event, ui);}

// Helper function to calculate the height of the canvas, textEditor, and palette
Layout.calculateMainHeight = function() 
{
  return jQuery(paletteHandle).outerHeight();
}

/////////////////////
// Layout Managers //
/////////////////////


// Controls the layout when the width of the screen is larger than the width threshold
function LargeScreenManager()
{
  //Add the appropriate classes
  jQuery(editorHandle).addClass('largeScreenEditor');
  jQuery(canvasHandle).addClass('largeScreenCanvas');
  
  //Calculate the total empty space horizontally
  this.marginSpace = parseInt(jQuery('body').css('marginLeft'))
    + parseInt(jQuery('body').css('marginRight'))
    + parseInt(jQuery(editorHandle).css('marginRight'))
    + parseInt(jQuery(canvasHandle).css('marginLeft'));
  
  this.heightFactor = 1;
  
  this.minCanvasSize = new UmplePosition(0,0,420,50);
  this.minEditorSize = new UmplePosition(0,0,284,0);
  
  var maxEditorWidth = jQuery(window).innerWidth() - this.marginSpace 
    - jQuery(paletteHandle).outerWidth() - this.minCanvasSize.width;
  var maxCanvasWidth = jQuery(window).innerWidth() - this.marginSpace
    - jQuery(paletteHandle).outerWidth() - this.minEditorSize.width;
  
  this.maxEditorSize = new UmplePosition(0, 0, maxEditorWidth, 0);
  this.maxCanvasSize = new UmplePosition(0, 0, maxCanvasWidth, 0);
  
  //////////////////////////////
  // Initialization functions //
  //////////////////////////////
  
  //Called when the layout is switching to this manager from another manager
  this.transition = function()
  {
    jQuery(editorHandle).resizable('destroy');
    jQuery(paletteHandle).resizable('destroy');
    jQuery(canvasHandle).resizable('destroy');
    
    //Allow horizontal resizing
    this.initEditorResizable();
    this.initCanvasResizable();
    
    //Allow vertical resizing
    this.initVerticalResizable();
    
    //Remove unnecessary styles
    jQuery(editorHandle).removeClass('smallScreenEditor');
    jQuery(canvasHandle).removeClass('smallScreenCanvasWithEditor');
    jQuery(canvasHandle).removeClass('smallScreenCanvasNoEditor');
    
    var editorWidth = undefined;
    
    if(!Layout.isDiagramVisible)
      editorWidth = this.calculateLeftoverWidth() + jQuery(editorHandle).outerWidth();
    
    this.setTextEditorSize(editorWidth, undefined);
  }
  
  //Initializes the canvas size and resizable properties
  this.initUmpleCanvasSize = function()
  {
    this.initCanvasResizable();
    if (Layout.isDiagramVisible==false) {Layout.showHideCanvas(false);}
  }
  
  //Initializes the text editor size and resizable properties
  this.initUmpleTextAreaSize = function() 
  {
    this.initEditorResizable();
    
    // Expands the text editor to 70 characters
    this.setTextEditorSize(508, undefined);
    
    this.adjustAfterWindowResize();
  }
  
  this.initPaletteSize = function()
  {
    jQuery("#paletteColumn").height(this.calculateHeight());
    jQuery("#palette").accordion("refresh");
    
    //Allow vertical resizing
    this.initVerticalResizable();
  }
  
  ////////////////////////////
  // Size setting functions //
  ////////////////////////////
  
  this.setTextEditorSize = function(width, height)
  {
    var umpleTextEditor = jQuery(editorHandle);
    
    if(width == undefined) width = umpleTextEditor.outerWidth();
    if(height == undefined) height = Layout.calculateMainHeight();
    
    if(width < this.minEditorSize.width) width = this.minEditorSize.width;
    
    umpleTextEditor.outerWidth(width);
    
    Layout.adjustTextEditorHeight(height);

    if(Layout.isDiagramVisible)
      this.setUmpleCanvasSize(this.calculateLeftoverWidth() + jQuery(canvasHandle).outerWidth(), undefined);
  }
  
  this.setUmpleCanvasSize = function(width, height)
  {
    var umpleCanvas = jQuery(canvasHandle);

    if(width == undefined) width = umpleCanvas.outerWidth();
    if(height == undefined) height = Layout.calculateMainHeight();
    
    if (width < this.minCanvasSize.width) width = this.minCanvasSize.width;
    if (height < this.minCanvasSize.height) height = this.minCanvasSize.height;
    if (width > this.maxCanvasSize.width && Layout.isTextVisible) width = this.maxCanvasSize.width;
    
    // This -1 exists to deal with any rounding errors that may occur during zooming
    // It ensures the layout does not float down in the page
    umpleCanvas.outerWidth(width - 1);
    umpleCanvas.height(height);
    
    jQuery("#palette").accordion("refresh");
      
    if (width == this.minCanvasSize.width && height == this.minCanvasSize.height)
      Page.enablePaletteItem("buttonSmaller", false);
    else
      Page.enablePaletteItem("buttonSmaller", true);
  }
  
  ///////////////////////////////
  // Reaction resize functions //
  ///////////////////////////////
  
  this.showHideTextEditorResize = function()
  {
    var canvas = jQuery(canvasHandle);
    var editor = jQuery(editorHandle);
    
    //Adjust margin spacing
    if(Layout.isTextVisible)
      this.marginSpace += parseInt(jQuery(editorHandle).css('marginRight'));
    else
      this.marginSpace -= parseInt(jQuery(editorHandle).css('marginRight'));
    
      
    //Adjust sizes
    if(Layout.isDiagramVisible)
      this.setUmpleCanvasSize(this.calculateLeftoverWidth() + canvas.outerWidth(), undefined);
    if(Layout.isTextVisible)
      this.setTextEditorSize(this.calculateLeftoverWidth() + editor.outerWidth(), undefined);
  }
  
  this.showHideCanvasResize = function()
  {
    var canvas = jQuery(canvasHandle);
    var editor = jQuery(editorHandle);
    
    //Adjust margin spacing
    if(Layout.isDiagramVisible)
      this.marginSpace += parseInt(jQuery(canvasHandle).css('marginLeft'));
    else
      this.marginSpace -= parseInt(jQuery(canvasHandle).css('marginLeft'));
      
    //Adjust sizes
    if(Layout.isDiagramVisible)
      this.setUmpleCanvasSize(this.calculateLeftoverWidth() + canvas.outerWidth(), undefined);
    if(Layout.isTextVisible)
      this.setTextEditorSize(this.calculateLeftoverWidth() + editor.outerWidth(), undefined);
  }
  
  this.adjustAfterWindowResize = function()
  {
    //Recalculate the max sizes of the editor and canvas
    var maxEditorWidth = jQuery(window).innerWidth() - this.marginSpace 
      - jQuery(paletteHandle).outerWidth() - this.minCanvasSize.width;
    var maxCanvasWidth = jQuery(window).innerWidth() - this.marginSpace
      - jQuery(paletteHandle).outerWidth() - this.minEditorSize.width;
    
    this.maxEditorSize = new UmplePosition(0, 0, maxEditorWidth, 0);
    this.maxCanvasSize = new UmplePosition(0, 0, maxCanvasWidth, 0);
    
    jQuery(editorHandle).resizable('option', 'maxWidth', this.maxEditorSize.width);
    jQuery(canvasHandle).resizable('option', 'maxWidth', this.maxCanvasSize.width);
    
    //Resize the palette height
    jQuery("#paletteColumn").height(this.calculateHeight());
    jQuery("#palette").accordion("refresh");
    
    //Resize the editor and canvas
    var leftoverWidth = this.calculateLeftoverWidth();
    
    if(leftoverWidth <= 0 && jQuery(canvasHandle).outerWidth() + leftoverWidth <= this.minCanvasSize.width)
    {
      this.setTextEditorSize(jQuery(editorHandle).outerWidth() + leftoverWidth, undefined);
    }
    else
    {
      this.setTextEditorSize(undefined, undefined);
    }
  }
  
  ////////////////////////////////////////
  // Draggable resizing setup functions //
  ////////////////////////////////////////
  
  this.initVerticalResizable = function()
  {
    jQuery("#mainApplication").resizable({
      resize: function(event, ui){Layout.verticallyResizing(event,ui);},
      stop: function(event, ui){Layout.verticallyResized(event, ui);},
      autoHide: true,
      minHeight: this.minCanvasSize.height,
      handles: "s"
    });
  }
  
  this.initEditorResizable = function()
  {
    jQuery(editorHandle).resizable({
      start: function(event, ui){Layout.savedStartingWidth = jQuery(canvasHandle).width();},
      resize: function(event, ui){Layout.editorResizing(event, ui);},
      stop: function(event, ui){Layout.editorResized(event, ui);},
      autoHide: true,
      minWidth: this.minEditorSize.width,
      maxWidth: this.maxEditorSize.width,
      handles: "e"
    });
  }
  
  this.initCanvasResizable = function()
  {
    var canvas = jQuery(canvasHandle);
    
    canvas.resizable({
      start: function(event, ui){Layout.savedStartingWidth = jQuery(editorHandle).outerWidth();},
      resize: function(event, ui){Layout.canvasResizing(event, ui);},
      stop: function(event, ui){Layout.canvasResized(event, ui);},
      autoHide: true,
      minWidth: this.minCanvasSize.width,
      maxWidth: this.maxCanvasSize.width,
      handles: "w"
    });
  }
  
  ///////////////////////////////////////////
  // Draggable resizing handling functions //
  ///////////////////////////////////////////
  
  this.verticallyResizing = function(event, ui)
  {
    var currentHeight = ui.size.height;
    jQuery(paletteHandle).outerHeight(currentHeight);
    jQuery(editorHandle).outerHeight(currentHeight);
    jQuery(canvasHandle).outerHeight(currentHeight);
    Layout.adjustTextEditorHeight(currentHeight);
    jQuery("#palette").accordion("refresh");
  }
  
  this.verticallyResized = function(event, ui)
  {
    this.heightFactor = jQuery("#mainApplication").outerHeight()
      / (jQuery(window).innerHeight() - jQuery("#header").outerHeight() 
      - jQuery("#topLine").outerHeight() - parseInt(jQuery("body").css('marginBottom'))
      - parseInt(jQuery("body").css('marginTop')));
    
    this.setTextEditorSize(undefined, ui.size.height);
    jQuery("#mainApplication").css('height', 'auto');
  }
  
  this.editorResizing = function(event, ui)
  {
    var currentWidth = ui.size.width;
    var deltaWidth = ui.originalSize.width - currentWidth;
    jQuery(canvasHandle).width(Layout.savedStartingWidth + deltaWidth);
    jQuery(modelEditorHandle).width(currentWidth);
    jQuery(layoutEditorHandle).width(currentWidth);
  }
  
  this.editorResized = function(event, ui)
  {
    var currentWidth = ui.size.width;
    jQuery(modelEditorHandle).css('width', 'auto');
    jQuery(layoutEditorHandle).css('width', 'auto');
    this.setTextEditorSize(currentWidth, undefined);
    delete Layout.savedStartingWidth;
  }
  
  this.canvasResizing = function(event, ui)
  {
    var currentWidth = ui.size.width;
    
    jQuery(canvasHandle).outerWidth(currentWidth);
    var deltaWidth = currentWidth - ui.originalSize.width;
    jQuery(editorHandle).width(Layout.savedStartingWidth - deltaWidth);
    jQuery(modelEditorHandle).width(Layout.savedStartingWidth - deltaWidth);
    jQuery(layoutEditorHandle).width(Layout.savedStartingWidth - deltaWidth);
    jQuery(canvasHandle).css('left', '0px'); //Corrects the resize dragging moving the canvas right
  }
  
  this.canvasResized = function(event, ui)
  {    
    var currentWidth = ui.size.width;
    jQuery(modelEditorHandle).css('width', 'auto');
    jQuery(layoutEditorHandle).css('width', 'auto');
    this.setTextEditorSize(this.calculateLeftoverWidth() + jQuery(editorHandle).outerWidth(), undefined);
    delete this.savedStartingWidth;
  }
  
  //////////////////////
  // Helper functions //
  //////////////////////
  
  this.calculateLeftoverWidth = function() 
  {
    var width = jQuery(window).innerWidth() - this.marginSpace;
    if(Layout.isTextVisible) width -= jQuery(editorHandle).outerWidth();
    if(Layout.isDiagramVisible) width -= jQuery(canvasHandle).outerWidth();
    if(Layout.isPaletteVisible) width -= jQuery(paletteHandle).outerWidth();
    
    return width;
  }
  
  this.calculateHeight = function()
  {
    var newHeight = (jQuery(window).innerHeight() - jQuery("#header").outerHeight() 
      - jQuery("#topLine").outerHeight() - parseInt(jQuery("body").css('marginBottom'))
      - parseInt(jQuery("body").css('marginTop')) - Layout.errorMessageSpace) * this.heightFactor;
    
    if(newHeight < this.minCanvasSize.height)
      return this.minCanvasSize.height;
    else
      return newHeight;
  }
}

//Controls the layout when the width of the screen is smaller than the width threshold
function SmallScreenManager()
{
  //Add the appropriate styles
  jQuery(editorHandle).addClass('smallScreenEditor');
  if(Layout.isTextVisible)
    jQuery(canvasHandle).addClass('smallScreenCanvasWithEditor');
  else
    jQuery(canvasHandle).addClass('smallScreenCanvasNoEditor');
  
  this.marginSpace = 2*parseInt(jQuery('body').css('marginLeft')) 
    + parseInt(jQuery(editorHandle).css('marginRight'));

  this.minCanvasSize = new UmplePosition(0,0,420,50);
  this.minEditorSize = new UmplePosition(0,0,284,0);
  
  var maxEditorWidth = jQuery(window).innerWidth() - this.marginSpace
    - jQuery(paletteHandle).outerWidth();
  var maxCanvasWidth = jQuery(window).innerWidth() - this.marginSpace;
  
  this.maxEditorSize = new UmplePosition(0, 0, maxEditorWidth, 0);
  this.maxCanvasSize = new UmplePosition(0, 0, maxCanvasWidth, 0);
  
  //////////////////////////////
  // Initialization functions //
  //////////////////////////////
  
  //Called when the layout is switching to this manager from another manager
  this.transition = function()
  {
    //Reset any resizables
    jQuery(editorHandle).resizable('destroy');
    jQuery(canvasHandle).resizable('destroy');
    jQuery("#mainApplication").resizable('destroy');
    
    //Remove the other styles
    jQuery(editorHandle).removeClass('largeScreenEditor');
    jQuery(canvasHandle).removeClass('largeScreenCanvas');
    
    this.initEditorResizable();
    this.initCanvasResizable();
    this.initPaletteResizable();
  }
  
  this.initUmpleCanvasSize = function()
  {
    this.setUmpleCanvasSize(undefined, this.calculateHeight());
    this.initCanvasResizable();
    this.initPaletteResizable();
  }
  
  this.initUmpleTextAreaSize = function() 
  {
    this.setTextEditorSize();
    this.initEditorResizable();
  }
  
  this.initPaletteSize = function()
  {
    jQuery("#paletteColumn").outerHeight(this.calculateHeight());
    jQuery("#palette").accordion("refresh");
  }
  
  ////////////////////////////
  // Size setting functions //
  ////////////////////////////
  
  this.setTextEditorSize = function(width, height)
  {
    // This -1 exists to deal with any rounding errors that may occur during zooming
    // It ensures the layout does not float down in the page
    jQuery(editorHandle).width(this.calculateLeftoverWidth() - 1);
    
    if(height != undefined)
      Layout.adjustTextEditorHeight(height);
    else
      Layout.adjustTextEditorHeight(this.calculateHeight());
  }
  
  this.setUmpleCanvasSize = function(width, height)
  {
    if (Layout.isTextVisible)
      jQuery(canvasHandle).outerWidth(jQuery("body").width());
    else
      jQuery(canvasHandle).outerWidth(this.calculateLeftoverWidth());
    
    if(height != undefined)
    {
      jQuery(canvasHandle).outerHeight(height);
    }
  }
  
  ///////////////////////////////
  // Reaction resize functions //
  ///////////////////////////////
  
  this.showHideTextEditorResize = function()
  {
    var canvasHeight = undefined;
    
    if(Layout.isTextVisible)
    {
      jQuery(canvasHandle).removeClass('smallScreenCanvasNoEditor');
      jQuery(canvasHandle).addClass('smallScreenCanvasWithEditor');
      this.setTextEditorSize(undefined, jQuery(paletteHandle).outerHeight());
    }
    else
    {
      jQuery(canvasHandle).removeClass('smallScreenCanvasWithEditor');
      jQuery(canvasHandle).addClass('smallScreenCanvasNoEditor');
      canvasHeight = jQuery(paletteHandle).outerHeight();
    }
    
    this.pairResizables();
    this.setUmpleCanvasSize(undefined, canvasHeight);
  }
  
  this.showHideCanvasResize = function() {} //Unused function
  
  this.adjustAfterWindowResize = function()
  {
    var maxEditorWidth = jQuery(window).innerWidth() - this.marginSpace
      - jQuery(paletteHandle).outerWidth();
    var maxCanvasWidth = jQuery(window).innerWidth() - this.marginSpace;
    
    this.maxEditorSize = new UmplePosition(0, 0, maxEditorWidth, 0);
    this.maxCanvasSize = new UmplePosition(0, 0, maxCanvasWidth, 0);
    
    jQuery("#paletteColumn").outerHeight(this.calculateHeight());
    jQuery("#palette").accordion("refresh");
    
    this.setTextEditorSize();
    this.setUmpleCanvasSize(undefined, this.calculateHeight());
  }
  
  ////////////////////////////////////////
  // Draggable resizing setup functions //
  ////////////////////////////////////////
  
  this.initEditorResizable = function()
  { 
    jQuery(editorHandle).resizable({
      autoHide: true,
      minHeight: 30,
      handles: "s"
    });
    
    this.pairResizables();
  }
  
  this.initPaletteResizable = function()
  {
    jQuery(paletteHandle).resizable({
      autoHide: true,
      minHeight: 30,
      handles: "s"
    });
    
    this.pairResizables();
  }
  
  this.initCanvasResizable = function()
  {
    jQuery(canvasHandle).resizable({
      autoHide: true,
      minHeight: 30,
      handles: "s"
    });
    
    this.pairResizables();
  }
  
  ///////////////////////////////////////////
  // Draggable resizing handling functions //
  ///////////////////////////////////////////
  
  //Resizing the palette
  this.verticallyResizing = function(event, ui)
  {
    jQuery(paletteHandle).outerHeight(ui.size.height);
    jQuery("#palette").accordion("refresh");
  }
  
  this.verticallyResized = function(event, ui) {} //Unused function
  
  //Resizing the text editor
  this.editorResizing = function(event, ui)
  {
    Layout.adjustTextEditorHeight(ui.size.height);
  }
  
  this.editorResized = function(event, ui) {} //Unused function
  
  //Resizing the canvas
  this.canvasResizing = function(event, ui)
  {
    jQuery(canvasHandle).outerHeight(ui.size.height);
  }
  
  this.canvasResized = function(event, ui) {} //Unused function
  
  //////////////////////
  // Helper functions //
  //////////////////////
  
  this.calculateLeftoverWidth = function() 
  {
    return jQuery(window).innerWidth() - this.marginSpace - jQuery(paletteHandle).outerWidth();
  }
  
  this.calculateHeight = function()
  {
    var height = (jQuery(window).innerHeight() - jQuery("#header").outerHeight(true)
      - 2*jQuery("#topLine").outerHeight(true) - Layout.errorMessageSpace)/2;

    return height;
  }
  
  this.pairResizables = function()
  {
    if(!jQuery(editorHandle).is('.ui-resizable')
        || !jQuery(paletteHandle).is('.ui-resizable')
        || !jQuery(canvasHandle).is('.ui-resizable'))
    {
      return;
    }
    
    if(Layout.isTextVisible)
    { //if the text editor is visible, the palette will be resized with it
      //Resizing functions
      var textEditorResizingFunction = function(event, ui)
      {
        Layout.editorResizing(event, ui);
        Layout.verticallyResizing(event, ui);
      };
      var paletteResizingFunction = textEditorResizingFunction;
      var canvasResizingFunction = function(event, ui) { Layout.canvasResizing(event, ui); };
      
      //Resized functions
      var textEditorResizedFunction = function(event, ui)
      {
        Layout.editorResized(event, ui);
        Layout.verticallyResized(event, ui);
      };
      var paletteResizedFunction = textEditorResizedFunction;
      var canvasResizedFunction = function(event,ui) { Layout.canvasResized(event, ui); };
    }
    else
    { //if the text editor is not visible, the palette will be resized with the canvas
      //Resizing functions
      var textEditorResizingFunction = function(event, ui) { Layout.editorResizing(event,ui); };
      var canvasResizingFunction = function(event, ui) 
      { 
        Layout.canvasResizing(event, ui); 
        Layout.verticallyResizing(event, ui);
      };
      var paletteResizingFunction = canvasResizingFunction;
      
      //Resized functions
      var textEditorResizedFunction = function(event, ui) { Layout.editorResized(event, ui); };
      var canvasResizedFunction = function(event,ui) 
      { 
        Layout.canvasResized(event, ui); 
        Layout.verticallyResized(event, ui);
      };
      var paletteResizedFunction = canvasResizedFunction;
    }
    
    jQuery(editorHandle).resizable('option', 'resize', textEditorResizingFunction);
    jQuery(editorHandle).resizable('option', 'stop', textEditorResizedFunction);
    jQuery(paletteHandle).resizable('option', 'resize', paletteResizingFunction);
    jQuery(paletteHandle).resizable('option', 'stop', paletteResizedFunction);
    jQuery(canvasHandle).resizable('option', 'resize', canvasResizingFunction);
    jQuery(canvasHandle).resizable('option', 'stop', canvasResizedFunction);
  }
}