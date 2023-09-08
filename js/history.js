// URL API
const GET_DATA_ALL = 'http://127.0.0.1:5000/getHistory';

// Time to call again on the api
const time = 60000 * 5;  // 60000 = 1 min 

// Get Data From LocalStorage
const userData = JSON.parse(localStorage.getItem("Data"));

// Check Login Or Not
if (userData === null) {
    window.location.href = '../index.html'
}

// ACCESS DATA
let data = {
    access_token: userData.access_token,
    username: userData.username
}

const jsonData = JSON.stringify(data);

// Call DATA From APi
function callData() {
    fetch(GET_DATA_ALL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        },
        body: jsonData
    }).then(res => res.json())
        .then(data => {
            showData(data.data);
        })
}

// Call Function Data 
callData();


// Call DATA AFter Time
setInterval(callData, time)

// Function Show Data In Dom
function showData(data) {
    let dataSort = sortDataByDate(data);
    let bodyTable = document.getElementById('body_table');
    bodyTable.innerHTML = '';
    // Add Data In Dom
    dataSort.forEach((element, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${element.timestamp}</td>
        <td>${element.job_title}</td>
        <td><a href=${element.job_url}>Link</a></td>
        <td>${element.job_score_applied}</td>
        `
        bodyTable.append(tr)
    });

}

// Change Name Header
document.querySelectorAll('.user_name').forEach(element => {
    element.innerHTML = 'Hi, ' + userData.username;
})

// Sign Out
document.getElementById('signout').addEventListener('click', () => {
    localStorage.setItem("Data", JSON.stringify(null));
    window.location.href = '../index.html'
})

// Sort Data
function sortDataByDate(data) {
    const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return sortedData;
}