const phoneScreen = window.matchMedia('(max-width: 576px)');
const btnStart = document.querySelector(".btn-start");
const warning =  document.querySelector(".warningLocationUser");
const btnConfirmLocation =  document.querySelector(".confirmLocation");
const btnDeniedLocation = document.querySelector(".deniedLocation");
var latitude, longitude;
var cityData, changeRainData, temperatureData, thermalSensationData, windSpeedData, indexUvData;
var forecastHours ={
    sixAm : "",
    nineAm: "",
    twelveAm:"",
    threePm:"",
    sixPm:"",
    ninePm:""
} 

//---------------------------- Commponents ----------------------
const navBar = document.querySelector(".header");
const Loader = document.querySelector(".containerLoad")
const InitScreen = document.querySelector(".init")
const weatherComponent = document.querySelector(".weatherComponent")




var weather = navBar.children[1].children[1],
    cities = navBar.children[2].children[1],
    map = navBar.children[3].children[1],
    settings =navBar.children[4].children[1];

var clima = {
    riscoDeChuva: `<img src="./assets/img/risco de chuva.png" alt="Tempestade">`,
    ensolarado :`<img src="./assets/img/sun2.png" alt="Ensolarado"> `,
    nublado: ` <img src="./assets/img/nublado.png" alt="Nublado">`,
    chuvoso: `<img src="./assets/img/chuva.png" alt="Chuvoso">`,
    tempestade: `<img src="./assets/img/tempestade.png" alt="Tempestade">`,
    nebulado : `<img src="./assets/img/nebulado.png" alt="Nebuloso">`,
} 


btnConfirmLocation.addEventListener('click', checkPermission)
btnStart.addEventListener('click', showWarning)
btnDeniedLocation.addEventListener('click', ()=>{
    toggleTab(InitScreen,weatherComponent,true)


})
phoneScreen.addEventListener('change', event => {
    function removeTextBtnNav(){
        if(event.matches){
            weather.innerText ="";
            cities.innerText ="";
            map.innerText ="";
            settings.innerText ="";
        }else{
            weather.innerText ="Weather";
            cities.innerText ="Cities";
            map.innerText ="Map";
            settings.innerText ="Settings";
        }

    }

    function removeTextBtnStart(){
        if (event.matches) {
            btnStart.innerText = " "
        } else {
            btnStart.innerText = "Iniciar"
        }
    }
    removeTextBtnStart()
    removeTextBtnNav()
});


function checkPermission() {
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    // o acesso à localização foi concedido

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        warning.style.display="none";
        toggleTab(InitScreen,weatherComponent,true);
        
        makeRequisitionCity()
        makeRequisitionForecast()
        

       
        
    }, function(error) {
        // o acesso à localização foi negado ou houve um erro

            if (error.code === 1) {

                let textBoxWarning = warning.childNodes[1].children[0];
                
                textBoxWarning.innerText = "Conceda o acesso a sua localização para uma melhor experiência"
                setTimeout(()=>{ btnDeniedLocation.style.display="flex"; },5000)
                setTimeout(()=>{ btnDeniedLocation.style.opacity= 0.7; },5200)

            } else if (error.code === 2) {

                console.log("Não foi possível obter a localização.");

            }
        });

    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
function toggleTab(currentTab,newTab,showheader){

    currentTab.style.opacity=0
    Loader.style.opacity=1
    showheader = false;

    if(newTab == weatherComponent){
        showheader = true
    }
    



    
        Loader.style.opacity=0;
        newTab.style.opacity=1;
        
        if(showheader == true){
            warning.style.opacity=0 
            navBar.style.opacity=1
        }
   
        

    
}
function showWarning() {

    warning.style.display= "flex";

}
function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        });
    } else {
      
    }



}
function start() {

    Loader.style.display= "none"
    InitScreen.style.display= "flex"
}
async function makeRequisitionCity(){
    
    const dados = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
    let resposta = await dados.json()
    let city = resposta.address.city;
    
    makeRequisitionWeather(city)

}
async function makeRequisitionWeather(city) {

    let Apikey = "5182a2574871dbd140787ce3dc109c97";

    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&mode=json&appid=${Apikey}`)
    
    let resposta = await data.json();

    dataProcessingWeather(resposta);
    

}
function dataProcessingWeather(data){
    
    cityData = data.name;
    changeRainData
    temperatureData = parseInt(data.main.temp)
    thermalSensationData = parseInt(data.main.feels_like);
    windSpeedData = data.wind.speed;
    indexUvData

    
}
async function  makeRequisitionForecast(){

    let Apikey = "5182a2574871dbd140787ce3dc109c97";
    const data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${Apikey}&lang=pt_br`)
    let resposta = await data.json();

    
    dataProcessingForecast(resposta)
    
}






