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
    console.log(JSON.parse(localStorage.getItem('bookData')))
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
    
}
$(function () {
    loadBookData();
});
$(document).ready(function () {
  
    var i;
    var j;
    for (i = 0; i < bookDataFromLocalStorage.length; i++) {
        for (j = 0; j < bookCategoryList.length; j++) {
            if (bookDataFromLocalStorage[i].BookCategory == bookCategoryList[j].value) {
                bookDataFromLocalStorage[i].BookCategory = bookCategoryList[j].text;
            }
        }
    }
    //set datasource
    var dataSource = new kendo.data.DataSource({
        data: bookDataFromLocalStorage,
        filterable: true,
        pageSize: 20,
        schema: {
            model: {
                id: "BookId",
                fields: {
                    BookId: { editable: false, nullable: true },
                    BookCategory: {
                        type: "text",
                        validation: {
                            required: true
                        }
                    },
                    BookName: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    BookAuthor: { type: "string" },
                    BookBoughtDate: { type: "date"},
                    BookPublisher: { type: "text" },
                    BookPrice: { type: "number" },
                    BookAmount: { type: "number" },
                    BookTotal: { type: "number" },
                    BookDeliveredDate: {
                        type: "date", nullable: true
                    }
                }
            }
        }
    });
    
    

    //確認刪除窗格
    function showDeleteDetail(e) {
        // prevent page scroll position change
        e.preventDefault();
        // e.target is the DOM element representing the button
        var tr = $(e.target).closest("tr"); // get the current table row (tr)
        // get the data bound to the current table row
        var data = this.dataItem(tr);
        var grid = $("#book_grid").data("kendoGrid")
        kendo.confirm("確定刪除「" + data.BookName + "」嗎?").then(function () {
            console.log(data);
            dataSource.remove(data);
            var bookData = grid.dataSource._data
            localStorage.clear();
            localStorage.setItem('bookData', JSON.stringify(bookData));
        }, function () {
        });
    }

    

    //新增書籍按鈕
    var wnd,
        detailsTemplate;
    $('#add_book').click(function () {
        wnd.center().open();
    })
    wnd = $("#showInsert")
        .kendoWindow({
            actions: ["Pin", "Maximize", "Minimize", "Close"],
            title: "新增書籍",
            modal: true,
            //visible: false,
            resizable: false,
            width: 700,
            height: 700
        }).data("kendoWindow");

    //書籍種類下拉式選單(變更圖片)
    function preview() {
        var dropdown = $("#book_category").data("kendoDropDownList");
        var product = dropdown.dataSource.get(dropdown.value());
        var bookimg = "<img src='image/" + dropdown.value() + ".jpg' style='width: 100%; height: 100%;'>";
        $("#book-preview").html(bookimg);
    }
    $("#book_category").kendoDropDownList({ 
        dataTextField: "text",
        dataValueField: "value",
        dataSource: bookCategoryList,
        dataBound: preview,
        change: preview
    });
    //表單資料設定  &  表單驗證
    //設定日期欄位
    var today = new Date();
    var date;
    date = (today.getFullYear()) + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    $("#delivered_datepicker").kendoDatePicker({
        culture: "zh-TW",
        format: "yyyy-MM-dd",
        parseFormats: ["yyyy/MM/dd", "yyyyMMdd"],
        dateInput: true
    });
    $("#bought_datepicker").kendoDatePicker({
        culture: "zh-TW",
        format: "yyyy-MM-dd",
        parseFormats: ["yyyy/MM/dd", "yyyyMMdd"],
        dateInput: true
    });

    //設定金額數量欄位
    $("#book_price,#book_amount").kendoNumericTextBox({
        value: 0,
        format: "{0:n0}"
    });

    $("#book_price,#book_amount").on('keyup', function () {
        var price = $("#book_price").val();
        var amount = $("#book_amount").val();
        var total = price * amount;
        $("#book_total").html(total.toLocaleString());
         //setTotal(total);
            
    })

    //驗證新增表單
    var validator = $("#book_form").kendoValidator({
        messages: {
            required: "此欄位為必填",
            custom1:  "請輸入大於0的數字",
            custom2:  "運送日不可在購買日之前"
        },
        rules: {
            custom1: function (input) {
                if (input.is("[id=book_price]")) {
                    if (checkInt(input.val()) === true) {
                        return input.val() > 0;
                    } else {
                        return false;
                    }
                } else if (input.is("[id=book_amount]")) {
                    if (checkInt(input.val()) === true) {
                        return input.val() > 0;
                    } else {
                        return false;
                    }
                }
                return true;
            },
            custom2: function (input) {
                if (input.is("[id=delivered_datepicker]")) {
                    var deliveredDate = $("#delivered_datepicker").val();
                    var boughtDate = $("#bought_datepicker").val();
                    if ((Date.parse(deliveredDate)).valueOf() > (Date.parse(boughtDate)).valueOf()) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return true;
            }
        }
    }).data("kendoValidator");
    function checkInt(n) {
        var regex = /^\d+$/;
        if (regex.test(n)) {
            if (n > 0) {
                return true;
            }
        } else {
            return false;
        }
    }
    //新增資料
    var viewModel = kendo.observable({
        BookCategory: "database",
        BookBoughtDate: date,
        BookPrice: 0,
        BookAmount: 0,
        display: function () {
            if (validator.validate()) {
                var bookName = this.get("bookName");
                var bookCategory = this.get("BookCategory");
                var author = this.get("BookAuthor");
                var bookBoughtDate = this.get("BookBoughtDate");
                var bookDeliveredDate = this.get("BookDeliveredDate");
                var bookPrice = this.get("BookPrice");
                var bookAmount = this.get("BookAmount");
                var bookTotal = this.get("BookPrice") * this.get("BookAmount");
                var id = dataSource.total() + 1;
                console.log(bookBoughtDate);
                dataSource.fetch(function () {
                    var dataItem = dataSource.insert(0,
                        {
                            BookId: id,
                            BookCategory: bookCategory,
                            BookName: bookName,
                            BookAuthor: author,
                            BookBoughtDate: bookBoughtDate,
                            BookDeliveredDate: bookDeliveredDate,
                            BookPrice: bookPrice,
                            BookAmount: bookAmount,
                            BookTotal: bookTotal
                        });
                    var index = dataSource.indexOf(dataItem);
                    
                });
                var grid = $("#book_grid").data("kendoGrid")
                var bookData = grid.dataSource._data
                localStorage.clear();
                localStorage.setItem('bookData', JSON.stringify(bookData));
            } else {
                alert("input error")
            }

        }
    });
    kendo.bind($("#showInsert"), viewModel);
    //Grid
    $("#book_grid").kendoGrid({
        dataSource: dataSource,
        height: 550,
        toolbar: "<input type='search' name='search' id='search' placeholder='我想要找....'/>",
        pageable: true,
        //groupable: true,
        //sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [
            { command: { text: "刪除", click: showDeleteDetail }, title: " ", width: "130px" },
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
            }, {
                field: "BookBoughtDate",
                title: "購買日期",
                format: "{0: yyyy-MM-dd}"
            }, {
                field: "BookDeliveredDate",
                title: "送達狀態",
                format: "{0: yyyy-MM-dd}",
                template: kendo.template($("#BookDeliveredDate-template").html())
                
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
        editable: "inline",
        change: function(e) {
            var item = data.splice(e.oldIndex, 1)[0]; //remove the item that has changed its order
            data.splice(e.newIndex, 0, item);
            localStorage.setItem("bookData", JSON.stringify(array)); //set the updated data in the local storage
        }
    });

    //搜尋引擎
    $("#search").on('input', function (e) {
        var grid = $('#book_grid').data('kendoGrid');
        var columns = grid.columns;
        var filter = { logic: 'or', filters: [] };
        columns.forEach(function (x) {
            if (x.field) {
                var type = grid.dataSource.options.schema.model.fields[x.field].type;
                if (type == 'string') {
                    filter.filters.push({
                        field: x.field,
                        operator: 'contains',
                        value: e.target.value
                    })
                }
            }
        });
        grid.dataSource.filter(filter);
    });
    

});
