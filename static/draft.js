document.addEventListener('DOMContentLoaded', (event) => {
  let items = document.querySelectorAll('.tr_table');
  let count = 0;
  items.forEach(function (item) {
    checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "checkbox");
    checkbox.setAttribute("id", count);
    checkbox.checked = localStorage.getItem(count);
    checkbox.addEventListener('change', whenCheked);
    item.children[3].appendChild(checkbox);
    for (i = 0; i < item.children.length; i++) {
      item.children[i].classList.add("tablerow:", count);
    }
    count++;
  });
});

function whenCheked(){
  if(this.checked){
    localStorage.setItem(this.id,this.checked);
  }else{
    localStorage.removeItem(this.id);
  }
}