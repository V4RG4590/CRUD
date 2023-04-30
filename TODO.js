$(document).ready(function() {
  // Load initial data
  loadStudents();

  // Handle form submit
  $('#add-student-form').submit(function(e) {
    e.preventDefault();
    const name = $('#name').val();
    const color = $('#color').val();
    addStudent(name, color);
  });

  // Handle delete button click
  $('#students-list').on('click', '.delete-btn', function() {
    const id = $(this).closest('tr').data('id');
    deleteStudent(id);
  });

  // Handle color change
  $('#students-list').on('click', '.color', function() {
    const id = $(this).closest('tr').data('id');
    const color = $(this).text();
    const newColor = prompt('Enter a new color:', color);
    if (newColor !== null && newColor !== color) {
      updateColor(id, newColor);
    }
  });

  // Handle name change
  $('#students-list').on('click', '.name', function() {
    const id = $(this).closest('tr').data('id');
    const name = $(this).text();
    const newName = prompt('Enter a new name:', name);
    if (newName !== null && newName !== name) {
      updateName(id, newName);
    }
  });
});

// Function to load students from the API
function loadStudents() {
  $('#students-list').empty();

  axios.get('https://644721ab50c25337441ee804.mockapi.io/Students')
    .then(function(response) {
      const students = response.data;
      students.forEach(function(student) {
        addStudentToList(student);
      });
    })
    .catch(function(error) {
      console.log(error);
      alert('Failed to load students.');
    });
}

// Function to add a student to the API
function addStudent(name, color) {
  axios.post('https://644721ab50c25337441ee804.mockapi.io/Students', {
      name: name,
      color: color
    })
    .then(function(response) {
      const student = response.data;
      addStudentToList(student);
      clearAddForm();
      alert('Student added successfully.');
    })
    .catch(function(error) {
      console.log(error);
      alert('Failed to add student.');
    });
}

// Function to delete a student from the API
function deleteStudent(id) {
  axios.delete(`https://644721ab50c25337441ee804.mockapi.io/Students/${id}`)
    .then(function(response) {
      $(`tr[data-id="${id}"]`).remove();
      alert('Student deleted successfully.');
    })
    .catch(function(error) {
      console.log(error);
      alert('Failed to delete student.');
    });
}

// Function to update a student in the API
function updateStudent(id, name, color) {
  axios.put(`https://644721ab50c25337441ee804.mockapi.io/Students/${id}`, {
      name: name,
      color: color
    })
    .then(function(response) {
      const student = response.data;
      $(`tr[data-id="${id}"]`).find('.name').text(student.name);
      $(`tr[data-id="${id}"]`).find('.color').text(student.color);
      $('#edit-student-modal').modal('hide');
      alert('Student updated successfully.');
    })
    .catch(function(error) {
      console.log(error);
      alert('Failed to update student.');
    });
  }
  // Function to add a student to the list
  function addStudentToList(student) {
    const row = `<tr data-id="${student.id}">
                    <td class="name">${student.name}</td>
                    <td class="color">${student.color}</td>
                    <td>
                      <button class="btn btn-primary update-btn">Update</button>
                      <button class="btn btn-danger delete-btn">Delete</button>
                    </td>
                </tr>`;
    $('#students-list').append(row);
  }
  // Handle edit button click
$('#students-list').on('click', '.edit-btn', function() {
  const id = $(this).data('id');
  const name = $(`tr[data-id="${id}"]`).find('.name').text();
  const color = $(`tr[data-id="${id}"]`).find('.color').text();
  $('#edit-student-id').val(id);
  $('#edit-student-name').val(name);
  $('#edit-student-color').val(color);
  $('#edit-student-modal').modal('show');
});
// Handle update button click
$('#students-list').on('click', '.update-btn', function() {
  const id = $(this).closest('tr').data('id');
  const name = $(this).closest('tr').find('.name').text();
  const color = $(this).closest('tr').find('.color').text();
  const newName = prompt('Enter a new name:', name);
  const newColor = prompt('Enter a new color:', color);
  if (newName !== null && newColor !== null && (newName !== name || newColor !== color)) {
    updateStudent(id, newName, newColor);
  }
});

// Handle edit form submit
$('#edit-student-form').submit(function(e) {
  e.preventDefault();
  const id = $('#edit-student-id').val();
  const name = $('#edit-student-name').val();
  const color = $('#edit-student-color').val();
  updateStudent(id, name, color);
});

// Function to clear the add student form
function clearAddForm() {
  $('#name').val('');
  $('#color').val('');
}
