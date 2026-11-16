document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", event => {
        event.preventDefault();

        const profile = document.getElementById("profile").value;

        const user = {
            email: document.getElementById("email").value.trim(),
            classroom: document.getElementById("classroom").value.trim(),
            profile
        };

        localStorage.setItem("escolhaPazUser", JSON.stringify(user));

        window.location.href =
            profile === "responsavel"
                ? "responsavel.html"
                : "escalhaspaz.html";
    });
});
