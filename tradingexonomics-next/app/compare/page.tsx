"use client";

import { useEffect, useMemo, useState } from "react";

const Page = () => {
  const [selectedCountries, setSelectedCountries] = useState(["", ""]);
  const [selectedIndicator, setSelectedIndicator] = useState("");

  const freeCountries = ["Sweden", "Mexico", "New Zealand", "Thailand"];

  const indicators = [
    "gdp",
    "Unemployment Rate",
    "Harmonised Inflation Rate YoY",
  ];

  function getData() {
    fetch("/compare/api", {
      method: "POST",
      body: JSON.stringify({
        countries: selectedCountries,
        indicator: selectedIndicator,
      }),
    });
  }

  useEffect(() => {
    selectedIndicator !== "" && getData();
    return () => {};
  }, [selectedIndicator]);
  useMemo(
    () => selectedCountries.includes("") && setSelectedIndicator(""),
    [selectedCountries]
  );

  return (
    <>
      <div className="p-3 w-full flex justify-center sm:items-center sm-flex-row flex-col items-start gap-3">
        Please select the countries :
        <div className="flex flex-col gap-2  w-full max-w-sm sm:ms-20 px-5">
          {selectedCountries.map((country, index) => (
            <div key={index} className="flex items-center gap-1">
              <select
                onChange={(event) =>
                  setSelectedCountries((prev) => {
                    const updatedCountries = [...prev];
                    updatedCountries[index] = event.target.value;
                    return updatedCountries;
                  })
                }
                value={country}
                className="select select-info w-full select-sm max-w-sm"
              >
                <option value={""}>{"Please select a country"}</option>

                {freeCountries
                  .filter(
                    (freeCountry) =>
                      !selectedCountries
                        .slice(0, index)
                        .concat(selectedCountries.slice(index + 1))
                        .includes(freeCountry)
                  )
                  .map((selectableCountry) => (
                    <option key={selectableCountry} value={selectableCountry}>
                      {selectableCountry}
                    </option>
                  ))}
              </select>
              {index > 1 && (
                <button
                  onClick={() =>
                    setSelectedCountries((prev) =>
                      [...prev]
                        .slice(0, index)
                        .concat(selectedCountries.slice(index + 1))
                    )
                  }
                  className="btn btn-error btn-xs"
                >
                  -
                </button>
              )}
            </div>
          ))}
          {selectedCountries.length < freeCountries.length && (
            <button
              className="btn btn-success btn-xs"
              onClick={() => setSelectedCountries((prev) => [...prev, ""])}
            >
              Add more country to compare
            </button>
          )}
          <select
            className="select select-info w-full select-sm max-w-sm "
            value={selectedCountries.includes("") ? "" : selectedIndicator}
            disabled={selectedCountries.includes("")}
            onChange={(event) => setSelectedIndicator(event.target.value)}
          >
            <option value={""}>{"Please select a indicator"}</option>
            {indicators.map((indicator) => (
              <option key={indicator}>{indicator}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default Page;
