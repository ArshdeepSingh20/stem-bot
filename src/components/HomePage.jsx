import React, { useState, useEffect } from "react";
import styles from "../styles/home.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import UploadImage from "./UploadImage";
import { FaMicrophone } from "react-icons/fa";

function HomePage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [references, setReferences] = useState([]);
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/questionAnswering",
        { question }
      );
      setAnswer(response.data.Answer);

      // Fetch references
      const referencesResponse = await axios.get(
        `http://localhost:8000/references/${response.data.Answer}`
      );
      setReferences(referencesResponse.data);

      // Generate image
      setImage(`http://localhost:8000/generateImage/${question}`);

      // Set searchSubmitted to true after submitting the question
      setSearchSubmitted(true);
    } catch (error) {
      console.error("Error fetching answer:", error);
    }
  };

  const handleTextToSpeech = async () => {
    try {
      setIsPlaying(true);

      const response = await axios.get(
        `http://localhost:8000/text_to_speech/${encodeURIComponent(answer)}`,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    } catch (error) {
      console.error("Error converting text to speech:", error);
    }
  };

  const generateImageCaption = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "http://localhost:8000/imageCaptioning",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCaption(response.data.Answer);
      console.log(response.data.Answer);

      // Close the modal after successful upload
      setModalOpen(false);
      console.log("model closed successfully");
    } catch (error) {
      console.error("Error generating image caption:", error);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
        console.error('Speech recognition not supported in this browser.');
        return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        setIsRecording(true);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
    };

    recognition.onend = () => {
        setIsRecording(false);
    };

    recognition.start();
};

  return (
    <div>
      <div className="text-center">
        <div className="row">
          <div className={`col-2 ${styles.head}`}>
            <h2>Fast API</h2>
            <h3>History</h3>
            {searchSubmitted && (
              <p className={`${styles.historyquestion}`}>{question}</p>
            )}
          </div>
          <div
            className={`col container d-flex flex-column justify-center align-center ${styles.mainchatbox}`}
          >
            <div className={`${styles.chatbox}`}>
              <div className="container text-center">
                {searchSubmitted && (
                  <>
                    <div className={`${styles.question} mt-3 row`}>
                      <div className="col-1">
                        <img
                          className={`${styles.icon}`}
                          src="\images\user.png"
                          alt=""
                        />
                      </div>
                      <div className="col p-2 d-flex flex-column justify-center align-center">
                        <h2 className={`${styles.icontext}`}>You</h2>
                        <p className={`${styles.iconpara}`}>{question}</p>
                      </div>
                    </div>

                    <div className={`${styles.answer} mt-4 row`}>
                      <div className="col-1">
                        <img
                          className={`${styles.icon}`}
                          src="\images\bot.png"
                          alt=""
                        />
                      </div>
                      <div
                        className={`col-10 p-2 d-inline-flex flex-column justify-center align-center ${styles.botContainer}`}
                      >
                        <h2 className={`${styles.icontext}`}>Bot</h2>
                        <p className={`${styles.iconpara}`}>{answer}</p>
                      </div>

                      <div className={`col-1 mt-3`}>
                        {/* Conditional rendering based on isPlaying */}
                        {!isPlaying ? (
                          <img
                            onClick={handleTextToSpeech}
                            style={{ cursor: "pointer" }}
                            src="\images\sound.png"
                            alt="listen"
                          />
                        ) : (
                          <img
                            style={{ cursor: "not-allowed" }}
                            src="\images\sound.png"
                            alt="listen"
                          />
                        )}
                      </div>
                    </div>

                    <div className={`${styles.imageref} mt-4 row`}>
                      <div className={`${styles.image} col-6`}>
                        <h3>Image</h3>
                        {image && (
                          <img
                            className={`${styles.generatedimage}`}
                            src={image}
                            alt="Generated Image"
                          />
                        )}
                      </div>
                      <div className={`${styles.refrence} col-6`}>
                        <h3>Reference</h3>
                        <ul>
                          {references.map((ref, index) => (
                            <li key={index}>
                              <Link to={ref} target="_blank">
                                {ref}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
                {caption && (
                  <div className={`${styles.answer} mt-4 row`}>
                    <div className="col-1">
                      <img
                        className={`${styles.icon}`}
                        src="\images\bot.png"
                        alt=""
                      />
                    </div>
                    <div
                      className={`col-10 p-2 d-inline-flex flex-column justify-center align-center ${styles.botContainer}`}
                    >
                      <h2 className={`${styles.icontext}`}>Bot</h2>
                      <p className={`${styles.iconpara}`}>{caption}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`${styles.searchbox} container  row`}>
              <div className={`${styles.search} col-10`}>
                <form className="d-flex" role="search" style={{position:"relative"}}>
                  <input
                    className={`form-control me-2 ${styles.searchinput}`}
                    type="search"
                    placeholder="Ask Anything"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    aria-label="Search"
                  />
                  <div
                    onClick={handleVoiceInput}
                    disabled={isRecording}
                    className={`micButton ${styles.micbutton}`}
                    style={{ position: 'absolute', right: '135px', bottom: '15px', cursor: 'pointer' }}
                  >
                    <FaMicrophone style={{ color: 'black', fontSize: '22px' }} />
                  </div>
                  <button
                    className={`btn btn-outline-secondary ${styles.searchbutton}`}
                    type="submit"
                    onClick={(e) => handleQuestionSubmit(e)}
                  >
                    Search
                  </button>
                </form>
              </div>

              <div className={`${styles.searchwithimage} col-1`}>
                {/* Button trigger modal  */}
                <button
                  type="button"
                  className={`btn btn-outline-secondary ${styles.searchimage}`}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Search with Image
                </button>

                {/* Modal */}
                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className={`modal-header ${styles.modalheader}`}>
                        <h1
                          className={`modal-title fs-5 text-center ${styles.modalhead}`}
                          id="exampleModalLabel"
                        >
                          Upload image to search
                        </h1>
                        <button
                          type="button"
                          className={`btn-close ${styles.modalbtn}`}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className={`modal-body ${styles.modalbody}`}>
                        <div className={`container ${styles.upload}`}>
                          <UploadImage
                            generateImageCaption={generateImageCaption}
                            setModalOpen={setModalOpen}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
