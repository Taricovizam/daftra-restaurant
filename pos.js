$(".orders-tabs-wrapper ul").append(
      '<li class="px-4"><input _ngcontent-c0="" autocomplete="off" class="form-control ng-untouched ng-pristine ng-valid" id="inv-obj" type="text" placeholder="invoice data..."></li>'
    );

 $("#invoice-details-iframe").attr(
      "src",
      "/owner/invoices/validate_pos_invoice_details/1?new=1"
    );

const customStyles = `
.extra-chip {
    display: inline-block;
    padding: 0 8px;
    height: 23px;
    font-size: 10px;
    line-height: 23px;
    border-radius: 40px;
    background-color: #2551da;
    color: #fff;
    cursor: pointer;
}


.extra-chip-close-btn {
    padding-left: 5px;
    color: #fff;
    /* font-weight: bold; */
    float: right;
    font-size: 15px;
    cursor: pointer;
    transition: .2s;
}

.extra-chip-close-btn:hover{
  color: #b2b6c2;
}
`

$("<style>li[data-cat='extra']{display:none !important}.toggle-input{display:block !important}</style>").appendTo( "head" )
$(`<style>${customStyles}</style>`).appendTo( "head" )
setTimeout(()=>{
$("#pos-wrapper > div.pos-content > app-invoice > div > div.products-sheet > div > div > div > div > a.user-action.del-order.btn.btn-danger > i").trigger("click")
const keyEvent = new Event( "keyup", { keyCode: 13 } );
$('window').trigger(keyEvent);
},2000)

const extrasContainer = `<div class="extras-container" style="z-index:10;transition:.4s;position:absolute;top:50%;left:0;transform:translateX(-110%) translateY(-50%);border:4px solid #d5d5d5;box-shadow:2px 2px 20px 3px #7777773d;border-radius:6px;background:#fff;height:500px;width:300px"> <div style="width:100%;padding:0px;position:relative;z-index:20;"><span style="transform:rotate(45deg);position:absolute;top:0;right:0;padding:3px 10px;font-size:22px;cursor:pointer;" class="extras-close">+</span></div>
<div style="text-align:center;font-weight:bold;width:100%;padding-top:10px;position:relative">Extra Items</div>
<ul class="extras-list" style="list-style:none;padding:0px;margin:0px"></ul></div>`

const notesContainer = `<div class="notes-container" style="display:none;z-index:10;position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%);border:4px solid #d5d5d5;box-shadow:2px 2px 20px 3px #7777773d;border-radius:6px;background:#fff;height:200px;width:300px">  <div style="width:100%;padding:0px;position:relative;z-index:20;"><span style="transform:rotate(45deg);position:absolute;top:0;right:0;padding:3px 10px;font-size:22px;cursor:pointer;" class="extras-close">+</span></div><form class="notes-form">
  <div class="form-group">
<label for="exampleFormControlInput1">Item Notes:</label>
 <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Add Notes..."/>
  </div>
</form>
</div>`

// Hide all extras from the selected items
//$("#pos-wrapper > div.pos-content > app-invoice > div > div.products-sheet > div > div > div > app-invoice-items > ul > li").find("[data-cat='extras']").hide()

const extraBtn = `<span class="extra-btn" style="float: left;padding: 4px;margin: -10px;background: darkkhaki;color: wheat;border: solid 1px;border-radius: 4px;"><i class="fa fa-plus"></i></span>` 
let currentExtras = []
let currentExtrasNames = []
let extraNames = {}
let currentItem, extraInterval;
let invObj = []

function prepPOS(){
//disable discount btns
$("#pos-wrapper > div.pos-content > app-invoice > div > div.calc-wrapper > div > div.subwindow-container-fix.pads > section.content-numpad > button:nth-child(2), #pos-wrapper > div.pos-content > app-invoice > div > div.calc-wrapper > div > div.subwindow-container-fix.pads > section.content-numpad > button:nth-child(3)").attr("disabled", "disabled").css({userSelect: "none", pointerEvents: "none", color: "gray"})
}


function FetchItemsNo(orderNumberURL, apiKey){
$.ajax({
   url: orderNumberURL, 
    method: "GET",
    headers: {apikey: apiKey}
})
.done(data => {
orderNumber = data.curr_no
lastItem = data.last_item
})
}

