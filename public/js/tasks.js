(()=>{
  'use strict'

  // referencias a firebase
  const rootRef = firebase.database().ref()
  const tasksRef = rootRef.child('tasks')

  // refrencias al DOM
  const alertTasks       = document.getElementById('alertTasks')
  const listTasks        = document.getElementById('tasks')


  /* lista de tareas */
  tasksRef.on('child_added', snap => {
    const li = document.createElement('li')
    const span = document.createElement('span')

    span.classList.add('user')
    span.innerText = snap.val().autor;

    li.id = snap.key;
    li.innerText = `${snap.val().task} por `
    li.appendChild(span)
    alertTasks.classList.add('display-none')
    listTasks.appendChild(li)
  })

  tasksRef.on('child_changed', snap => {
    const li = document.getElementById(snap.key)
    li.innerText = snap.val().task
  })

  tasksRef.on('child_removed', snap => {
    const li = document.getElementById(snap.key)
    li.remove()
  })

})()