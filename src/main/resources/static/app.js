async function submitTask() {
    const taskID = document.getElementById('taskID').value;
    if (!taskID) {
        alert('Please enter a Task ID');
        return;
    }

    await downloadFiles(taskID);
}

async function downloadFiles(taskID) {
    const urls = [
        `${await getApiUrl('download-url')}/${taskID}`,
        `${await getApiUrl('success-url')}/${taskID}`,
        `${await getApiUrl('error-url')}/${taskID}`
    ];

    const filenames = [
        `${taskID}.txt`,
        `${taskID}-success.txt`,
        `${taskID}-error.txt`
    ];

    for (let i = 0; i < urls.length; i++) {
        const response = await fetch(urls[i]);
        const data = await response.text();
        saveFile(filenames[i], data);
    }
}

function saveFile(filename, data) {
    const blob = new Blob([data], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

async function compareTasks() {
    const taskID = document.getElementById('taskID').value;
    if (!taskID) {
        alert('Please enter a Task ID');
        return;
    }

    const newTaskID = await getNewTaskID(taskID);
    if (!newTaskID) {
        alert('Failed to get new Task ID');
        return;
    }

    document.getElementById('progressBar').style.display = 'block';
    await resetProgress();
    await trackProgress();

    await downloadFiles(newTaskID);

    const successComparison = await compareFiles(`${taskID}-success.txt`, `${newTaskID}-success.txt`);
    const errorComparison = await compareFiles(`${taskID}-error.txt`, `${newTaskID}-error.txt`);

    displayComparisonResult('Success Comparison', successComparison);
    displayComparisonResult('Error Comparison', errorComparison);
}

async function getNewTaskID(taskID) {
    const newTaskIdUrl = await getApiUrl('new-taskid-url');
    const response = await fetch(newTaskIdUrl, {
        method: 'POST',
        body: JSON.stringify({ taskID }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data.newTaskID;
}

async function resetProgress() {
    await fetch('/api/v1/resetProgress', {
        method: 'POST'
    });
}

async function trackProgress() {
    const progressBar = document.getElementById('progressBar');
    let progress = 0;

    while (progress < 100) {
        const response = await fetch(await getApiUrl('progress-url'));
        const data = await response.json();
        progress = data.percent;
        progressBar.value = progress;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function compareFiles(file1, file2) {
    const [data1, data2] = await Promise.all([fetch(file1).then(res => res.text()), fetch(file2).then(res => res.text())]);
    return data1 === data2 ? 'Match' : `Mismatch: \n${data1}\n\n${data2}`;
}

function displayComparisonResult(title, result) {
    const resultDiv = document.getElementById('result');
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    const isMatch = result === 'Match';
    resultItem.innerHTML = `<h3>${title}</h3><pre class="${isMatch ? 'match' : 'mismatch'}">${result}</pre>`;
    resultDiv.appendChild(resultItem);
}

async function getApiUrl(key) {
    const response = await fetch(`/api/v1/config/${key}`);
    const data = await response.json();
    return data.url;
}
