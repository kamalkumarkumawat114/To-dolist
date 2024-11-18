import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth ,db} from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "./LoginSignup.css";

function LoginSignup({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Fetch user's IP address using ipify API
async function getUserIp() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip; // Returns the IP address as a string
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null; // If the IP couldn't be fetched, return null
  }
}

  const handleSignup = async () => {
    const userIp = await getUserIp(); 
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
       
       await addDoc(collection(db, "users"), {
        email: user.email,
        password: password, 
        signupTime: serverTimestamp(),
        ip: userIp || 'IP not available',
      });

      setUser(user);
      alert("User signed up successfully!");
    } catch (error) {
      alert(error.message);
    }
  };
    
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert("User logged in successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="toggle-buttons">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>
      </div>

      {isLogin ? (
        <div className="form-container">
          <h2>Login</h2>
          <form>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
          </form>
          <button onClick={handleLogin} className="form-button">
            Login
          </button>
        </div>
      ) : (
        <div className="form-container">
          <h2>Signup</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
          />
          <button onClick={handleSignup} className="form-button">
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginSignup;
