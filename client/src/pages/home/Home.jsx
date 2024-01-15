
import Questions from "../../components/questions/Questions"
import SubmitQuestion from "../../components/submitQuestion/SubmitQuestion"
import "./home.scss"

const Home = () => {
  return (
    <div className="home">

      <SubmitQuestion />
      <Questions/>
    </div>
  )
}

export default Home