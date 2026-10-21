(function () {
    const modal = document.getElementById("modalMetodologia");
    const fechar = document.getElementById("fecharMetodologia");
    const entendi = document.getElementById("entendiMetodologia");
    if (!modal) return;
    function fecharModal() {
        modal.hidden = true;
        document.body.style.overflow = "";
    }
    function abrirModal() {
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        if (fechar) fechar.focus();
    }
    if (fechar) fechar.addEventListener("click", fecharModal);
    if (entendi) entendi.addEventListener("click", fecharModal);
    modal.addEventListener("click", function (event) {
        if (event.target === modal) fecharModal();
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) fecharModal();
    });
    // Mostra a explicação ao entrar no Dashboard.
    abrirModal();
})();
