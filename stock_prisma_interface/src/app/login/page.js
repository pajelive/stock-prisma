export default function Home() {
    return (

    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - Stock Prisma</title>
        </head>
    <body>

        <div class="container">

            <div class="left-panel">
                <svg class="logo-svg" viewBox="0 0 200 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="100,8 192,168 8,168" fill="none" stroke="#29A8FF" stroke-width="9" stroke-linejoin="round"/>
                    <polygon points="100,8 54,95 100,95" fill="#0A0A55"/>
                    <polygon points="100,8 146,95 100,95" fill="#1189D0"/>
                    <polygon points="54,95 100,168 146,95" fill="#0A0A55" opacity="0.75"/>
                </svg>
                <h1>STOCK <span>PRISMA</span></h1>
                <p class="slogan">A descoberta é o que nos move.</p>
            </div>

            <div class="right-panel">
                <div class="login-card">
                    <h2>Login</h2>
                    <form action="">
                        <div class="input-box">
                            <input type="text" placeholder="Usuário" required>
                        </div>
                        <div class="input-box">
                            <input type="password" placeholder="Senha" required>
                        </div>
                        <div class="remember-forgot">
                            <label><input type="checkbox"> Lembrar-me</label>
                        </div>
                        <button type="submit" class="btn-login"> Login</button>
                        <a href="cadastro.html" class="btn-register"> Cadastrar</a>
                    </form>
                </div>
            </div>

        </div>

    </body>
    </html>
    )
}