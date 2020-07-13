fetch("https://disease.sh/v3/covid-19/all")
	.then((response) => response.json())
	.then((data) => {
		worldData(
			separateComma(String(data.cases)),
			separateComma(String(data.active)),
			separateComma(String(data.deaths)),
			separateComma(String(data.recovered))
		);
	});

fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=all")
	.then((response) => response.json())
	.then((data) => {
		let fetchedData = [];
		let date = [];
		let cases = [];
		let deaths = [];
		let recovered = [];

		fetchedData = data.cases;
		for (let [keys, value] of Object.entries(fetchedData)) {
			date.push(`${keys} GMT`);
			cases.push(value);
		}
		fetchedData = data.deaths;
		for (let [keys, value] of Object.entries(fetchedData)) {
			deaths.push(value);
		}

		fetchedData = data.recovered;
		for (let [keys, value] of Object.entries(fetchedData)) {
			recovered.push(value);
		}
		globalSituationChart(date, cases, deaths, recovered, "#chartContainer");
	});

const searchInput = document.querySelector(".searchbox");
const searchButton = document.querySelector(".searchbtn");

searchInput.addEventListener("keypress", (e) => {
	if (e.keyCode === 13) {
		let query = searchInput.value;
		if (query.trim() === "") {
			alert("Please enter a valid entry!");
		} else {
			searchCountry(query);
		}
	}
});

searchButton.addEventListener("click", () => {
	let query = searchInput.value;
	if (query.trim() === "") {
		alert("Please enter a valid entry!");
	} else {
		searchCountry(query);
	}
});

const searchCountry = (query) => {
	fetch(`https://disease.sh/v3/covid-19/historical/${query}?lastdays=all`)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				if (response.status === 404) {
					alert("Error 404: Country not found :(");
					console.log(response);
				} else {
					alert("Something went wrong :(");
					console.log(response);
				}
			}
		})
		.then((data) => {
			const countryEverything = document.querySelector(".country-everything");
			const countryName = document.querySelector(".country-name");
			const chartCountry = document.querySelector(".chart-country");
			let fetchedData = [];
			let date = [];
			let cases = [];
			let deaths = [];
			let recovered = [];
			fetchedData = data.timeline.cases;
			for (let [keys, value] of Object.entries(fetchedData)) {
				date.push(`${keys} GMT`);
				cases.push(value);
			}
			fetchedData = data.timeline.deaths;
			for (let [keys, value] of Object.entries(fetchedData)) {
				deaths.push(value);
			}

			fetchedData = data.timeline.recovered;
			for (let [keys, value] of Object.entries(fetchedData)) {
				recovered.push(value);
			}
			fetch(
				`https://disease.sh/v3/covid-19/countries/${query}?yesterday=false&strict=true`
			)
				.then((response) => response.json())
				.then((data) => {
					const countryFlag = document.querySelector(".country-flag");
					const countryDeaths = document.querySelector(".country-deaths");
					const countryCases = document.querySelector(".country-cases");
					const countryRecovered = document.querySelector(".country-recovered");
					const newCases = document.querySelector(".new-cases");
					const newDeaths = document.querySelector(".new-deaths");
					const newRecovered = document.querySelector(".new-recovered");
					newCases.innerHTML = `+` + separateComma(String(data.todayCases));
					newDeaths.innerHTML = `+` + separateComma(String(data.todayDeaths));
					newRecovered.innerHTML =
						`+` + separateComma(String(data.todayRecovered));
					countryDeaths.innerHTML = separateComma(String(data.deaths));
					countryCases.innerHTML = separateComma(String(data.cases));
					countryRecovered.innerHTML = separateComma(String(data.recovered));
					countryFlag.src = data.countryInfo.flag;
				});
			countryEverything.style.display = "block";
			chartCountry.innerHTML = "";
			globalSituationChart(date, cases, deaths, recovered, ".chart-country");

			countryName.innerHTML = query;
		});
};

const separateComma = (value) => {
	let iterator = 0;
	let arrValue = [...value];
	let arrNew = [];
	for (let i = arrValue.length - 1; i >= 0; i--) {
		if (iterator == 3) {
			arrNew.unshift(",");
			iterator = 1;
		} else {
			iterator += 1;
		}
		arrNew.unshift(arrValue[i]);
	}
	return arrNew.join("");
};

const worldData = (cases, active, deaths, recovered, selector) => {
	const casesP = document.querySelector(".number-cases");
	const activeP = document.querySelector(".number-active");
	const deathsP = document.querySelector(".number-deaths");
	const recoveredP = document.querySelector(".number-recovered");

	casesP.innerHTML = cases;
	activeP.innerHTML = active;
	deathsP.innerHTML = deaths;
	recoveredP.innerHTML = recovered;
};

const globalSituationChart = (date, cases, deaths, recovered, selector) => {
	let options = {
		series: [
			{
				name: "Confirmed Cases",
				data: cases,
			},
			{
				name: "Deaths",
				data: deaths,
			},
			{
				name: "Recovered",
				data: recovered,
			},
		],
		chart: {
			height: 350,
			type: "area",
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: "smooth",
		},
		xaxis: {
			type: "datetime",
			categories: date,
		},
		tooltip: {
			x: {
				format: "MM/dd/yyyy",
			},
		},
	};

	var chart = new ApexCharts(document.querySelector(selector), options);
	chart.render();
};
