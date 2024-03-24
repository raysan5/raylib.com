function searchFunction(x, id) {
    // Declare variables
    var input, filter, table, tr, i, txtValue;
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    table = document.getElementById("resultsTable");
    tr = table.getElementsByTagName('tr');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[x];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
    }
  }

filterSelection("all");
function filterSelection(c) {
    if (c == undefined)
    {
        c = 'all';
    }
    var x, i;
    x = document.getElementsByClassName("filter");
    if (c == "all") c = "";
    // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
    }
}

// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current control button (highlight it)
var btnContainer = document.getElementById("buttons");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

var container = document.getElementsByTagName('td');

for (var i = 0; i < container.length; i++)
{
    var re = new RegExp(/(?<![,])\b(void|bool|struct|unsigned|const|float|double|int|char)(?![,])\b/g);
    var str = container[i].innerHTML;
    var result = str.match(re); // String.prototype.match calls re[@@match].
    if (result != null)
    {
        container[i].innerHTML = container[i].innerHTML.replaceAll(/\b(void|bool|struct|unsigned|const|float|double|int|char)\b/g, `<span class="hljs-keyword">$1</span>`);
    }
}