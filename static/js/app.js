// Fetch data asynchronously from a URL
async function fetchData(url) {
  try {
    // Send a GET request to the specified URL
    const response = await fetch(url);

    // Parse the response body as JSON
    const data = await response.json();

    // Return the parsed JSON data
    return data;
  } catch (error) {
    // If an error occurs during fetching or parsing, log the error
    console.error('Error fetching data:', error);
    
    // Return null to indicate that the fetch operation failed
    return null;
  }
}