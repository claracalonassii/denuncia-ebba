
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("responsavelForm");
    const erro = document.getElementById("loginErro");

    // Credenciais fictícias para demonstração do projeto.
    // Substitua pelos dados de teste que você definiu para a apresentação.
    const equipeAutorizada = [
        {
            email: "secretaria@escola.com",
            senha: "Secretaria123",
            cargo: "secretaria"
        },
        {
            email: "diretora@escola.com",
            senha: "Diretora123",
            cargo: "diretora"
        }
    ];

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("email")
            .value.trim().toLowerCase();

        const senha = document.getElementById("password").value;

        const cargo = document.getElementById("cargo").value;

        const usuario = equipeAutorizada.find((pessoa) =>
            pessoa.email === email &&
            pessoa.senha === senha &&
            pessoa.cargo === cargo
        );

        if (usuario) {

            const dadosResponsavel = {
                email: usuario.email,
                cargo: usuario.cargo,
                autenticado: true
            };

            localStorage.setItem(
                "escolhaPazResponsavel",
                JSON.stringify(dadosResponsavel)
            );

            window.location.href = "responsavel.html";

        } else {

            erro.textContent =
                "Dados incorretos ou acesso não autorizado.";

        }

    });

});
