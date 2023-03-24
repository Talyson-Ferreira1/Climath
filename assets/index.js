const phoneScreen = window.matchMedia('(max-width: 576px)');
const btnStart = document.querySelector(".btn-start");
const warning =  document.querySelector(".warningLocationUser");
const btnConfirmLocation =  document.querySelector(".confirmLocation");
const btnDeniedLocation = document.querySelector(".deniedLocation");
var latitude, longitude;
var nameCityData, AirUmidityData, temperatureData, thermalSensationData, windSpeedData, climate, visibilityData;
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

var clickEvent = new Event('click');
    
InitScreen.dispatchEvent(clickEvent);



var weather = navBar.children[1].children[1],
    cities = navBar.children[2].children[1],
    map = navBar.children[3].children[1],
    settings =navBar.children[4].children[1];

var descricaoClima = {
    
    "clear sky":            `./assets/img/ensolarado.png`,
    "few clouds":           `./assets/img/ensolarado.png`,
    "scattered clouds":     `./assets/img/nuvens-esparças.png`, 
    "broken clouds":        `./assets/img/parcialmente-nublado.png`,
    "overcast clouds":      `./assets/img/parcialmente-nublado-.png`,
    "light rain":           `./assets/img/chuva-leve-1.png`,
    "moderate rain":        `./assets/img/chuva-leve-2.png`,
    "heavy intensity rain": `./assets/img/chuva-pesada-3.png`,
    "very heavy rain":      `./assets/img/chuva-intensa-4.png`,
    "extreme rain":         `./assets/img/chuva-torrencial-5.png`,
    "thunderstorm":         `./assets/img/storm.png`,
    "snow":                 `./assets/img/neve.png`,
    "mix snow/rain":        `./assets/img/chuva-com-neve.png`,
    "mist":                 `./assets/img/nevoa.png`,
    "haze":                 `./assets/img/fumaça.png`,
    "smoke":                `./assets/img/nevoa.png`,
    "dust":                 `./assets/img/poeira.png`,
    "sand":                 `./assets/img/sand.png`,
    "volcanic ash":         `./assets/img/cinzas-vulcão.png`,
    "squalls":              `./assets/img/clima-ventoso.png`,
    "tornado":              `./assets/img/tornado.png`

};


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

