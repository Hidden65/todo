require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, deleteDoc, doc, getDocs } = require("firebase/firestore");

const app = express();
app.use(cors());
app.use(express.json());

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const AUTH_TOKEN = process.env.AUTH_TOKEN;

// Middleware for token authentication
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  next();
};

// API: Get All Todos
app.get("/api/todos", authenticate, async (req, res) => {
  try {
    const todosSnapshot = await getDocs(collection(db, "todos"));
    const todos = todosSnapshot.docs.map((doc) => ({
      id: doc.id,
      task: doc.data().task,
    }));
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Add a New Todo
app.post("/api/todos", authenticate, async (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }
  try {
    const docRef = await addDoc(collection(db, "todos"), { task });
    res.json({ id: docRef.id, task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Delete a Todo
app.delete("/api/todos/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteDoc(doc(db, "todos", id));
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
