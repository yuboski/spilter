
let sortColumnIndex = 0;
let filterColumnIndex = 0;

function waitAndSortTable() {
    waitForElm("table").then((table)=>{
        // sort on the first column (currently "Description")
        sortTable();
        filterTable();
      });
}
// from: https://gitlab.com/gitlab-org/gitlab/-/issues/37246
// inspiration: https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable() {
    let table = getCorrectTable();
    let switching = true;
    while (switching) {
        switching = false;

        let rowA;
        let rowB;
        let shouldSwitch = false;
        for (let i = 1; i < table.rows.length - 1; i++) {
            rowA = table.rows[i];
            rowB = table.rows[i + 1];
            let rowASortElement = rowA.getElementsByTagName("td")[sortColumnIndex];
            let rowBSortElement = rowB.getElementsByTagName("td")[sortColumnIndex];
            if (rowASortElement.innerText > rowBSortElement.innerText) {
                shouldSwitch = true;
                break;
            }
        }

        if (shouldSwitch) {
            rowA.parentNode.insertBefore(rowB, rowA);
            switching = true;
        }
    }
  }
  
  //from: https://stackoverflow.com/a/61511955/24356095
  function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
  }




  function createSearchBox_old() {
    var searchBox = document.createElement("input");
    searchBox.setAttribute('type', 'text');
    searchBox.setAttribute('id', 'filter-scheduled-pipelines');
    searchBox.setAttribute('placeholder', 'Filter pipelines');
    searchBox.setAttribute('class', 'gl-filtered-search-token-segment-input');

    var searchContainer = document.createElement("div");
    searchContainer.setAttribute('class', 'input-group gl-search-box-by-click gl-display-flex gl-flex-grow-1 gl-mr-4');
    searchContainer.appendChild(searchBox);

    
    var searchHeader = document.createElement("div");
    searchHeader.setAttribute('class', 'row-content-block gl-display-flex gl-flex-grow-1 gl-border-b-0');
    searchHeader.appendChild(searchContainer);


    let mainContent = document.querySelectorAll('[class="content"]')[0];
    let flashContainer = document.querySelectorAll('[data-testid="flash-container"]')[0];
    mainContent.insertBefore(searchHeader, flashContainer);

    searchBox.addEventListener("change", filterTable);
    searchBox.addEventListener("keyup", filterTable);

  }
  function createSearchBox() {
    var htmlFilterPanel = `
    <div class="row-content-block gl-display-flex gl-flex-grow-1 gl-border-b-0">
        <div role="group" class="input-group gl-search-box-by-click gl-display-flex gl-flex-grow-1 gl-mr-4">
            <div class="gl-filtered-search-scrollable-container">
            <div class="gl-filtered-search-scrollable">
                <div class="gl-h-auto gl-filtered-search-term gl-filtered-search-item gl-filtered-search-last-item">
                <div id="filter-scheduled-pipelines-container" class="gl-filtered-search-token-segment gl-filtered-search-term-token">
                    <input id="filter-scheduled-pipelines" aria-label="Filter pipelines" class="gl-filtered-search-term-input" placeholder="Filter pipelines">
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    `;
    var searchHeader = document.createElement("div");

    searchHeader.innerHTML = htmlFilterPanel;

    let mainContent = document.querySelectorAll('[class="content"]')[0];
    let flashContainer = document.querySelectorAll('[data-testid="flash-container"]')[0];
    mainContent.insertBefore(searchHeader, flashContainer);

    let searchInput = document.getElementById("filter-scheduled-pipelines");
    searchInput.addEventListener("change", filterTable);
    searchInput.addEventListener("keyup", filterTable);

    let searchInputContainer = document.getElementById("filter-scheduled-pipelines-container");
    searchInputContainer.addEventListener("click", function() {searchInput.focus()});

  }

  function filterTable(searchEvent) {
    let searchText = document.getElementById("filter-scheduled-pipelines").value;
    let table = getCorrectTable();
    var visibleCount = 0;
    for (let i = 1; i < table.rows.length; i++) {
        row = table.rows[i];
        let rowFilterElement = row.getElementsByTagName("td")[filterColumnIndex];
        if ((rowFilterElement.innerText||"").indexOf(searchText) < 0) {
            //hide
            row.hidden = true;
        } else {
            //show
            row.hidden = false;
            visibleCount++;
        }
    }

    if (getCorrectTableIndex()==0) {
        (document.querySelectorAll('[data-testid="pipeline-schedules-all-tab"]')[0].querySelector('.gl-tab-counter-badge')||{}).textContent = ` ${visibleCount} `;
    }
    
  }

  function getCorrectTableIndex() {
    let navItems = document.querySelectorAll('li[class="nav-item"]');
    for (let i = 0; i < navItems.length; i++) {
        let active = navItems[i].querySelector(".active");
        if (active) {
          return i;
        }
    }
  }
  function getCorrectTable() {
    return document.getElementsByTagName("table")[getCorrectTableIndex()];
  }

  function addNavItemHandlers() {
    let navItems = document.querySelectorAll('li[class="nav-item"]');
    for (let i = 0; i < navItems.length; i++) {
        navItems[i].childNodes[0].addEventListener("click", waitAndSortTable);
    }
  }


  addNavItemHandlers();
  createSearchBox();
  // sort on the first column (currently "Description")
  waitAndSortTable();