function start() {

    Loader.style.display= "none"
    InitScreen.style.display= "flex"
}
function checkPermission() {
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    // confirm

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        warning.style.display="none";
        toggleTab(InitScreen,weatherComponent,true);
        
        makeRequisitionCity()
        makeRequisitionForecast()
        
    }, function(error) {
        // denied

            if (error.code === 1) {

                let textBoxWarning = warning.childNodes[1].children[0];
                
                textBoxWarning.innerText = "Conceda o acesso a sua localização para uma melhor experiência"
                setTimeout(()=>{ btnDeniedLocation.style.display="flex"; },5000)
                setTimeout(()=>{ btnDeniedLocation.style.opacity= 0.7; },5200)

            } else if (error.code === 2) {

                alert("Não foi possível obter sua localização, visualiza no modo estático");

            }
        });

    } else {
        alert("Seu navegador não suporta geolocalização.");
    }
}
function showWarning() {

    warning.style.display= "flex";

}
function toggleTab(currentTab,newTab,showheader){

    currentTab.style.display="none"
    Loader.style.display="flex"
    showheader = false;

    newTab == weatherComponent?showheader = true:showheader = false

    setTimeout(()=>{
        Loader.style.display="none";
        newTab.style.display="grid";
        
        if(showheader == true){
            warning.style.display="none" 
            navBar.style.display="flex"
        }
    },500)
   
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


    nameCityData = data.name;
    temperatureData = parseInt(data.main.temp)
    climate = data.weather[0].description

    thermalSensationData = parseInt(data.main.feels_like);
    windSpeedData = data.wind.speed;
    AirUmidityData = data.main.humidity;
    visibilityData = data.visibility;

    async function changeValuesDisplay(){
        
        await data

        let visibility = document.querySelector(".Visibilidade");
        let AirUmidity = document.querySelector(".Umidade");
        let windSpeed = document.querySelector(".velocidade-vento");
        let thermalSensation = document.querySelector(".sensacao-termica");
    
        let nameCity = document.querySelector(".cityName");
        let climateCity = document.querySelector(".climateCity");
        let temperature = document.querySelector(".graus");
    
        visibility.innerHTML = visibilityData;
        AirUmidity.innerHTML = `${AirUmidityData}°`;
        windSpeed.innerHTML = windSpeedData;
        thermalSensation.innerHTML =`${thermalSensationData}°`;

        nameCity.innerHTML = nameCityData;
        climateCity.innerHTML = climate;
        temperature.innerHTML = `${temperatureData}°`;
    }

    changeValuesDisplay()
 
}
async function  makeRequisitionForecast(){

    let Apikey = "5182a2574871dbd140787ce3dc109c97";
    const data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${Apikey}`)
    let resposta = await data.json();

    
    dataProcessingForecast(resposta)
    dataProcessing5DaysForecast(resposta)
    
}
async function dataProcessingForecast(resposta){

    const dados = await resposta;

    forecastHours.sixAm = dados.list[1].weather[0].description;
    forecastHours.nineAm = dados.list[2].weather[0].description;
    forecastHours.twelveAm = dados.list[3].weather[0].description;
    forecastHours.threePm = dados.list[4].weather[0].description;
    forecastHours.sixPm = dados.list[5].weather[0].description;
    forecastHours.ninePm = dados.list[6].weather[0].description;

    
    for (const chave in forecastHours) {
        for (const descricao in descricaoClima) {
            if (forecastHours[chave] === descricao) {
                forecastHours[chave] = descricaoClima[descricao];
                break;
            }
        }
    }
    async function changeForecastDisplay(){
        
        await resposta

        let imgSixAm = document.querySelector(".imgSixAm");
        let imgNineAm = document.querySelector(".imgNineAm");
        let imgTwelveAm = document.querySelector(".imgTwelveAm");
        let imgThreePm = document.querySelector(".imgThreePm");
        let imgSixPm = document.querySelector(".imgSixPm");
        let imgNinePm = document.querySelector(".imgNinePm");

        imgSixAm.src = forecastHours.sixAm;
        imgNineAm.src = forecastHours.nineAm;
        imgTwelveAm.src = forecastHours.twelveAm;
        imgThreePm.src = forecastHours.threePm;
        imgSixPm.src = forecastHours.sixPm;
        imgNinePm.src = forecastHours.ninePm;

    }

    changeForecastDisplay()
   
}
async function dataProcessing5DaysForecast(resposta) {

    await resposta;
  
    function separateDaysFromTheList(){

        const dailyAverages = {};
    
        dias = {
        dia1: { index1: 0, index2: 5 },
        dia2: { index1: 6, index2: 13 },
        dia3: { index1: 14, index2: 21 },
        dia4: { index1: 22, index2: 29 },
        dia5: { index1: 30, index2: 37 },
        };
    
        Object.keys(dias).forEach((el) => {
        let i = dias[el].index1;
        let j = dias[el].index2;
    
        let index = 0;
    
        for (let chave in resposta.list) {
            if (index >= i && index < j) {
            const dayData = resposta.list[chave];
            const date = dayData.dt_txt.split(" ")[0];
            const minTemp = dayData.main.temp_min;
            const maxTemp = dayData.main.temp_max;
            const dailyAverage = (minTemp + maxTemp) / 2;
    
            if (!dailyAverages[el]) {
                dailyAverages[el] = [];
            }
    
            let dia = { date, dailyAverage };
    
            dailyAverages[el].push(dia);
            }
    
            index++;
        }
        });

        return dailyAverages

    }

    function createDailyAverage() {

        const dailyAverages = separateDaysFromTheList();
        const dailyAverageObj = {};

        Object.keys(dailyAverages).forEach((el) => {
            let sum = 0;

            dailyAverages[el].forEach((day) => {
                sum += day.dailyAverage;
            });

            const avg = sum / dailyAverages[el].length;

            dailyAverageObj[el] = {
                date: dailyAverages[el][0].date,
                average: avg.toFixed(2),
            };
        });

        return dailyAverageObj;
    }
    
    changeForecastFiveDays(createDailyAverage()) 
}

async function changeForecastFiveDays(resposta){

    await resposta

    const parentElementCards = document.querySelector(".containerHours")

    function removeList(){
        const hoursList = document.querySelectorAll('.hours');

        hoursList.forEach(hour => {
        hour.remove();
        });

    }


    function ConvertValues(){
        
        //converte para dias da semana       
        obj = resposta
        var weekdays = {};
        const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        
        for (let chave in obj) {
            const data = new Date(obj[chave].date);
            const diaDaSemana = daysOfWeek[data.getDay()];
            
            weekdays[chave] = diaDaSemana;
        }
        console.log(weekdays)
        
        //converte  para dois digitos
        var dataForm = {};

        Object.keys(resposta).forEach((el) =>  {
          const data = new Date(resposta[el].date);
          const dia = data.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
          dataForm[el] = dia;
        });
        console.log(dataForm)


        let card1 = `<div class="hours ">
    
                            <div class="dia">
                                ${weekdays.dia1}
                            </div>
    
                            <div class="clima">
                                <img src="./assets/img/risco de chuva.png" alt="Tempestade">
                                <span>Tempestade</span>
                            </div>
                            
                            <div class="data">
                                ${dataForm.dia1}
                            </div>
    
                        </div>` 








        parentElementCards.innerHTML = card1

    }
   
    ConvertValues()

    removeList()
   
}
