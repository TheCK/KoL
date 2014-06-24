// ==UserScript==
// @name        CKs Manuel Checker
// @namespace   org.ck
// @description Checks how many casually/thoroughly/exhaustively monsters you have for a certain letter
// @include     http://www.kingdomofloathing.com/questlog.php?which=6*
// @version     1
// @grant       none
// ==/UserScript==

NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;

var casualNumber = 0;
var thoroughNumber = 0;
var exhaustiveNumber = 0;

small = document.getElementsByTagName('small')[0];
links = small.getElementsByTagName('a');

table = document.getElementsByTagName('p')[1];
entries = table.getElementsByTagName('tbody');

entries.forEach(
    function(element, index, array) {
        list = element.getElementsByTagName('ul')[0];

        if (list.childNodes.length == 1) {
           casualNumber += 1;
            list.style.background = "orange";
        }
        if (list.childNodes.length == 2) {
           thoroughNumber += 1;
           list.style.background = "yellow";
        }
        if (list.childNodes.length == 3) {
           exhaustiveNumber += 1;
           list.style.background = "green";
        }
    }
);

casualNode = document.createElement("p");
casualNode.innerHTML = " casually researched in this selection: " + casualNumber;
small.insertBefore(casualNode, links[0].nextSibling);

thoroughNode = document.createElement("p");
thoroughNode.innerHTML = " thoroughly researched in this selection: " + thoroughNumber;
small.insertBefore(thoroughNode, links[1].nextSibling);

exhaustiveNode = document.createElement("p");
exhaustiveNode.innerHTML = " exhaustivly researched in this selection: " + exhaustiveNumber;
small.insertBefore(exhaustiveNode, links[2].nextSibling);