function addCategory(){

const allProds = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > app-products > div > span.product-pic")
allProds.click((e)=>{

e.stopPropagation()
let currentCat = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(2) > a").text()

const lastItem = $("#pos-wrapper > div.pos-content > app-invoice > div > div.products-sheet > div > div > div > app-invoice-items > ul > li.order-item:last-child")

!lastItem.attr( "data-cat") && lastItem.attr( "data-cat", currentCat)
lastItem.find(".fa-plus").length != 1 && lastItem.append(extraBtn)
$(".extra-btn").off("toggle");

//$(".extras-close").click(()=>$(".extras-container").css({transform: "translateX(-110%) translateY(-50%)"}))
$(".extra-btn").click(function () {
const homeBtn = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(1)")
homeBtn.click()

extraInterval = setInterval(()=>{
const extraCard = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > div").find("span.product[data-category= '14']")
if(extraCard){
extraCard.click()
$("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > app-products > div > span:nth-child(4)").click(()=>{$(".notes-container").toggleClass("toggle-input")})
addNotes()
addExtra()
}
},500)


//$(".extras-container").css({transform: "translateX(0%) translateY(-50%)"});
const $thisItem = $(this).closest("li")
currentItem = $thisItem
//console.log(currentItem.find(`.extra-div`) != null)
//currentItem.find(`.extra-div`) != null && currentItem.find("ul.meta-list").after(`<div class='extra-div'></div>`)
//console.log(currentItem)
currentExtras = $thisItem.data("extraids") || []
currentExtras = $thisItem.data("extranames") || []
//console.log(currentItem)
}
);

})
}

function addExtra(){

const allProds = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > app-products > div > span.product-pic")
//console.log(allProds)

// When clicking on Extra Items
allProds.click(function(){
const selectedExtraPrice = $(this).find("app-product > div.Product-meta > span.price-tag").text()
const selectedExtraID = $(this).data("product")
const selectedExtraName = $(this).find("app-product > div.product-name> p").text().trim()

//adding extra category to the item on the list
let currentCat = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(2) > a").text()
const lastItem = $("#pos-wrapper > div.pos-content > app-invoice > div > div.products-sheet > div > div > div > app-invoice-items > ul > li.order-item:last-child")
!lastItem.attr( "data-cat") && lastItem.attr( "data-cat", currentCat)

//currentExtras = currentItem.data("extraids") || []
//currentExtrasNames = currentItem.data("extranames") || [] 
extraNames =currentItem.data("extranames") || {}
console.log("just added", extraNames)
// Add Extra IDs
//currentExtras.push(selectedExtraID)
//const extrasSet = [...new Set(currentExtras)]
//currentItem.attr("data-extraids", JSON.stringify(extrasSet))

// Add Extra Names
//currentExtrasNames.push(selectedExtraName)
extraNames[selectedExtraName] =  {name: selectedExtraName, id: selectedExtraID, qty: "" || 1, price: selectedExtraPrice}
//const extrasSetNames = [...new Set(currentExtrasNames)]
currentItem.attr("data-extranames", JSON.stringify(extraNames))
//currentItem.closest(".extra-div").html(JSON.stringify(Object.keys(extraNames)))
currentItem.find("ul > li:not(.meta-info)").remove() 

//currentItem.find(".meta-list > li.meta-info").after(`<li><b>${JSON.stringify(Object.keys(extraNames))}</b></li>`)
//currentItem.find(".meta-list > li.meta-info").after(`<li><b>${JSON.stringify(Object.keys(extraNames))}<br/> +Notes: ${currentItem.attr("data-notes") || //"No Notes"}</b></li>`)
currentItem.find(".meta-list").append("<li></li>")

Object.values(extraNames).map((ex,_)=> {
const {name, id, price, qty} = ex
const newChip = `<div class="extra-chip" data-id=${id} data-qty=${qty} data-price=${price}>
  <b><span class="extra-chip-content">${name}</span></b>
  <span class="extra-chip-close-btn">&times;</span>
</div>`

currentItem.find(".meta-list > li:last-child").append(newChip)
$(".extra-chip-close-btn").click(function(e){removeExtra(ex);e.target.closest(".extra-chip").remove()})
})
    console.log(extraNames)


//console.log(extraNames, currentItem.data("extranames"), extraNames[selectedExtraName])
})






}

