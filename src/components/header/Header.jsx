import React, { useState, useEffect, useRef } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";

const Header = (props) => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const [isHome, setIsHome] = useState(false);
  const [searchError, setSearchError] = useState("");
  // props.setTest(false);

  useEffect(() => {
    if (props.search && !props.showOverlay) {
      hideSearch();
    }
  }, [props.search, props.showOverlay]);

  const hideSearch = () => {
    setSearchError("");
    setShowSearch(false);
    props.setShowOverlay(false);
    setOverFlowHidden("auto");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname === "/") {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
    setSearchError("");
    setShowSearch(false);
    props.setShowOverlay(false);
    setQuery("");
  }, [location]);

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);

    return () => {
      //will be called before every run of the effect again and on when component unmounts.
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };

  const openSearch = () => {
    setMobileMenu(false);

    setShowSearch(true);
    props.setShowOverlay(true);
    setOverFlowHidden("hidden");
    setTimeout(() => {
      searchRef.current.focus();
    }, 0);
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
    props.setShowOverlay(false);
  };

  const searchInputChangeHandler = (event) => {
    setQuery(event.target.value);
    setSearchError("");
  };

  const searchQueryHandler = (event) => {
    // console.log(event.key, query.length);
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      // console.log(query);
      setSearchError("");
      setTimeout(() => {
        setShowSearch(false);
        props.setShowOverlay(false);
      }, 1000);
      setQuery("");
    } else if (query.length <= 0) {
      setSearchError("error");
    }
  };

  const navigationHandler = (type) => {
    navigate(`explore/${type}`);
    setMobileMenu(false);
  };
  const setOverFlowHidden = (att) => {
    document.body.style.overflow = att;
  };

  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <div className="logo">
          <img src={logo} alt="movix logo" onClick={() => navigate("/")} />
        </div>
        <ul className="menuItems">
          <li className="menuItem" onClick={() => navigationHandler("movie")}>
            Movies
          </li>
          <li className="menuItem" onClick={() => navigationHandler("tv")}>
            TV Shows
          </li>
          <li className="menuItem">
            {!isHome && <HiOutlineSearch onClick={openSearch} />}
          </li>
        </ul>
        <div className="mobileMenuItems">
          {!isHome && <HiOutlineSearch onClick={openSearch} />}

          {mobileMenu ? (
            <VscChromeClose onClick={() => setMobileMenu(false)} />
          ) : (
            <SlMenu onClick={openMobileMenu} />
          )}
        </div>
      </ContentWrapper>
      {showSearch && (
        <div className={`searchBar ${searchError}`}>
          <ContentWrapper>
            <div className="searchInput">
              <input
                id="search"
                type="text"
                ref={searchRef}
                placeholder="Search for movie or TV show...."
                onChange={searchInputChangeHandler}
                onKeyUp={searchQueryHandler}
              />
              <VscChromeClose onClick={hideSearch} />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
