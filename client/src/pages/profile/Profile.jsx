import "./profile.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Questions from "../../components/questions/Questions"
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";

const Profile = () => {

  const userId = useLocation().pathname.split("/")[2]

  const { isLoading, error, data } = useQuery(["user"],() =>
  makeRequest.get("/users/find/"+userId).then((res) => {
    return res.data;
  })
);

  return (
    <div className="profile">
      <div className="images">
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          
          <div className="center">
            <span>{data.name}</span>
            
          </div>
         
        </div>
      <Questions/>
      </div>
    </div>
  );
};

export default Profile;
