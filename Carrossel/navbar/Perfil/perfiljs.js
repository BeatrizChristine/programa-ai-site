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

// Obtém a referência para o elemento botão "Alterar Foto", a imagem de perfil e a lista de imagens disponíveis
const btnAlterarFoto = document.getElementById('btnAlterarFoto');
const fotoPerfil = document.getElementById('fotoPerfil');

var menu = document.querySelector('#menu_icon');
var navbar = document.querySelector('.navbar');
var home = document.querySelector('#Home');
var about = document.querySelector('#About');
var crono = document.querySelector('#Cronograma');
var sair = document.querySelector('#Logout');


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // O usuário está autenticado
    exibirPerfilUsuario();
  }
});

// Função para exibir as informações do usuário na tela de perfil
function exibirPerfilUsuario() {
  var usuarioAtual = auth.currentUser;
  var databaseRef = database.ref('users/' + usuarioAtual.uid);

  databaseRef.once('value')
    .then(function(snapshot) {
      var user_data = snapshot.val();

      // Exibir os dados na tela de perfil
      document.getElementById('nomeUsuario').textContent = user_data.user;
      document.getElementById('nomeUser').textContent = user_data.user;
      document.getElementById('emailUsuario').textContent = user_data.email;
      
      // Verificar se há uma foto de perfil no banco de dados
      if (user_data.foto) {
        document.getElementById('fotoPerfil').src = user_data.foto;
      }
    })
    .catch(function(error) {
      console.error(error);
    });
}



// Adiciona um evento de escuta quando o botão "Alterar Foto" for clicado
btnAlterarFoto.addEventListener('click', exibirOpcoesFoto);

// Função para exibir as opções de foto em uma nova janela
function exibirOpcoesFoto() {
  const novaJanela = window.open('imgs/opcoes_foto.html', 'Opções de Foto', 'width=500,height=500');
  window.addEventListener('message', function (event) {
    if (event.origin === window.location.origin) {
      if (event.data.foto) {
        definirFotoPerfil(event.data.foto);
      }
    }
  });

  function definirFotoPerfil(nomeFoto) {
    const fotoPerfil = document.getElementById('fotoPerfil');
    fotoPerfil.src = nomeFoto;
  
    // Salvar a URL da foto no banco de dados
    var usuarioAtual = auth.currentUser;
    var databaseRef = database.ref('users/' + usuarioAtual.uid);
  
    var user_data = {
      foto: nomeFoto
    };
  
    databaseRef.update(user_data)
      .then(function() {
        console.log("Foto de perfil atualizada no banco de dados");
      })
      .catch(function(error) {
        console.error(error);
      });
  }
}

menu.onclick = () => {
  menu.classList.toggle('bx-x');
  navbar.classList.toggle('open')
}

function homepage() {
  window.location.href = '../../carrossel.html';
}

function aboutpage() {
  window.location.href = '../About/about.html';
}

function cronopage() {
  window.location.href = '../Cronograma/crono.html'
}


function logout() {
  auth.signOut()
    .then(function () {
      // Logout bem-sucedido, redirecione para a tela de login
      window.location.href = '../../../index.html';
    })
    .catch(function (error) {
      // Tratar erros de logout, se necessário
      console.log(error);
    });
}



