// Global Variable
var selectedRow = null;

// Show Alert
function showAlert(message, className) {
  const div = document.createElement("div");
  div.className = `alert alert-${className}`;

  div.appendChild(document.createTextNode(message));
  const container = document.querySelector(".container");
  const main = document.querySelector(".main");
  container.insertBefore(div, main);
  setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

// Function to clear form fields
function clearFields() {
  document.getElementById("Number").value = "";
  document.getElementById("Name").value = "";
  document.getElementById("Gender").value = "";
  document.getElementById("Age").value = "";
  document.getElementById("Email").value = "";
  document.getElementById("Province").value = "";
}
function restrictInputToText(event) {
  var input = event.target;
  input.value = input.value.replace(/(^\s+$|[^A-Za-z\s])/g, '');
}
function removeSpaces() {
  var emailInput = document.getElementById("Email");
  emailInput.value = emailInput.value.replace(/\s/g, '');
}

function inputToNumber(event){
  var input = event.target;
  input.value = input.value.replace([0-9]);
  input.value = input.value.replace(/-/g, '');
  input.value = input.value.replace(/\./g, '');
}
  
// Add Button
document.getElementById("Student-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const Name = document.getElementById("Name").value;
  const Gender = document.getElementById("Gender").value;
  const Age = document.getElementById("Age").value;
  const Email = document.getElementById("Email").value;
  const Province = document.getElementById("Province").value;

  const list = document.getElementById("student-list");
  const newRow = document.createElement("tr");
  const lastRow = list.querySelector("tr:last-child");
  let newNumber;
  

  if (lastRow) {
    const lastNumber = Number(lastRow.children[0].textContent);
    newNumber = lastNumber + 1;
  } else {
    newNumber = 1;
  }

  // Data validation
  const errors = [];
  if (Name.trim() === "") {
    errors.push("Name is required");
  }
  if (Gender.trim() === "") {
    errors.push("Gender is required");
  }
  if (Age.trim() === "") {
    errors.push("Age is required");
  }
  if (Email.trim() === "") {
    errors.push("Email is required");
  } else if (!validateEmail(Email.trim())) {
    errors.push("Email is invalid");
  }
  if (Province.trim() === "") {
    errors.push("Province is required");
  }

 // Check for email duplication
 const rows = list.querySelectorAll("tr");
 for (let i = 1; i < rows.length; i++) {
   const row = rows[i];
   const rowEmail = row.children[4].textContent;

   if (rowEmail === Email) {
     errors.push("Email already exists");
     break;
   }
 }

  if (errors.length > 0) {
    showAlert(errors.join(", "), "danger");
  } else {
    if (selectedRow === null) {
      newRow.innerHTML = `
        <td>${newNumber}</td>
        <td>${Name}</td>
        <td>${Gender}</td>
        <td>${Age}</td>
        <td>${Email}</td>
        <td>${Province}</td>
        <td>
          <a href="#" class="btn btn-primary btn-sm edit">Edit</a>
          <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
        </td>
      `;

      list.appendChild(newRow);
      showAlert("Student Info Added", "success");
    } else {
      selectedRow.children[1].textContent = Name;
      selectedRow.children[2].textContent = Gender;
      selectedRow.children[3].textContent = Age;
      selectedRow.children[4].textContent = Email;
      selectedRow.children[5].textContent = Province;
      selectedRow = null;
      showAlert("Student Info Edited", "info");
    }
    clearFields();
  }
});

// Function to validate email format
function validateEmail(email) {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
}



// Edit Button
document.getElementById("student-list").addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("edit")) {
    selectedRow = target.parentElement.parentElement;
    document.getElementById("Number").value = selectedRow.children[0].textContent;
    document.getElementById("Name").value = selectedRow.children[1].textContent;
    document.getElementById("Gender").value = selectedRow.children[2].textContent;
    document.getElementById("Age").value = selectedRow.children[3].textContent;
    document.getElementById("Email").value = selectedRow.children[4].textContent;
    document.getElementById("Province").value = selectedRow.children[5].textContent;
    // Open update button
    const addBtn = document.querySelector(".add-btn");
    const saveButton = document.querySelector(".Save-btn");
    addBtn.setAttribute("hidden", "true");
    saveButton.removeAttribute("hidden");
  }
});

