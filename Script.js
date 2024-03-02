const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather_container");
const grantAccessLocation=document.querySelector(".grant_locationcontainer");
const searchForm =document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".userinfo_container");
const wrap=document.querySelector('.wrapper');

const API_KEY="292bf0ee725ac14937d969c6a3cfe6fd";
let currentTab= userTab;
currentTab.classList.add("current_tab");
getfromSessionStorage();

function SwitchTab(clickedtab){

    if(clickedtab!==currentTab)
    {
        currentTab.classList.remove("current_tab");
        currentTab=clickedtab;
        currentTab.classList.add("current_tab");


        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessLocation.classList.remove("active");
            wrap.classList.add("bgactive");
            searchForm.classList.add("active");

        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchInput.value="";
            errImg.classList.remove("active")
            getfromSessionStorage();
        }
        
    }
    
}
userTab.addEventListener("click" ,() =>{
    SwitchTab(userTab);
});
searchTab.addEventListener("click" ,() =>{
    SwitchTab(searchTab);
});


function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        wrap.classList.remove("bgactive");
        grantAccessLocation.classList.add("active");
    }
    else{
        const coordinates =JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates)
{  
    const {lat,lon}=coordinates;
        grantAccessLocation.classList.remove("active");
        console.log(lat);
        console.log(lon);
        try{
        loadingScreen.classList.add("active");
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        wrap.classList.add("bgactive");
        renderInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        console.log("Error Found",e);
    }
}



function renderInfo(data){

    const cityName=document.querySelector(".data-cityName");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data_weather_Description]");
    const weatherIcon=document.querySelector("[data_weather_Icon]");
    const temp=document.querySelector("[data_weather_Temp]");
    const windSpeed=document.querySelector("[data-WindSpeed]");
    const humidity=document.querySelector("[data-Humidity]");
    const cloudiness=document.querySelector("[data-Cloud]");



    desc.innerText=data?.weather?.[0]?.description ;
    temp.innerText=`${data?.main?.temp.toFixed(2)} °C `;
    cityName.innerText=data?.name;
    windSpeed.innerText=`${data?.wind?.speed} m/s`;
    humidity.innerText=`${data?.main?.humidity} %`;
    cloudiness.innerText=`${data?.clouds?.all} %`;
    countryIcon.src=`http://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
    weatherIcon.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`

}


const grantAccessBtn=document.querySelector('[data-grantAccess]');
grantAccessBtn.addEventListener('click',() =>{
    getLocation();
})


function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No geolocation support");
    }
}


function showPosition(position)
{
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);   
}

const searchInput =document.querySelector("[data-SearchInput]")
searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName ==="") return;

    fetchSearchWeatherInfo(cityName)
})

const errImg =document.querySelector(".error_image");
async function fetchSearchWeatherInfo(city)
{   
    grantAccessLocation.classList.remove("active");
    errImg.classList.remove("active");
    userInfoContainer.classList.remove("active");
    try{
        loadingScreen.classList.add("active");
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        console.log(data);

        let errVal=data?.cod;
        console.log(errVal);
        if(errVal==="404")
        {
            console.log("enter");
            errImg.classList.add("active");
        }
        else
        {
            userInfoContainer.classList.add("active");
            renderInfo(data);
        }
        
    }
    catch(e){
        console.log(e);
    }
    
}