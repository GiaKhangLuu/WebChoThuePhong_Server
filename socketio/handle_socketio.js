module.exports.ReceiveMessage = async (io, data) => {
  var receiver_socket_id = data.id_receiver
  io.to(receiver_socket_id).emit('renderMessage', data.message)
}

module.exports.SetUpSocketID = (socket, data) => {
  user_id = data.user_id
  socket.id = user_id
  console.log(socket.id)
}

