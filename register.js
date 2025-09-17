
//configuração do firebase
const firebaseConfig = {
  apiKey: "AIzaSyCkRzZewk-Ujmh03M1QZcTQjDKpJrf1WhM",
  authDomain: "programaaiweb-d128e.firebaseapp.com",
  projectId: "programaaiweb-d128e",
  storageBucket: "programaaiweb-d128e.appspot.com",
  messagingSenderId: "318944516779",
  appId: "1:318944516779:web:913b58d9067f229880b5ee",
  measurementId: "G-QDPDD9C8KP"
  
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const database = firebase.database();

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

//funções para a tela de login e cadastro
function exibirFormularioLogin() {
  container.classList.remove("sign-up-mode");
}

function exibirFormularioCadastro() {
  container.classList.add("sign-up-mode");
}

//evento de click do login e cadastro
sign_in_btn.addEventListener("click", exibirFormularioLogin);

sign_up_btn.addEventListener("click", exibirFormularioCadastro);

function registrar() {
  var user = document.getElementById('user_reg').value;
  var email = document.getElementById('email_reg').value;
  var senha = document.getElementById('senha_reg').value;

  if (validar_email(email) == false || validar_senha(senha) == false) {
    alert('Os campos estão vazios ou inválidos');
    return;

  }

  if (validar_campos(user) == false) {
    alert('Os campos estão vazios');
    return;
  }

  auth.createUserWithEmailAndPassword(email, senha)
    .then(function () {

      var usuarioAtual = auth.currentUser;

      var database_ref = database.ref()

      var user_data = {
        email: email,
        user: user,
        ultimo_login: Date.now()

      }

      database_ref.child('users/' + usuarioAtual.uid).set(user_data);

      if (usuarioAtual) {
        alert('Usuário Cadastrado');
        exibirFormularioLogin();

      } else {
        alert('Falha no login. Verifique suas credenciais.');
      }

    })
    .catch(function (error) {
      var error_code = error.code
      var error_message = error.message

      alert(error_message)
    });

}

function login() {
  var email = document.getElementById('email_log').value;
  var senha = document.getElementById('senha_log').value;

  if (validar_email(email) === false || validar_senha(senha) === false) {
    alert('Os campos estão vazios ou inválidos');
    return;
  }

  auth.signInWithEmailAndPassword(email, senha)
    .then(function (userCredential) {
      var usuarioAtual = userCredential.user;
      var databaseRef = database.ref();
      var user_data = {
        ultimo_login: Date.now()
      };


      databaseRef.child('users/' + usuarioAtual.uid).update(user_data);

      // Verificar se o usuário foi autenticado com sucesso
      if (usuarioAtual) {
        alert('Usuário Logado');
        window.location.href = 'Carrossel/carrossel.html';

      } else {
        alert('Falha no login. Verifique suas credenciais.');
      }

    })
    .catch(function (error) {

      var errorCode = error.code;
      var error_message = error.message;

      if (errorCode === 'auth/user-not-found') {
        alert(`O email: ${email}\nNão está cadastrado!`);
      } else {
        alert(errorMessage);
      }
    });
}

function validar_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    return true;

  } else {
    return false;
  }

}

function validar_senha(senha) {
  if (senha < + 6) {
    window.alert('A senha deve possuir 6 ou mais caracteres');
    return false;
  } else {
    return true;
  }
}

function validar_campos(field) {
  if (field == null) {
    return false;

  }
  if (field.length <= 0) {
    return false;
  }
  else {
    return true;
  }

}

function exibirPerfilUsuario() {
  var usuarioAtual = auth.currentUser;
  var databaseRef = database.ref('users/' + usuarioAtual.uid);

  databaseRef.once('value')
    .then(function (snapshot) {
      var user_data = snapshot.val();

      // Exibir os dados na tela de perfil
      document.getElementById('nomeUsuario').textContent = user_data.user;
      document.getElementById('emailUsuario').textContent = user_data.email;
    })
    .catch(function (error) {
      console.error(error);
    });
}
