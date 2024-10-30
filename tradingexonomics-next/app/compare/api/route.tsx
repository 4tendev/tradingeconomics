import { TIMEOUT } from "dns";

export async function POST(request: Request) {
  const userRequest = await request.json();
  const indicator = userRequest.indicator;

  const contories = userRequest.countries;

  const data: any = [];

  for (let index = 0; index < contories.length; index++) {
    const country = contories[index];
    console.log(country)
    console.log(indicator)
    const res = await fetch(
      `https://api.tradingeconomics.com/historical/country/${country}/indicator/${indicator}?c=e0721bcb6806404:z9606uviey8lwwm&f=json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseText = await res.text();
    data[index] = responseText;
  }
 
  return new Response(data, {
    status: 200,
  });
}
