(()=>{
  'use strict'

  // referencias a firebase
  const rootRef     = firebase.database().ref()
  const productsRef = rootRef.child('products')
  let productRef;

  // referencias del DOM
  const inputName        = document.getElementById('inputName')
  const inputDescription = document.getElementById('inputDescription')
  const inputPrice       = document.getElementById('inputPrice')
  const btnAddProduct    = document.getElementById('btnAddProduct')
  const btnUpdateProduct = document.getElementById('btnUpdateProduct')
  const btnReset         = document.getElementById('btnReset')
  const alertProducts    = document.getElementById('alertProducts')
  const listProducts     = document.getElementById('listProducts')

  // listeners de firebase
  productsRef.once('value').then(initValues)
  productsRef.on('child_added',    addProductList)
  productsRef.on('child_changed',  updateProductList)
  productsRef.on('child_removed',  removeProductList)
  
  // listeners del DOM
  btnAddProduct.addEventListener('click', addProduct)
  btnUpdateProduct.addEventListener('click',updateProduct)
  btnReset.addEventListener('click', resetValues)

  function initValues(snapshot){
    alertProducts.classList.add('display-none')
  }

  function addProductList(snapshot){
    const li = document.createElement('li')
    const spanName = document.createElement('span')
    const spanPrice = document.createElement('span')
    const smallDescription = document.createElement('small')

    spanName.id = `name${snapshot.key}`
    spanName.innerText = snapshot.val().name

    spanPrice.id = `price${snapshot.key}`
    spanPrice.classList.add('badge')
    spanPrice.innerText = snapshot.val().price

    smallDescription.id = `description${snapshot.key}`
    smallDescription.classList.add('description')
    smallDescription.innerText = snapshot.val().description

    li.id = snapshot.key
    li.appendChild(spanName)
    li.appendChild(spanPrice)
    li.appendChild(smallDescription)

    createOptions(li,snapshot.key)
    listProducts.appendChild(li)
    addEventMouseEnter(li,snapshot.key)
  }

  function updateProductList(snapshot){
    const spanName = document.getElementById(`name${snapshot.key}`)
    const spanPrice = document.getElementById(`price${snapshot.key}`)
    const smallDescription = document.getElementById(`description${snapshot.key}`)

    spanName.innerText = snapshot.val().name
    spanPrice.innerText = Number(snapshot.val().price)
    smallDescription.innerText = snapshot.val().description
  }

  function removeProductList(snapshot){
    const li = document.getElementById(snapshot.key)
    li.remove()
  }

  function addProduct(e){
    e.preventDefault()

    if (emptyInputs()) {
      return alert('Asegurate de llenar todos los campos para poder agregar el producto.')
    }

    productsRef.push({
      name: inputName.value,
      description: inputDescription.value,
      price: inputPrice.value
    })

    resetValues()
  }

  function updateProduct(e){
    e.preventDefault()
    
    if (emptyInputs()) {
      return alert('Asegurate de llenar todos los campos para poder agregar el producto.')
    }

    productRef.set({
      name: inputName.value,
      description: inputDescription.value,
      price: inputPrice.value
    })
    
    resetValues()
  }

  function createOptions(li,id){
    const div = document.createElement('div')
    const spanEdit = document.createElement('span')
    const spanRemove = document.createElement('span')
    
    div.id = `option${id}`
    div.classList.add('options','display-none')

    // editar
    spanEdit.classList.add('fa','fa-pencil')
    spanEdit.style.color = '#FBBC05'
    spanEdit.addEventListener('click', e => handleClickEdit(id))
    
    // eliminar
    spanRemove.classList.add('fa','fa-close')
    spanRemove.style.color = '#EA4335'
    spanRemove.addEventListener('click', e => productsRef.child(id).remove())

    div.appendChild(spanEdit)
    div.appendChild(spanRemove)
    li.appendChild(div)
  }

  function handleClickEdit(id){
    btnAddProduct.classList.add('display-none')
    btnReset.classList.remove('display-none')
    btnUpdateProduct.classList.remove('display-none')

    productRef = productsRef.child(id);

    productRef.on('value', snapshot => {
      inputName.value = snapshot.val().name
      inputDescription.value = snapshot.val().description
      inputPrice.value = Number(snapshot.val().price)
    })
  }

  function addEventMouseEnter(object,id){
    object.addEventListener('mouseenter', e => {
      const options = document.getElementById(`option${id}`)
      options.classList.remove('display-none')
    })

    object.addEventListener('mouseleave', e => {
      const options = document.getElementById(`option${id}`)
      options.classList.add('display-none')
    })
  }

  function resetValues(e){
    if (e) e.preventDefault()

    inputName.value = ''
    inputDescription.value = ''
    inputPrice.value = ''

    btnUpdateProduct.classList.add('display-none')
    btnReset.classList.add('display-none')
    btnAddProduct.classList.remove('display-none')
  }

  function emptyInputs(){
    if (inputName.value === '' || inputDescription.value === '' || inputPrice.value === ''){
      return true
    }
    return false
  }

})()