function removeExtra(extra){
console.log(extra)

//currentExtras  = JSON.parse(currentItem.attr("data-extraids"))
extraNames = JSON.parse(currentItem.attr("data-extranames"))
//const itemNotes = currentItem.attr("data-notes")

console.log(extraNames)
delete extraNames[extra.name]

console.log("after", extraNames)

currentItem.attr("data-extranames", JSON.stringify(extraNames))
$(this).parent().remove()

}


function FetchExtras(extrasURL, apiKey){
$("body").append(extrasContainer)
$("body").append(notesContainer)
$.ajax({
   url: extrasURL, 
    method: "GET",
    headers: {apikey: apiKey}
})
.done(data => {
//console.log(data.data)
const allExtras = data.data.map(ex => {
const newExtra = `
 <li class="extra-item" style="cursor:pointer;margin-bottom:1px;padding:4px;background:#bbc5cd;color:#171616;" data-prod=${ex.id} data-name=${ex.item.name}>
    <div>${ex.item.name}</div>
    <div>${ex.item.product_code}</div>
    <div>${ex.item.description}</div>
  </li>
`
$(".extras-list").append(newExtra)
$(".extra-item").off("toggle")
$(".extra-item").toggle(
function(){
$(this).css({background: "#11a683"});
currentExtras = currentItem.data("extraids") || []

//=========

const extraSelected = $(this).closest("li").data("prod")
//console.log($(this).closest("li"), extraSelected, currentExtras)
currentExtras.push(extraSelected)
const extrasSet = [...new Set(currentExtras)]
currentItem.attr("data-extraids", JSON.stringify(extrasSet))

currentExtrasNames = currentItem.data("extranames") || [] 
const extraSelectedName = $(this).closest("li").data("name")
//console.log(extraSelectedName)
currentExtrasNames.push(extraSelectedName)
const extrasSetNames = [...new Set(currentExtrasNames)]
currentItem.attr("data-extranames", JSON.stringify(extrasSetNames))

},
function(){
$(this).css({background: "#bbc5cd"});
currentExtras = currentItem.data("extraids") || [] 
const extraSelected = $(this).closest("li").data("prod")

//console.log($(this).closest("li"), extraSelected, currentExtras)
let extrasSet = new Set(currentExtras)
//console.log(extrasSet)
extrasSet.delete(extraSelected)

currentItem.attr("data-extraids", JSON.stringify([...extrasSet]))
}

)
})

})
}
$(".pay.btn-success").click(invoiceObj)
console.log("that btn", $(".pay.btn-success"))

function UpdateItemsNo(orderNumberURL, apiKey, data){
console.log(data)
$.ajax({
    url: orderNumberURL, 
   method: "PUT",
    contentType: "application/json",
    accept: "application/json",
    headers: {apikey: apiKey},
    data: JSON.stringify(data)
}).done(()=>console.log("new numbers after posting the new inv items")).fail(err=>console.log(err))
}

function CreateItems(itemsURL, apiKey, data){

console.log("dataa:", data)
data.map((_,item)=>{
//item["invoice_id"] = invID
//console.log("last checK", data)
$.ajax({
    url: itemsURL, 
    method: "POST",
    contentType: "application/json",
    accept: "application/json",
    headers: {apikey: apiKey},
//data: JSON.stringify(data),
    data: JSON.stringify({item_name: $(item).find(".product-name").text(), item_qty: $(item).find("li > span > em:nth-child(1)").text(), item_category: $(item).attr( "data-cat"), itemPrice: $(item).find(".price").text().replace(",", "").match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)[0], status: "0", order_no: orderNumber, invoice_id: invID})
}).done(
    ()=>{
console.log("items have been Created!!!")
invID = null
}).fail(err=>console.log(err))
})
}

// code excution starts here

const apiKey = "7c677625232b637a1065355630d780923bfbce76"
const itemsURL = "/v2/api/entity/le_order-items"
const extrasURL = "/v2/api/entity/item_category/list/1?per_page=1000&filter[category_id]=14"
const orderNumberURL =  "/v2/api/entity/le_order-no/1"
let currCat;
let orderNumber, lastItem, invID;
//FetchItemsNo(orderNumberURL, apiKey)
FetchExtras(extrasURL, apiKey)

