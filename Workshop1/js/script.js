console.log(bookData);
console.log(bookData[2].BookCategory);
var bookDataCopy = bookData.slice();
var i;
for (i = 0; i < bookDataCopy.length; i++) {
    if (bookData[i].BookCategory == "database") {
        bookData[i].BookCategory = "資料庫";
        console.log(i);
        console.log(bookData[i].BookCategory);
    }
}

var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];

// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}
$(function () {
    loadBookData();
});
$(document).ready(function () {
    var dataSource = new kendo.data.DataSource({
            data: bookData,
            pageSize: 20,
            schema: {
                model: { id: "BookId" },
                fields: {
                    BookId: { editable: false, nullable: true },
                }
            }
        }
    );
    var wnd,
        detailsTemplate;
    function showDeleteDetail(e) {
        // prevent page scroll position change
        e.preventDefault();
        // e.target is the DOM element representing the button
        var tr = $(e.target).closest("tr"); // get the current table row (tr)
        // get the data bound to the current table row
        var data = this.dataItem(tr);
        kendo.confirm("確定刪除「" + data.BookName + "」嗎?").then(function () {
            console.log(data);
            dataSource.remove(data);
        }, function () {
        });
    }
    $("#book_grid").kendoGrid({
        dataSource: dataSource,
        height: 550,
        toolbar: "<input type='search id='search' />",
        pageable: true,
        //groupable: true,
        //sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [
            { command:{ text: "刪除", click: showDeleteDetail }, title: " ", width: "130px" } ,
                {
                    field: "BookId",
                    title: "書籍編號",
            }, {
                    field: "BookName",
                    title: "書籍名稱",
                    width: "250px"
            }, {
                    field: "BookCategory",
                    title: "書籍種類",
            }, {
                    field: "BookAuthor",
                    title: "作者",
                    width: "100px"
            },{
                    field: "BookBoughtDate",
                    title: "購買日期",
                    format: "{0: yyyy-MM-dd}"
            }, {
                    field: "BookDeliveredDate",
                    title: "送達狀態"
            }, {
                    field: "BookPrice",
                    title: "金額",
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: right"
                    },
                    format: '{0:n0}'
            }, {
                    field: "BookAmount",
                    title: "數量",
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: right"
                    },
                    format: '{0:n0}'
            }, {
                    field: "BookTotal",
                    title: "總計",
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: right"
                    },
                    format: '{0:n0} 元'
                }],
        
        editable: "inline"
    });
    $('#add_book').click(function () {
        wnd.center().open();
    })
    wnd = $("#showInsert")
        .kendoWindow({
            title: "新增書籍",
            modal: true,
            //visible: false,
            resizable: false,
            width: 700
        }).data("kendoWindow");

    var template = kendo.template($("#book-template").html());

    function preview() {
        var dropdown = $("#book_category").data("kendoDropDownList");
        console.log("value" + dropdown.dataSource);
        console.log("dropdown" + bookCategoryList.indexOf());
        var product = dropdown.dataSource.indexOf(dropdown.value());

        var productPreviewHtml = template(product);
        console.log("product"+product);
        console.log("productPreviewHtml"+productPreviewHtml);
        $("#book-preview").html(productPreviewHtml);
    }

    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: bookCategoryList,
        dataBound: preview,
        change: preview
    });
    
    var $search = $("#search");
    $search.kendoAutoComplete({
        dataTextField: "textForSearch",
        dataSource: bookData,
        filter: "contains",
        select: function (e) {
            //get index of <LI>
            var idx = $.inArray(e.item[0], e.sender.items());
            var data = e.sender.dataItem(idx);
            //set name
            $("#name").text(data.name);
        }
        
    });
});
