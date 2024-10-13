async function submitTask() {
    const taskID = document.getElementById('taskID').value;
    if (!taskID) {
        alert('Please enter a Task ID');
        return;
    }

    await downloadFiles(taskID);
}

async function downloadFiles(taskID) {
    const downloadUrl = await getApiUrl('download-url');
    const successUrl = await getApiUrl('success-url');
    const errorUrl = await getApiUrl('error-url');
    const urls = [
        `${downloadUrl}/${taskID}`, // Construct the full URL with task-id for download
        `${successUrl}/${taskID}`,  // Construct the full URL with task-id for success
        `${errorUrl}?jobid=${taskID}` // Construct the full URL with jobId as a query parameter
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
    await trackProgress(taskID);

    await downloadFiles(newTaskID);

    const successComparison = await compareFiles(`${taskID}-success.txt`, `${newTaskID}-success.txt`);
    const errorComparison = await compareFiles(`${taskID}-error.txt`, `${newTaskID}-error.txt`);

    displayComparisonResult('Success Comparison', successComparison);
    displayComparisonResult('Error Comparison', errorComparison);
}

async function getNewTaskID() {
    const newTaskIdUrl = await getApiUrl('new-taskid-url');
    
    // 打印获取到的newTaskIdUrl值
    console.log('newTaskIdUrl:', newTaskIdUrl);

    const formData = new FormData();
    formData.append('file', new Blob(['dummy content'], { type: 'text/plain' }), 'dummy.txt'); // 确保替换为实际文件
    formData.append('isCompressed', 'false');
    formData.append('assetType', 'insurance');

    try {
        const response = await fetch(newTaskIdUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.newTaskID;
    } catch (error) {
        console.error('Failed to get new task ID:', error);
        alert('Failed to get new task ID');
        return null;
    }
}

async function resetProgress() {
    await fetch('/formula/pricing/resetProgress', {
        method: 'POST'
    });
}

async function trackProgress(taskID) {
    const progressUrl = await getApiUrl('progress-url');
    const progressBar = document.getElementById('progressBar');
    let progress = 0;

    while (progress < 100) {
        const response = await fetch(`${progressUrl}?jobid=${taskID}&isLogging=false`);
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
    console.log('key:', key);
    const response = await fetch(`/formula/pricing/config/${key}`);
    console.log('response',response)
    const data = await response.json();
    console.log('data:', data.url);
    return data.url;
}
