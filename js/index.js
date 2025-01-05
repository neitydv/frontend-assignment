import { FETCH_DATA_API_URL, TABLE_COLUMN_CONFIG, TABLE_PAGINATION_DEFAULT_LIMIT } from './constants.js';

const setTableBody = function(pageNumber, dataList) {
    const fragment = new DocumentFragment();
    const tbody = document.createElement("tbody");

    let l = TABLE_PAGINATION_DEFAULT_LIMIT * (pageNumber - 1),
        r = Math.min(TABLE_PAGINATION_DEFAULT_LIMIT * pageNumber, dataList.length);

    for (let i = l; i < r; i++) {
        const currRow = dataList[i];
        const tr = document.createElement("tr");

        TABLE_COLUMN_CONFIG.forEach(columnConfig => {
            const td = document.createElement("td");
            td.innerText = currRow[columnConfig.key];

            tr.append(td);
        });
        tbody.append(tr);
    }

    fragment.append(tbody);

    const tableNode = document.getElementById("data-table");
    const tbodyNode = tableNode.getElementsByTagName("tbody")[0];
    tableNode.replaceChild(fragment, tbodyNode);
}

const setTableHead = function() {
    const fragment = new DocumentFragment();
    const thead = document.createElement("thead");

    TABLE_COLUMN_CONFIG.forEach(columnConfig => {
        const th = document.createElement("th");
        th.innerText = columnConfig.label;
        thead.append(th);
    });

    fragment.append(thead);

    const tableNode = document.getElementById("data-table");
    const theadNode = tableNode.getElementsByTagName("thead")[0];
    tableNode.replaceChild(fragment, theadNode);
}

const setPaginator = function(currPage = 1, dataList = []) {
    const totalPageCount = (dataList.length - 1) / TABLE_PAGINATION_DEFAULT_LIMIT + 1;
    if (currPage < 1 || currPage > totalPageCount) throw new Error("Error in pagination");

    setTableBody(currPage, dataList);
    const fragment = new DocumentFragment();

    // set label
    const label = document.createElement("span");
    label.innerText = "Page Number: ";
    label.classList = 'paginator-label';

    // set left button
    const leftButton = document.createElement("button");
    leftButton.innerText = '<';
    leftButton.classList = "paginator-increment";

    if (currPage === 1) leftButton.disabled = true;
    else leftButton.disabled = false;

    leftButton.addEventListener("click", function() {
        setPaginator(currPage - 1, dataList);
    })

    // set go to start page button
    const gotoStartButton = document.createElement("button");
    gotoStartButton.innerText = '<<';
    gotoStartButton.classList = "paginator-goto-start";

    if (currPage === 1) gotoStartButton.disabled = true;
    else gotoStartButton.disabled = false;

    gotoStartButton.addEventListener("click", function() {
        setPaginator(1, dataList);
    })

    // set right button
    const rightButton = document.createElement("button");
    rightButton.innerText = '>';
    rightButton.classList = "paginator-decrement";

    if (currPage === totalPageCount) rightButton.disabled = true;
    else rightButton.disabled = false;

    rightButton.addEventListener("click", function() {
        setPaginator(currPage + 1, dataList);
    })

    // set go to end page button
    const gotoEndButton = document.createElement("button");
    gotoEndButton.innerText = '>>';
    gotoEndButton.classList = "paginator-goto-end";

    if (currPage === totalPageCount) gotoEndButton.disabled = true;
    else gotoEndButton.disabled = false;

    gotoEndButton.addEventListener("click", function() {
        setPaginator(totalPageCount, dataList);
    })

    // set page number
    const pageNumber = document.createElement("span");
    pageNumber.innerText = `${currPage} of ${Math.max(1, totalPageCount)}`
    pageNumber.classList = "paginator-pagenumber";

    fragment.append(label);
    fragment.append(gotoStartButton);
    fragment.append(leftButton);
    fragment.append(pageNumber);
    fragment.append(rightButton);
    fragment.append(gotoEndButton);

    const paginatorNode = document.getElementById("paginator");
    paginatorNode.replaceChildren(fragment);
}

const fetchData = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', FETCH_DATA_API_URL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                setPaginator(1, response);
            } else {
                throw new Error('Error occurred: ' + xhr.status);
            }
        }
    };

    xhr.send();
}

try {
    setTableHead();
    fetchData();
} catch (ex) {
    console.log(ex.message);
}