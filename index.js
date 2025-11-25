import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//configuração da sessão
app.use(
  session({
    secret: "segredo123",
    resave: false,
    saveUninitialized: true,
  })
);

let produtos = []; 

//Tela de login
app.get("/", (req, res) => {
  res.send(`
        <h2>Login</h2>
        <form method="POST" action="/login">
            <input name="usuario" placeholder="Seu nome" required/>
            <button type="submit">Entrar</button>
        </form>
    `);
});

//processa o login
app.post("/login", (req, res) => {
  const { usuario } = req.body;

  //salva o nome do usuario na sessão
  req.session.usuario = usuario;

  //salva cookie com ultimo acesso
  res.cookie("ultimoAcesso", new Date().toLocaleString(), {
    maxAge: 3600000,
  });

  res.redirect("/cadastro");
});

//tela de cadastro (sapos logado)
app.get("/cadastro", (req, res) => {
  if (!req.session.usuario) {
    return res.send(
      "<h3>Você precisa realizar o login antes.</h3><a href='/'>Voltar</a>"
    );
  }

  const ultimoAcesso = req.cookies.ultimoAcesso || "Primeiro acesso";

  //tabela de produtos
  let tabela = "<h3>Nenhum produto cadastrado ainda.</h3>";
  if (produtos.length > 0) {
    tabela = `
        <table border="1" cellpadding="5">
            <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Custo</th>
                <th>Venda</th>
                <th>Validade</th>
                <th>Estoque</th>
                <th>Fabricante</th>
            </tr>
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
        </table>
        `;
  }

  res.send(`
        <h2>Cadastro de Produtos</h2>
        <p>Usuário logado: <strong>${req.session.usuario}</strong></p>
        <p>Último acesso: <strong>${ultimoAcesso}</strong></p>

        <form method="POST" action="/cadastro">
            <input name="codigo" placeholder="Código de barras" required/><br><br>
            <input name="descricao" placeholder="Descrição" required/><br><br>
            <input name="custo" placeholder="Preço de custo" required/><br><br>
            <input name="venda" placeholder="Preço de venda" required/><br><br>
            <input name="validade" placeholder="Data de validade" required/><br><br>
            <input name="estoque" placeholder="Quantidade em estoque" required/><br><br>
            <input name="fabricante" placeholder="Fabricante" required/><br><br>
            <button type="submit">Cadastrar</button>
        </form>

        <hr><br>

        <h2>Produtos cadastrados:</h2>
        ${tabela}
    `);
});

// cadastro de produto
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
