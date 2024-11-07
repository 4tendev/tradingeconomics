export async function POST(request: Request) {
  const userRequest = await request.json();
  const indicator = userRequest.indicator;
  const countries = userRequest.countries.join(",")  ;

  const res = await fetch(
    `https://api.tradingeconomics.com/historical/country/${countries}/indicator/${indicator}?c=e0721bcb6806404:fsxzeyve8e7i82z&f=json`,
    {
      method: "GET",
    }
  );
  const responseJson = await res.json();
  return new Response(JSON.stringify(responseJson), { // Serialize data to JSON
    status: 200,
    headers: {
      
      "Content-Type": "application/json", // Set content-type header to JSON
    },
  });
}