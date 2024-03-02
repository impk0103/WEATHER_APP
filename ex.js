

const API_KEY="292bf0ee725ac14937d969c6a3cfe6fd";
async function showWeather(){

    try{
        let city="patna";
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        console.log("weather data:->",data);
        renderInfo(data);
    }
    catch(e){
        console.log("Error Found",e);
    }
}

function renderInfo(data){
    let newPara= document.createElement('p');
    newPara.textContent=`${data?.main?.temp.toFixed(2)} °C `;
    document.body.appendChild(newPara); 
}


async function getCustomWeatherDetail()
{
    try{
        let lat=25.5941;
        let long=85.1376;
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        console.log("weather data:->",data);
        renderInfo(data);
    }
    catch(e){
        console.log("Error Found",e);
    }
}


function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No geolocation support");
    }
}


function showPosition(position){
    let lat=position.coords.latitude;
    let lon=position.coords.longitude;

    console.log(lat);
    console.log(lon);
}