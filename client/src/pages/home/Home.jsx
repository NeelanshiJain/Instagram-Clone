import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import TrendingPosts from "../../components/trendingposts/TrendingPosts";

const Home = () => {
  return (
    <div className="home">
      <Share />
      <TrendingPosts />
      <Posts />
      <Stories />
    </div>
  );
};

export default Home;
