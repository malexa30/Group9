
//Create express variable, set up the server, etc:
const express = require("express");
const app = express();
const port =3000;

//To allow Express to read the form data:
app.use(express.urlencoded({ extended: true }));

//To store feedback in memory in the form of an array:
let feedbackList = [];

//Serve the HTML page:
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Handle feedback submission to read page, store, and show confirmation message:
app.post("/submit", (req, res) => {
  const feedback = req.body.feedback;
  feedbackList.push(feedback);

  res.sendFile(__dirname + "/public/confirmation.html");
});




// Admin view: see the feedback anonymously
app.get("/admin", (req, res) => {
  res.send(feedbackList.join("<br>"));
});

//Server work to list on our port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});