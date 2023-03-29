const phoneScreen = window.matchMedia('(max-width: 576px)');
const btnStart = document.querySelector(".btn-start");
const warning =  document.querySelector(".warningLocationUser");
const btnConfirmLocation =  document.querySelector(".confirmLocation");
const btnDeniedLocation = document.querySelector(".deniedLocation");

const navBar = document.querySelector(".header");
const Loader = document.querySelector(".containerLoad")
const InitScreen = document.querySelector(".init")
const weatherComponent = document.querySelector(".weatherComponent")
const cityComponent = document.querySelector(".cityComponent")
const mapComponent = document.querySelector(".mapComponent")
const settingsComponent = document.querySelector(".settingsComponent")

var latitude, longitude;
var nameCityData, AirUmidityData, temperatureData, 
    thermalSensationData, windSpeedData, climate, visibilityData;

var forecastHours = {
    sixAm : "",
    nineAm: "",
    twelveAm:"",
    threePm:"",
    sixPm:"",
    ninePm:""
};
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
var descricaoClimaPt = {
    "clear sky": "céu limpo",            
    "few clouds": "poucas nuvens",     
    "scattered clouds": "nuvens dispersas",  
    "broken clouds": "nuvens quebradas",  
    "overcast clouds": "céu nublado",  
    "light rain": "chuva leve",  
    "moderate rain": "chuva moderada",  
    "heavy intensity rain": "chuva forte",  
    "very heavy rain": "chuva muito forte",  
    "extreme rain": "chuva extrema",  
    "thunderstorm": "tempestade",  
    "snow": "neve",  
    "mix snow/rain": "chuva com neve",  
    "mist": "névoa",  
    "haze": "neblina",  
    "smoke": "fumaça",  
    "dust": "poeira",  
    "sand": "areia",  
    "volcanic ash": "cinzas vulcânicas", 
    "squalls": "rajadas de vento",  
    "tornado": "tornado",  
};
/* ------------------------------- work flow ------------------------------- */
const containerTabs = document.querySelector(".header");
let childnodeListTabs = Array.from(containerTabs.childNodes).filter(card => card.tagName === "DIV");

//Faz a troca de tabs
childnodeListTabs.forEach((tab)=>{

    tab.addEventListener('click', ()=>{
        let currentTab = checkCurrentTab();
        let showheader = true;
        let newTab;

        childnodeListTabs.forEach((i)=>{i.classList.remove("active")})
        tab.classList.add("active")
        newTab = tab.classList[1] 

        toggleTab(currentTab,newTab,showheader)
    })
    
})

