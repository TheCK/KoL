// ==UserScript==
// @name        CK's Display Case Highlighter
// @namespace   org.ck.kol
// @include     https://www.kingdomofloathing.com/inventory.php*
// @include     https://www.kingdomofloathing.com/managecollection.php
// @include     https://www.kingdomofloathing.com/fight.php
// @include     https://www.kingdomofloathing.com/closet.php*
// @include     https://www.kingdomofloathing.com/mall.php*
// @include     http://127.0.0.1:60080/inventory.php*
// @include     http://127.0.0.1:60080/managecollection.php
// @include     http://127.0.0.1:60080/fight.php
// @include     http://127.0.0.1:60080/closet.php*
// @include     http://127.0.0.1:60080/mall.php*
// @version     2
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// ==/UserScript==


if (window.location.pathname == "/managecollection.php")
{
    keys = GM_listValues();
    for (i=0, key=null; key=keys[i]; i++)
    {
        GM_deleteValue(key);
    }
    
    var selects = document.getElementsByName("whichitem1");
    
    if (typeof selects[1] != "undefined") 
    {
        var dcItems = selects[1].options;
        console.log(dcItems.length)
        
        for (dcItem in dcItems)
        {
            GM_setValue(dcItems[dcItem].value, true);
        }
    }
}

if (window.location.pathname == "/inventory.php" || window.location.pathname == "/closet.php")
{
    invItems = document.getElementsByClassName("item");
    for (invIndex in invItems) {
        if (!isNaN(invIndex))
        {
            var invItem = invItems[invIndex];
            var image = invItem.querySelector('.img').firstChild;

            image.style.border = "3px solid red";
            
            if(GM_getValue(invItem.id.slice(2), false))
            {
                image.style.border = "3px solid green";
            }
        }
    }
}

if (window.location.pathname == "/fight.php")
{
    invItems = document.getElementsByClassName("item");
    for (invIndex in invItems) {
        var newItem = invItems[invIndex];
        newItem.style.background = "red";
        
        var regEx = /id=(\d*)/g;
        var match = newItem.getAttribute("rel").match(regEx);
        if(GM_getValue(match[0].slice(3), false))
        {
            newItem.style.background = "green";
        }
    }
}

if (window.location.pathname == "/mall.php")
{
    mallTables = document.getElementsByClassName("itemtable");
    console.log(mallTables);
    for (mallTable in mallTables) {
        var newTable = mallTables[mallTable];
        newTable.style.background = "red";
        
        var match = newTable.childNodes[0].childNodes[0].getAttribute("id");
        console.log(match.slice(5));
        if(GM_getValue(match.slice(5), false))
        {
            newTable.style.background = "green";
        }
    }
}
