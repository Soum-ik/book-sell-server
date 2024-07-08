import { Server } from 'socket.io';


const chatSocket = (io: Server): void => {
    io.on('connection', (socket) => {
        console.log('One user connected', socket.id);
        
        socket.emit('hello', 'world');
        socket.on('chat-system', (data) =>{ 
            console.log(data, 'data ');
            
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

export default chatSocket;
