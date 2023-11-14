window.addEventListener('load', () => {
    gsap.from(".mainContainer", {translateX : -200, duration: 2});
})

function submitForm() {
    var inputData = document.getElementById("request").value;

    $.ajax({
        type: "POST",
        url: "/traitement",
        data: { inputData: inputData },
        success: function(response) {
            // Mettre à jour le contenu de l'élément DOM avec la réponse du serveur
            $("#result").html('Message du serveur : ' + response.message + '<br>Data : ' + response.data);
        }
    });
}
