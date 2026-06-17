import api from "./api";

export async function login(matricula, senha) {

    const { data } = await api.post("/admin/auth/login", {
        matricula,
        senha
    });

    return data;
}