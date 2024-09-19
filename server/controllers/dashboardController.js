// Add the note
exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
        const { title, body } = req.body;

        // Assuming you have a Note model connected to your MongoDB
        const newNote = new Note({
            title: title,
            body: body,
            createdAt: new Date()
        });

        await newNote.save(); // Save the note to the database

        // Redirect to the homepage after the note is saved
        res.redirect('/Home');
    } catch (error) {
        console.error('Error adding note:', error);
        res.redirect('/Home'); // In case of error, redirect back to home (can improve error handling)
    }
};
