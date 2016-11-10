(() => {
  'use strict'
  // referencias a firebase
  const rootRef     = firebase.database().ref()
  const authRef     = firebase.auth()

  let currentUser = null

  // componentes de la UI
  const welcomeContainer = document.getElementById('welcomeContainer')
  const loginForm = document.getElementsByName('loginForm')[0]
  const sectionList = document.getElementById('sectionLists')
  const username = document.getElementById('username')
  const avatar = document.getElementById('avatar')

  // componentes login
  const inputEmail = document.getElementById('inputEmail')
  const inputPassword = document.getElementById('inputPassword')
  const btnSignOut = document.getElementById('btnSignOut')
  const btnSignUp = document.getElementById('btnSignUp')
  const btnSignIn = document.getElementById('btnSignIn')
  const btnSignInWithGoogle = document.getElementById('btnSignInWithGoogle')
  const btnSignInWithTwitter = document.getElementById('btnSignInWithTwitter')
  const btnSignInWithGithub = document.getElementById('btnSignInWithGithub')
  const spanErrorMessage = document.getElementById('messageError')

  // listeners de los botones del login
  btnSignUp.addEventListener('click', e => handleLogin(e,'register'))
  btnSignIn.addEventListener('click', e => handleLogin(e,'email'))
  btnSignInWithGoogle.addEventListener('click', e => handleLogin(e,'google'))
  btnSignInWithTwitter.addEventListener('click', e => handleLogin(e,'twitter'))
  btnSignInWithGithub.addEventListener('click', e => handleLogin(e,'github'))
  btnSignOut.addEventListener('click', signOut)

  // verificar si hay alguna sesión activa
  authRef.onAuthStateChanged(user => {
    currentUser = user
    if (user) {
      showComponentsUI()
    } else {
      hideComponentsUI()
    }
  })

  function handleLogin(e,provider) {
    e.preventDefault()
    spanErrorMessage.classList.add('display-none')
    let email, password, providerRef

    if (provider === 'email' || provider === 'register'){
      if (emptyInputs()){
        return showLoginError('Debes escribir tu email y contraseña')
      }
      email = inputEmail.value
      password = inputPassword.value
    }

    if (provider === 'register') signUp(email,password)
    if (provider === 'email') signIn(email,password)
    if (provider === 'google') providerRef = new firebase.auth.GoogleAuthProvider();
    if (provider === 'twitter') providerRef = new firebase.auth.TwitterAuthProvider();
    if (provider === 'github') providerRef = new firebase.auth.GithubAuthProvider()
    
    signInWithProvider(providerRef)
  }

  function signUp(email,password) {
    authRef.createUserWithEmailAndPassword(email,password)
      .then(user => {
        clearInputs()
      })
      .catch(error => {
        showLoginError(error.message)
      })
  }

  function signIn(email,password) {
    authRef.signInWithEmailAndPassword(email,password)
      .then(user => {
        clearInputs()
      })
      .catch(error => {
        showLoginError(error.message)
      })
  }

  function signInWithProvider(provider){
    authRef.signInWithPopup(provider)
      .catch(error => {
        showLoginError(error.message)
      })
  }

  function signOut() {
    authRef.signOut()
      .then(hideComponentsUI)
      .catch(error => console.log('error cerrar sesión', error))
  }

  function showLoginError(error) {
    let msj = '<span class="fa fa-warning"></span>&nbsp;'
    spanErrorMessage.innerHTML = `${msj}${error}`
    spanErrorMessage.classList.remove('display-none')
  }

  function emptyInputs() {
    if (inputEmail.value === '' || inputPassword.value === ''){
      return true
    }
    return false
  }

  function clearInputs() {
    inputEmail.value = ''
    inputPassword.value = ''
  }

  function showOptionsUser(){
    if (currentUser.displayName !== null) {
      username.innerText = currentUser.displayName
    } else {
      username.innerText = currentUser.email
    }

    if (currentUser.photoURL !== null){
      avatar.src = currentUser.photoURL
      avatar.classList.remove('display-none')
    }
  }

  function showComponentsUI() {
    showOptionsUser()
    loginForm.classList.add('display-none')
    welcomeContainer.classList.remove('display-none')
    sectionList.classList.remove('display-none')
  }

  function hideComponentsUI() {
    loginForm.classList.remove('display-none')
    welcomeContainer.classList.add('display-none')
    sectionList.classList.add('display-none')
  }
})()