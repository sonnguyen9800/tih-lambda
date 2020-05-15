'use strict';

const fetch = require('node-fetch');

 async function fetchEvent(event) {
    // TODO implement    
    const month = new Date().getMonth();
    const day = new Date().getDay();    
    const type = Math.floor(Math.random()*3 + 1);
    let api = "";
    switch (type) {
        case 1:
            // code
            api = "https://byabbe.se/on-this-day/"+month+"/"+day+"/events.json";
            break;
        case 2:
            api = "https://byabbe.se/on-this-day/"+month+"/"+day+"/births.json";
            // code
            break;
        case 3:
            api = "https://byabbe.se/on-this-day/"+month+"/"+day+"/deaths.json";
            // code
            break;
        
        default:
            // code
            api = "https://byabbe.se/on-this-day/"+month+"/"+day+"/events.json";
            break;
    }

     var item = null;    
    // Fetch result
     try {
         /* code */            
        let apiResult = await fetch(api);
        let json = await apiResult.json();
        let data = null;
        switch (type) {
            case 1:
                // get events
            data = json.events;
                break;
            case 2:
            // get Births
                data = json.births;
                break;
            case 3:
                // get deaths
                data = json.deaths;
                break;
        
            default:
                // return events
                data = json.events;
                break;
        }
        // get random item from the result:
         item = data[Math.floor(Math.random()*data.length)];
    
    } catch (e) {
	console.log(e);
        item = null;
    }     
     const response = {
         statusCode: 200,
	 headers : {
	  //  "Access-Control-Allow-Credentials": true,
	    "Access-Control-Allow-Origin": "*",
	    "Content-Type": "application/json"
	},
         body: {
	     event : item,
	     type : type
	 }
     };    
    return response;
};


// Fetch wiki info
async function fetchWikiContent(event, context, callback) {
//    const req = event;
    // const item = {
    // 	"success" : true,
    // 	"sd" : event
    // };
    let item = JSON.parse(event.body);
    const title = encodeURI(item.title);
    const apiContent = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles="+ title +"&origin=*";

	
    let response = await fetch(apiContent);
    let data = await response.json();
    
    let content = data.query.pages;
    const index = Object.keys(content);
    
    const result = content[index].extract;

    return callback(null, {
	statusCode : 200,
	headers : {
	   // "Access-Control-Allow-Credentials": true,
	    "Access-Control-Allow-Origin": "*",
	    "Content-Type": "application/json"

	},
	body : JSON.stringify({	    
	    result : result
	})	
    });

    
}

async function fetchWikiImage(event, context, callback){
    let body = JSON.parse(event.body);
    const title = encodeURI(body.title);
    
    const apiImg = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles="+ title +"&pithumbsize=1000&format=json&origin=*";

    let response = await fetch(apiImg);
    let data = await response.json();
    
    let content = data.query.pages;
    const index = Object.keys(content);    
    const result = content[index];

    return callback(null, {
	statusCode : 200,
	headers : {
//	    "Access-Control-Allow-Credentials": true,
	    "Access-Control-Allow-Origin": "*",
	    "Content-Type": "application/json"

	},
	body : JSON.stringify({	    
	    imgSrc : result.thumbnail.source,
	    caption : result.pageimage
	})	
    });
 
    
}

module.exports = {
    fetchEvent : fetchEvent,
    fetchWikiContent : fetchWikiContent,
    fetchWikiImage : fetchWikiImage
};
