import { useContext } from "react";
import "./replies.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient  } from "react-query";
import { makeRequest } from "../../axios";

import moment from "moment";
import { useState } from "react";

const Replies = ({questionId}) => {

  const [descrip, setDesc] = useState("")
  const { currentUser } = useContext(AuthContext);
  //Temporary
  const { isLoading, error, data } = useQuery(["replies"], () =>

  makeRequest.get("/replies?questionId="+questionId).then( (res) => {

    return res.data;

  })

  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newReply) => {
      return makeRequest.post("/replies", newReply);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["replies"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ descrip, questionId });
    setDesc("");
  };
  return (
    <div className="replies">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a reply"
        value={descrip} 
        onChange={(e)=>setDesc(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading 
      ? "loading"
      :data.map((reply) => (
        <div className="reply">
    
          <div className="info">
            <span>{reply.name}</span>
            <p>{reply.descrip}</p>
          </div>
          <span className="date">{moment(reply.time).fromNow()}</span>
        </div>
      ))
      }
    
    </div>
  );
};

export default Replies;
