// URL API
const GET_DATA_ALL = 'http://127.0.0.1:5000/updateDashboard';
const CREATE_PROPOSAL = 'http://127.0.0.1:5000/createProposal'
const UPLOAD_IMAGE = 'http://127.0.0.1:5000/uploadScreenshot'

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
function showData(values) {
    // Call function sort Data
    let data = sortData(values);
    let bodyTable = document.getElementById('body_table');
    bodyTable.innerHTML = '';
    // Add Data In Dom
    data.forEach((element, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${element.job_title}</td>
        <td><a href=${element.job_url}>Link</a></td>
        <td>${element.job_score}</td>
        <td><button class="bg-primary rounded-[10px] p-[10px] text-[15px] text-white buttonProposal" data-status="wait" data-id=${index} data-url=${element.job_url}>Create
                Proposal</button></td>
        <td>
        <button class="bg-[#808080] pointer-events-none rounded-[10px] p-[10px] text-[15px] text-white upload" data-url=${element.job_url} data-id=${index}>Upload</button>
        <input type='file' class='hidden' id=${index} />
        </td>
        <td class="text-black status">Application Pending</td>
        `
        bodyTable.append(tr)
    });

    document.querySelectorAll('.buttonProposal').forEach(element => {
        element.addEventListener('click', () => {
            if (element.getAttribute('data-status') === 'wait') {
                let url = element.getAttribute('data-url');
                let data = {
                    access_token: userData.access_token,
                    username: userData.username,
                    job_url: url
                }
                const jsonData = JSON.stringify(data);
                fetch(CREATE_PROPOSAL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`
                    },
                    body: jsonData
                }).then(res => res.json())
                    .then(data => {
                        element.setAttribute('copy_proposal', data.job_proposal);
                        element.setAttribute('data-status', 'Done');
                        element.innerHTML = 'Copy Proposal'
                        element.classList.add('bg-[#008000]')
                        element.classList.remove('bg-primary')
                    })
            } else {
                navigator.clipboard.writeText(element.getAttribute('copy_proposal'))
                    .then(() => {
                        element.innerHTML = 'Copy Proposal'
                        document.querySelectorAll('.upload').forEach((ele, i) => {
                            if (+ele.getAttribute('data-id') === +element.getAttribute('data-id')) {
                                ele.classList.remove('bg-[#808080]')
                                ele.classList.remove('pointer-events-none')
                                ele.classList.add('bg-primary')
                            }
                        })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        })
    })

    document.querySelectorAll('.upload').forEach(element => {
        element.addEventListener('click', () => {
            document.getElementById(element.getAttribute('data-id')).click();
            let fileImage = document.getElementById(element.getAttribute('data-id'));
            fileImage.addEventListener('change', () => {
                const formData = new FormData();
                formData.append('access_token', 'lol');
                formData.append('username', 'lol');
                formData.append('job_url', element.getAttribute('data-url'));
                formData.append('image_file', fileImage.files[0]);
                fetch(UPLOAD_IMAGE, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userData.token}`
                    },
                    body: formData
                }).then(res => res.json())
                    .then(data => {
                        if (data.success === true) {
                            document.querySelectorAll('.status').forEach((ele, i) => {
                                if (i === +element.getAttribute('data-id')) {
                                    ele.innerHTML = 'Screenshot Uploaded'
                                    ele.classList.add('text-[#00db00]')
                                    ele.classList.remove('text-black')
                                }
                            })
                        }
                    })
            })
        })
    })
}

// Function Sort Data [Job score]
function sortData(data) {
    data.sort((a, b) => +b["job_score"] - +a["job_score"]);
    return data;
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