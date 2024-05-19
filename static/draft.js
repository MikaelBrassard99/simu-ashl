document.addEventListener('DOMContentLoaded', (event) => {
  let items = document.querySelectorAll('.tr_table');
  let count = 0;
  items.forEach(function (item) {
    checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "checkbox");
    checkbox.setAttribute("id", count);
    item.children[3].appendChild(checkbox);
    for (i = 0; i < item.children.length; i++) {
      item.children[i].classList.add("tablerow:", count);
    }
    count++;
  });
});

var checks = document.querySelectorAll('.checkbox');
checks.forEach(function (check) {
  console.log(check);
  check.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      alert('checked');
    } else {
      alert('not checked');
    }
  });
});
