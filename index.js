import express from "express";

const app = express();
const port = 4000;

app.use(express.urlencoded({ extended: true }));

let fornecedores = [];

const navbar = `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">Sistema PPI</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="/cadastro">Cadastro de Fornecedor</a></li>
        <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
      </ul>
    </div>
  </div>
</nav>
`;

function paginaBase(titulo, conteudo) {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>${titulo}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body class="bg-light">
    <div class="container mt-4">
      ${navbar}
      ${conteudo}
    </div>
  </body>
  </html>`;
}

app.get("/", (req, res) => {
  const conteudo = `
    <h2>Bem-vindo ao Sistema de Cadastro de Fornecedores</h2>
    <p>Utilize o menu acima para navegar entre as opções disponíveis.</p>
  `;
  res.send(paginaBase("Home", conteudo));
});

app.get("/login", (req, res) => {
  const conteudo = `
    <h3>Login</h3>
    <form method="POST" action="/login" class="w-50">
      <div class="mb-3">
        <label>Usuário:</label>
        <input type="text" name="usuario" class="form-control">
      </div>
      <div class="mb-3">
        <label>Senha:</label>
        <input type="password" name="senha" class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">Entrar</button>
    </form>
  `;
  res.send(paginaBase("Login", conteudo));
});

app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === "admin" && senha === "123") {
    res.send(paginaBase("Login", `<div class="alert alert-success">Login realizado com sucesso!</div>`));
  } else {
    res.send(paginaBase("Login", `<div class="alert alert-danger">Usuário ou senha inválidos!</div>`));
  }
});

app.get("/logout", (req, res) => {
  res.send(paginaBase("Logout", `<div class="alert alert-info">Logout efetuado com sucesso!</div>`));
});

app.get("/cadastro", (req, res) => {
  const lista = fornecedores.map(f => `
    <li class="list-group-item">
      <strong>${f.razaoSocial}</strong> (${f.nomeFantasia}) - ${f.cidade}/${f.uf}
    </li>`).join("");

  const conteudo = `
    <h3>Cadastro de Fornecedor</h3>
    <form method="POST" action="/cadastro" class="w-75">
      <div class="mb-3">
        <label>CNPJ:</label>
        <input type="text" name="cnpj" class="form-control">
      </div>
      <div class="mb-3">
        <label>Razão Social:</label>
        <input type="text" name="razaoSocial" class="form-control">
      </div>
      <div class="mb-3">
        <label>Nome Fantasia:</label>
        <input type="text" name="nomeFantasia" class="form-control">
      </div>
      <div class="mb-3">
        <label>Endereço:</label>
        <input type="text" name="endereco" class="form-control">
      </div>
      <div class="mb-3">
        <label>Cidade:</label>
        <input type="text" name="cidade" class="form-control">
      </div>
      <div class="mb-3">
        <label>UF:</label>
        <input type="text" name="uf" class="form-control">
      </div>
      <div class="mb-3">
        <label>CEP:</label>
        <input type="text" name="cep" class="form-control">
      </div>
      <div class="mb-3">
        <label>E-mail:</label>
        <input type="email" name="email" class="form-control">
      </div>
      <div class="mb-3">
        <label>Telefone:</label>
        <input type="text" name="telefone" class="form-control">
      </div>
      <button type="submit" class="btn btn-success">Cadastrar</button>
    </form>

    <hr/>
    <h4>Fornecedores já cadastrados:</h4>
    <ul class="list-group">
      ${lista || "<li class='list-group-item'>Nenhum fornecedor cadastrado ainda.</li>"}
    </ul>
  `;
  res.send(paginaBase("Cadastro de Fornecedor", conteudo));
});

app.post("/cadastro", (req, res) => {
  const { cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone } = req.body;

  let erros = "";
  if (!cnpj) erros += "<div class='alert alert-danger'>Informe o CNPJ.</div>";
  if (!razaoSocial) erros += "<div class='alert alert-danger'>Informe a Razão Social.</div>";
  if (!nomeFantasia) erros += "<div class='alert alert-danger'>Informe o Nome Fantasia.</div>";
  if (!endereco) erros += "<div class='alert alert-danger'>Informe o Endereço.</div>";
  if (!cidade) erros += "<div class='alert alert-danger'>Informe a Cidade.</div>";
  if (!uf) erros += "<div class='alert alert-danger'>Informe o Estado (UF).</div>";
  if (!cep) erros += "<div class='alert alert-danger'>Informe o CEP.</div>";
  if (!email) erros += "<div class='alert alert-danger'>Informe o E-mail.</div>";
  if (!telefone) erros += "<div class='alert alert-danger'>Informe o Telefone.</div>";

  if (erros === "") {
    fornecedores.push({ cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone });
    res.redirect("/cadastro");
  } else {
    const conteudo = `<h3>Erros no formulário:</h3>${erros}<a href="/cadastro" class="btn btn-secondary mt-3">Voltar</a>`;
    res.send(paginaBase("Erros", conteudo));
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
