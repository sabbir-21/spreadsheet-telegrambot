var token = "BOT_TOKEN";
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "WEBAPP_URL";

function setWebhook() {
var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
var response = UrlFetchApp.fetch(url);
}
function sendMessage(id, text,keyboard){
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(id),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyboard)
    }
  };
  UrlFetchApp.fetch(telegramUrl + '/',data);
      //old version
      /* var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text="+ text;
      var response = UrlFetchApp.fetch(url); */
}
function doPost(e){
  var contents = JSON.parse(e.postData.contents);
  //ssid of spreadsheet
  var ssId = "SPREADSHEET_SSID";
  var sheet = SpreadsheetApp.openById(ssId).getSheetByName("Sheet1");
  if(contents.callback_query){
    var id = contents.callback_query.from.id;
    var data = contents.callback_query.data;
    if(data == "budget"){
      var budget = sheet.getDataRange().getCell(1, 2).getValue();
      return sendMessage(id, "Your budget is " + budget + "$");
    }else if(data == "expense"){
      var expense = sheet.getDataRange().getCell(2, 2).getValue();
      return sendMessage(id, "Your expense is " + expense + "$");
    }else if(data == "savings"){
      var savings = sheet.getDataRange().getCell(3, 2).getValue();
      return sendMessage(id, "Your savings is " + savings + "$");
    }else if(data == "view"){
      return sendMessage(id, "SPREADSHEET_LINK");
    }

  }else if(contents.message){
    var id = contents.message.from.id;
    var text = contents.message.text;
    //keyboard
      var keyboard = {
        "inline_keyboard": [
          [{
            "text" : "Budget",
            "callback_data" : "budget"
          }],
          [{
            "text" : "Expense",
            "callback_data" : "expense"
          }],
          [{
            "text" : "Savings",
            "callback_data" : "savings"
          }]
        ]
      }; //end keyboard
      if(text == "/start"){
        var firstname = contents.message.from.first_name;
        var lastname = contents.message.from.last_name;
        return sendMessage(id, "Hi, " + firstname + " " + lastname + " This is the google spreadsheet bot to track your expense");
    }else if(text == "/view"){
        //keyboard
      var viewkey = {
        "inline_keyboard": [
          [{
            "text" : "View",
            "callback_data" : "view"
          }]
        ]
      }; //end keyboard
        return sendMessage(id, "This is stored in a spreadsheet",viewkey);
    }else if(text.indexOf("-") !== -1){
      var dateNow = new Date;
      var item = text.split("-");
      var user = contents.message.from.username;
      sheet.appendRow([dateNow,item[0],item[1]]);
      return sendMessage(id, "New product added by @"+ user,keyboard);
    }else{
      return sendMessage(id, "Wrong format! to add data, type as 'item-price'");
    }
  } 
}