/* Problemas com promisse  */
async function dataProcessingForecast(resposta) {

    const dados = await resposta;

    
      
    forecastHours.sixAm = dados.list[1].weather[0].description;
    forecastHours.nineAm = dados.list[2].weather[0].description;
    forecastHours.twelveAm = dados.list[3].weather[0].description;
    forecastHours.threePm = dados.list[4].weather[0].description;
    forecastHours.sixPm = dados.list[5].weather[0].description;
    forecastHours.ninePm = dados.list[6].weather[0].description;

    console.log(forecastHours)

    const descricaoClima = {

        "céu claro": ` ./assets/img/ensolarado.png`,
        "poucas nuvens": ` ./assets/img/ensolarado.png`,
        "nuvens esparsas": ` ./assets/img/nuvens-esparças.png`,
        "nuvens quebradas": ` ./assets/img/nublado.png`,
        "nuvens nubladas": ` ./assets/img/parcialmente-nublado-.png`,
        "chuva leve": ` ./assets/img/chuva-leve-1.png`,
        "chuva moderada": ` ./assets/img/chuva-leve-2.png`,
        "chuva forte": ` ./assets/img/chuva-pesada-3.png`,
        "chuva muito forte": ` ./assets/img/chuva-intensa-4.png`,
        "chuva extrema": `  ./assets/img/chuva-torrencial-5.png`,
        "tempestade": ` ./assets/img/storm.png`,
        "neve": `  ./assets/img/neve.png`,
        "neve misturada com chuva": ` ./assets/img/chuva-com-neve.png`,
        "névoa": ` ./assets/img/nevoa.png`,
        "névoa densa": ` ./assets/img/nevoa.png`,
        "fumaça": ` ./assets/img/fumaça.png`,
        "névoa seca":  ` ./assets/img/nevoa.png`,
        "poeira": ` ./assets/img/poeira.png`,
        "areia": ` ./assets/img/sand.png`,
        "cinzas vulcânicas": ` ./assets/img/cinzas-vulcão.png`,
        "rajadas de vento": `  ./assets/img/clima-ventoso.png`,
        "tornado": ` ./assets/img/tornado.png`
    };
    
    
    for (const chave in forecastHours) {
        for (const descricao in descricaoClima) {
            if (forecastHours[chave] === descricao) {
                forecastHours[chave] = descricaoClima[descricao];
                break;
            }
        }
    }

    console.log(forecastHours)
   /*  test(forecastHours) */
    
}

/* async function test(arg){
    await dataProcessingForecast();
    
    let sixAm = document.querySelector(".imgSixAm");
    let nineAm = document.querySelector(".imgNineAm");
    let twelveAm = document.querySelector(".imgTwelveAm");
    let imgThreePm = document.querySelector(".imgThreePm");
    let imgSixPm = document.querySelector(".imgSixPm");
    let imgNinePm = document.querySelector(".imgNinePm")
    
    sixAm.src = forecastHours.sixAm;
} */






