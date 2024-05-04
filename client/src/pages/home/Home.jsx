import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import TrendingPosts from "../../components/trendingposts/TrendingPosts";
import Layout from "../../components/layouts/Layouts";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
//import BookMarks from "../../components/bookmarks/BookMarks";

const Home = () => {
  const successMsg = "Success message"; // Replace with actual success message
  const errorMsg = null; // Replace with actual error message
  const error = null; // Replace with actual error
  const body = null;
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="home">
      <Layout
        user={currentUser}
        successMsg={successMsg}
        errorMsg={errorMsg}
        error={error}
        body={body}
      />

      <Share />
      <TrendingPosts />
      <Posts />

      <Stories />
    </div>
  );
};

export default Home;
