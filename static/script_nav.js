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
  case"/draft":
    document.getElementById("draftPage").className = "active";
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

//table sort
var tables = document.querySelectorAll('.table-wrap');
tables.forEach(function (table) {
  table.addEventListener("click", function (e) {
    try {
      function findElementRecursive(element, tag) {
        return element.nodeName === tag
          ? element
          : findElementRecursive(element.parentNode, tag);
      }
      let descending_th_class = " dir-d ";
      let ascending_th_class = " dir-u ";
      let ascending_table_sort_class = "asc";
      let regex_dir = / dir-(u|d) /;
      let regex_table = /\bsortable\b/;
      let alt_sort = e.shiftKey || e.altKey;
      let element = findElementRecursive(e.target, "TH");
      let tr = findElementRecursive(element, "TR");
      let table = findElementRecursive(tr, "TABLE");
      function reClassify(element, dir) {
        element.className = element.className.replace(regex_dir, "") + dir;
      }
      function getValue(element) {
        return (
          (alt_sort && element.getAttribute("data-sort-alt")) ||
          element.getAttribute("data-sort") ||
          element.innerText
        );
      }
      if (regex_table.test(table.className)) {
        let column_index;
        let nodes = tr.cells;
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i] === element) {
            column_index = element.getAttribute("data-sort-col") || i;
          } else {
            reClassify(nodes[i], "");
          }
        }
        let dir = descending_th_class;
        if (
          element.className.indexOf(descending_th_class) !== -1 ||
          (table.className.indexOf(ascending_table_sort_class) !== -1 &&
            element.className.indexOf(ascending_th_class) == -1)
        ) {
          dir = ascending_th_class;
        }
        reClassify(element, dir);
        let org_tbody = table.tBodies[0];
        let rows = [].slice.call(org_tbody.rows, 0);
        let reverse = dir === ascending_th_class;
        rows.sort(function (a, b) {
          let x = getValue((reverse ? a : b).cells[column_index]);
          let y = getValue((reverse ? b : a).cells[column_index]);
          return isNaN(x - y) ? x.localeCompare(y) : x - y;
        });
        let clone_tbody = org_tbody.cloneNode();
        while (rows.length) {
          clone_tbody.appendChild(rows.splice(0, 1)[0]);
        }
        table.replaceChild(clone_tbody, org_tbody);
      }
    } catch (error) { }
  });
});