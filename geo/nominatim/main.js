/**
 * Contains all functions used by the website (there is not that many functions)
 */

/**
 * Main function launched when submitting the form with query
 */
function onMainFormSubmit(event) {
    // Get the form input's value
    const query = document.querySelector("input#form-query").value
    // Get the form filename's value
    const filename = document.querySelector("input#form-filename").value
    // Perform some validation
    if (query.trim().length === 0) {
        window.error("Aucune chaine de caractère vide ne sera acceptée");
        return;
    }

    // Try fetching the bounds from api and launch the "store results" action
    fetchBoundsFromApi(query)
        .then((result) => {
            // We have an array of results, we only want the first result
            const firstResult = result[0];
            triggerSaveJson(firstResult, filename);
        }).catch((err) => {
            console.error(err);
            window.error("Une erreur est survenue lors du traitement de la demande");
        });
    // Return false for avoiding page reload
    return false;
}

/**
 * Get the wanted boundaries from the Nominatim API
 * @param {string} query 
 * @returns {object} The requested data from Nominatim API
 */
async function fetchBoundsFromApi(query) {
    // Create the url with the wanted query parameters
    const url = new URL("https://nominatim.openstreetmap.org/search.php")
    const searchParams = new URLSearchParams({
        polygon_geojson: 1,
        format: "jsonv2",
        q: query
    });
    url.search = searchParams.toString();

    // Perform que query and fetch the result
    const response = await fetch(url);
    if (!response.ok) {
        console.error(response);
        throw new Error("Error while performing query : error " + response.status);
    }
    return response.json();
}

function triggerSaveJson(jsonData, filename) {
    // Help with snippet from https://stackoverflow.com/a/72490299/14559121
    var textToSave = JSON.stringify(jsonData);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = createFilename(filename);
    hiddenElement.click();
}

function createFilename(filename) {
    // If filename is empty, we will replace it by a default name
    if (filename.trim().length === 0) {
        return "resultat.json";
    }
    return filename.trim();
}
