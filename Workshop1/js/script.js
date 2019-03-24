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
        transport: {
            read: function (e) {
                // on success
                e.success(bookData);

                // on failure
                //e.error("XHR response", "status code", "error message");
            },
            //the other CRUD settings are omitted for brevity 
           
            destroy: function (e) {
                // remove items from the original datasource by using e.data
                bookData.splice(getIndexById(e.data.BookId), 1); //splice用來刪除从 index 處開始的零個或多個元素
                // on success
                e.success();
                // on failure
                //e.error("XHR response", "status code", "error message");
            },
            update: function (e) {
                // locate item in original datasource and update it
                bookData[getIndexById(e.data.BookId)] = e.data;
                // on success
                e.success();
                // on failure
                //e.error("XHR response", "status code", "error message");
            },
            error: function (e) {
                // handle data operation error
                alert("Status: " + e.status + "; Error message: " + e.errorThrown);
            },
            schema: {
                model: { id: "BookId" },
                fields: {
                    BookId: { editable: false, nullable: true },
                }
            }
        }
    });
    $("#book_grid").kendoGrid({
        dataSource: dataSource,
        height: 550,
        toolbar: ["create"],
        pageable: true,
        groupable: true,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [
            { command: "destroy", title: "&nbsp;" },
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
        
        editable: "popup"
    });
});
