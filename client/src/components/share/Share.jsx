import "./share.scss";
import Image from "../../image/img.png";
import Map from "../../image/map.png";
import Friend from "../../image/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [visibility, setVisibility] = useState("public");

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

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl, visibility });
    setDesc("");
    setFile(null);
    setVisibility("public");
  };

  return (
    <div>
      <h2>Create Post</h2>
      <div className="share">
        <div className="container">
          <div className="top">
            <div className="left">
              <img src={"/upload/" + currentUser.profilePic} alt="" />
              <input
                type="text"
                placeholder={`What's on your mind ${currentUser.name}?`}
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
              />
            </div>
            <div className="right">
              {file && (
                <img className="file" alt="" src={URL.createObjectURL(file)} />
              )}
            </div>
          </div>
          <hr />
          <div className="bottom">
            <div className="left">
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file">
                <div className="item">
                  <img src={Image} alt="" />
                  <span>Add Image</span>
                </div>
              </label>
              <div className="item">
                <img src={Map} alt="" />
                <span>Add Place</span>
              </div>
              <div className="item">
                <img src={Friend} alt="" />
                <span>Tag Friends</span>
              </div>
            </div>
            <div className="right">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="friends_only">Friends Only</option>
              </select>
              <button onClick={handleClick}>Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
