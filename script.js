document.addEventListener("DOMContentLoaded", function() {
    const textInput = document.getElementById('text-input');
    const languageOutput = document.getElementById('language-output');

    const debounceDelay = 500;
    let debounceTimer;

    async function fetchPredictions(text) {
        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text }),
            });
            
            if (response.ok) {
                console.log(response);
                const data = await response.json();
                if(data !== null){
                    console.log(data);
                    displayPredictions(data);
                }
            } else {
                console.error('Error fetching predictions');
            }
        } catch (error) {
            console.error('Request failed', error);
        }
    }

    function displayPredictions(data) {
        languageOutput.innerHTML = ''; // clear previous output
        data.top_5_languages.forEach(prediction => {
            const listItem = document.createElement('li');
            const probabilityBar = document.createElement('div');
            probabilityBar.style.width = `${prediction.probability * 100}%`;
            probabilityBar.classList.add('probability-bar');

            listItem.innerHTML = `
                <div class="language-row">
                    <span class="language">${prediction.language}</span>
                    <span class="probability">${(prediction.probability * 100).toFixed(2)}%</span>
                </div>
            `;
            listItem.appendChild(probabilityBar);
            languageOutput.appendChild(listItem);
        });
    }

    function debounce(func, delay) {
        return function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
        };
    }

    textInput.addEventListener('input', debounce(function() {
        const text = textInput.value;
        if (text.trim()) {
            fetchPredictions(text);
        } else {
            languageOutput.innerHTML = '';
        }
    }, debounceDelay));
});
