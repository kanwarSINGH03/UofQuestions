import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  //use states to get input from the form
  const [inputs, setInputs] = useState({
    username:"",
    email:"",
    password:"",
    name:"",
  })

const [err, setErr] = useState(null);

const handleChange = (e) =>{
  setInputs((prev) => ({...prev, [e.target.name]:e.target.value}));

};

const handleClick = async e =>{

  e.preventDefault()

  try {
    await axios.post("http://localhost:8080/backend/authent/register",inputs)

  } catch (err) {
    setErr(err.response.data);
  }

};

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>UofQuestions</h1>
          <span>Do you have an account?</span>
          <Link to="/signIn">
          <button>SignIn</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange} />
            <input type="text" placeholder="Name" name="name" onChange={handleChange}/>

            {err && err}
            <button onClick={handleClick} >Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
