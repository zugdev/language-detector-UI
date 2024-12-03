document.addEventListener("DOMContentLoaded", function() {
    const textInput = document.getElementById('text-input');
    const languageOutput = document.getElementById('language-output');

    const debounceDelay = 500;
    let debounceTimer;

    async function fetchPredictions(text) {
        const startTime = Date.now();  // capture the start time before the request

        try {
            const response = await fetch('https://lang-scan-api.vercel.app/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text }),
            });
            
            const endTime = Date.now();
            const rtt = endTime - startTime;  // calculate round-trip time

            if (response.ok) {
                console.log(response);
                const data = await response.json();
                if (data !== null) {
                    console.log(data);
                    displayPredictions(data, rtt);  
                }
            } else {
                console.error('Error fetching predictions');
            }
        } catch (error) {
            console.error('Request failed', error);
        }
    }

    function displayPredictions(data, rtt) {
        languageOutput.innerHTML = ''; // clear previous output
        
        const rttDisplay = document.createElement('li');
        rttDisplay.textContent = `RTT: ${rtt} ms`;
        languageOutput.appendChild(rttDisplay);

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
