


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
        var i;
        for (i = 0; i < bookDataFromLocalStorage.length; i++) {
            if (bookDataFromLocalStorage[i].BookCategory == "database") {
                bookDataFromLocalStorage[i].BookCategory = "資料庫";
                console.log(i);
                console.log(bookDataFromLocalStorage[i].BookCategory);
            }
        }
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
        
        
    }
}
$(function () {
    loadBookData();
});
$(document).ready(function () {
    var dataSource = new kendo.data.DataSource({
            data: bookDataFromLocalStorage,
            pageSize: 20,
            schema: {
                model: { id: "BookId",
                fields: {
                    BookId: { editable: false, nullable: true },
                    BookCategory: {
                        type: "text",
                        validation: { // validation rules
                            required: true
                        }
                    },
                    BookName: {
                        type: "text",
                        validation: {
                            required: true
                        }
                    },
                    BookAuthor: { type: "text"},
                    BookBoughtDate: { type: "date" },
                    BookPublisher: { type: "text" },
                    BookPrice: { type: "number" },
                    BookAmount: { type: "number"},
                    BookTotal: { type: "number"},
                    BookDeliveredDate: { nullable: true}
                    }
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
    //Grid
    $("#book_grid").kendoGrid({
        dataSource: dataSource,
        height: 550,
        toolbar: "<input type='search id='search' class='k-i-search'/>",
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
                    title: "送達狀態",
                    template:kendo.template($("#BookDeliveredDate-template").html())
                        

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
    //新增書籍按鈕
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
        format: "yyyy-MM-dd"
    });
    $("#bought_datepicker").kendoDatePicker({
        culture: "zh-TW",
        format: "yyyy-MM-dd"
    }).data("kendoDatePicker").value(date);

    //設定金額數量欄位
    

    
    $("#book_price,#book_amount").on('keyup', function () {
        var price = $("#book_price").val();
        var amount = $("#book_amount").val();
        var total = price * amount;
        $("#book_total").text(total);
        
            
    })
    
    var validator = $("#book_form").kendoValidator({
        messages: {
            custom: "Please enter valid value for my custom rule"
        },
        rules: {
            custom: function (input) {
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
                } else if (input.is("[id=delivered_datepicker]")) {
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
        console.log("enter checkint");
        var regex = /^\d+$/;
        if (regex.test(n)) {
            if (n > 0) {
                console.log("整數");
                return true;
            }
        } else {
            console.log("非整數");
            return false;
        }
    }
    $("#insert").on("click", function () {
        if (validator.validate()) {
            // If the form is valid, the Validator will return true
            alert("123");
        } else {
            alert("456");
        }
    });
    //搜尋引擎
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
