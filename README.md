# MyNotes App
MyNotes is a simple application that will provide users with a form to create and share notes with content and title, able to edit and update the  existing notes and also capable of deleting their notes.
The application provides features such as user authentication, dynamic search and a user interfaced styled by Tailwindcss.

# Usage Guideline
User Authentication: User can register or login to access his notes
Creating notes: Using the form a user can create his/ her notes
Managing notes: User has the ability to update the created note or delete it. The user also can search the notes by title or word.



# Technologies used
Backend: Node.js, Express.js, MongoDB (Mongoose)
Frontend: EJS, Tailwind CSS
Database: MongoDB (Atlas)

# Setup Instruction
Install the following:
NodeJs, Git

Clone the repository
Step 1: git clone https://github.com/Ofallbrains/MyNotes.git
        cd MyNotes-app

Step 2: npm install

Step 3: Setup environment variables
MONGO_URI=mongodb+srv://yourMongoDBURI
JWT_SECRET=yourJWTSecret

# Start the server
nodemon/yourserver.js
