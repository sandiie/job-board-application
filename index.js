document.addEventListener("DOMContentLoaded", function() {
    const addJobModal = document.getElementById('addJobModal');
    const titleInput = document.getElementById('title');
    const companyInput = document.getElementById('company');
    const locationInput = document.getElementById('location');
    const descriptionInput = document.getElementById('description');

    // Fetch job postings from JSON server
    function fetchJobs() {
        fetch('http://localhost:3000/jobs')
            .then(response => response.json())
            .then(json => {
                document.getElementById('jobList').innerHTML = '';
                json.forEach(job => {
                    displayJob(job);
                });
            });
    }

    fetchJobs();

    document.getElementById('addJobBtn').addEventListener('click', function() {
        addJobModal.classList.remove('hidden');
    });

    document.getElementById('closeModalBtn').addEventListener('click', function() {
        addJobModal.classList.add('hidden');
    });

    document.getElementById('saveJobBtn').addEventListener('click', function() {
        const jobData = {
            title: titleInput.value,
            company: companyInput.value,
            location: locationInput.value,
            description: descriptionInput.value
        };

        fetch('http://localhost:3000/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        }).then(response => {
            if (response.ok) {
                fetchJobs();
                addJobModal.classList.add('hidden');
                titleInput.value = '';
                companyInput.value = '';
                locationInput.value = '';
                descriptionInput.value = '';
            } else {
                console.error('Failed to add job');
            }
        });
    });

    document.getElementById('jobList').addEventListener('click', function(event) {
        if (event.target.classList.contains('deleteJobBtn')) {
            const jobId = event.target.getAttribute('data-id');
            fetch(`http://localhost:3000/jobs/${jobId}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    fetchJobs();
                } else {
                    console.error('Failed to delete job');
                }
            });
        }
    });

    function displayJob(job) {
        const jobList = document.getElementById('jobList');
        const jobCard = document.createElement('div');
        jobCard.classList.add('bg-gray-200', 'p-4', 'rounded');
        jobCard.innerHTML = `
            <h2 class="text-lg font-bold">${job.title} - ${job.company}</h2>
            <p class="text-sm text-gray-600">${job.location}</p>
            <p class="my-2">${job.description}</p>
            <button class="bg-red-500 text-white font-bold py-1 px-2 rounded deleteJobBtn" data-id="${job.id}">Delete</button>
        `;
        jobList.appendChild(jobCard);
    }
});