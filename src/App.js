import { useEffect, useState, useRef } from "react";
import randomwords from "random-words";
import {
  Paper,
  ColorSchemeProvider,
  MantineProvider,
  Input,
  Button,
  Group,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import DarkMode from "./DarkMode";
import "./App.css";
import SampleCarousel from "./Carousel";

export default function TypingSpeedTestApp() {
  // --------- theme stored in local storage ------------------------------
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "color-scheme",
    defaultValue: "light",
  });
  // ----------------------- toggle themes --------------------------------
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const Seconds = 60;

  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(Seconds);
  const [currentInput, setCurrentInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const inputText = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  // -------------------- enable & focus on input -------------------------
  useEffect(() => {
    if (status === "started") {
      inputText.current.focus();
    }
  }, [status]);

  // ------------------- generates word through library -------------------
  function generateWords() {
    return new Array(180).fill(null).map(() => randomwords());
  }

  function startCountDown() {
    if (status === "finished") {
      setWords(generateWords());
      setCurrentWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrentCharIndex(-1);
      setCurrentChar("");
    }
    if (status !== "started") {
      setStatus("started");
      setCountDown(Seconds);
      let interval = setInterval(() => {
        setCountDown((count) => {
          if (count === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrentInput("");
            return count;
          } else {
            return count - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeyDown(e) {
    // console.log(e.key);
    // check at hitting spacebar
    if (e.key === " ") {
      checkSpace();
      setCurrentInput("");
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentCharIndex(-1);
    } else if (e.key === "Backspace") {
      setCurrentCharIndex(currentCharIndex - 1);
      setCurrentChar("");
    } else {
      setCurrentCharIndex(currentCharIndex + 1);
      setCurrentChar(e.key);
    }
  }
  function checkSpace() {
    const compareWith = words[currentWordIndex];
    const isMatch = compareWith === currentInput.trim();
    if (isMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  function getCharClass(wordindex, charidx, char) {
    if (
      wordindex === currentWordIndex &&
      charidx === currentCharIndex &&
      currentChar &&
      status !== "finished"
    ) {
      if (char === currentChar) {
        return "char-bg-green";
      } else {
        return "char-bg-red";
      }
    } else if (
      wordindex === currentWordIndex &&
      currentCharIndex >= words[currentWordIndex].length
    ) {
      return "char-bg-red";
    } else {
      return "";
    }
  }

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="main-container">
          {/* Header----------------------------------------- */}
          <div className="title-container">
            <p>Test your Speed...!</p>
            <DarkMode />
          </div>

          {/* countdown-------------------------------------- */}
          <Group position="center" mt="xs" mb="md" className="countdown">
            <div className="paper-countdown"></div>
            <Paper className="countdown-timer">
              <p className="timer">{countDown}</p>
            </Paper>
          </Group>

          {/* Input box-------------------------------------- */}
          <div className="user-input">
            <Input
              ref={inputText}
              disabled={status !== "started"}
              mb="md"
              placeholder="Text..."
              onKeyDown={handleKeyDown}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
            />
          </div>
          <Group position="center" mb="md">
            <Button
              variant="gradient"
              gradient={{ from: "blue", to: "violet", deg: 180 }}
              position="center"
              className="start-btn"
              onClick={startCountDown}
            >
              Start
            </Button>
          </Group>
          {status === "started" ? (
            // words to be typed---------------------------------
            <Paper p="sm" mb="md" className="paper-container">
              {words.map((word, index) => (
                <span key={index}>
                  {word.split("").map((char, idx) => (
                    <span className={getCharClass(index, idx, char)} key={idx}>
                      {char}
                    </span>
                  ))}{" "}
                </span>
              ))}
            </Paper>
          ) : null}

          {status === "finished" ? (
            // results ------------------------------------------
            <Group position="center" mb="md" className="result-container">
              <Paper p="xs" className="wpm container">
                <p>WPM</p>
                <h2>{correct}</h2>
              </Paper>
              <Paper p="xs" className="accuracy container">
                <p>Accuracy</p>
                <h2>{Math.round((correct / (correct + incorrect)) * 100)}%</h2>
              </Paper>
            </Group>
          ) : null}
          <SampleCarousel />
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