// Cancel Button
document.querySelector(".cancell-btn").addEventListener("click", () => {
  clearForm();
  // Hide save button
  const saveButton = document.querySelector(".Save-btn");
  saveButton.setAttribute("hidden", "true");

  // Reset the values to the original row values
  document.getElementById("Name").value = selectedRow.children[1].textContent;
  document.getElementById("Gender").value = selectedRow.children[2].textContent;
  document.getElementById("Age").value = selectedRow.children[3].textContent;
  document.getElementById("Email").value = selectedRow.children[4].textContent;
  document.getElementById("Province").value = selectedRow.children[5].textContent;

  // Show add button
  const addBtn = document.querySelector(".add-btn");
  addBtn.removeAttribute("hidden");

  selectedRow = null;
});
// Save Button
document.querySelector(".Save-btn").addEventListener("click", () => {
  const Name = document.getElementById("Name").value;
  const Gender = document.getElementById("Gender").value;
  const Age = document.getElementById("Age").value;
  const Email = document.getElementById("Email").value;
  const Province = document.getElementById("Province").value;

  const list = document.getElementById("student-list");
  const rows = list.querySelectorAll("tr");

  // Cancel Button
  document.querySelector(".cancell-btn").addEventListener("click", () => {
    clearForm();
  });

  // Check if any form field is empty
  if (!Name || !Gender || !Age || !Email || !Province) {
    showAlert("Please fill in all the form fields", "danger");
    return;
  }

  // Check for data duplication
  const errors = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row !== selectedRow) {
      const rowName = row.children[1].textContent;
      const rowGender = row.children[2].textContent;
      const rowAge = row.children[3].textContent;
      const rowEmail = row.children[4].textContent;
      const rowProvince = row.children[5].textContent;

      if (
        rowName === Name &&
        rowGender === Gender &&
        rowAge === Age &&
        rowEmail === Email &&
        rowProvince === Province
      ) {
        errors.push("Data already exists");
        break;
      }
    }
  }

  if (errors.length > 0) {
    showAlert(errors.join(", "), "danger");
  } else {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to update?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        selectedRow.children[1].textContent = Name;
        selectedRow.children[2].textContent = Gender;
        selectedRow.children[3].textContent = Age;
        selectedRow.children[4].textContent = Email;
        selectedRow.children[5].textContent = Province;
        selectedRow = null;
        clearFields();
        // Hide save button
        const saveButton = document.querySelector(".Save-btn");
        saveButton.setAttribute("hidden", "true");
        // Show add button
        const addBtn = document.querySelector(".add-btn");
        addBtn.removeAttribute("hidden");
        showAlert("Student Info Edited", "info");
      }
    });
  }  
});

// Cancel Button
document.querySelector(".cancell-btn").addEventListener("click", () => {
  clearForm();
  // Hide save button
  const saveButton = document.querySelector(".Save-btn");
  saveButton.setAttribute("hidden", "true");
});

// Function to clear form fields
function clearForm() {
  document.getElementById("Name").value = "";
  document.getElementById("Gender").value = "";
  document.getElementById("Age").value = "";
  document.getElementById("Email").value = "";
  document.getElementById("Province").value = "";

  // Hide save button
  const saveButton = document.querySelector(".Save-btn");
  saveButton.setAttribute("hidden", "true");

  // Show add button
  const addBtn = document.querySelector(".add-btn");
  addBtn.removeAttribute("hidden");
}

document.getElementById("student-list").addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("delete")) {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this student's data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        target.parentElement.parentElement.remove();   
        showAlert("Student Data Deleted", "danger");
        const rows = document.querySelectorAll("#student-list tr");
        rows.forEach((row, index) => {
          row.children[0].textContent = index + 1;
        });
      }
    });
  }
});
