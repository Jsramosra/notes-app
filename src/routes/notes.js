const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const {isAuthenticated} = require('../helpers/auth');
router.get('/notes/add', isAuthenticated ,(req, res) =>{
    res.render('notes/newNote');
});

router.post('/notes/newNote', isAuthenticated, async (req,res) =>{
   const {title, description} = req.body;
   const errors = [];
   if(!title){
       errors.push({text: 'Please write a title'});
   }
   if(!description){
       errors.push({text: 'Please write a description'});
   }
   if(errors.length>0){
       res.render('notes/newNote', {
        errors,
        title,
        description
       });
   }else{
    const newNote = new Note({title, description});
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', "Nota agregada satisfactoriamente");
    res.redirect('/notes');
   }
});
router.get('/notes', isAuthenticated, async (req, res) =>{
  const notes = await  Note.find({user: req.user.id}).sort({date: 'desc'});
  res.render('notes/allNotes', {notes});
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) =>{
 const note = await Note.findById(req.params.id);
    res.render('notes/editNote',{note});
});

router.put('/notes/editNote/:id', isAuthenticated, async (req, res) =>{
    const {title, description}= req.body;
   await Note.findByIdAndUpdate(req.params.id, {title, description});
   req.flash('success_msg', "Nota actualizada satisfactoriamente");
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req,res) =>{
    const {title, description} = req.body;
    await Note.findByIdAndRemove(req.params.id);
    req.flash('success_msg', "Nota eliminada satisfactoriamente");
    res.redirect('/notes');

});
module.exports = router;