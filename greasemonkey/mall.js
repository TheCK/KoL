// ==UserScript==
// @name        Ck's Mall Price Script
// @namespace   org.ck,kol
// @include     http://www.kingdomofloathing.com/inventory.php*
// @include     http://www.kingdomofloathing.com/closet.php*
// @version     1.1
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// ==/UserScript==

var tinyTexts = [];
var ids = [];
var sum = 0;

function setPrice(searchTerm, price)
{
    priceNode = document.createTextNode(price);
    tinyTexts[searchTerm].appendChild(priceNode);
}

function deletePrices()
{
    keys = GM_listValues();
    for (i = 0, key = null; key = keys[i]; ++i)
    {
        GM_deleteValue(key);
    }
}

if (window.location.pathname == "/inventory.php" || window.location.pathname == "/closet.php")
{
    inventoryItems = document.getElementsByClassName("item");
    for (invIndex in inventoryItems)
    {

        if (!isNaN(invIndex))
        {
            invItem = inventoryItems[invIndex];
            id = invItem.id.slice(2);

            pr = GM_getValue(id, false);

            bs = invItem.querySelectorAll("[class=ircm]");
            search = bs[0].firstChild.nodeValue;
            tinyTexts[search] = bs[0].parentNode.childNodes[3];
            ids[search] = id;

            if (pr === false)
            {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://www.kingdomofloathing.com/mall.php?pudnuggler=" + encodeURIComponent("\"" + search + "\""),
                    onload: function(response)
                    {
                        doc = document.implementation.createHTMLDocument('');
                        doc.documentElement.innerHTML = response.responseText;

                        searchTerm = doc.getElementById("pudnuggler").getAttribute("value");

                        priceTags = doc.getElementById("searchresults").querySelectorAll("[class='small price']");

                        which = 4;
                        while (typeof priceTags[which] == "undefined" && which > 0)
                        {
                            --which;
                        }
                        
                        if (typeof priceTags[which] != "undefined")
                        {

                            price = priceTags[which].firstChild.innerHTML.replace("&nbsp;", " ");
                            price += " (" + (which+1) + ".)"

                            if (which != 0 && typeof priceTags[0] != "undefined")
                            {
                                price += " / " + priceTags[0].firstChild.innerHTML.replace("&nbsp;", " ") + " (1.)";
                            }

                            GM_setValue(ids[searchTerm.slice(1, -1)], price) ;
                            setPrice(searchTerm.slice(1, -1), price);
                        }
                        else
                        {
                            GM_setValue(ids[searchTerm.slice(1, -1)], "untradable");
                            setPrice(searchTerm.slice(1, -1), "untradable");
                        }
                    }
                });
            }
            else
            {
                times = 1;

                if (bs[0].parentNode.childNodes[2].hasChildNodes())
                {
                   times = parseInt(bs[0].parentNode.childNodes[2].childNodes[0].nodeValue.replace( /\D/g, ''));
                }

                val = GM_getValue(id, false);
                priceLine = val.match( /[\d,]+/g, '');

                if (priceLine != null)
                {
                    intValue = parseInt(priceLine[0].replace( /\D/g, ''));

                    if(!isNaN(intValue))
                    {
                       sum += times * intValue;
                    }
                }

                setPrice(search, GM_getValue(id, false));
            }
        }
    }
}

if (window.location.pathname == "/inventory.php" || window.location.pathname == "/closet.php")
{
    center = document.getElementsByTagName('center')[0].childNodes[1].firstChild.childNodes[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;

    open = document.createTextNode("  [");
    center.appendChild(open);

    a = document.createElement('a');
    linkText = document.createTextNode("refresh mall prices");
    a.appendChild(linkText);
    a.href = "#";
    a.addEventListener('click', deletePrices, false);

    center.appendChild(a);

    close = document.createTextNode("]");
    center.appendChild(close);
    
    sumnode = document.createTextNode("  " + sum);
    center.appendChild(sumnode);
}
