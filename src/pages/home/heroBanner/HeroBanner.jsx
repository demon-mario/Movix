import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";

import useFetch from "../../../hooks/useFetch";
import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const HeroBanner = () => {
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const url = useSelector((state) => state.home.url);
  const [searchError, setSearchError] = useState("");

  const { data, loading } = useFetch("/movie/upcoming");

  // console.log(searchError);

  useEffect(() => {
    const bg =
      url.backdrop +
      data?.results?.[Math.floor(Math.random() * 20)].backdrop_path;
    setBackground(bg);
  }, [data]);

  const searchInputChangeHandler = (event) => {
    setQuery(event.target.value);
    setSearchError("");
  };

  const searchQueryHandler = (event) => {
    // console.log(event.key, query.length);
    if ((event.key === "Enter" || event.type === "click") && query.length > 0) {
      navigate(`/search/${query}`);
      setSearchError("");
    } else if (query.length <= 0) {
      setSearchError("error");
    }
  };

  return (
    <div className="heroBanner">
      {!loading && (
        <div className="backdrop-img">
          <Img src={background} alt="Background Image" />
        </div>
      )}
      <div className="opacity-layer"></div>

      <ContentWrapper>
        <div className="heroBannerContent">
          <span className="title">Welcome.</span>
          <span className="subTitle">
            Millions of movies, TV shows and people to discover.Explore now.
          </span>
          <div className={`searchInput ${searchError}`}>
            <input
              type="text"
              placeholder="Search for movie or TV show...."
              onChange={searchInputChangeHandler}
              onKeyUp={searchQueryHandler}
            />
            <button onClick={searchQueryHandler}>Search</button>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
