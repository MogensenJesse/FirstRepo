// HTML elementen aanroepen
const openTasks = document.querySelector(".openTasks");
const completedTasks = document.querySelector(".completedTasks");
const inputField = document.getElementById("taskInput");
const submitBtn = document.getElementById("submitBtn");

// Authoriseren met de API
const myHeaders = new Headers();
myHeaders.append(
  "Authorization",
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDYyMDQ4MGIxNmUxNDAwMTc1MWUwNGIiLCJpYXQiOjE2MTcwMzY0MTZ9.qa7p3mpq__RP8bz-cV_wFRtAd_to6G0e-cPHWzy5ge8"
);
myHeaders.append("Content-Type", "application/json");

// Check of men ingelogd is (console), onzichtbaar zetten in production app!
const loginCheck = () => {
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("https://api-nodejs-todolist.herokuapp.com/user/me", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

loginCheck();

// Alle to do's oplijsten
async function getTasks() {
  
  // Duplicaten vermijden
  if (document.querySelector(".openTaskList")) {
    document.querySelector(".openTaskList").remove();
  }
  if (document.querySelector(".completedTaskList")) {
    document.querySelector(".completedTaskList").remove();
  }

  // GET command
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const fetchData = await fetch(
    `https://api-nodejs-todolist.herokuapp.com/task`,
    requestOptions
  );
  const data = await fetchData.json();

  console.log(data);

  // Open en completed tasks wrappen
  const openTaskList = document.createElement("div");
  const completedTaskList = document.createElement("div");

  // Classes toevoegen
  openTaskList.classList = "openTaskList";
  completedTaskList.classList = "completedTaskList";

  // Elk item weergeven
  data.data.forEach((task) => {
    
    // Elementen aanmaken
    const taskContainer = document.createElement("div");
    const deleteBtn = document.createElement("button");
    let toggleBtn = document.createElement("button");
    const taskName = document.createElement("p");

    // Naamgevingen en linken met database-items
    taskName.textContent = task.description;
    taskName.classList = "description";
    taskContainer.id = task._id;
    taskContainer.classList = "taskItem";
    deleteBtn.textContent = "Delete task";
    deleteBtn.classList = "delete";
    toggleBtn.classList = "toggle";

    // Appenden aan container
    taskContainer.appendChild(toggleBtn);
    taskContainer.appendChild(taskName);
    taskContainer.appendChild(deleteBtn);
    
    // Indien de taak completed is in completedTaskList steken, indien niet completed in openTaskList. Bij toggelen altijd uit huidige lijst verwijderen.
    if (task.completed === true) {
      completedTaskList.appendChild(taskContainer);
      toggleBtn.textContent = "Restore";

      // Restore task uitvoeren on click, element verwijderen, aan opentasklist appenden & label aanpassen
      toggleBtn.addEventListener("click", function () {
        restoreTask(taskContainer.id);
        if (document.getElementById(`${taskContainer.id}`)) {
          document.getElementById(`${taskContainer.id}`).remove();
        }
        openTaskList.appendChild(taskContainer);
        toggleBtn.textContent = "Complete";
      });
    } else {
      openTaskList.appendChild(taskContainer);
      toggleBtn.textContent = "Complete";

      // complete task uitvoeren on click, element verwijderen, aan completedTaskList appenden & label aanpassen
      toggleBtn.addEventListener("click", function () {
        completeTask(taskContainer.id);
        if (document.getElementById(`${taskContainer.id}`)) {
          document.getElementById(`${taskContainer.id}`).remove();
        }
        completedTaskList.appendChild(taskContainer);
        toggleBtn.textContent = "Restore";
      });
    }

    // Delete task uitvoeren on click
    deleteBtn.addEventListener("click", function () {
      deleteTask(taskContainer.id);
    });
  });

  // Lijsten appenden
  openTasks.appendChild(openTaskList);
  completedTasks.appendChild(completedTaskList);
}

getTasks();

// Taak toevoegen
async function addTask(event) {
  
  // Pagina niet herladen, taak wordt anders niet toegevoegd (API te traag?)
  event.preventDefault();

  // Input opvangen
  let raw = JSON.stringify({
    description: `${inputField.value}`,
  });

  // POST command
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const addData = await fetch(
    "https://api-nodejs-todolist.herokuapp.com/task",
    requestOptions
  );
  const data = await addData.json();
  console.log(data);

  // Inputveld terug leegmaken
  inputField.value = "";

  // Alle taken opnieuw oplijsten. Niet meest performante methode?
  getTasks();
}

submitBtn.addEventListener("click", addTask);

// Taak verwijderen
async function deleteTask(id) {
  
  // DELETE command
  const deleteOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  // Element visueel verwijderen
  if (document.getElementById(`${id}`)) {
    document.getElementById(`${id}`).remove();
  }

  const deleteData = await fetch(
    `https://api-nodejs-todolist.herokuapp.com/task/${id}`,
    deleteOptions
  );
  const delData = await deleteData.json();
  console.log(delData);
}

// Taak completen
async function completeTask(id) {
  
  // toggle naar true
  let raw = JSON.stringify({
    completed: true,
  });

  // PUT command
  const updateOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const updateData = await fetch(
    `https://api-nodejs-todolist.herokuapp.com/task/${id}`,
    updateOptions
  );
  const upData = await updateData.json();
  console.log(upData);
}

// Taak restoren
async function restoreTask(id) {
  
  // toggle naar false
  let raw = JSON.stringify({
    completed: false,
  });

  // PUT command
  const updateOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const updateData = await fetch(
    `https://api-nodejs-todolist.herokuapp.com/task/${id}`,
    updateOptions
  );
  const upData = await updateData.json();
  console.log(upData);
}
