//set cursor position
$.fn.setCursorPosition = function(position){
  if(this.length == 0) return this;
  return $(this).setSelection(position, position);
};


//set selection range
$.fn.setSelection = function(selectionStart, selectionEnd) {
  if(this.length == 0) return this;
  input = this[0];

  if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  } else if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }

  return this;
};

//Set focus to end of input:
$.fn.focusEnd = function(){
  this.setCursorPosition(this.val().length);
};