var roomID;
var currentUserID;
var currentName;

$(document).ready(function(){
	loadUserObjAndRoom();
	loadAllList();
	$("#addGroceryOptions").hide();
	$("#addTransactionOptions").hide();

	$("#addGroceryButton").click(function(){
		$("#addGroceryOptions").toggle();
	});
	$("#addTransactionButton").click(function(){
		$("#addTransactionOptions").toggle();
	});


});

function loadUserObjAndRoom(){
	let xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/get-user", true);
	xhttp.onreadystatechange = function () {
		let userObj = JSON.parse(this.responseText);
		currentUserID = userObj["userID"];
		currentName = userObj["fullName"];
		roomID = userObj["roomID"];
		console.log("Loaded with these param:", currentUserID, currentName, roomID);
	};
	//xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send();
}

function loadRoommatesForAddTransaction(){
	let transactionOpt = document.getElementById("addTransactionOptions");
	document.getElementById("roommateList").remove();
	document.getElementById("purchaserList").remove();
	let newList = document.createElement("span");
	newList.id = "roommateList";
	let newPurchaserList= document.createElement("span");
	newPurchaserList.id = "purchaserList";

	//Get roomates from servlet here
		let roommateList = [];
		roommateList.push({name:"name1", userID:"id1"});
		roommateList.push({name:"name2", userID:"id2"});
		roommateList.push({name:"name3", userID:"id3"});

	//Splitters
	let listnamesplit = document.createElement("textNode");
	listnamesplit.innerHTML = "Splitters: ";
	transactionOpt.appendChild(listnamesplit);
	roommateList.forEach(function(roommate){
		let name = document.createElement("textNode");
		name.innerHTML = roommate["name"];
		let checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = roommate["userID"];
		newList.appendChild(name);
		newList.appendChild(checkbox);
	});
	transactionOpt.appendChild(newList);

	//Purchaser
	let listnamebuy = document.createElement("textNode");
	listnamebuy.innerHTML = "Purchaser: ";
	transactionOpt.appendChild(listnamebuy);
	roommateList.forEach(function(roommate){
		let name = document.createElement("textNode");
		name.innerHTML = roommate["name"];
		let radio = document.createElement("input");
		radio.type = "radio";
		radio.value = roommate["userID"];
		newPurchaserList.appendChild(name);
		newPurchaserList.appendChild(radio);
	});
	transactionOpt.appendChild(newPurchaserList);


}


function loadAllList(){
	loadGroceryList();
	loadTransactionList();
	loadTabsTotalList();
	loadRoommatesForAddTransaction();
}
function loadGroceryList(){
	let xhttp = new XMLHttpRequest();
	xhttp.open("GET", "/GroceryList", true);
	xhttp.onreadystatechange = function () {
		let GroceryList = JSON.parse(this.responseText);
		let list = document.getElementById("groceryList");
		//Clear the list
		list.innerHTML = "";

		GroceryList.forEach(function(item) {

			let listItem = document.createElement("li");
			listItem.className = "mdl-list__item";
			listItem.id = item["itemName"]+item["roomID"];

			let itemNameSpan = document.createElement("span");
			itemNameSpan.className = "mdl-list__item-primary-content";
			itemNameSpan.innerHTML = item["itemName"];

			let checkboxSpan = document.createElement("span");
			checkboxSpan.className = "mdl-list__item-secondary-action";
			let checkboxLabel = document.createElement("label");
			checkboxLabel.className = "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect";
			let checkboxInput = document.createElement("input");
			checkboxInput.type = "checkbox";
			checkboxInput.className = "mdl-checkbox__input";
			checkboxInput.id = item["itemName"];
			checkboxInput.onclick = function(){
				deleteGroceryClick("5566", item["itemName"]);
			};
			checkboxLabel.appendChild(checkboxInput);
			checkboxSpan.appendChild(checkboxLabel)

			listItem.appendChild(itemNameSpan);
			listItem.appendChild(checkboxSpan);

			componentHandler.upgradeElement(listItem);
			list.appendChild(listItem);
			componentHandler.upgradeElement(list);
		});
		componentHandler.upgradeDom();
	};
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send();
}

function addGroceryClick(){
	let name = document.addGroceryOptions.itemNameInput.value;
	addGroceryPass(roomID, name, "Y");
	return false;
}

function addGroceryPass(roomid, itemname, addYN){
	let toPass = {};
	toPass["roomID"] = roomid;
	toPass["itemName"] = itemname;
	toPass["add"] = addYN;
	let param = toPass;
	$.ajax({
		type: "POST",
		url: "/GroceryList",
		data:JSON.stringify(param),
		success: function(status){
			loadAllList();
			console.log("Grocery Sent", param);
		},
		error:function(error){
			console.log("Error sending grocery item",error);
		}
	});
}

function deleteGroceryClick(roomID, itemName){
	deleteGroceryPass(roomID, itemName, "N");
}

function deleteGroceryPass(roomid, itemname, addYN){
	let toPass = {};
	toPass["roomID"] = roomid;
	toPass["itemName"] = itemname;
	toPass["add"] = addYN;
	//let param = JSON.stringify(toPass);
	let param = toPass;
	$.ajax({
		type: "POST",
		url: "/GroceryList",
		data:JSON.stringify(param),
		success: function(status){
			loadGroceryList();
			console.log("Grocery delete",status);
		},
		error:function(error){
			console.log("Error removing grocery item",error);
		}
	});
}

