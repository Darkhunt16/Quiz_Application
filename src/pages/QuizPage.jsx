import { useEffect, useState } from "react"; // React hooks for state & lifecycle
import { useNavigate } from "react-router-dom"; // Navigation hook for routing
import { fetchQuestionsData } from "../utils/fetchQuestions"; // Function to fetch quiz questions

export default function QuizPage() {
  const [questions, setQuestions] = useState([]); // Store quiz questions
  const [currentIndex, setCurrentIndex] = useState(0); // Track current question index
  const [answers, setAnswers] = useState({}); // Store user answers
  const [visited, setVisited] = useState(new Set()); // Track visited questions
  const [timeLeft, setTimeLeft] = useState(1800); // Countdown timer (30 mins)
  const navigate = useNavigate(); // For page navigation

  // Shuffle answers randomly
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestionsData().then((results) => {
      // Add shuffled answer options to each question
      const formatted = results.map((q) => ({
        ...q,
        all_answers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
      }));
      setQuestions(formatted); // Save questions
      setVisited(new Set([0])); // Mark first question as visited
    });
  }, []);

  // Mark questions as visited when currentIndex changes
  useEffect(() => {
    setVisited((prev) => new Set([...prev, currentIndex]));
  }, [currentIndex]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) { // If time runs out, submit quiz
      finishQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000); // Decrease every second
    return () => clearInterval(timer); // Cleanup on unmount
  }, [timeLeft]);

  // Save selected answer
  const selectAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
  };

  // Finish quiz & save data
  const finishQuiz = () => {
    localStorage.setItem("quizAnswers", JSON.stringify(answers)); // Save answers
    localStorage.setItem("quizQuestions", JSON.stringify(questions)); // Save questions
    navigate("/result"); // Go to results page
  };

  // Show loading until questions load
  if (questions.length === 0) return <p className="p-4">Loading...</p>;

  const currentQ = questions[currentIndex]; // Current question object

  // Decide button color for navigation panel
  const getButtonColor = (idx) => {
    const isCurrent = currentIndex === idx;
    const isAttempted = !!answers[idx];
    const isVisited = visited.has(idx);

    if (isCurrent) return "bg-blue-500 text-white"; // Current
    if (isAttempted) return "bg-green-300"; // Attempted
    if (isVisited) return "bg-yellow-200"; // Visited but not attempted
    return "bg-gray-200"; // Not visited
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header with timer & submit button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </h2>
        <button
          onClick={finishQuiz}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Submit
        </button>
      </div>

      {/* Question & answer buttons */}
      <div className="mb-6">
        <h3
          className="font-semibold text-lg"
          dangerouslySetInnerHTML={{ __html: currentQ.question }}
        />
        <div className="mt-3 space-y-2">
          {currentQ.all_answers.map((ans, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(ans)}
              className={`block w-full text-left px-4 py-2 border rounded ${
                answers[currentIndex] === ans
                  ? "bg-blue-100 border-blue-400" // Highlight selected
                  : "border-gray-300"
              }`}
              dangerouslySetInnerHTML={{ __html: ans }}
            />
          ))}
        </div>
      </div>

      {/* Prev & Next navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Prev
        </button>
        <button
          onClick={() =>
            setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))
          }
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Question navigation panel */}
      <div className="mt-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-full border ${getButtonColor(idx)}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Legend for navigation colors */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="inline-block w-4 h-4 bg-gray-200 mr-2"></span>Not visited</div>
          <div><span className="inline-block w-4 h-4 bg-yellow-200 mr-2"></span>Visited but not attempted</div>
          <div><span className="inline-block w-4 h-4 bg-green-300 mr-2"></span>Attempted</div>
          <div><span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>Current question</div>
        </div>
      </div>
    </div>
  );
}