/*
const descricaoClima = {
    "céu claro": `<img class="icon-pre-rain" src="./assets/img/ensolarado.png" alt="ensolarado">`,
    "poucas nuvens": `<img class="icon-pre-rain" src="./assets/img/ensolarado.png" alt="ensolarado">`,
    "nuvens esparsas": `<img class="icon-pre-rain" src="./assets/img/nuvens-esparças.png" alt="nuvens esparsas">`,
    "nuvens quebradas": `<img class="icon-pre-rain" src="./assets/img/nublado.png" alt="nublado">`,
    "nuvens nubladas": `<img class="icon-pre-rain" src="./assets/img/parcialmente-nublado-.png" alt="nublado">`,
    "chuva leve": `<img class="icon-pre-rain" src="./assets/img/chuva-leve-1.png" alt="chuva-leve">`,
    "chuva moderada": `<img class="icon-pre-rain" src="./assets/img/chuva-leve-2.png" alt="chuva-moderada">`,
    "chuva forte": `<img class="icon-pre-rain" src="./assets/img/chuva-pesada-3.png" alt="chuva-forte">`,
    "chuva muito forte": `<img class="icon-pre-rain" src="./assets/img/chuva-intensa-4.png" alt="chuva-muito-forte">`,
    "chuva extrema": ` <img class="icon-pre-rain" src="./assets/img/chuva-torrencial-5.png" alt="chuva-extrema">`,
    "tempestade": `<img class="icon-pre-rain" src="./assets/img/storm.png" alt="tempestade">`,
    "neve": ` <img class="icon-pre-rain" src="./assets/img/neve.png" alt="neve">`,
    "neve misturada com chuva": `<img class="icon-pre-rain" src="./assets/img/chuva-com-neve.png" alt="chuva com neve">`,
    "névoa": `<img class="icon-pre-rain" src="./assets/img/nevoa.png" alt="nevoa">`,
    "névoa densa": `<img class="icon-pre-rain" src="./assets/img/nevoa.png" alt="nevoa">`,
    "fumaça": `<img class="icon-pre-rain" src="./assets/img/fumaça.png" alt="fumaca">`,
    "névoa seca":  `<img class="icon-pre-rain" src="./assets/img/nevoa.png" alt="nevoa">`,
    "poeira": `<img class="icon-pre-rain" src="./assets/img/poeira.png" alt="poeira">`,
    "areia": `<img class="icon-pre-rain" src="./assets/img/sand.png" alt="areia">`,
    "cinzas vulcânicas": `<img class="icon-pre-rain" src="./assets/img/cinzas-vulcão.png" alt="cinzas">`,
    "rajadas de vento": ` <img class="icon-pre-rain" src="./assets/img/clima-ventoso.png" alt="vento">`,
    "tornado": `<img class="icon-pre-rain" src="./assets/img/tornado.png" alt="tornado">`
}; */


/* const descricaoClima = {
    "céu claro": ` ./assets/img/ensolarado.png`,
    "poucas nuvens": ` ./assets/img/ensolarado.png`,
    "nuvens esparsas": ` ./assets/img/nuvens-esparças.png`,
    "nuvens quebradas": ` ./assets/img/nublado.png`,
    "nuvens nubladas": ` ./assets/img/parcialmente-nublado-.png`,
    "chuva leve": ` ./assets/img/chuva-leve-1.png`,
    "chuva moderada": ` ./assets/img/chuva-leve-2.png`,
    "chuva forte": ` ./assets/img/chuva-pesada-3.png`,
    "chuva muito forte": ` ./assets/img/chuva-intensa-4.png`,
    "chuva extrema": `  ./assets/img/chuva-torrencial-5.png`,
    "tempestade": ` ./assets/img/storm.png`,
    "neve": `  ./assets/img/neve.png`,
    "neve misturada com chuva": ` ./assets/img/chuva-com-neve.png`,
    "névoa": ` ./assets/img/nevoa.png`,
    "névoa densa": ` ./assets/img/nevoa.png`,
    "fumaça": ` ./assets/img/fumaça.png`,
    "névoa seca":  ` ./assets/img/nevoa.png`,
    "poeira": ` ./assets/img/poeira.png`,
    "areia": ` ./assets/img/sand.png`,
    "cinzas vulcânicas": ` ./assets/img/cinzas-vulcão.png`,
    "rajadas de vento": `  ./assets/img/clima-ventoso.png`,
    "tornado": ` ./assets/img/tornado.png`
}; */