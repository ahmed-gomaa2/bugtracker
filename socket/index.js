module.exports = (app, io) => {
    io.on('connection', socket => {
        console.log(socket.id);

        socket.on('join_room', id => {
            console.log('User with id: ' + id + ' joined room');
            socket.join(id);
        });

        socket.on('remove_engineer', data => {
            console.log('removed');
            const dataSent = {
                user_id: data.user_id,
                task: data.task
            };
            data.engineers.map(eng => {
                io.to(eng.id).emit('engineer_removed', dataSent);
            })
        });

        socket.on('add-engineer', data => {
            data.task.engineers.map(eng => {
                io.to(eng.id).emit('engineer_added', data);
            });
        });

        socket.on('disconnect', () => {
            console.log('USER WITH ID: ' + socket.id + ' DISCONNECTED');
        });
    });
}