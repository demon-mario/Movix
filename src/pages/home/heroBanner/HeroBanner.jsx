import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineSearch } from "react-icons/hi";
import "./style.scss";

import { fetchDataFromApi } from "../../../utils/api";
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
  const [showSuggestion, setShowSuggestion] = useState("hide");
  const [showSuggestionResults, setShowSuggestionResults] = useState(null);
  const inputSearchRef = useRef();

  // console.log(searchError);

  useEffect(() => {
    const bg =
      url.backdrop +
      data?.results?.[Math.floor(Math.random() * 20)].backdrop_path;
    setBackground(bg);
  }, [data]);

  const fetchSearchData = () => {
    fetchDataFromApi(
      `/search/multi?query=${inputSearchRef.current.value}&page=1`
    )
      .then((res) => {
        const response = [];
        for (let i = 0; i < res.results.length; i++) {
          const str = res.results[i].title || res.results[i].name;
          if (!response.includes(str)) {
            response.push(str);
          }
          if (response.length >= 5) {
            break;
          }
        }
        setShowSuggestionResults(response);
        // console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const outcome = (data) => {
    setQuery({ data });
    setSearchError("");
    if (inputSearchRef.current.value !== "") {
      // console.log("output from the server....", data);
      setShowSuggestionResults(null);
      setShowSuggestion("");
      fetchSearchData();
    }
  };

  const debounce = (func, timeOut) => {
    let timer;

    return (...args) => {
      if (timer) {
        // console.log("clearing the timer");
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        func(args);
      }, timeOut);
    };
  };

  const result = debounce(outcome, 1000);

  const searchInputChangeHandler = (event) => {
    // console.log(event.target.value);
    if (event.target.value !== "") {
      result(event.target.value);
    }
    //  setQuery(event.target.value);
    //  setSearchError("");
  };

  const searchQueryHandler = (event) => {
    // console.log(event.key, query.length);
    if (event.target.value !== "" && event.target.value.length > 0) {
      setSearchError("");
    }
    if (
      (event.key === "Enter" && event.target.value.length > 0) ||
      (event.type === "click" && inputSearchRef.current.value !== "")
    ) {
      // navigate(`/search/${event.target.value}`);
      navigate(`/search/${inputSearchRef.current.value}`);

      setSearchError("");
    } else if (event.target.value <= 0) {
      setSearchError("error");
      setShowSuggestion("hide");
    }
  };

  const setSuggestedResultHandler = (event) => {
    setShowSuggestion("hide");
    setShowSuggestionResults(null);
    inputSearchRef.current.value = event.target.innerText;
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
              ref={inputSearchRef}
              type="text"
              placeholder="Search for movie or TV show...."
              onChange={searchInputChangeHandler}
              onKeyUp={searchQueryHandler}
            />
            <button onClick={searchQueryHandler}>Search</button>
          </div>
          {/* {showSuggestion && ( */}
          <div className={`searchResults ${showSuggestion}`}>
            {showSuggestionResults?.map((item) => (
              <div
                key={item}
                className="searchItem"
                onClick={setSuggestedResultHandler}
              >
                <HiOutlineSearch />
                {item}
              </div>
            ))}
          </div>
          {/* )} */}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
