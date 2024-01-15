import "./Question.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Replies from "../replies/Replies";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { makeRequest } from "../../axios";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Question = ({ question }) => {
  const [replyOpen, setReplyOpen] = useState(false);

  const { isLoading, error, data } = useQuery("likes", question.id, () =>
    makeRequest.get("/likes?questionId=" + question.id).then((res) => {
      return res.data;
    })
  );

  const currentUser = useContext(AuthContext)

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?questionId=" + question.id);
      return makeRequest.post("/likes", { questionId: question.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const deleteMutation = useMutation(
    (questionId) => {
      return makeRequest.delete("/questions/" + questionId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["questions"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  // const handleDelete = () => {
  //   deleteMutation.mutate(question.id);
  // };
  

  return (
    <div className="question">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={question.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${question.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{question.name}</span>
              </Link>
              <span className="date">{moment(question.time).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{question.descrip}</p>
          <img src={"./upload/"+question.img} alt="" />
        </div>
        <div className="info">
        <div className="item">
          {isLoading ? (
            "Loading"
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            <>
              {data && data.includes(currentUser.id) ? (
                <FavoriteOutlinedIcon style={{color: "red"}} onClick={handleLike}/>
              ) : (
                <FavoriteBorderOutlinedIcon onClick={handleLike}/>
              )}
              {data ? `${data.length} Likes` : "0 Likes"}
            </>
          )}
        </div>
          <div className="item" onClick={() => setReplyOpen(!replyOpen)}>
            <TextsmsOutlinedIcon />
            See Replies
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {replyOpen && <Replies questionId={question.id}/>}
      </div>
    </div>
  );
};

export default Question;
