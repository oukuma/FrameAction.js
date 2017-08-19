function KeyInfo(){
  this.keyInfo = {};
  this.keyCount = {};
  
  var keyInfo = this.keyInfo;
  document.addEventListener('keydown', function(e){
    keyInfo[e.key] = true;
    //console.log(['push', e.key]);
  });
  
  document.addEventListener('keyup', function(e){
    keyInfo[e.key] = false;
    //console.log(['release', e.key]);
  });
}

KeyInfo.prototype.updateKeyCount = function(key){
  if(this.keyInfo[key]) this.keyCount[key] = this.getKeyCount(key) + 1;
  else                  this.keyCount[key] = 0;
};

KeyInfo.prototype.updateKeyCounts = function(){
  for(var key in this.keyInfo){
    this.updateKeyCount(key);
  }
};

KeyInfo.prototype.getKeyInfo = function(keyCode){
  return this.keyInfo[keyCode];
};

KeyInfo.prototype.getKeyCount = function(keyCode){
  return this.keyCount[keyCode] || 0;
};