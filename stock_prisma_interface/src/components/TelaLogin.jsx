import Image from "next/image";
import styles from '../../components/TelaLogin.module.css'

export default function TelaLogin() {
    return (
        <div className={styles.container}>
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
            <div className="rightPanel">
                <div className="loginCard">
                    <h2>Login</h2>
                    <form action="">
                        <div className="inputBox">
                            <input type="text" placeholder="Usuário"/>
                        </div>
                        <div className="inputBox">
                            <input type="password" placeholder="Senha"/>
                        </div>
                        <div className="rememberForgot">
                            <input type="checkbox"/>
                        </div>
                        <button type="submit" className="btnLogin"> Login</button>
                        <a href="cadastro.html" className="btnRegister"> Cadastrar</a>
                    </form>
                </div>
            </div>
        </div>
    )
}
