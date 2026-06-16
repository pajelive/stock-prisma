export default function TelaLogin() {
    return (
        <div className="container">
            <div className="left-panel">
                <svg className="logo-svg" viewBox="0 0 200 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="100,8 192,168 8,168" fill="none" stroke="#29A8FF" stroke-width="9"
                             stroke-linejoin="round"/>
                    <polygon points="100,8 54,95 100,95" fill="#0A0A55"/>
                    <polygon points="100,8 146,95 100,95" fill="#1189D0"/>
                    <polygon points="54,95 100,168 146,95" fill="#0A0A55" opacity="0.75"/>
                </svg>
                <h1>STOCK <span>PRISMA</span></h1>
                <p className="slogan">A descoberta é o que nos move.</p>
            </div>

            <div className="right-panel">
                <div className="login-card">
                    <h2>Login</h2>
                    <form action="">
                        <div className="input-box">
                            <input type="text" placeholder="Usuário"/>
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="Senha"/>
                        </div>
                        <div className="remember-forgot">
                            <input type="checkbox"/>
                        </div>
                <button type="submit" className="btn-login"> Login</button>
                <a href="cadastro.html" className="btn-register"> Cadastrar</a>
            </form>
        </div>
    </div>

    </div>
    )
}
