import React, { useState, useEffect } from "react";
import "./Covid19Dashboard.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import "leaflet/dist/leaflet.css";

const Covid19Dashboard = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://api.covid19api.com/summary")
      .then((response) => response.json())
      .then((data) => {
        // console.log("-->", data);
        
        setCountryInfo(data.Global);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://api.covid19api.com/summary")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.Countries.map((country) => ({
            name: country.Country,
            value: country.CountryCode,
          }));
          // console.log("countries", data.Countries);
          
          let sortedData = sortData(data.Countries);          
          setCountries(countries);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  // console.log(casesType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
         "https://api.covid19api.com/summary";
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let countryData;
        let filteredCountryData;
       // console.log("total data!!!",data)
        if(e.target.value==="worldwide"){
          countryData =data.Global;
        //  console.log("countryData", countryData)
          setInputCountry(countryCode);
          setCountryInfo(countryData);  
        }
        else{
         countryData= data.Countries.map((countryData)=>{
         if(countryData.CountryCode===e.target.value){
          return countryData;
         }
         return null
        });
        filteredCountryData= countryData.filter(e => e)
        // console.log("country data", filteredCountryData)
        setInputCountry(countryCode);
        setCountryInfo(filteredCountryData[0]);      
      }  
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              key={Math.random()}
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
        <InfoBox
            onClick={(e) => setCasesType("active")}
            title="Active Cases"
            isRed
            active={casesType === "active"}
            cases={prettyPrintStat(countryInfo.TotalConfirmed-countryInfo.TotalRecovered)}
            total={numeral(countryInfo.TotalConfirmed-countryInfo.TotalRecovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Total covid Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.TotalConfirmed)}
            total={numeral(countryInfo.TotalConfirmed).format("0.0a")}
          />
          {country !=="worldwide" ?
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.TotalRecovered)}
            total={numeral(countryInfo.TotalRecovered).format("0.0a")}
          />:" "}
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.TotalDeaths)}
            total={numeral(countryInfo.TotalDeaths).format("0.0a")}
          />
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Covid19Dashboard;
