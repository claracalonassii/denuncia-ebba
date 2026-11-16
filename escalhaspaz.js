
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("reportForm");

    if (form) {

        form.addEventListener("submit", (event) => {

            event.preventDefault();

            const category =
                document.getElementById("category").value;

            const place =
                document.getElementById("place").value;

            const description =
                document.getElementById("description").value.trim();

            const feedback =
                document.getElementById("successMessage");

            if (!category || !place || description.length < 15) {

                feedback.textContent =
                    "Confira os campos. A descrição precisa ter pelo menos 15 caracteres.";

                feedback.classList.add("visible");

                return;
            }

            form.reset();

            feedback.textContent =
                "Relato demonstrativo registrado nesta tela. Nenhuma informação foi enviada ou armazenada. Em uma situação real, procure também um adulto de confiança ou a equipe responsável da escola.";

            feedback.classList.add("visible");

        });

    }

});
