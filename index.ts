(async () => {
    const isDev = window.location.hostname === "localhost";

    if(isDev) {
        const ws = new WebSocket("ws://localhost:3001");

        ws.addEventListener("message", async (event) => {
            if(event.data === "reload") {
                console.log("Reloading Window");
                window.location.reload();
            }
        });
    }
    console.log("hey");
})(); 
