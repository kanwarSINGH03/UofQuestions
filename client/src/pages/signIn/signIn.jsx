import { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./signIn.scss";

const SignIn = () => {

  const [inputs, setInputs] = useState({
    username:"",
    password:"",
  })

const [err, setErr] = useState(null);

const navigate = useNavigate()

const handleChange = (e) =>{
  setInputs((prev) => ({...prev, [e.target.name]:e.target.value}));

};
  const { signIn } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault()
    try{
    await signIn(inputs);
    navigate("/")
    }catch(err){
      setErr(err.response.data);
    }
  };

  return (
    <div className="signIn">
      <div className="card">
        <div className="left">
          <span>Don't have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>SignIn</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>

            {err && err}
            <button onClick={handleSignIn}>SignIn</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
