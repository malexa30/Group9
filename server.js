const express = require("express");
const app = express();
const port = 3000;

// Allow Express to read form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // needed for JSON requests

// Serve static files
app.use(express.static(__dirname + "/public"));

// In-memory feedback storage
let feedbackList = [];

// Home page: user feedback submission
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  const feedback = req.body.feedback;
  const impact = req.body.impact;

  if (feedback) {
    feedbackList.push({
      feedback: feedback,
      impact: impact,
      reply: ""
    });
  }

  res.sendFile(__dirname + "/public/confirmation.html");
});

// Admin page: view & submit feedback
//Updated to allow for feedback category filtering
app.get("/admin", (req, res) => {
  const selectedImpact = req.query.impact;

  let filteredFeedback = feedbackList;

  if (selectedImpact) {
    filteredFeedback = feedbackList.filter(
      item => item.impact === selectedImpact
    );
  }

  let html = `
    <h1>Feedback Review</h1>

    <form method="GET" action="/admin">
      <label>Filter by Impact:</label>
      <select name="impact">
        <option value="">All</option>
        <option value="Urgent">Urgent</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit">Filter</button>
    </form>

    <hr>
  `;

  filteredFeedback.forEach(item => {
  html += `
    <p><strong>Impact:</strong> ${item.impact}</p>
    <p><strong>Feedback:</strong> ${item.feedback}</p>
    <hr>
  `;
});

  res.send(html);
});

// API route: manager fetches all feedback
app.get("/api/feedback", (req, res) => {
  // Send feedback as JSON array of objects
  res.json(feedbackList);
});

// API route: manager or admin posts a reply
app.post("/api/feedback/:index/reply", (req, res) => {
  const index = parseInt(req.params.index);
  const reply = req.body.reply;

  if (!feedbackList[index]) return res.status(404).send("Feedback not found");

  // Update the reply
  feedbackList[index].reply = reply;
  res.send("Reply saved");
});

app.get("/review", (req, res) => {
  res.sendFile(__dirname + "/public/review.html");
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});