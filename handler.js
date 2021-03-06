'use strict';

const fetch = require('node-fetch');

async function fetchEvent(event, context, callback) {

    let body = JSON.parse(event.body);
    const month = body.month;
    const day = body.day;
    
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

     let item = null;    
    // Fetch result
     try {
         /* code */            
        let apiResult = await fetch(api);
        let json = await apiResult.json();
        let data = null;
        switch (type) {
            case 1:
                // get events
            data = await json.events;
                break;
            case 2:
            // get Births
                data = await json.births;
                break;
            case 3:
                // get deaths
                data = await json.deaths;
                break;
        
            default:
                // return events
                data = await json.events;
                break;
        }
        // get random item from the result:
         item = await data[Math.floor(Math.random()*data.length)];

	 return callback(null,  {
	     statusCode: 200,			     
	     headers: {
		 'Access-Control-Allow-Origin': '*',
		 'Access-Control-Allow-Credentials': true,
	     },	 
	     body: JSON.stringify({
		 event : item,
		 type : type
	     })    
	 });
    
    } catch (e) {
	console.log(e);
        return callback(null,  {
	     statusCode: 200,			     
	     headers: {
		 'Access-Control-Allow-Origin': '*',
		 'Access-Control-Allow-Credentials': true,
	     },	 
	    body: JSON.stringify({
		success: false,
		day: day,
		month: month,
		 event : null,
		 type : type
	     })    
	});
    }     
   
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
	 headers: {
	     'Access-Control-Allow-Origin': '*',
	     'Access-Control-Allow-Credentials': true,
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

	 headers: {
	     'Access-Control-Allow-Origin': '*',
	     'Access-Control-Allow-Credentials': true,
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
