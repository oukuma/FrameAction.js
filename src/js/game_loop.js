/*
function getFrameAction(tool){
  var context = tool.getContext();
  
  return function(tool){
    var timestamp = tool.getTimeStamp();
    //return undefined;                   //repeat this frame action(null or false)
    //return "next scene name";           //move scene
    //return ["next scene name", result]; //move scene with result
    
  };
}

function getFadeInOutFrameAction(tool){
  function fadeOut(tool){
    return false;
  }
  function fadeIn(tool){
    return false;
  }
  return [fadeOut, fadeIn];
}

var getFrameActions = {
  "scene1": getScene1FrameAction,
  "scene2": [getScene2FrameAction, getFadeInOutFrameAction]
};

startLoop(canvas, 60.0, getFrameActions, "scene1");

*/

function startLoop(canvas, fps, getFrameActions, firstScene, firstArgu){
  var canvasContext = canvas.getContext('2d');
  var bufferCanvas = document.createElement('canvas');
  var bufferContext = bufferCanvas.getContext('2d');
  var act = function(){ return [firstScene, firstArgu] };
  var background = 'rgba(0, 0, 0, 0.0)';
  var timestamp = 0.0;
  var interval = 1000.0 / (fps != 0.0 ? fps : 60.0);
  
  var creatingNextScene = false;
  var loadingCount = 0, loadedCount = 0;
  var nextAction = null;
  var nextBackground;
  var nextScene, prevResult;
  
  bufferCanvas.width = canvas.width;
  bufferCanvas.height = canvas.height;
  
  window.setInterval(function(){
    var canvasHeight = canvas.height;
    var canvasWidth = canvas.width;
    
    bufferContext.fillStyle = background;
    bufferContext.fillRect(0, 0, canvasWidth, canvasHeight);
    
    var result = act({
      timestamp: timestamp,
      canvas: canvas
    });
    
    timestamp += interval;
    
    if(creatingNextScene){
      if(nextAction && loadingCount == loadedCount){
        act = nextAction;
        background = nextBackground;
        timestamp = 0.0;
        creatingNextScene = false;
      }
    }
    else{
      if(result){
        creatingNextScene = true;
        nextAction = null;
        loadingCount = loadedCount = 0;
        if(Array.isArray(result)){
          nextScene = result[0];
          prevResult = result[1];
        }
        else{
          nextScene = result;
          prevResult = undefined;
        }
        window.setTimeout(asyncCreateNextScene, 0);
      }
    }
    requestAnimationFrame(render);
  }, interval);
  
  function render(){
    canvasContext.drawImage(bufferCanvas, 0, 0);
  }
  
  function asyncCreateNextScene(){
    nextBackground = background;
    nextAction = getFrameActions[nextScene]({
      context: bufferContext,
      prevResult: prevResult,
      loadImages: loadImages,
      setBackground: setBackground
    });
  }
  
  function setBackground(color){
    nextBackground = color;
  }
  
  function loadImages(){
    var names = [];
    var loadCount = 0;
    var callback = function(){};
    
    for(var i = 0; i < arguments.length; ++i){
      var argu = arguments[i];
      if(i == arguments.length - 1 && typeof argu == 'function'){
        callback = argu;
      }
      else{
        names = names.concat(argu);
      }
    }
    
    loadingCount += names.length;
    
    var loadingImages = [];
    names.forEach(function(name){
      var image = new Image();
      image.onload = function(){
        ++loadCount;
        if(loadCount == names.length){
          callback(loadingImages);
          loadedCount += names.length;
        }
      };
      image.src = name;
      loadingImages.push(image);
    });
    return loadingImages;
  }
  
  function loadAudios(){
    
  }
}

(function(){
  var requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();