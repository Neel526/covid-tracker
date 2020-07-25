import React, {useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from "./Table"
import { sortData, prettyPrintStat } from "./util"
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = 
  useState({ lat: 20.5937, lng: 78.9629});
  const [mapZoom, setMapZoom] = useState(4);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
  const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then((response) => response.json())
    .then((data) => {
      const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2
        }));
        
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
    });
  }
  getCountriesData();
}, []);

  const onCountryChange = async (event) => {
    const countryCode= event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' 
    ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
   
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4);
    })
  };

  console.log("country Info<<<", countryInfo)

  return (   
    <div className="App">
      <div className="app_left">
    <div className="app_header">
    <h1> COVID-19 TRACKER</h1>
      <FormControl className="app_dropdown">
      <Select variant="outlined" onChange={onCountryChange} value={country}  >
        <MenuItem value="worldwide">Worldwide</MenuItem>
        {countries.map((country) => (
          <MenuItem value={country.value}>{country.name}</MenuItem>
        ))}
        </Select>
      </FormControl>

    </div>
 
  { /*infoBox*/ }
  { /*infoBox*/ }
  { /*infoBox*/ }

<div className="app_stats">
    <InfoBox
    isRed
    active={casesType === "cases"} 
    onClick= {e => setCasesType('cases')}
    title="coronavirus cases" 
    cases={prettyPrintStat(countryInfo.todayCases)} 
    total={prettyPrintStat(countryInfo.cases)}/>
    
    <InfoBox 
    isBlue
    active={casesType === "active"} 
    onClick= {e => setCasesType('active')}
    title="Active" 
    cases={prettyPrintStat(countryInfo.active)}  />
    
    <InfoBox 
    isGreen
    active={casesType === "recovered"} 
    onClick= {e => setCasesType('recovered')}
    title="Recovered" 
    cases={prettyPrintStat(countryInfo.todayRecovered)} 
    total={prettyPrintStat(countryInfo.recovered)} />

    <InfoBox 
    isGrey
    active={casesType === "deaths"} 
    onClick= {e => setCasesType('deaths')}
    title="Deaths" 
    cases={prettyPrintStat(countryInfo.todayDeaths)} 
    total={prettyPrintStat(countryInfo.deaths)} />
</div>

  { /*Map*/ }
  <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}  />
    </div>
    
  <Card className="app_right">
    <CardContent>
      { /*Table*/ }
      <h1>Live cases by country</h1>
      <Table countries={tableData} />
      { /*Graph*/ }
      <h3 className= "app_graphTitle">Worldwide New {casesType}</h3>
      <LineGraph className= "app_graph" casesType={casesType} />
    </CardContent>
  </Card>
</div>
);
}


export default App;
