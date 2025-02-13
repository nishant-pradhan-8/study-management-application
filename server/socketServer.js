/*
const User = require("./src/models/userModel")

module.exports = function(io) {

const rooms = {};

io.on("connection", (socket) => {
    console.log(`Socket Connected`, socket.id);
    socket.on("create:room",async(user, callback)=>{
      
      const roomId = Math.random().toString(36).substring(2, 10);
    
      const userInfo = await getUserInfo(user);
      if(!userInfo){
        callback({member:null,roomId})
      }
      
      let member = {
        userId: userInfo._id,
        profilePicture: userInfo.profilePicture,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        socketId: socket.id,
        isOwner: true,
        sharingScreen: false
      }
      rooms[roomId] = [member];
      console.log(rooms)
      callback({member,roomId})
    })
    
    socket.on("join:room",async(data, callback)=>{
      const {user,roomId} = data
     
       if(!rooms[roomId]){
         callback({member:null,roomId:null})
         
       }
      
       const userInfo = await getUserInfo(user);
       if(!userInfo){
         callback({member:null,roomId})
       }
       let member = {
        userId: userInfo._id,
        profilePicture: userInfo.profilePicture,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        socketId: socket.id,
        isOwner: false,
        sharingScreen:false

      }
   
       rooms[roomId].push(member);
       console.log(rooms)
       callback({member,roomId})
       
    })

  });
}

const getUserInfo = async(userId) =>{

  const userInfo = await User.findOne({_id: userId}).select("profilePicture firstName lastName")
  if(userInfo){
    return userInfo
  }
  
  return null
 
}
/*
  
  socket.on("room:join", (data) => {
    const { email, room } = data;

    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });*/