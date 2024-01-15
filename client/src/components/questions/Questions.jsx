import Question from "../question/Question";
import "./Questions.scss";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";

const Questions = () => {


  const { isLoading, error, data } = useQuery('questions', () =>

  makeRequest.get("/questions").then( (res) => {

    return res.data;

  })

  );

  return ( 
  <div className="questions">
    { error
      ? "Error occurred"
      : isLoading
      ? "Loading"
      :data.map( (question) =><Question question={question} key={question.id}/>)
    }
  </div>

  );
};

export default Questions;
