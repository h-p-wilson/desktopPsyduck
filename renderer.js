const information = document.getElementById('info');
if (window.versions) {
    information.innerText = `This app is using Chrome v${window.versions.chrome()}, Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`;
}
else {
    information.innerText = "Something's gone wrong";
    console.log("Something's gone wrong");
}