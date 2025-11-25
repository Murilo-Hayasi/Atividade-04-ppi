import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "segredo123",
    resave: false,
    saveUninitialized: true,
  })
);

let produtos = [];

app.get("/", (req, res) => {
  res.send(`
      <html>
      <head>
          <title>Login</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
      </head>
      <body class="bg-light">
          <div class="container mt-5">
              <div class="col-md-6 offset-md-3">
                  <div class="card shadow">
                      <div class="card-header text-center">
                          <h3>Login</h3>
                      </div>
                      <div class="card-body">
                          <form method="POST" action="/login">
                              <label>Nome completo:</label>
                              <input name="usuario" class="form-control" placeholder="Exemplo: João da Silva" required><br>

                              <button class="btn btn-primary w-100">Entrar</button>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `);
});

app.post("/login", (req, res) => {
  const { usuario } = req.body;

  if (!usuario.includes(" ")) {
    return res.send(`
          <h3>Digite seu NOME COMPLETO.</h3>
          <a href="/">Voltar</a>
        `);
  }

  req.session.usuario = usuario;

  res.cookie("ultimoAcesso", new Date().toLocaleString(), {
    maxAge: 3600000,
  });

  res.redirect("/cadastro");
});

//tela de cadastro (apos logado)
app.get("/cadastro", (req, res) => {
  if (!req.session.usuario) {
    return res.send(
      "<h3>Você precisa realizar o login antes.</h3><a href='/'>Voltar</a>"
    );
  }

  const ultimoAcesso = req.cookies.ultimoAcesso || "Primeiro acesso";

  let tabela = `
      <p class="text-muted">Nenhum produto cadastrado ainda.</p>
  `;

  if (produtos.length > 0) {
    tabela = `
        <table class="table table-striped mt-4">
            <thead class="table-dark">
              <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Custo</th>
                  <th>Venda</th>
                  <th>Validade</th>
                  <th>Estoque</th>
                  <th>Fabricante</th>
              </tr>
            </thead>
            <tbody>
              ${produtos
                .map(
                  (p) => `
                <tr>
                    <td>${p.codigo}</td>
                    <td>${p.descricao}</td>
                    <td>${p.custo}</td>
                    <td>${p.venda}</td>
                    <td>${p.validade}</td>
                    <td>${p.estoque}</td>
                    <td>${p.fabricante}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
        </table>
        `;
  }

  res.send(`
    <html>
    <head>
        <title>Cadastro de Produtos</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    </head>

    <body class="bg-light">
        <nav class="navbar navbar-dark bg-dark">
            <div class="container">
                <span class="navbar-brand">
                  Logado como: <strong>${req.session.usuario}</strong>
                </span>

                <span class="text-white">Último acesso: ${ultimoAcesso}</span>
            </div>
        </nav>

        <div class="container mt-4 mb-5">

            <div class="card shadow">
                <div class="card-header bg-primary text-white">
                    <h4>Cadastro de Produtos</h4>
                </div>

                <div class="card-body">
                    <form method="POST" action="/cadastro">

                        <label>Código de barras:</label>
                        <input class="form-control" name="codigo" required><br>

                        <label>Descrição:</label>
                        <input class="form-control" name="descricao" required><br>

                        <label>Preço de custo:</label>
                        <input class="form-control" name="custo" required><br>

                        <label>Preço de venda:</label>
                        <input class="form-control" name="venda" required><br>

                        <label>Data de validade:</label>
                        <input type="date" class="form-control" name="validade" required><br>

                        <label>Quantidade em estoque:</label>
                        <input type="number" class="form-control" name="estoque" required><br>

                        <label>Fabricante:</label>
                        <input class="form-control" name="fabricante" required><br>

                        <button class="btn btn-success w-100 mt-3">Cadastrar Produto</button>
                    </form>
                </div>
            </div>

            <h3 class="mt-5">Produtos cadastrados:</h3>
            ${tabela}

        </div>
    </body>
    </html>
  `);
});

//cadastro de produto
app.post("/cadastro", (req, res) => {
  if (!req.session.usuario) {
    return res.send("<h3>Você precisa estar logado.</h3>");
  }

  produtos.push(req.body);
  res.redirect("/cadastro");
});

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);
