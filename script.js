let currentPage = 1;
const resultsPerPage = 16;
let debounceTimeout;
let cars = [];

document.addEventListener('DOMContentLoaded', function() {
    fetch('cars.json')
        .then(response => response.json())
        .then(data => {
            cars = data;
            const query = document.getElementById('search-bar').value;
            const processedQuery = processQuery(query);
            displayResults(filterResults(processedQuery));
        })
        .catch(error => console.error('Error fetching and parsing JSON:', error));
});

document.getElementById('search-bar').addEventListener('input', function() {
    const query = document.getElementById('search-bar').value;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const processedQuery = processQuery(query);
        displayResults(filterResults(processedQuery));
    }, 300); // Adjust the debounce delay as needed
});

document.getElementById('search-bar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action of the Enter key
        const query = document.getElementById('search-bar').value;
        const processedQuery = processQuery(query);
        displayResults(filterResults(processedQuery));
    }
});

function processQuery(query) {
    return query.toLowerCase();
}

function filterResults(query) {
    return cars.filter(car => car.name && car.name.toLowerCase().includes(query));
}

function displayResults(results) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';
    const paginatedResults = results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
    if (paginatedResults.length === 0) {
        container.innerHTML = '<p>No results found for your query.</p>';
    } else {
        paginatedResults.forEach(result => {
            const panel = document.createElement('div');
            panel.classList.add('panel');
            panel.innerHTML = `
                <div class="image-zoom-container">
                    <img src="${result.image_url}" alt="${result.name}">
                    <div class="price-panel" style="margin-top:20px;">${result.price}</div>
                </div>
                <h3>${result.name}</h3>
                <p>${result.description}</p>
                <ul>
                    <li><strong>Speed:</strong> ${result.speed}</li>
                    <li><strong>Engine Type:</strong> ${result.engine_type}</li>
                    <li><strong>Car Build:</strong> ${result.build}</li>
                    <li><strong>Weight:</strong> ${result.weight}</li>
                    <li><strong>Build Material:</strong> ${result.material}</li>
                    <li><strong>Engine Size</strong> ${result.engine_l}</li>
                    <li><strong>Horsepower</strong> ${result.hp}</li>
                </ul>
                <p>${result.history}</p>
            `;
            container.appendChild(panel);
        });
    }
    updatePagination(results.length);
}

function updatePagination(totalResults) {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage * resultsPerPage >= totalResults;

    prevButton.onclick = function() {
        if (currentPage > 1) {
            currentPage--;
            displayResults(filterResults(processQuery(document.getElementById('search-bar').value)));
            window.scrollTo(0, 0);
        }
    };

    nextButton.onclick = function() {
        if (currentPage * resultsPerPage < totalResults) {
            currentPage++;
            displayResults(filterResults(processQuery(document.getElementById('search-bar').value)));
            window.scrollTo(0, 0);
        }
    };
}
