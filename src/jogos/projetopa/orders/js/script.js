function validarFormulario() {
  var senha = document.getElementById("senha").value;
  var confirmacaoSenha = document.getElementById("confirma-senha").value;
  if (senha !== confirmacaoSenha) {
    alert("As senhas não coincidem. Por favor, verifique e tente novamente.");
    return false; // impede o envio do formulário se as senhas não coincidirem
  }
}
