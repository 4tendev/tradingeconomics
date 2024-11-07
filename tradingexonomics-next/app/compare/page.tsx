"use client";

import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

const Page = () => {
  const [elementWidth, setElementWidth] = useState<number>(300);
  const [selectedCountries, setSelectedCountries] = useState(["", ""]);
  const [selectedIndicator, setSelectedIndicator] = useState({
    name: "",
    x: "",
    y: "",
  });

  const [fetching, setFetching] = useState(false)

  const [data, setData] = useState<any[]>([]);
  type FreeCountry = ["Sweden", "Mexico", "New Zealand", "Thailand"];
  const freeCountries: FreeCountry = [
    "Sweden",
    "Mexico",
    "New Zealand",
    "Thailand",
  ];

  const indicators = [
    { name: "gdp", x: "DateTime", y: "Value" },
    { name: "Inflation Rate", x: "DateTime", y: "Value" },
  ];

  const colors = ["orange", "red", "blue", "black"];

  async function getData() {
    setFetching(true)
    setData([]);
    const response = await fetch("/compare/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        countries: selectedCountries,
        indicator: selectedIndicator.name,
      }),
    });

    const responseData = await response.json();
    const normalizedData: any = {};
    responseData.map((countrydata: any, index: number) => {
      const country = countrydata.Country;
      if (index + 1 != responseData.length) {
        if (!normalizedData[countrydata[selectedIndicator["x"]]]) {
          normalizedData[countrydata[selectedIndicator["x"]]] = {};
          normalizedData[countrydata[selectedIndicator["x"]]][
            selectedIndicator["x"]
          ] = countrydata[selectedIndicator["x"]].substring(0, 10);
        }
        normalizedData[countrydata[selectedIndicator["x"]]] = {
          ...normalizedData[countrydata[selectedIndicator["x"]]],
          [country]: countrydata[selectedIndicator["y"]] || 1,
        };
      }
      return countrydata;
    });

    setData(
      Object.values(normalizedData).filter((data: any) => {
        return selectedCountries.every((country) => data[country]);
      })
    );
    setFetching(false)
  }

  useEffect(() => {
    selectedIndicator.name !== "" &&
      !selectedCountries.includes("") &&
      getData();
    return () => {};
  }, [selectedIndicator, selectedCountries]);
  useMemo(
    () =>
      selectedCountries.includes("") &&
      setSelectedIndicator({
        name: "",
        x: "",
        y: "",
      }),
    [selectedCountries]
  );
  useEffect(() => {
    const updateElementWidth = () => {
      const element = document.getElementById("chart");
      if (element) {
        const width = element.offsetWidth;
        setElementWidth(width);
      }
    };
    updateElementWidth();
    window.addEventListener("resize", updateElementWidth);
    return () => {
      window.removeEventListener("resize", updateElementWidth);
    };
  }, [data]);

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
            value={
              selectedCountries.includes("") ? "" : selectedIndicator["name"]
            }
            disabled={selectedCountries.includes("")}
            onChange={(event) =>
              setSelectedIndicator(
                indicators.filter(
                  (indicator) => indicator["name"] == event.target.value
                )[0]
              )
            }
          >
            <option value={""}>{"Please select a indicator"}</option>
            {indicators.map((indicator) => (
              <option key={indicator["name"]}>{indicator["name"]}</option>
            ))}
          </select>
        </div>
        {
          fetching && <span className="loading loading-infinity loading-lg"></span>
        }
        {selectedIndicator.name != "" && data.length > 0 && (
          <div id="chart" className="w-full max-w-5xl mx-auto min-w-xl pt-3">
     
            <LineChart
              width={elementWidth}
              height={400}
              data={data}
              margin={{
                top: 3,
                right: 15,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey={selectedIndicator.x} tickMargin={3} />

              <Tooltip
                animationDuration={500}
                allowEscapeViewBox={{ x: false }}
              />
              {selectedCountries.map((country, index) => (
                <Line
                  key={country}
                  yAxisId="date"
                  type="monotone"
                  dataKey={country}
                  attributeName="ss"
                  stroke={colors[index]}
                  dot={false}
                  strokeWidth={2}
                />
              ))}

              <Legend />
            </LineChart>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