$("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol.breadcrumb ").click(()=>{
clearInterval(extraInterval)
$("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > div > span.product").click(()=>addCategory())

})

let domInterval = setInterval(()=>{
const payBtn = $("#paymentSubmitBtn")
if(payBtn){
clearInterval(domInterval)
$("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > div > span.product").click(()=>addCategory())
prepPOS()
payBtn.click(function(e){
e.preventDefault()
const itemsList = $(".order-item")

const invNumberInterval = setInterval(() => {
if(!invID){
window.addEventListener("message", (event)=>{
if(event.data) invID = event.data.event_data.invoice_id
//console.log("IJD: ", event.data.event_data.invoice_id)
  },false)

console.log("invNumberInterval", invID)
}else{
clearInterval(invNumberInterval)
console.log("InvID: ", invID, "on.", orderNumber)
let itemsNoData = {
    "id": 1,
    "curr_no": parseInt(orderNumber)+1,
    "last_item": parseInt(lastItem) + itemsList.length,
    "last_inv": invID 
}
UpdateItemsNo(orderNumberURL, apiKey, itemsNoData)
CreateItems(itemsURL, apiKey, itemsList)
const homeBtn = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(1)")
homeBtn.click()
//CreateItems(itemsURL, apiKey, invObj)
}
}, 500)
})
}

},1000)


function addNotes(){
$(".notes-form").submit(function(e){
e.preventDefault()
const inputNotesVal = $(this).find("input").val()
//console.log(inputNotesVal)
currentItem.attr("data-notes", inputNotesVal)
//extraNames[inputNotesVal] = "notes"
currentItem.find("ul > li:not(.meta-info)").remove() 
currentItem.find(".meta-list > li.meta-info").after("li")


currentItem.find(".meta-list > li.meta-info").after(`<li>${JSON.stringify(Object.keys(extraNames))}<br/> +Notes: ${currentItem.attr("data-notes")}</li>`)
//$(this).find("input").val("")
$(".notes-container").removeClass("toggle-input")
})

}

function invoiceObj(){
FetchItemsNo(orderNumberURL, apiKey)
invObj=[]
const allItems = $("#pos-wrapper > div.pos-content > app-invoice > div > div.products-sheet > div > div > div > app-invoice-items > ul > li:not([data-cat='extra'])")
allItems.map((_,item)=>{
//console.log(item)
const itemNotes = $(item).attr("data-notes")
const itemExtraIDs = $(item).attr("data-extraids")
const itemExtraNames = $(item).attr("data-extranames")


const thisItem = {item_name: $(item).find(".product-name").text(), item_qty: $(item).find("li > span > em:nth-child(1)").text(), item_category: $(item).attr( "data-cat"), itemPrice: $(item).find(".price").text().replace(",", "").match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)[0], status: "0", order_no: orderNumber, invoice_id: invID, itemExtraNames, itemExtraIDs, itemNotes}
//const thisItem = {itemName: $(item).find(".product-name").text(), itemQty: $(item).find("li > span > em:nth-child(1)").text(), itemCategory: $(item).attr( "data-cat"), itemPrice: $(item).find(".price").text().replace(",", "").match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)[0], itemExtraNames, itemExtraIDs, itemNotes}
invObj.push(thisItem)

})
// Handling data input

      let customFelid = $("#invoice-details-iframe")
        .contents()
        .find("#CustomModelField2")
customFelid.val(JSON.stringify(invObj))
console.log(customFelid)
if(customFelid.val() == "" || customFelid.val() == undefined ) {
customFelid.val(JSON.stringify(invObj))
alert("اضغط زر عملية الدفع مرة أخرى")

}
$("#invoice-details-iframe")
        .contents()
        .find("#InvoiceForm > div.submit-wrap > button")
        .click()
console.log(invObj, customFelid.val())
$("#inv-obj").val(JSON.stringify(invObj))

}


// Last invoice created message Event Listener...

window.addEventListener("message", (event)=>{
if(event.data) invID = event.data.event_data.invoice_id
//console.log("InvID: ", event.data.event_data.invoice_id)
  },false)

