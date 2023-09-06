// Global Variables
let extras = []
let extrasArr = []
let currentItem, currentExtras, payBtn;
let invObj = []

const extrasCategoryId = 14
const apiKey = "7c677625232b637a1065355630d780923bfbce76"
const itemsURL = "/v2/api/entity/le_order-items"
const extrasURL = "/v2/api/entity/item_category/list/1?per_page=1000&filter[category_id]=14"
const orderNumberURL =  "/v2/api/entity/le_order-no/1"
let orderNumber, lastItem, invID;


// Global Elements/Manipulation

// Create Extra Btn
const extraBtn = `<span class="extra-btn" style="float: left;padding: 4px;margin: -10px;background: darkkhaki;color: wheat;border: solid 1px;border-radius: 4px;"><i class="fa fa-plus"></i></span>` 

function prepPOS(){
// Disable Discount Field
$("#pos-wrapper > div.pos-content > app-invoice > div > div.calc-wrapper > div > div.subwindow-container-fix.pads > section.content-numpad > button:nth-child(2), #pos-wrapper > div.pos-content > app-invoice > div > div.calc-wrapper > div > div.subwindow-container-fix.pads > section.content-numpad > button:nth-child(3)").attr("disabled", "disabled").css({userSelect: "none", pointerEvents: "none", color: "gray"})


  // Accessing Invoice Custom Fields
 $("#invoice-details-iframe").attr(
      "src",
      "/owner/invoices/validate_pos_invoice_details/1?new=1"
    );

    setTimeout(()=>{
      $("#pos-wrapper > div.pos-content > app-invoice > div > div.products-sheet > div > div > div > div > a.user-action.del-order.btn.btn-danger > i").trigger("click")
      const keyEvent = new Event( "keyup", { keyCode: 13 } );
      $('window').trigger(keyEvent);
      },2000)

      // Adding styles for Extra Btn And Others
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
li[data-cat='extra']{
  display:none !important}
  .toggle-input{
    display:block !important
  }
`
$(`<style>${customStyles}</style>`).appendTo( "head" )

}

// Create Notes Field
function CreateNotesField(){
  const notesContainer = `<div class="notes-container" style="display:none;z-index:10;position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%);border:4px solid #d5d5d5;box-shadow:2px 2px 20px 3px #7777773d;border-radius:6px;background:#fff;height:200px;width:300px">  <div style="width:100%;padding:0px;position:relative;z-index:20;"><span style="transform:rotate(45deg);position:absolute;top:0;right:0;padding:3px 10px;font-size:22px;cursor:pointer;" class="extras-close">+</span></div><form class="notes-form">
  <div class="form-group">
  <label for="exampleFormControlInput1">Item Notes:</label>
  <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Add Notes..."/>
  </div>
  </form>
  </div>`
  $("body").append(notesContainer)

}

 // Handling Notes Input (onClick extraBtn)
 function notesHandling(){
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

// Get Current Item (onClick extraBtn)
function AccessCurrentItem(el){
  const $thisItem = $(el).closest("li")
  // current item prep for using
  currentExtras = $thisItem.data("extras") || []
  
  return $thisItem
  }
  
  // Add Category Name to Items
function addCategoryName(){
  //onClick categories cards 
  $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > app-products > div > span.product-pic").click((e)=>{
  e.stopPropagation()
  let currentCat = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(2) > a").text()
  const lastItem = $("#pos-wrapper > div.pos-content > app-invoice > div > div.products-sheet > div > div > div > app-invoice-items > ul > li.order-item:last-child")
  // add categoryName + extrasButton to listItem 
  !lastItem.attr( "data-cat") && lastItem.attr( "data-cat", currentCat)
  lastItem.find(".fa-plus").length != 1 && lastItem.append(extraBtn)
  });

}

// POST Invoice Items to the Restaurant App
function POSTitemsToKitchen(itemsURL, apiKey, data){
  data.map((_,item)=>{
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

// GET Items Number
function GETorderNumber(orderNumberURL, apiKey){
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

  // GET Extras IDs
  function FetchExtrasIDs(extrasURL, apiKey){
     $.ajax({
       url: extrasURL, 
        method: "GET",
        headers: {apikey: apiKey}
    })
    .done(data => {
     extrasArr = data.data.map(ex => {
      ex.id
    })
    })
  }

  // Create Invoice Data Obj
function invoiceObj(){
  GETorderNumber(orderNumberURL, apiKey)
  const allItems = $("#pos-wrapper > div.pos-content > app-invoice > div > div.products-sheet > div > div > div > app-invoice-items > ul > li:not([data-cat='extra'])")
  allItems.map((_,item)=>{
  //console.log(item)
  const currentItemNotes = $(item).attr("data-notes")
  const currentItemExtras = JSON.parse($(item).attr("data-extras"))
  
  
  const thisItem = {item_name: $(item).find(".product-name").text(), item_qty: $(item).find("li > span > em:nth-child(1)").text(), item_category: $(item).attr( "data-cat"), itemPrice: $(item).find(".price").text().replace(",", "").match(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)[0], status: "0", order_no: orderNumber, invoice_id: invID, currentItemExtras, currentItemNotes}
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

  // Update Order Number
  function PUTorderNumber(orderNumberURL, apiKey, data){
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

  // onCheckout
function onCheckout(payBtn){
  
  payBtn.click(function(e){
    e.preventDefault()
    const itemsList = $(".order-item")
    // Passing Inv. Data to Custom Field
    $(".pay.btn-success").click(invoiceObj())
    const invNumberInterval = setInterval(() => {
    if(!invID){
    console.log("inv is null")
    }else{
    clearInterval(invNumberInterval)
    console.log("InvID: ", invID, "on.", orderNumber)
    let itemsNoData = {
        "id": 1,
        "curr_no": parseInt(orderNumber)+1,
        "last_item": parseInt(lastItem) + itemsList.length,
        "last_inv": invID 
    }
  
    // Update Order Number
    PUTorderNumber(orderNumberURL, apiKey, itemsNoData)
    // Create Items to The Restaurant App
    POSTitemsToKitchen(itemsURL, apiKey, itemsList)
    // Back to Home
    $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(1)").click()
    }
    }, 500)
    })
  }

// Register Event Listeners
function EventListeners(){
  // Listen to Invoice Submission
  window.addEventListener("message", (event)=>{
    if(event.data) invID = event.data.event_data.invoice_id
      },false)
    

      
  // Listen to Adding New Extra
  $(".orders-list, #pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td").click(function(e){
    const $this = $(e.target)
// console.log($this)
    if($this.hasClass("extra-btn") || $this.hasClass("fa-plus")){
      // console.log("yes item Extra gooo...")
          // logic goes here....
          extraLogic()
          currentItem = AccessCurrentItem($this)
    }
    if($this.tagName == "IMG" ||$this.hasClass("product-name")){
      setTimeout(()=>{
        // console.log("yes prod to g yaaaaaaa..")

         
        },200)
    }
  })


  
//   payBtn.click(function(e){
//     e.preventDefault()
//     const itemsList = $(".order-item")
//     // Passing Inv. Data to Custom Field
//     $(".pay.btn-success").click(invoiceObj)
//     const invNumberInterval = setInterval(() => {
//     if(!invID){
//     console.log("inv is null")
//     }else{
//     clearInterval(invNumberInterval)
//     console.log("InvID: ", invID, "on.", orderNumber)
//     let itemsNoData = {
//         "id": 1,
//         "curr_no": parseInt(orderNumber)+1,
//         "last_item": parseInt(lastItem) + itemsList.length,
//         "last_inv": invID 
//     }
  
//     // Update Order Number
//     PUTorderNumber(orderNumberURL, apiKey, itemsNoData)
//     // Create Items to The Restaurant App
//     POSTitemsToKitchen(itemsURL, apiKey, itemsList)
//     // Back to Home
//     $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(1)").click()
//     }
//     }, 500)
//     })
}

// onReset or onHome
function onHomeOrReset(){
  const homeBtn =  $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(1)")
  const clearBtn =  $("#pos-wrapper > div.pos-content > app-invoice > div > div.products-sheet > div > div > div > div > a.user-action.del-order.btn.btn-danger")
  // onHome clicking home btn
  homeBtn.click(()=>{
    $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > div > span.product").click(()=>{
      addCategoryName()
    })
  })
  // onReset reseting the current invoice
  clearBtn.click(()=>{
    // homeBtn.trigger("click")
    setTimeout(()=>{
    console.log("cleared")
    $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > div > span.product").click(()=>{
        addCategoryName()
      })
    },400)
     })

}

function goToExtras(){
  //click home button
  $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(1)").click()
  const extraInterval = setInterval(()=>{
    const extraCard = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > div").find(`span.product[data-category= '${extrasCategoryId}']`)
    if(extraCard){
    extraCard.click()
    clearInterval(extraInterval)
  }
  setTimeout(()=>{
 
    $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > app-products > div > span:nth-child(4)").click(()=>{$(".notes-container").toggleClass("toggle-input")})
    addCategoryName()

    $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > app-products > div > span.product-pic").one("click", function(e){
      const $this = $(this)
      addNewExtra($this)
    })
  
  },200)

  },200)
}
  
// All About Extras
function extraLogic(){
  goToExtras()
    removeExtra()
    notesHandling()
}



function addNewExtra($this){
  $this.click(function(){
    console.log("extra clicked")
  const selectedExtraPrice = $this.find("app-product > div.Product-meta > span.price-tag").text()
  const selectedExtraID = $this.data("product")
  const selectedExtraName = $this.find("app-product > div.product-name> p").text().trim()
  // Add Data Attrs to Current Item
  const oldExtras = currentItem.attr("data-extras") && JSON.parse(currentItem.attr("data-extras"))
  console.log("old extras:", oldExtras)
  const newExtras = oldExtras ? [...oldExtras, {name: selectedExtraName, id: selectedExtraID, qty: 1, price: selectedExtraPrice}] : [{name: selectedExtraName, id: selectedExtraID, qty: 1, price: selectedExtraPrice}]
  console.log("new extras:", newExtras)
  currentItem.attr("data-extras", JSON.stringify(newExtras))
  

  extrasQtyCalc(newExtras)
   
  })

}


function extrasQtyCalc(newExtras){


  // Extras Calcs
  const uniqueExtras = [...new Set(newExtras.map(extra => extra.name))];
  const allExtras = {}
  uniqueExtras.map((ex,_)=> {
    allExtras[ex] = newExtras.filter((extra,_)=> extra.name == ex).length
  })
currentItem.attr("data-allextras", JSON.stringify(allExtras))
// DOM manipulation 
// Add Extra Chip to Current Item
currentItem.find("ul > li:not(.meta-info)").remove() 
currentItem.find(".meta-list").append("<li></li>")
Object.entries(allExtras).map((ex)=>{
  const newChip = `<div class="extra-chip" data-name="${ex[0]}" data-qty="${ex[1]}">
    <b><span class="extra-chip-content">${ex[0]}</span></b>
    <b><span class="extra-chip-qty">${ex[1]}</span></b>
    <span class="extra-chip-close-btn">&times;</span>
  </div>`
  
  currentItem.find(".meta-list > li:last-child").append(newChip)
  extraRemove()
  extraDecrease()
})

}


function extraDecrease(){

  $(".extra-chip").click(function(e){
    e.stopPropagation()
    const extraChip = $(e.target)
    const $thisChipName = extraChip.attr("data-name")

    // const thisExtraQty = extraChip.attr("data-qty")
    // const newExtraQty = thisExtraQty-1
    // extraChip.closest(".extra-chip").attr("data-qty", newExtraQty)

    const currentExtras = currentItem.attr("data-extras") && JSON.parse(currentItem.attr("data-extras"))
    const a = currentExtras.filter((ex,_)=>ex.name != $thisChipName)
    const b = currentExtras.filter((ex,_)=>ex.name == $thisChipName).slice(0,-1)
    const filteredExtras = [...a, ...b]
    console.log(a, b, filteredExtras)
    currentItem.attr("data-extras", JSON.stringify(filteredExtras))
    extrasQtyCalc(filteredExtras)
  })


}

function extraRemove(){

  $(".extra-chip-close-btn").click(function(e){
    const closeBtn = $(e.target)
    const $thisChipName = closeBtn.closest(".extra-chip").attr("data-name")
    closeBtn.closest(".extra-chip").remove()
    const currentExtras = currentItem.attr("data-extras") && JSON.parse(currentItem.attr("data-extras"))
    const filteredExtras = currentExtras.filter((ex,_)=>ex.name != $thisChipName)
    currentItem.attr("data-extras", JSON.stringify(filteredExtras))
    extrasQtyCalc(filteredExtras)
  })

}

function removeExtra(){
$(".extra-chip-close-btn").click(function(e){
  const $thisExtra = e.target
  const $thisExtraQty = $thisExtra.data("qty")
  const $thisExtraName = $thisExtra.data("name")
  if($thisExtraQty > 0)$thisExtra.closest(".extra-chip").remove()
  if($thisExtraQty > 0){
    const newQty = +$thisExtraQty--
    $thisExtra.closest(".extra-chip-qty").text(newQty)
    $thisExtra.attr("data-qty", $thisExtraQty--)

    // Update the allextra data attr on the Current Item
    const oldExtras = JSON.parse(currentItem.data("extras"))
    const $thisSimilars = oldExtras.filter((x,_)=>x["name"] == $thisExtraName)
    currentItem.attr("data-extras", JSON.stringify([...oldExtras.filter((x,_)=>x["name"] != $thisExtraName), ...$thisSimilars.pop()]))

    // Update the allextra data attr on the Current Item
    const oldAllExtras = JSON.parse(currentItem.data("allextras"))
    currentItem.attr("data-allextras", JSON.stringify({...oldAllExtras, $thisExtraName: newQty}))

  }

}) 

}


// onLoad DOM
let domInterval = setInterval(()=>{
  payBtn = $("#paymentSubmitBtn")
  
  if(payBtn){
    clearInterval(domInterval)
    // If user resets POS or goes HOME
    onHomeOrReset()
    //calling functions
    prepPOS()
    onCheckout(payBtn)
    EventListeners()
    FetchExtrasIDs(extrasURL, apiKey)
    GETorderNumber(orderNumberURL, apiKey)
    CreateNotesField()

  }
  
  },1000)
  























// $(".extra-btn").off("toggle");

//$(".extras-close").click(()=>$(".extras-container").css({transform: "translateX(-110%) translateY(-50%)"}))
// $(".extra-btn").click(function () {
// const homeBtn = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(1)")
// homeBtn.click()

// const extraInterval = setInterval(()=>{
// const extraCard = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > div").find("span.product[data-category= '14']")
// if(extraCard){
// extraCard.click()
// $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > app-products > div > span:nth-child(4)").click(()=>{$(".notes-container").toggleClass("toggle-input")})
// clearInterval(extraInterval)
// addNotes()
// addExtra()
// }
// },500)


//$(".extras-container").css({transform: "translateX(0%) translateY(-50%)"});
// const $thisItem = $(this).closest("li")
// currentItem = $thisItem
// //console.log(currentItem.find(`.extra-div`) != null)
// //currentItem.find(`.extra-div`) != null && currentItem.find("ul.meta-list").after(`<div class='extra-div'></div>`)
// //console.log(currentItem)
// currentExtras = $thisItem.data("extraids") || []
// currentExtras = $thisItem.data("extranames") || []
// //console.log(currentItem)
// });

// })
// }

// function addExtra(){

// // const allProds = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > app-products > div > span.product-pic")
// //console.log(allProds)

// // When clicking on Extra Items
// allProds.click(function(){
// const selectedExtraPrice = $(this).find("app-product > div.Product-meta > span.price-tag").text()
// const selectedExtraID = $(this).data("product")
// const selectedExtraName = $(this).find("app-product > div.product-name> p").text().trim()

// //adding extra category to the item on the list
// // let currentCat = $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol > li:nth-child(2) > a").text()
// // const lastItem = $("#pos-wrapper > div.pos-content > app-invoice > div > div.products-sheet > div > div > div > app-invoice-items > ul > li.order-item:last-child")
// // l!astItem.attr( "data-cat") && lastItem.attr( "data-cat", currentCat)

// //currentExtras = currentItem.data("extraids") || []
// //currentExtrasNames = currentItem.data("extranames") || [] 
// extraNames =currentItem.data("extranames") || {}
// extras = currentItem.data("extras") || []
// console.log("just added", extraNames, extras)
// // Add Extra IDs
// //currentExtras.push(selectedExtraID)
// //const extrasSet = [...new Set(currentExtras)]
// //currentItem.attr("data-extraids", JSON.stringify(extrasSet))

// // Add Extra Names
// //currentExtrasNames.push(selectedExtraName)
// extraNames[selectedExtraName] =  {name: selectedExtraName, id: selectedExtraID, qty: "" || 1, price: selectedExtraPrice}
// extras.push({name: selectedExtraName, id: selectedExtraID, qty: "" || 1, price: selectedExtraPrice})

// //const extrasSetNames = [...new Set(currentExtrasNames)]
// currentItem.attr("data-extranames", JSON.stringify(extraNames))
// currentItem.attr("data-extras", JSON.stringify(extras))

// //currentItem.closest(".extra-div").html(JSON.stringify(Object.keys(extraNames)))
// currentItem.find("ul > li:not(.meta-info)").remove() 

// //currentItem.find(".meta-list > li.meta-info").after(`<li><b>${JSON.stringify(Object.keys(extraNames))}</b></li>`)
// //currentItem.find(".meta-list > li.meta-info").after(`<li><b>${JSON.stringify(Object.keys(extraNames))}<br/> +Notes: ${currentItem.attr("data-notes") || //"No Notes"}</b></li>`)

// })
// }





// Object.values(extraNames).map((ex,_)=> {
// const {name, id, price, qty} = ex
// const newChip = `<div class="extra-chip" data-id=${id} data-qty=${qty} data-price=${price}>
//   <b><span class="extra-chip-content">${name}</span></b>
//   <span class="extra-chip-close-btn">&times;</span>
// </div>`

// currentItem.find(".meta-list > li:last-child").append(newChip)
// $(".extra-chip-close-btn").click(function(e){removeExtra(ex);e.target.closest(".extra-chip").remove()})
// })
 


//console.log(extraNames, currentItem.data("extranames"), extraNames[selectedExtraName])
// })






// }


// function removeExtra(e){
// console.log(extra)
// if(extraCount < 1) extraCount--

// //currentExtras  = JSON.parse(currentItem.attr("data-extraids"))
// extraNames = JSON.parse(currentItem.attr("data-extranames"))
// //const itemNotes = currentItem.attr("data-notes")

// console.log(extraNames)
// delete extraNames[extra.name]

// console.log("after", extraNames)

// currentItem.attr("data-extranames", JSON.stringify(extraNames))
// currentItem.attr("data-extras", JSON.stringify(extras))
// $(this).parent().remove()

// }


// function FetchExtras(extrasURL, apiKey){
// $("body").append(extrasContainer)
// $("body").append(notesContainer)
// $.ajax({
//    url: extrasURL, 
//     method: "GET",
//     headers: {apikey: apiKey}
// })
// .done(data => {
// //console.log(data.data)
// const allExtras = data.data.map(ex => {
// const newExtra = `
//  <li class="extra-item" style="cursor:pointer;margin-bottom:1px;padding:4px;background:#bbc5cd;color:#171616;" data-prod=${ex.id} data-name=${ex.item.name}>
//     <div>${ex.item.name}</div>
//     <div>${ex.item.product_code}</div>
//     <div>${ex.item.description}</div>
//   </li>
// `
// $(".extras-list").append(newExtra)
// $(".extra-item").off("toggle")
// $(".extra-item").toggle(
// function(){
// $(this).css({background: "#11a683"});
// currentExtras = currentItem.data("extraids") || []

// //=========

// const extraSelected = $(this).closest("li").data("prod")
// //console.log($(this).closest("li"), extraSelected, currentExtras)
// currentExtras.push(extraSelected)
// const extrasSet = [...new Set(currentExtras)]
// currentItem.attr("data-extraids", JSON.stringify(extrasSet))

// currentExtrasNames = currentItem.data("extranames") || [] 
// const extraSelectedName = $(this).closest("li").data("name")
// //console.log(extraSelectedName)
// currentExtrasNames.push(extraSelectedName)
// const extrasSetNames = [...new Set(currentExtrasNames)]
// currentItem.attr("data-extranames", JSON.stringify(extrasSetNames))

// },
// function(){
// $(this).css({background: "#bbc5cd"});
// currentExtras = currentItem.data("extraids") || [] 
// const extraSelected = $(this).closest("li").data("prod")

// //console.log($(this).closest("li"), extraSelected, currentExtras)
// let extrasSet = new Set(currentExtras)
// //console.log(extrasSet)
// extrasSet.delete(extraSelected)

// currentItem.attr("data-extraids", JSON.stringify([...extrasSet]))
// }

// )
// })

// })
// }
// // console.log("that btn", $(".pay.btn-success"))








// $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-top > td > div > app-breadcrumb > ol.breadcrumb ").click(()=>{
//   $("#pos-wrapper > div.pos-content > div > table > tbody > tr.table-cont > td > app-categories > div > span.product").click(()=>addCategory())
  
//   })
  
