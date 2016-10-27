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
  productsRef.on('child_added',    addProductList)
  productsRef.on('child_changed',  updateProductList)
  productsRef.on('child_removed',  removeProductList)
  
  // listeners del DOM
  btnAddProduct.addEventListener('click', addProduct)
  btnUpdateProduct.addEventListener('click',updateProduct)
  btnReset.addEventListener('click', resetValues)


  function addProductList(snap){
    const li = document.createElement('li')
    const spanName = document.createElement('span')
    const spanPrice = document.createElement('span')
    const smallDescription = document.createElement('small')

    spanName.id = `name${snap.key}`
    spanName.innerText = snap.val().name

    spanPrice.id = `price${snap.key}`
    spanPrice.classList.add('badge')
    spanPrice.innerText = snap.val().price

    smallDescription.id = `description${snap.key}`
    smallDescription.classList.add('description')
    smallDescription.innerText = snap.val().description

    li.id = snap.key
    li.appendChild(spanName)
    li.appendChild(spanPrice)
    li.appendChild(smallDescription)

    createOptions(li,snap.key)
    alertProducts.classList.add('display-none')
    listProducts.appendChild(li)
    addEventMouseEnter(li,snap.key)
  }

  function updateProductList(snap){
    const spanName = document.getElementById(`name${snap.key}`)
    const spanPrice = document.getElementById(`price${snap.key}`)
    const smallDescription = document.getElementById(`description${snap.key}`)

    spanName.innerText = snap.val().name
    spanPrice.innerText = Number(snap.val().price)
    smallDescription.innerText = snap.val().description
  }

  function removeProductList(snap){
    const li = document.getElementById(snap.key)
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

    spanEdit.innerText = 'O'
    spanEdit.style.color = '#FBBC05'
    spanEdit.addEventListener('click', e => handleClickEdit(id))
    
    spanRemove.innerText = 'X'
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

    productRef.on('value', snap => {
      inputName.value = snap.val().name
      inputDescription.value = snap.val().description
      inputPrice.value = Number(snap.val().price)
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