import "./submitQuestion.scss";
import Image from "../../assets/img.png";
import { useMutation, useQueryClient } from "react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useState } from "react";
import { makeRequest } from "../../axios";

const Share = () => {

  const [file, setFile] = useState(null)
  const [descrip, setDesc] = useState("")

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newQuestion) => {
      return makeRequest.post("/questions", newQuestion);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["questions"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ descrip, img: imgUrl});
    setDesc("");
    setFile(null);
  };

  const {currentUser} = useContext(AuthContext)
  return (
    <div className="submitQuestion">
      <div className="container">
        <div className="top">
          <div className="left">
          <img
            src={currentUser.profilePic}
            alt=""
          />
          <input type="text" placeholder={`What doubts do you have ${currentUser.name}?`}
          onChange = {(e) => setDesc(e.target.value)}
          value= {descrip}
          />
          </div>
          <div className="right">
              {file && <img className="file" alt="" src={URL.createObjectURL(file)}/>}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} 
            onChange = {(e) => setFile(e.target.files[0])}/>
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Screenshot</span>
              </div>
            </label>
            
          </div>
          <div className="right">
            <button onClick={handleClick}>Submit Question</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
