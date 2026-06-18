'use client'

import Image from "next/image";
import styles from './TelaLogin.module.css'
import { useState } from "react";
import { useRouter } from "next/navigation"
import { login } from '../services/authService'

export default function TelaLogin() {
    const [matricula, setMatricula] = useState("");
    const [senha, setSenha] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await login(matricula, senha);
            router.push("/");
        } catch (erro) {
            alert("Matrícula ou senha inválidas");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <Image
                    src="/logo-simbolo.png"
                    alt="Stock Prisma"
                    width={400}
                    height={400}
                    className={styles.logo}
                />
                <h1>STOCK <span>PRISMA</span></h1>
                <p className={styles.slogan}>A descoberta é o que nos move.</p>
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.loginCard}>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className={styles.inputBox}>
                            <input type="text" placeholder="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                        </div>
                        <div className={styles.inputBox}>
                            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                        </div>
                        <div className={styles.rememberForgot}>
                            <input id="remember" type="checkbox"/>
                            <label htmlFor="remember">Lembrar-me</label>
                        </div>
                        <button type="submit" className={styles.btnLogin}> Login</button>
                        <a href="cadastro.html" className={styles.btnRegister}> Esqueci a senha</a>
                    </form>
                </div>
            </div>
        </div>
    )
}
