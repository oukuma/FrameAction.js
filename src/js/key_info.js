function KeyInfo(){
  this.key_info = {};
  this.key_count = {};
  
  var key_info = this.key_info;
  document.addEventListener('keydown', function(e){
    key_info[e.key] = true;
    //console.log(['push', e.key]);
  });
  
  document.addEventListener('keyup', function(e){
    key_info[e.key] = false;
    //console.log(['release', e.key]);
  });
}

KeyInfo.prototype.updateKeyCount = function(key){
  if(this.key_info[key]) this.key_count[key] = this.getKeyCount(key) + 1;
  else                   this.key_count[key] = 0;
};

KeyInfo.prototype.updateKeyCounts = function(){
  for(var key in this.key_info){
    this.updateKeyCount(key);
  }
};

KeyInfo.prototype.getKeyInfo = function(key_code){
  return this.key_info[key_code];
};

KeyInfo.prototype.getKeyCount = function(key_code){
  return this.key_count[key_code] || 0;
};