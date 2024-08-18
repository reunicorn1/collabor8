import { Server } from "@hocuspocus/server";

const server  = Server.configure({
    async onConnect(data) {
        console.log(`New websocket connection has been established as ${data.socketId}`);
    }

    // A hook will be created for loading the document <onLoadDocument>
    // Another hook will be created to store the document in the database <onStoreDocument>
})

export { server };