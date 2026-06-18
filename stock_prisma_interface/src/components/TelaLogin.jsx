'use client'

import Image from "next/image";
import styles from './TelaLogin.module.css'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { login } from '../services/authService'
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function TelaLogin() {
    const [matricula, setMatricula] = useState("");
    const [senha, setSenha] = useState("");
    const { usuario, loading, setUsuario } = useAuth();
    const router = useRouter();
    const [senhaVisivel, setSenhaVisivel] = useState(false);

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
                                type={senhaVisivel ? "text" : "password"}
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                name="password"
                                autoComplete="current-password"
                                style={{ paddingRight: "2.5rem" }}
                            />

                            <button
                                type="button"
                                onClick={() => setSenhaVisivel((prev) => !prev)}
                                style={{
                                    position: "absolute",
                                    right: "0.75rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    color: "#6b7280"
                                }}
                            >
                                {senhaVisivel ? <EyeOff size={18} /> : <Eye size={18} />}
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
