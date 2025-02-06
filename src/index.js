import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useSpring, animated } from "@react-spring/web";
import { TextField, Button, Box } from "@mui/material";
import "./index.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Wave from "react-wavify";

// Counter Component
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.body.style.backgroundColor = `rgba(0, 100, 0, ${Math.min(
      count * 0.1,
      1
    )})`;

    return () => {
      document.body.style.backgroundColor = "white";
    };
  }, [count]);
  const props = useSpring({});
  const increment = () => setCount(count + 1);
  const reset = () => setCount(0);
  const decrement = () => setCount(count > 0 ? count - 1 : 0);

  return (
    <animated.div
      style={{
        ...props,
        height: "50vh",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box className="counter-container">
        <h2>Counter: {count}</h2>
        <Button className="btn" onClick={increment}>
          +
        </Button>
        <Button className="btn" onClick={reset}>
          Reset
        </Button>
        <Button className="btn" onClick={decrement}>
          -
        </Button>
      </Box>
    </animated.div>
  );
}
// RichTextEditor Component
function RichTextEditor({ userData }) {
  const [text, setText] = useState(localStorage.getItem("editor") || "");

  useEffect(() => {
    if (
      userData &&
      userData.name &&
      userData.email &&
      userData.address &&
      userData.phone
    ) {
      const { name, email, phone } = userData;
      setText(`
        Name: ${name} | Email: ${email} | Phone: ${phone}
      `);
    } else {
      setText("");
    }
  }, [userData]);

  const handleSave = () => {
    localStorage.setItem("editor", text);
    alert("Data saved!");
  };

  return (
    <div className="editor-container">
      <ReactQuill value={text} onChange={setText} />
      <Button className="save-btn btn" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
// UserForm Component
function UserForm({ onUserDataChange }) {
  const [user, setUser] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "You have unsaved changes!";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (e) => {
    setIsDirty(true);
    const updatedUser = { ...user, [e.target.name]: e.target.value };
    setUser(updatedUser);
    onUserDataChange(updatedUser);
  };

  const handleSubmit = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setIsDirty(false);
    alert("User Data Saved!");
  };

  return (
    <div className="form-container">
      <TextField
        name="name"
        label="Name"
        value={user.name}
        onChange={handleChange}
      />
      <TextField
        name="address"
        label="Address"
        value={user.address}
        onChange={handleChange}
      />
      <TextField
        name="email"
        label="Email"
        value={user.email}
        onChange={handleChange}
      />
      <TextField
        name="phone"
        label="Phone"
        value={user.phone}
        onChange={handleChange}
      />
      <Button className="btn" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
}
// UserIdGenerator Component
function UserIdGenerator({ name, email }) {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (name && email) {
      const data = `${name}-${email}`;
      const generatedId = btoa(data).substring(0, 9);
      setUserId(generatedId);
    }
  }, [name, email]);

  return (
    <div className="userId-container">
      <strong>User ID: </strong>
      {userId || "Please fill your details in the form for generating UserId"}
    </div>
  );
}
export { Counter, RichTextEditor, UserForm, UserIdGenerator };
// App Component
function App() {
  const [userData, setUserData] = useState({});

  const handleUserDataChange = (updatedData) => {
    setUserData(updatedData); // Update user data state
  };

  return (
    <div>
      <h1>React App</h1>
      <div className="app-container">
        <div className="counter-userdata">
          <Counter />
          <UserForm onUserDataChange={handleUserDataChange} />
        </div>
        <div className="editor-userid">
          <RichTextEditor userData={userData} />
          <UserIdGenerator name={userData.name} email={userData.email} />
        </div>
      </div>
      <div>
        <Wave
          fill="#1277b0"
          paused={false}
          options={{
            height: 80,
            amplitude: 40,
            speed: 0.2,
            points: 4,
          }}
        />
      </div>
    </div>
  );
}

// Render App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
