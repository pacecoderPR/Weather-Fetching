const userTab=document.querySelector("[data-userData]");
const searchTab=document.querySelector("[data-searchData]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".weather-full-container");

let currentTab=userTab;
const API_KEY="24732e83c4171f0ce867e3a7f6a50134";
currentTab.classList.add("current-tab");

getfromSessionStorage();
function switchTab(tabName){
    if(tabName===currentTab)return;
     let varz=currentTab;
    currentTab.classList.remove("current-tab");
    currentTab=tabName;
    currentTab.classList.add('current-tab');
    console.log("clicked",tabName);
    console.log("other", varz);
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
    }
}
userTab.addEventListener('click',()=>{
     switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});

function getfromSessionStorage(){
      const localCoordinates=sessionStorage.getItem("user-coordinates");
      if(!localCoordinates){
        grantAccessContainer.classList.add("active");
      }
      else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
      }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat , lon} =coordinates;
    //trying to show loading screen instead of grant interface
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");


    try{
        const res=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`

        );
        const data=await res.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
       loadingScreen.classList.remove("active");
    }
}


function renderWeatherInfo(weatherInfo){
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryFlg]");
    const description=document.querySelector("[data-weatherDescription]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temperature=document.querySelector("[data-temperature]");
    const humidity=document.querySelector("[data-humidity]");
    const windSpeed=document.querySelector("[data-windSpeed]");
    const cloud=document.querySelector("[data-cloud]");

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText=`${weatherInfo?.main?.temp} °C`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    cloud.innertText=`${weatherInfo?.clouds?.all} %`;



}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude

    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
function capturingCoordinates(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by your browser.");
    }
}

const grantAccessButton=document.querySelector("[data-grantAcess]");
grantAccessButton.addEventListener('click',capturingCoordinates);
let searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchInput.value==="")return;
    fetchSearchWeatherInfo(searchInput.value);


});


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");
    try{
        const response= await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        const data =await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.error(err);
    }
   
}