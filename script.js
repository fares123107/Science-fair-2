document.addEventListener('DOMContentLoaded', function() {
    const dairySelect = document.getElementById('dairy-select');
    const measureBtn = document.getElementById('measure');
    const addLactaseBtn = document.getElementById('add-lactase');
    const stirBtn = document.getElementById('stir');
    const waitBtn = document.getElementById('wait');
    const testGlucoseBtn = document.getElementById('test-glucose');
    const glucoseResult = document.getElementById('glucose-result');
    const timerDiv = document.getElementById('timer');
    const resultsBody = document.getElementById('results-body');

    let selectedDairy = '';
    let measured = false;
    let lactaseAdded = false;
    let stirred = false;
    let waited = false;
    let timerInterval;

    const glucoseValues = {
        milk: [139, 138, 140],
        yogurt: [115, 117, 116],
        cheese: [42, 41, 43]
    };

    const results = {
        milk: [],
        yogurt: [],
        cheese: []
    };

    dairySelect.addEventListener('change', function() {
        selectedDairy = this.value;
        resetExperiment();
    });

    measureBtn.addEventListener('click', function() {
        if (selectedDairy) {
            measured = true;
            glucoseResult.textContent = 'Measured 20ml of ' + selectedDairy + '.';
            addLactaseBtn.disabled = false;
        }
    });

    addLactaseBtn.addEventListener('click', function() {
        if (measured) {
            lactaseAdded = true;
            glucoseResult.textContent = 'Added 2 drops of lactase.';
            stirBtn.disabled = false;
        }
    });

    stirBtn.addEventListener('click', function() {
        if (lactaseAdded) {
            stirred = true;
            glucoseResult.textContent = 'Stirred gently.';
            waitBtn.disabled = false;
        }
    });

    waitBtn.addEventListener('click', function() {
        if (stirred) {
            waited = false;
            waitBtn.disabled = true;
            let timeLeft = 10; // 10 seconds for simulation
            timerDiv.textContent = 'Waiting: ' + timeLeft + ' seconds';
            timerInterval = setInterval(() => {
                timeLeft--;
                timerDiv.textContent = 'Waiting: ' + timeLeft + ' seconds';
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    waited = true;
                    timerDiv.textContent = 'Reaction complete.';
                    testGlucoseBtn.disabled = false;
                }
            }, 1000);
        }
    });

    testGlucoseBtn.addEventListener('click', function() {
        if (waited && results[selectedDairy].length < 3) {
            const trial = results[selectedDairy].length;
            const glucose = glucoseValues[selectedDairy][trial];
            results[selectedDairy].push(glucose);
            glucoseResult.textContent = `Glucose: ${glucose} mg/dL`;
            updateTable();
            resetExperiment();
        }
    });

    function resetExperiment() {
        measured = false;
        lactaseAdded = false;
        stirred = false;
        waited = false;
        measureBtn.disabled = true;
        addLactaseBtn.disabled = true;
        stirBtn.disabled = true;
        waitBtn.disabled = true;
        testGlucoseBtn.disabled = true;
        glucoseResult.textContent = '';
        timerDiv.textContent = '';
        if (timerInterval) clearInterval(timerInterval);
        if (selectedDairy) measureBtn.disabled = false;
    }

    function updateTable() {
        resultsBody.innerHTML = '';
        for (const [dairy, trials] of Object.entries(results)) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${dairy.charAt(0).toUpperCase() + dairy.slice(1)}</td>`;
            for (let i = 0; i < 3; i++) {
                row.innerHTML += `<td>${trials[i] || '-'}</td>`;
            }
            const avg = trials.length > 0 ? (trials.reduce((a, b) => a + b, 0) / trials.length).toFixed(0) : '-';
            row.innerHTML += `<td>${avg}</td>`;
            resultsBody.appendChild(row);
        }
    }

    resetExperiment();
});