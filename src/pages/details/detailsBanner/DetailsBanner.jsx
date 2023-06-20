import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../Playbtn";
import VideoPopup from "../../../components/videoPopup/VideoPopup";

const DetailsBanner = ({ video, crew }) => {
  const [show, setShow] = useState(false);
  const [errorShow, setErrorShow] = useState("hide");
  const [videoId, setVideoId] = useState(null);
  const params = useParams();
  const { data, loading } = useFetch(`/${params.mediaType}/${params.id}`);
  const url = useSelector((state) => state.home.url);
  const _genres = data?.genres?.map((g) => g.id);

  const directors = crew?.filter((f) => f.job === "Director");
  const writers = crew?.filter(
    (w) => w.job === "Screenplay" || w.job === "Story" || w.job === "Writer"
  );

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  const showPlayer = () => {
    if (video?.key) {
      setShow(true);
      setVideoId(video.key);
    } else {
      setErrorShow("");
      setTimeout(() => {
        setErrorShow("hide");
      }, 3000);
    }
  };

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!data && (
            <>
              <div className="backdrop-img">
                {url?.backdrop && data?.backdrop_path && (
                  <Img src={url?.backdrop + data?.backdrop_path} />
                )}
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data?.poster_path ? (
                      <Img
                        className="posterImg"
                        src={url?.backdrop + data?.poster_path}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  <div className="right">
                    <div className="title">
                      {`${data?.name || data?.title} (${dayjs(
                        data.release_date
                      ).format("YYYY")})`}
                    </div>
                    <div className="subtitle">{data?.tagline}</div>

                    <Genres data={_genres} />
                    <div className="row">
                      <CircleRating rating={data?.vote_average.toFixed(1)} />
                      <div className="playbtn" onClick={showPlayer}>
                        <PlayIcon />
                        <span className={`video-error ${errorShow}`}>
                          <span className="error-text">
                            Trailer not available
                          </span>
                          <div className="arrow-down"></div>
                        </span>
                        <span className="text">Watch Trailer</span>
                      </div>
                    </div>

                    <div className="overview">
                      <div className="heading">Overview</div>
                      <div className="description">{data?.overview}</div>
                    </div>

                    <div className="info">
                      {data.status && (
                        <div className="infoItem">
                          <span className="text bold">{"Status: "}</span>
                          <span className="text">{data?.status}</span>
                        </div>
                      )}
                      {data.release_date && (
                        <div className="infoItem">
                          <span className="text bold">{"Release: "}</span>
                          <span className="text">
                            {dayjs(data?.release_date).format("MMM D,YYYY")}
                          </span>
                        </div>
                      )}
                      {data.runtime && (
                        <div className="infoItem">
                          <span className="text bold">{"Runtime: "}</span>
                          <span className="text">
                            {toHoursAndMinutes(data?.runtime)}
                          </span>
                        </div>
                      )}
                    </div>
                    {directors?.length > 0 && (
                      <div className="info">
                        <span className="text bold">{"Director: "}</span>
                        <span className="text">
                          {directors?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {directors?.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {writers?.length > 0 && (
                      <div className="info">
                        <span className="text bold">{"Writer: "}</span>
                        <span className="text">
                          {writers?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {writers?.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {data?.created_by?.length > 0 && (
                      <div className="info">
                        <span className="text bold">{"Creator: "}</span>
                        <span className="text">
                          {data?.created_by?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {data?.created_by?.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <VideoPopup
                  show={show}
                  setShow={setShow}
                  videoId={videoId}
                  setVideoId={setVideoId}
                />
              </ContentWrapper>
            </>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;
