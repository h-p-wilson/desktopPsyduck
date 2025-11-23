// To see logging I need to open the dev tools using cmd+option+i
const information = document.getElementById('info');
if (window.versions) {
    information.innerText = `This app is using Chrome v${window.versions.chrome()}, Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`;
}
else {
    information.innerText = "Something's gone wrong";
    console.log("Something's gone wrong");
}

const func = async() => {
    console.log("About to call ping...");
    const response = await window.versions.ping()
    console.log("Ping response:", response) // should be pong
    console.log("✅ Ping/Pong is working!");
}

func()