/* ------------------------------------------------------------------------------- */

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
        toggleTab('InitScreen','weather',true);
        
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
    
    switch (currentTab) {
        case 'InitScreen':
            currentTab = InitScreen;
            break;
        case 'weather':
            currentTab = weatherComponent;
            break;
        case 'cities':
            currentTab = cityComponent;
            break;
        case 'map':
            currentTab = mapComponent;
            break;
        case 'settings':
            currentTab = settingsComponent;
            break;
        default:
            break;
    }

    switch (newTab) {
        case 'InitScreen':
            newTab = InitScreen;
            break;
        case 'weather':
            newTab = weatherComponent;
            break;
        case 'cities':
            newTab = cityComponent;
            break;
        case 'map':
            newTab = mapComponent;
            break;
        case 'settings':
            newTab = settingsComponent;
            break;
        default:
            break;
    }
    
    currentTab.style.display="none"
    Loader.style.display="flex"

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
function checkCurrentTab(){
    let elemento,arrayOfClass;

    childnodeListTabs.forEach((el)=>{
        if(el.classList.contains("active")){
            arrayOfClass =  Array.from(el.classList)
        }
    })
    
    switch (arrayOfClass[1]) {
        case 'weather':
        elemento = 'weather'
        break;
        case 'cities':
        elemento = 'cities'
        break;
        case 'map':
        elemento = 'map'
        break;
        case 'settings':
        elemento = 'settings'
        break;
        default:
        break;
    }
      

    return elemento 
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
        let dataWork = resposta.list;
        
        
        dataWork.forEach((item) => {
          const date = new Date(item.dt_txt);
          const day = date.getDate();
          
          if (!dailyAverages[day]) {
            dailyAverages[day] = [];
          }
          
          dailyAverages[day].push(item);
        });

        let maioresQueHoje = []
        let menoresQueHoje = []
        let dadosDoDiaAtual = []
        let dailyAveragesOrg = []
        let dataDeHoje = new Date().getDate();
        
        for(let index = 0;index < 6; index++){

            if(Object.entries(dailyAverages)[index][0] > dataDeHoje ){
                maioresQueHoje.push(Object.entries(dailyAverages)[index])
            }
            if(Object.entries(dailyAverages)[index][0] < dataDeHoje ){
                menoresQueHoje.push(Object.entries(dailyAverages)[index])
            }
            if(Object.entries(dailyAverages)[index][0] == dataDeHoje ){
                dadosDoDiaAtual.push(Object.entries(dailyAverages)[index])
            }
        } 

        dadosDoDiaAtual.forEach(item =>{ dailyAveragesOrg.push(item)})
        maioresQueHoje.forEach(item =>{ dailyAveragesOrg.push(item)})
        menoresQueHoje.forEach(item =>{ dailyAveragesOrg.push(item)})
        

        return dailyAveragesOrg

    }

    function separateHoursFormTheList(){
        let hoursInDay = {};
        let day1 = [];
        let day2 = [];
        let day3 = [];
        let day4 = [];
        let day5 = [];
        let day6 = [];
        
        let dataWork = separateDaysFromTheList();

        dataWork[0][1].forEach((hoursList)=>{
            const data = new Date(hoursList.dt_txt);

            const hours  = {
                tempo: hoursList.weather[0].description,
                horario: data.getHours().toString().padStart(2, "0")
            };

            day1.push(hours)
        })
        dataWork[1][1].forEach((hoursList)=>{
            const data = new Date(hoursList.dt_txt);

            const hours  = {
                tempo: hoursList.weather[0].description,
                horario: data.getHours().toString().padStart(2, "0")
            };

            day2.push(hours)
        })
        dataWork[2][1].forEach((hoursList)=>{
            const data = new Date(hoursList.dt_txt);

            const hours  = {
                tempo: hoursList.weather[0].description,
                horario: data.getHours().toString().padStart(2, "0")
            };

            day3.push(hours)
        })
        dataWork[3][1].forEach((hoursList)=>{
            const data = new Date(hoursList.dt_txt);

            const hours  = {
                tempo: hoursList.weather[0].description,
                horario: data.getHours().toString().padStart(2, "0")
            };

            day4.push(hours)
        })
        dataWork[4][1].forEach((hoursList)=>{
            const data = new Date(hoursList.dt_txt);

            const hours  = {
                tempo: hoursList.weather[0].description,
                horario: data.getHours().toString().padStart(2, "0")
            };

            day5.push(hours)
        })
        dataWork[5][1].forEach((hoursList)=>{
            const data = new Date(hoursList.dt_txt);

            const hours  = {
                tempo: hoursList.weather[0].description,
                horario: data.getHours().toString().padStart(2, "0")
            };

            day6.push(hours)
        })
        
        
        hoursInDay["Dia_1"] = day1;
        hoursInDay["Dia_2"] = day2;
        hoursInDay["Dia_3"] = day3;
        hoursInDay["Dia_4"] = day4;
        hoursInDay["Dia_5"] = day5;
        hoursInDay["Dia_6"] = day6;


       return hoursInDay


    }

    return change5DaysForecastInDisplay(separateHoursFormTheList(), separateDaysFromTheList())
    
}
async function change5DaysForecastInDisplay(clima,array){

    await array;
    

    dataFirstDay = clima['Dia_1'];
    dataSecoundDay = clima['Dia_2'];
    dataThirdDay = clima['Dia_3'];
    dataFourtDay = clima['Dia_4'];
    dataFifthtDay = clima['Dia_5'];

    dateFirstDday = Object.keys(array)[0].toString()
    dateSecoundDday = Object.keys(array)[1].toString()
    dateThirdDday = Object.keys(array)[2].toString()
    dateFourthDday = Object.keys(array)[3].toString()
    dateFifthtDday = Object.keys(array)[4].toString()

    
    Object.keys(dataFirstDay).forEach((item)=>{

     //pegar as informações de cada horario e clima
        
    });



    createCards(clima)

}
async function createCards(i){

    await i 

    let day1_html = document.querySelector(".day1");
    let day2_html = document.querySelector(".day2");
    let day3_html = document.querySelector(".day3");
    let day4_html = document.querySelector(".day4");
    let day5_html = document.querySelector(".day5");

    const cardShape = `
    <div class="dia">
        Hoje
    </div>

    <div class="clima">
        <img src="./assets/img/risco de chuva.png" alt="Tempestade">
        <span>Tempestade</span>
    </div>

    <div class="data">
    01/02
    </div>
    `;

    function removeCardsStaticMode(){
        let cards = document.querySelectorAll(".hours")

        cards.forEach((card)=>{
            card.remove()
        })

        
    }
      
    async function Day1(){

        numberOfCardsFirstDay = i['Dia_1'].length;
        for (let counter = 0; counter < numberOfCardsFirstDay; counter++) {
            const hoursDiv = document.createElement("div");

            hoursDiv.className = "hours";
            hoursDiv.innerHTML = cardShape;
            day1_html.appendChild(hoursDiv);

        }
    }
    async function Day2(){

        numberOfCardsSecoundDay = i['Dia_2'].length;
        for (let counter = 0; counter < numberOfCardsSecoundDay; counter++) {
            const hoursDiv = document.createElement("div");

            hoursDiv.className = "hours";
            hoursDiv.innerHTML = cardShape;
            day2_html.appendChild(hoursDiv);

        }
    }
    async function Day3(){

        numberOfCardsThirdtDay = i['Dia_3'].length;
        for (let counter = 0; counter < numberOfCardsThirdtDay; counter++) {
            const hoursDiv = document.createElement("div");

            hoursDiv.className = "hours";
            hoursDiv.innerHTML = cardShape;
            day3_html.appendChild(hoursDiv);

        }
    }
    async function Day4(){

        numberOfCardsFourthDay = i['Dia_4'].length;
        for (let counter = 0; counter < numberOfCardsFourthDay; counter++) {
            const hoursDiv = document.createElement("div");

            hoursDiv.className = "hours";
            hoursDiv.innerHTML = cardShape;
            day4_html.appendChild(hoursDiv);

        }
    }
    async function Day5(){

        numberOfCardsFifthtDay = i['Dia_5'].length;
        for (let counter = 0; counter < numberOfCardsFifthtDay; counter++) {
            const hoursDiv = document.createElement("div");

            hoursDiv.className = "hours";
            hoursDiv.innerHTML = cardShape;
            day5_html.appendChild(hoursDiv);

        }
    }

    //revisar
    function addActiveClassInTheFirstCard(){
        let days = document.querySelectorAll(".days")

        days.forEach((dia)=>{
            dia.children[0].classList.add("active")
        })
    }

    removeCardsStaticMode()
    Day1()
    Day2()
    Day3()
    Day4()
    Day5() 
    addActiveClassInTheFirstCard()

    isrtDataInCards(i)

}
async function isrtDataInCards(data){

    let nodeListDay1 = document.querySelectorAll(".day1 .hours");
    let nodeListDay2 = document.querySelectorAll(".day2 .hours");
    let nodeListDay3 = document.querySelectorAll(".day3 .hours");
    let nodeListDay4 = document.querySelectorAll(".day4 .hours");
    let nodeListDay5 = document.querySelectorAll(".day5 .hours");

    insertDay(data['Dia_1'],nodeListDay1);
    insertDay(data['Dia_2'],nodeListDay2,1);
    insertDay(data['Dia_3'],nodeListDay3,2);
    insertDay(data['Dia_4'],nodeListDay4,3);
    insertDay(data['Dia_5'],nodeListDay5,4);

    function insertDay(dia,cardList,weekday){ 

        let dataDay = dia;
        let nodeListDay = cardList;
        
        function getDay(i) {
            if(i == undefined){i = 0}
            const dataAtual = new Date();
            const diaDaSemana = dataAtual.getDay();
            const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
            const proximoDia = diasDaSemana[(diaDaSemana + i) % 7];
        
            return proximoDia;
        }
        function getTextAndImgClima(valor){
            let climaText;
            
            for(const chave in descricaoClima) {
                if(chave == valor){
                    for(const chavePt in descricaoClimaPt){
                        if(chavePt == chave){
                            climaText = descricaoClimaPt[chavePt]
                        }
                    }
                }
            }

            return climaText
        }
        function getImgClima(valor){
            let imgClima

            for (const chave in descricaoClima) {
                if (chave == valor) {
                    imgClima = descricaoClima[chave]
                }
            }

            return imgClima
        }
        for(let index = 0; index < dataDay.length; index++ ){
            
            let childnodeListDay = Array.from(nodeListDay[index].childNodes).filter(card => card.tagName === "DIV");

            //dia da previsão
            let diaDaSemanaIsrt = getDay(weekday);
            let diaDaSemanaDiv = childnodeListDay[0];

            //horario do clima 
            let horarioDiv  = childnodeListDay[2];
            let horarioIsrt = dataDay[index].horario;

            //tipo de clima
            let climaTextIsrt = getTextAndImgClima(dataDay[index].tempo);
            let climaTextDiv = childnodeListDay[1].children[1];

            //ilustração do tipo de clima
            let climaImgIsrt = getImgClima(dataDay[index].tempo);
            let climaImgDiv = childnodeListDay[1].children[0];

            
            diaDaSemanaDiv.innerText = diaDaSemanaIsrt;
            climaImgDiv.src = climaImgIsrt;
            climaTextDiv.innerText = climaTextIsrt;
            horarioDiv.innerText = `${horarioIsrt}h`;
            
            
        }
    
    }
    
    animationCards()
}
function animationCards(){

    let day1 = document.querySelector(".day1"); 
    let day2 = document.querySelector(".day2"); 
    let day3 = document.querySelector(".day3"); 
    let day4 = document.querySelector(".day4"); 
    let day5 = document.querySelector(".day5"); 

    function animation(el){  
        let cards = Array.from(el.children).filter(card => card.tagName === "DIV");
        cards.forEach(( index)=>{

            index = 0;

            setInterval(() => {

            index++;
            cards[index -1].classList.remove('active');  

            if (index === cards.length) {
                index = 0;
            }

            cards[index].classList.add('active');

            }, 9000);

        })
    }

    animation(day1)
    animation(day2)
    animation(day3)
    animation(day4)
    animation(day5)
    
}
   

  


//resvisar a inserção de class active







