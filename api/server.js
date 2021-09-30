// BUILD YOUR SERVER HERE
const express = require("express"); //bring in express
const server = express(); //initialize it
const Users = require("./users/model.js");
server.use(express.json()); //allows server to use json

//Endpoints

server.get("/api/users", (req, res) => {
  Users.find().then((users) => {
    res.status(200).json(users);
  })
  .catch(()=>{
      res.status(500).json({ message: "The users information could not be retrieved" })
  })
});

server.get("/api/users/:id", (req, res) => {
  const idVariable = req.params.id;
  Users.findById(idVariable)
    .then((user) => {
      if (!user) {
        res.status(404).json({message: "The user with the specified ID does not exist"});
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

server.post("/api/users", (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.bio) {
    res.status(400).json({message:"Please provide name and bio for the user"});
  } else {
    Users.insert(newUser)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch(() => {
        res.status(500).json({ message: "There was an error while saving the user to the database"});
      });
  }
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const userChanges = req.body;
  if (!userChanges.name || !userChanges.bio) {
    res.status(400).json({message:"Please provide name and bio for the user"});
  } else {
    Users.update(id, userChanges)
      .then((user) => {
        if (!user) {
          res.status(404).json({message:"The user with the specified ID does not exist"});
        } else {
          res.status(200).json(user);
        }
      })
      .catch(() => {
        res.status(500).json({ message: "The user information could not be modified" });
      });
  }
});

server.delete("/api/users/:id",(req,res)=>{
    const {id} = req.params;
    Users.remove(id)
    .then((user)=>{if(!user){
            res.status(404).json({message:"The user with the specified ID does not exist"})
        }else{
            res.status(200).json(user)
        }
    }).catch(()=>{
        res.status(500).json({message:"The user could not be removed"})
    })

})

server.use("*", (req, res) => {
  res.status(404).json({ message: "404 Not Found" });
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
