import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../Styles.css';

function HomePage() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = () => {
    const user = localStorage.getItem('user');
    return user !== null;
  };

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/chat');
    }
  }, [navigate]);

  const toggleVideo = () => {
    const video = videoRef.current;
    const isPaused = video.paused;

    if (isPaused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div>
      <video autoPlay muted loop id="myVideo" ref={videoRef}>
        <source src={`${process.env.PUBLIC_URL}/video/home.mp4`} type="video/mp4" />
      </video>

      <div className="content d-flex justify-content-between ps-4 pe-4 align-items-center">
        <a
          href="https://github.com/TherapyAI/TherapyAI"
          target="_blank"
          rel="noreferrer"
          className="logo header btn-buttom fw-bold fs-4"
        >
          Github
        </a>

        <div className="header d-flex flex-column align-items-center gap-1">
          <div>
            A MERN project by{' '}
            <a
              href="https://www.linkedin.com/in/javier-moreno-gaona"
              className="logo header fw-bold fs-3 bg-transparent"
              target="_blank"
              rel="noreferrer"
            >
              Javideas
            </a>
            {' '}(MongoDB, Express, React, Node + OpenAi)
          </div>
          <div className="mb-3">
            special thanks to{' '}
            <a
              href="https://www.linkedin.com/in/erica-sanchez-11725426/"
              className="logo fw-bold fs-5 header bg-transparent"
              target="_blank"
              rel="noreferrer"
            >
              Erica Sanchez
            </a>
            ,{' '}
            <a
              href="https://www.linkedin.com/in/xabier-naseem-mohammad/"
              className="logo fw-bold fs-5 header bg-transparent"
              target="_blank"
              rel="noreferrer"
            >
              Xabier Naseem
            </a>
            ,{' '}
            <a
              href="https://www.linkedin.com/in/admartinbarcelo/"
              className="logo fw-bold fs-5 header bg-transparent"
              target="_blank"
              rel="noreferrer"
            >
              Adrián Martín
            </a>
            {' '}and{' '}
            <a
              href="https://www.linkedin.com/school/ironhack-spain/"
              className="logo fw-bold fs-5 header bg-transparent"
              target="_blank"
              rel="noreferrer"
            >
              Ironhack Spain
            </a>
          </div>
        </div>

        <button
          id="myBtn"
          className="logo m-0 d-flex align-items-center gap-2 bg-transparent rounded p-1"
          onClick={toggleVideo}
        >
          {/* SVG elements... */}
          <div className="header">Pause video</div>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
