(()=>{
  'use strict'

  // referencias a firebase
  const rootRef = firebase.database().ref()
  const tasksRef = rootRef.child('tasks')
  let taskRef;

  // refrencias al DOM
  const alertTasks       = document.getElementById('alertTasks')
  const listTasks        = document.getElementById('tasks')
  const inputTask        = document.getElementById('inputTask')
  const inputUsername    = document.getElementById('inputUsername')
  const btnAddTask       = document.getElementById('btnAddTask')

  // listeners de firebase
  tasksRef.once('value').then(initValues)
  tasksRef.on('child_added',    addTaskList)
  tasksRef.on('child_changed',  updateTaskList)
  tasksRef.on('child_removed',  removeTaskList)

  // listeners del DOM
  btnAddTask.addEventListener('click', addTask)

  function initValues(snapshot){
    alertTasks.classList.add('display-none')
  }

  function addTaskList(snapshot){
    const li = document.createElement('li')
    const spanTask = document.createElement('span')
    const spanUser = document.createElement('span')

    spanTask.id = `task${snapshot.key}`
    spanTask.classList.add('task')
    spanTask.innerText = snapshot.val().task

    spanUser.id = `user${snapshot.key}`
    spanUser.classList.add('user')
    spanUser.innerText = snapshot.val().autor

    li.id = snapshot.key;
    createOptions(li,snapshot)
    li.appendChild(spanTask)
    li.appendChild(spanUser)

    alertTasks.classList.add('display-none')
    listTasks.appendChild(li)
  }

  function updateTaskList(snapshot){
    const li = document.getElementById(snapshot.key)
    const spanTask = document.getElementById(`task${snapshot.key}`)
    const spanUser = document.getElementById(`user${snapshot.key}`)

    spanTask.innerText = snapshot.val().task
    spanUser.innerText = snapshot.val().autor

    if (snapshot.val().done) {
      li.classList.add('task-complete')
    } else {
      li.classList.remove('task-complete')
    }
  }

  function removeTaskList(snapshot){
    const li = document.getElementById(snapshot.key)
    li.remove()
  }

  function addTask(e){
    e.preventDefault()

    if (emptyInputs()) {
      return alert('Asegurate de llenar todos los campos para poder agregar una tarea.')
    }

    tasksRef.push({
      autor: inputUsername.value,
      done: false,
      task: inputTask.value
    })

    clearInputs()
  }

  function createOptions(li,snapshot){
    const spanCheck = document.createElement('span')
    const spanRemove = document.createElement('span')

    // check para marcar como realizada una tarea
    spanCheck.id = `check${snapshot.key}`
    spanCheck.classList.add('fa','pointer')
    spanCheck.style.marginRight = '10px'
    spanCheck.style.color = '#34A853'
    spanCheck.addEventListener('click', e => toggleCheck(snapshot.key))

    // span para eliminar una tarea
    spanRemove.id = `remove${snapshot.key}`
    spanRemove.classList.add('fa','fa-close','pointer')
    spanRemove.style.color = '#EA4335'
    spanRemove.style.cssFloat = 'right'
    spanRemove.addEventListener('click', e => tasksRef.child(snapshot.key).remove())

    if (snapshot.val().done){
      li.classList.add('task-complete')
      spanCheck.classList.add('fa-check-square-o')
    } else {
      spanCheck.classList.add('fa-square-o')
    }

    li.appendChild(spanCheck)
    li.appendChild(spanRemove)
  }

  function toggleCheck(id){
    const spanCheck = document.getElementById(`check${id}`)
    taskRef = tasksRef.child(id)
    let done;

    taskRef.on('value', snapshot => {
      done = snapshot.val().done
      setCheckIcon(spanCheck,snapshot.val().done)
    })

    taskRef.update({done: !done})
  }

  function setCheckIcon(spanCheck,done){
    if (done){
      spanCheck.classList.remove('fa-square-o')
      spanCheck.classList.add('fa-check-square-o')
    } else {
      spanCheck.classList.remove('fa-check-square-o')
      spanCheck.classList.add('fa-square-o')
    }
  }

  function emptyInputs(){
    if (inputTask.value === '' || inputUsername.value === ''){
      return true
    }
    return false
  }

  function clearInputs(){
    inputUsername.value = ''
    inputTask.value = ''
  }

})()