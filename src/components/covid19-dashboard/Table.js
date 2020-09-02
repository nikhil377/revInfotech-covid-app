import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map((country) => (
        <tr>
          <td>{country.Country}</td>
          <td>
            <strong>{numeral(country.TotalConfirmed).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