function loadTransactionList(){
	let xhttp = new XMLHttpRequest();
	xhttp.open("GET", "/TransactionList", true);
	xhttp.onreadystatechange = function () {
		let TransactionList = JSON.parse(this.responseText);
		let table = document.getElementById("transactionList");
		table.className = "mdl-data-table mdl-js-data-table mdl-shadow--2dp";
		table.innerHTML = "";

		let tHead = document.createElement("thead");
		let headrow = document.createElement("tr");
		let itemHead = document.createElement("th");
		itemHead.className = "mdl-data-table__cell--non-numeric";
		itemHead.innerHTML = "Product";
		let priceHead = document.createElement("th");
		priceHead.innerHTML = "Total price";
		let splitHead = document.createElement("th");
		splitHead.innerHTML = "Split";
		componentHandler.upgradeElement(itemHead);
		componentHandler.upgradeElement(priceHead);
		componentHandler.upgradeElement(splitHead);
		headrow.appendChild(itemHead);
		headrow.appendChild(priceHead);
		headrow.appendChild(splitHead);
		componentHandler.upgradeElement(headrow);
		tHead.appendChild(headrow);
		componentHandler.upgradeElement(tHead);
		table.appendChild(tHead);
		componentHandler.upgradeElement(table);

		/*let tBody = document.getElementById("transactionBody");
		tBody.innerHTML = "";*/
		let tBody = document.createElement("tbody");
		componentHandler.upgradeElement(tBody);
		table.appendChild(tBody);
		componentHandler.upgradeElement(table);

		TransactionList.forEach(function(item) {
			let row = document.createElement("tr");
			let tdItemName = document.createElement("td");
			tdItemName.className = "mdl-data-table__cell--non-numeric";
			tdItemName.innerHTML = item["item"];
			let tdAmount = document.createElement("td");
			let tdSplit = document.createElement("td");
			//TODO: get current userID and fullname here
			if(item["user1"] === currentName){
				tdAmount.innerHTML = item["amount"];
				tdSplit.innerHTML = item["user2"];
			} else {
				tdAmount.innerHTML = "-";
				tdAmount.innerHTML += item["amount"];
				tdSplit.innerHTML = item["user1"];
			}
			componentHandler.upgradeElement(tdItemName);
			componentHandler.upgradeElement(tdAmount);
			componentHandler.upgradeElement(tdSplit);
			row.appendChild(tdItemName);
			row.appendChild(tdAmount);
			row.appendChild(tdSplit);
			componentHandler.upgradeElement(row);
			tBody.appendChild(row);
			componentHandler.upgradeElement(tBody);
			componentHandler.upgradeElement(table);
		});
		componentHandler.upgradeDom();
	};
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send();
}

function addTransactionClick(){
	let itemname = document.addTransactionOptions.newTransactionItemName.value;
	let quantity = document.addTransactionOptions.newTransactionQuantity.value;
	let pricePerItem = document.addTransactionOptions.newTransactionPricePerItem.value;
	let splitters = [];
	let purchaser;
	let allInput = document.getElementById("addTransactionOptions").getElementsByTagName("input");
	for(let i = 0; i < allInput.length; i++){
		if(allInput[i].type == "checkbox" && allInput[i].checked == true){
			splitters.push(allInput[i].value);
		} else if (allInput[i].type == "radio" && allInput[i].checked == true){
			purchaser = allInput[i].value;
		}
	}
	addTransactionPass(roomID, itemname, quantity, pricePerItem, purchaser, splitters);
	return false;

}

function addTransactionPass(roomid, itemname, q, ppi, buy, split){
	//It is actually adding a TabsLedger
	//The servlet will take the tabs ledger and create independent transactions
	let toPass = {};
	toPass["roomID"] = roomid;
	toPass["itemName"] = itemname;
	toPass["quantity"] = q;
	toPass["pricePerItem"] = ppi;
	toPass["purchaser"] = buy;
	toPass["splitters"] = split;
	let param = toPass;
	console.log("Try to send", param);
	$.ajax({
		type: "POST",
		url: "/TransactionList",
		data:JSON.stringify(param),
		success: function(status){
			loadAllList();
			console.log("Transactions Sent",status);
		},
		error:function(error){
			console.log("Error Transactions",error);
		}
	});
}

function loadTabsTotalList(){
	let xhttp = new XMLHttpRequest();
	xhttp.open("GET", "/TabsTotalList", true);
	xhttp.onreadystatechange = function () {

		let tabsTotalList = JSON.parse(this.responseText);
		let list = document.getElementById("tabsList");
		list.innerHTML = "";

		tabsTotalList.forEach(function(item){
			//user1 is always current user
			//list.innerHTML += (item["user2"] + item["amount"]);
			let listItem = document.createElement("li");
			listItem.className = "mdl-list__item mdl-list__item--two-line";
			let span1 = document.createElement("span");
			span1.className = "mdl-list__item-primary-content";
			let i = document.createElement("i");
			i.className = "material-icons mdl-list__item-avatar";
			componentHandler.upgradeElement(i);
			let nameSpan = document.createElement("span");
			nameSpan.innerHTML = item["user2"];
			componentHandler.upgradeElement(nameSpan);
			let amountSpan = document.createElement("span");
			amountSpan.className = "mdl-list__item-sub-title";
			if(parseFloat(item["amount"]) < 0){
				let a = item["amount"];
				a *= -1;
				amountSpan.innerHTML = ( "-$" + a );
			} else {
				amountSpan.innerHTML = ("$" + item["amount"]);
			}

			componentHandler.upgradeElement(amountSpan);
			span1.appendChild(i);
			span1.appendChild(nameSpan);
			span1.appendChild(amountSpan);
			componentHandler.upgradeElement(span1);
			listItem.appendChild(span1);
			componentHandler.upgradeElement(listItem);
			list.appendChild(listItem);
		});
		componentHandler.upgradeElement(list);
		componentHandler.upgradeDom();
	};
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send();
}
