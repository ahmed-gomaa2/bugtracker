module.exports = (app, io) => {
    io.on('connection', socket => {
        console.log(socket.id);

        socket.on('join_room', id => {
            console.log('User with id: ' + id + ' joined room');
            socket.join(id);
        });

        socket.on('remove_engineer', data => {
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

        socket.on('create-task', data => {
            data.engineers.map(eng => {
                io.to(eng.id).emit('create_task', data);
            })
        });

        socket.on('change-type', data => {
            data.engineers.map(eng => {
                io.to(eng.id).emit('change_type', data);
            });
        });

        socket.on('change-status', data => {
            console.log(data);
            const engineers = [
                    ...data.engineers.map(eng => eng.id),
                    data.task.owner_id
            ];
            console.log(engineers)
            engineers.filter(eng => eng != data.currentUser.id).map(eng => {
                console.log(eng);
                io.to(eng).emit('change_status', data);
            });
        });

        socket.on('change-date', data => {
            console.log(data);
            data.task.engineers.map(eng => {
                io.to(eng.id).emit('change_date', data);
            });
        });

        socket.on('change-priority', data => {
            data.task.engineers.map(eng => {
                io.to(eng.id).emit('change_priority', data);
            });
        });

        socket.on('change-title', data => {
            data.task.engineers.map(eng => {
                console.log(eng.id);
                io.to(eng.id).emit('change_title', data);
            });
        });

        socket.on('disconnect', () => {
            console.log('USER WITH ID: ' + socket.id + ' DISCONNECTED');
        });
    });
}