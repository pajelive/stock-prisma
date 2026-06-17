import Image from "next/image";
import styles from './TelaLogin.module.css'

export default function TelaLogin() {
    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <Image
                    src="/stock-prisma-logo-vertical.png"
                    alt="Stock Prisma"
                    width={320}
                    height={80}
                    priority
                    className="h-12 w-auto"
                />
                <h1>STOCK <span>PRISMA</span></h1>
                <p className="slogan">A descoberta é o que nos move.</p>
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.loginCard}>
                    <h2>Login</h2>
                    <form action="">
                        <div className={styles.inputBox}>
                            <input type="text" placeholder="Usuário"/>
                        </div>
                        <div className={styles.inputBox}>
                            <input type="password" placeholder="Senha"/>
                        </div>
                        <div className={styles.rememberForgot}>
                            <input type="checkbox"/>
                        </div>
                        <button type="submit" className={styles.btnLogin}> Login</button>
                        <a href="cadastro.html" className={styles.btnRegister}> Cadastrar</a>
                    </form>
                </div>
            </div>
        </div>
    )
}
