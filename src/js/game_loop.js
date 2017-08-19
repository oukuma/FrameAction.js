/*
function getFrameAction(tool){
  var context = tool.getContext();
  
  return function(tool){
    var timeStamp = tool.getTimeStamp();
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

function startLoop(canvas, fps, getFrameActions, first_scene, first_args){
  var canvas_context = canvas.getContext('2d');
  var buffer_canvas = document.createElement('canvas');
  var buffer_context = buffer_canvas.getContext('2d');
  var act = function(){ return [first_scene, first_args] };
  var background = 'rgba(0, 0, 0, 0.0)';
  var time_stamp = 0.0;
  var interval = 1000.0 / (fps != 0.0 ? fps : 60.0);
  
  var creating_next_scene = false;
  var loading_count = 0, loaded_count = 0;
  var next_action = null;
  var next_background;
  var next_scene, prev_result;
  
  buffer_canvas.width = canvas.width;
  buffer_canvas.height = canvas.height;
  
  window.setInterval(function(){
    var canvas_height = canvas.height;
    var canvas_width = canvas.width;
    
    buffer_context.fillStyle = background;
    buffer_context.fillRect(0, 0, canvas_width, canvas_height);
    
    var result = act({
      time_stamp: time_stamp,
      canvas: canvas
    });
    
    time_stamp += interval;
    
    if(creating_next_scene){
      if(next_action && loading_count == loaded_count){
        act = next_action;
        background = next_background;
        time_stamp = 0.0;
        creating_next_scene = false;
      }
    }
    else{
      if(result){
        creating_next_scene = true;
        next_action = null;
        loading_count = loaded_count = 0;
        if(Array.isArray(result)){
          next_scene = result[0];
          prev_result = result[1];
        }
        else{
          next_scene = result;
          prev_result = undefined;
        }
        window.setTimeout(asyncCreateNextScene, 0);
      }
    }
    requestAnimationFrame(render);
  }, interval);
  
  function render(){
    canvas_context.drawImage(buffer_canvas, 0, 0);
  }
  
  function asyncCreateNextScene(){
    next_background = background;
    next_action = getFrameActions[next_scene]({
      context: buffer_context,
      prev_result: prev_result,
      loadImages: loadImages,
      setBackground: setBackground
    });
  }
  
  function setBackground(color){
    next_background = color;
  }
  
  function loadImages(){
    var names = [];
    var load_count = 0;
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
    
    loading_count += names.length;
    
    var loading_images = [];
    names.forEach(function(name){
      var image = new Image();
      image.onload = function(){
        ++load_count;
        if(load_count == names.length){
          callback(loading_images);
          loaded_count += names.length;
        }
      };
      image.src = name;
      loading_images.push(image);
    });
    return loading_images;
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