let currentPage = 1;
const resultsPerPage = 15;
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
    }, 300);
});

document.getElementById('search-bar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayResults(results) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';

    // Shuffle results before displaying
    const shuffledResults = shuffleArray(results);

    const paginatedResults = shuffledResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
    if (paginatedResults.length === 0) {
        container.innerHTML = '<p>No results found for your query.</p>';
    } else {
        paginatedResults.forEach(result => {
            const panel = document.createElement('div');
            panel.classList.add('panel');

            let logo = '';
            if (result.name.toLowerCase().includes('ferrari')) {
                logo = 'ferrari_logo.png';
            } else if (result.name.toLowerCase().includes('lamborghini')) {
                logo = 'lamborghini_logo.png';
            }

            const truncatedHistory = result.history.split(' ').slice(0, 50).join(' ') + '...';

            panel.innerHTML = `
                <h1 style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <span>${result.name}</span>
                    ${logo ? `<img src="${logo}" class="logo" style="height: 30px; border-radius: 0; margin-left: 30px">` : ''}
                </h1>
                <div class="image-zoom-container">
                    <img src="${result.image_url}" alt="${result.name}">
                    <div class="price-panel">${result.price}</div>
                </div>
                <p>${result.description}</p>
                <ul>
                    <li><strong>Speed (0-100kph):</strong> ${result.speed}</li>
                    <li><strong>Engine Type:</strong> ${result.engine_type}</li>
                    <li><strong>Car Build:</strong> ${result.build}</li>
                    <li><strong>Weight:</strong> ${result.weight}</li>
                    <li><strong>Build Material:</strong> ${result.material}</li>
                    <li><strong>Engine Size:</strong> ${result.engine_l}</li>
                    <li><strong>Horsepower:</strong> ${result.hp}</li>
                </ul>
                <p>${truncatedHistory} <span onclick="showFullHistory('${result.name}', '${result.history.replace(/'/g, "\\'")}')">More</span></p>
            `;
            container.appendChild(panel);
        });
    }
    updatePagination(results.length);
}

function showFullHistory(carName, fullHistory) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3>History of the ${carName}</h3>
            <p>${fullHistory}</p>
        </div>
    `;
    document.body.appendChild(modal);
}
