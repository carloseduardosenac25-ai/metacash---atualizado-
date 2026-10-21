const form = document.getElementById("loginForm");
const inputNome = document.getElementById("nome");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = inputNome.value.trim();

  if (nome.length < 2) {
    alert("Digite um nome válido.");
    return;
  }

  const usuario = {
    nome: nome,
    saldo: 0,
    entradas: [],
    gastos: [],
    categorias: []
  };

  localStorage.setItem("usuario", JSON.stringify(usuario));

  window.location.href = "../meta/cadastro.html";
});