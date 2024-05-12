let nav_items = document.querySelectorAll('.nav-item');
nav_items.forEach(function (nav_item) {
  nav_item.firstChild.classList.remove('active');
});
switch(location.pathname){
  case"/":
    document.getElementById("homepage").className = "active";
  break;
  case"/graphChart":
    document.getElementById("graphPage").className = "active";
  break;
  case"/openStats":
    document.getElementById("openStats").className = "active";
  break;
  case"/about":
  document.getElementById("aboutPage").className = "active";
break;
  default:
  break;
}