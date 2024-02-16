import React, { useState } from "react";
import styles from "../styles/home.module.css";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [references, setReferences] = useState([]);
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [textToSpeechText, setTextToSpeechText] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false); 

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
      // Use the answer state variable directly
      const response = await axios.get(`http://localhost:8000/text_to_speech/${encodeURIComponent(answer)}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };
  


  return (
    <div>
      <div className="text-center">
        <div className="row">
          <div className={`col-2 ${styles.head}`}>
            <h2>Fast API</h2>
            <h3>History</h3>
            {searchSubmitted && <p className={`${styles.historyquestion}`}>{question}</p>}
          </div>
          <div className={`col d-flex flex-column justify-center align-center ${styles.mainchatbox}`}>
            <div className={`${styles.chatbox}`}>
              <div className="container text-center">
                
                {searchSubmitted && (
                  <>
                    <div className={`${styles.question} mt-3 row`}>
                      <div className="col-1">
                        <img
                          className={`${styles.icon}`}
                          src="\images\user.webp"
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
                          src="\images\bot.jpeg"
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
                      <button onClick={handleTextToSpeech}>listen</button>
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
                        <h3>Referance</h3>
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
              </div>
            </div>

            <div className={`${styles.searchbox} container mt-5 row`}>
                  <div className={`${styles.search} col-12`}>
                    <form className="d-flex" role="search">
                      <input
                        className={`form-control me-2 ${styles.searchinput}`}
                        type="search"
                        placeholder="Ask Anything"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        aria-label="Search"
                      />
                      <button
                        className={`btn btn-outline-secondary ${styles.searchbutton}`}
                        type="submit"
                        onClick={(e) => handleQuestionSubmit(e)}
                      >
                        Search
                      </button>
                    </form>
                  </div>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
