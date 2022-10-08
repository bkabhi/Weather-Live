var api = "2c990bafe1385aad245206b17d4496ab";

    var unit = "metric";
    var tempMesure = "℃";
    var imperial = document.getElementById("imperial");
    imperial.addEventListener("click",function(){
        metric.classList.remove("rightNavbarLastDivSelectedbutton");
        imperial.setAttribute("class", "rightNavbarLastDivSelectedbutton")
        unit = "imperial"
        tempMesure = "℉";
        getWeather();
    })
    var metric = document.getElementById("metric")
    metric.addEventListener("click",function(){
        imperial.classList.remove("rightNavbarLastDivSelectedbutton");
        metric.setAttribute("class", "rightNavbarLastDivSelectedbutton")
        unit = "metric"
        tempMesure = "℃";
        getWeather();
    })


    async function getWeather() {
        var city = document.getElementById("city").value;
        try {
            var res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=${unit}`);
            var res2 = await res.json();
            console.log(res2, "res");
            console.log(res2.coord.lat, res2.coord.lon);
            showData(res2);
            showForcast(res2.coord.lat, res2.coord.lon)
        } catch (err) {
            var content = document.getElementById("content");
            // console.log(err, "err");
            content.innerHTML = `<h2 id="cityHeading">Wrong City Name Entered "${city}"</h2>`
        }
    }

    function getPos() {
        async function success(pos) {
            const crd = pos.coords;

            // console.log('Your current position is:');
            // console.log(`Latitude : ${crd.latitude}`);
            // console.log(`Longitude: ${crd.longitude}`);
            // console.log(`More or less ${crd.accuracy} meters.`);

            var resLoc = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=${api}&units=${unit}`)
            var resLoc2 = await resLoc.json();
            // console.log(resLoc2);
            showData(resLoc2);
        }
        navigator.geolocation.getCurrentPosition(success);
    }
    function showData(res2) {
        var content = document.getElementById("content");

        var dt = new Date(res2.dt*1000);
        
        console.log(dt.getMonth());
        var dayString = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        console.log(dt.getDay(), "dt");
        var sr = new Date(res2.sys.sunrise * 1000).toTimeString();
        var ss = new Date(res2.sys.sunset * 1000).toTimeString();

        content.innerHTML =
            `<div id="dt" >${dt}</div>
                <div id="cityHeading">${res2.name}, ${res2.sys.country}</div>
                <div id="iconTemp">
                    <img src="http://openweathermap.org/img/wn/${res2.weather[0].icon}@2x.png" alt="">
                    ${res2.main.temp}${tempMesure}
                </div>
                <div id="desc">Feels Like ${res2.main.feels_like}${tempMesure}. ${res2.weather[0].description}. ${res2.weather[0].main}</div>
                <div id="descContent">
                    <div id="temp">Max Temperature: ${res2.main.temp_max}${tempMesure}</div>
                    <div id="temp">Wind: ${res2.wind.speed}m/s, ${res2.wind.deg}</div>
                    <div id="humidity">Humidity: ${res2.main.humidity}%</div>
                    <div id="temp">Clounds: ${res2.clouds.all}%</div>
                    <div id="temp">Sunrise: ${sr}</div>
                    <div id="temp">Sunset: ${ss}</div>
                </div>`;

        var map = document.getElementById("gmap_canvas")
        map.setAttribute("class", "gmap_canvas");
        map.src = `https://maps.google.com/maps?q=${res2.name}&t=&z=8&ie=UTF8&iwloc=&output=embed`
    }


// forcast part

    function showForcast(lat, lon) {
        fetchforcastData();
        async function fetchforcastData(){
            var res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${api}&units=${unit}`)
            var res2 = await res.json();
            console.log(res2, "forcast");

            document.querySelector(".forcastdiv").setAttribute("id","forcastdiv")
            document.querySelector(".forcast").setAttribute("id","forcast")
            var forcast = document.getElementById("forcast");
            forcast.innerHTML = null
            var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            res2.daily.forEach(function(ele){
                var dt = new Date(ele.dt*1000)
                forcast.innerHTML+=
            `<div>
                <h2>${day[dt.getDay()]}</h2>
                <img src="http://openweathermap.org/img/wn/${ele.weather[0].icon}@2x.png" alt="">
                <h2>${ele.temp.max}°</h2>
                <h3>${ele.temp.min}°</h3>
            </div>`
            })
        }
    }