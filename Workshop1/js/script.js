
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
        dataSource: bookData,
        height: 550,
        groupable: true,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            template: "<div class='customer-photo'" +
                "style='background-image: url(../content/web/Customers/#:data.CustomerID#.jpg);'></div>" +
                "<div class='customer-name'>#: ContactName #</div>",
            field: "ContactName",
            title: "Contact Name",
            width: 240
        }, {
                field: "BookId",
                title: "書籍編號"
        }, {
                field: "BookName",
                title: "書籍名稱"
        }, {
                field: "BookCategory",
                title: "書籍種類",
            width: 150
        }]
    });
});
