let apiURL = "http://localhost:3000/jobs"

const fetchData = () => {
    fetch(apiURL)
    .then(res => res.json())
    .then(data => {
        listNames(data)
        fetchFirstData(data)
    })
}

const fetchFirstData = (value) => {
    let first = value[0]
    console.log(first)
    detailDescription(first)
}

const listNames = (value) => {
    value.forEach(element => {
        let titleContainer = document.querySelector(".job-list")
        let soldOut = document.querySelector(".sold-out")
        let names = document.createElement("a")
        names.innerHTML = element.title

        let diff = parseInt(element.available_slots) - parseInt(element.slots_remained)

        if (diff <= 0){
            let soldnames = document.createElement("a")
            soldnames.innerText = value.title
            soldOut.appendChild(names)

        }
        else{
            titleContainer.appendChild(names)
        } 

        let posId = element.id
        names.addEventListener("click", () => {
            listEachJob(posId)
        })
    })
}


const detailDescription = (value) => {
    // let card = document.querySelector(".card")
    let container = document.querySelector(".card-details")

    let title = document.createElement("h2")
    let company_name = document.createElement("h4")
    let location = document.createElement("p")
    let description = document.createElement("p")
    let availableJobs = document.createElement("p")
    let apply_job = document.createElement("button")
    let deleteJob = document.createElement("button")

    title.innerText = value.title
    company_name.innerText = value.company_name
    location.innerText = value.location
    description.innerText = value.description
    deleteJob.innerText = "Delete Job"

    let diff = parseInt(value.available_slots) - parseInt(value.slots_remained)
    availableJobs.innerText = `Available Slots: ${diff}`

    if (diff <= 0){
        apply_job.innerText = "SOLD OUT"
        apply_job.disabled = true  
    }
    else{
        apply_job.innerText = "Apply for job"
    }

    container.appendChild(title) 
    container.appendChild(company_name)
    container.appendChild(location) 
    container.appendChild(description)
    container.appendChild(availableJobs)
    container.appendChild(apply_job) 
    container.appendChild(deleteJob)
    
    apply_job.addEventListener('click', () => {
        value.slots_remained ++
        let slots_remained = value.slots_remained
        let posId = value.id
        console.log(slots_remained, posId)
        updateSlotNum(posId, {slots_remained})      
    })

    deleteJob.addEventListener("click", () => {
        let posId = value.id
        deleteData(posId) // Updated function name
    })
}

const listEachJob = (id) => {
    fetch(`${apiURL}/${id}`)
    .then(res => res.json())
    .then(data => detailDescription(data))
}


const updateSlotNum = (id, value) => {
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept":"application/json"
        },
        body:JSON.stringify(value)
    }
    fetch(`${apiURL}/${id}`, options)
    .then(res => res.json())
}

const deleteData = (id) => {
    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept":"application/json"
        },
        
    }
    fetch(`${apiURL}/${id}`, options)
    .then(res => res.json())
}

document.addEventListener('DOMContentLoaded',fetchData)
    