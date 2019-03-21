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
    $("#book_grid").kendoGrid({
        dataSource: new kendo.data.DataSource({
            data: bookData
        }),
        height: 550,
        groupable: true,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [
            { command: "destroy" },
                {
                    field: "BookId",
                    title: "書籍編號"
            }, {
                    field: "BookName",
                    title: "書籍名稱"
            }, {
                    field: "BookCategory",
                    title: "書籍種類",
            }, {
                    field: "BookAuthor",
                    title: "作者"
            },{
                    field: "BookBoughtDate",
                    title: "購買日期"
            }, {
                    field: "BookDeliveredDate",
                    title: "送達狀態",
            }, {
                    field: "BookPrice",
                    title: "金額"
            }, {
                    field: "BookAmount",
                    title: "數量"
            }, {
                    field: "BookTotal",
                    title: "總計"
                }],
        remove: function (e) {
                console.log("Removing", e.model.name);
        },
        schema: {
              model: { id: "id" }
            },
        editable: true,
    });
});
