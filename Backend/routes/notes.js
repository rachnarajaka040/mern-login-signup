const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Notes = require("../models/Notes");
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
    res.json([]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


//add new notes
router.post(
  "/addallnotes",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "enter a valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({ title, description, tag, user: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.put('/updatenote/:id',fetchuser,
    async (req,res)=>{
        const{title,description,tag}=req.body;
        const newNote={};
        if(title) {newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};
try {
    let  note= await Notes.findById(req.params.id);
    if(!note) return res.status(404).send('Note not found');
    if(note.user.toString()!== req.user.id){
        return res.status(401).send("Note Allowed");
    }
    note =await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});
} catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
}
      

    }
)

router.delete('/deleteNote/:id',fetchuser,
async (req,res)=>{
    try {
        let note=await Notes.findById(req.params.id);
        if(!note) return res.status(404).send('Note not found');
        if(note.user.toString()!== req.user.id){
            return res.status(401).send("Note Allowed");
        }
        await Notes.findByIdAndDelete(req.params.id);
        res.json({message:"Note deleted successfully"})
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }

})

module.exports = router;