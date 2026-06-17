import Image from "next/image";

export default function TelaLogin() {
    return (
        <div className="container">
            <div className="left-panel">
                <h1>STOCK <span>PRISMA</span></h1>
                <p className="slogan">A descoberta é o que nos move.</p>
            </div>
            <Image
                src="/stock-prisma-logo-vertical.png"
                alt="Stock Prisma"
                width={320}
                height={80}
                priority
                className="h-12 w-auto"
            />
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
