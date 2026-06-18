'use client'

import Image from "next/image";
import styles from './TelaLogin.module.css'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { login } from '../services/authService'
import { useAuth } from "@/context/AuthContext";


export default function TelaLogin() {
    const [matricula, setMatricula] = useState("");
    const [senha, setSenha] = useState("");
    const { usuario, loading, setUsuario } = useAuth();
    const router = useRouter();

    //redireciona se já estiver logado
    useEffect(() => {
        if (!loading && usuario) {
            router.replace("/");
        }
    }, [usuario, loading]);


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await login(matricula, senha);
            setUsuario(res);
            router.push("/");
        } catch (erro) {
            console.log("LOGIN ERRO:", erro);

            alert("Matrícula ou senha inválidas");
        }
    };

    if (loading || usuario) return null;

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
                            <input type="text" placeholder="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} name="username" autoComplete="username"/>
                        </div>
                        <div className={styles.inputBox} style={{ position: "relative" }}>
                            <input
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                name="password"
                                autoComplete="current-password"
                                style={{ paddingRight: "2.5rem" }}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                tabIndex={-1}
                                style={{
                                    position: "absolute",
                                    right: "0.75rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#6b7280",
                                    padding: 0,
                                    lineHeight: 1
                                }}
                            >
                                {mostrarSenha ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button type="submit" className={styles.btnLogin}> Login</button>
                        <a href="cadastro.html" className={styles.btnRegister}> Esqueci a senha</a>
                    </form>
                </div>
            </div>
        </div>
    )
}
