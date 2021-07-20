const gridContainer = document.querySelector('#grid-container');
const zindexers = document.querySelectorAll('.z-adjust');
let ztop = 5;

// Adds listeners to close windows on click 
const setClosers = function () {
  let closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      let parentWindow = button.getAttribute('data-parent');
      let windowName = button.getAttribute('data-feedback')
      if(confirm('Do you want to give up the ' + windowName + ' window?')){
        document.getElementById(parentWindow).remove();
      }
    });
  });
};;

//moves a windowed element to the top zindex on mousedown
zindexers.forEach((element) => {
  element.addEventListener('mousedown', () => {
    ztop++;
    console.log(element.id, 'is the active window');
    element.style.zIndex = ztop;
  });
});

setClosers();



