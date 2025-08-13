import React from "react";
import { Pie } from "react-chartjs-2"; // Pie chart component
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"; // Chart.js elements
import { useNavigate } from "react-router-dom"; // For navigation

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ResultPage() {
  const navigate = useNavigate(); // Hook to navigate between pages

  // Get stored quiz questions & answers from localStorage
  const questions = JSON.parse(localStorage.getItem("quizQuestions") || "[]");
  const answers = JSON.parse(localStorage.getItem("quizAnswers") || "{}");

  // Counters for results
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  // Loop through each question and check answer status
  questions.forEach((q, idx) => {
    if (!answers[idx]) {
      unattemptedCount++; // No answer given
    } else if (answers[idx] === q.correct_answer) {
      correctCount++; // Correct answer
    } else {
      wrongCount++; // Wrong answer
    }
  });

  // Data for pie chart
  const pieData = {
    labels: ["Correct", "Wrong", "Unattempted"], // Chart labels
    datasets: [
      {
        data: [correctCount, wrongCount, unattemptedCount], // Values
        backgroundColor: ["#16a34a", "#dc2626", "#9ca3af"], // Colors: green, red, gray
        hoverBackgroundColor: ["#15803d", "#b91c1c", "#6b7280"] // Darker shades on hover
      }
    ]
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Go Back Button */}
      <button
        onClick={() => navigate("/")} // Navigate to start page
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ⬅ Go to Start Page
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Quiz Results</h1>

      {/* Pie Chart Section */}
      <div className="max-w-sm mx-auto mb-8">
        <Pie data={pieData} /> {/* Render Pie chart */}
      </div>

      {/* Show each question with user's answer and correct answer */}
      {questions.map((q, idx) => (
        <div key={idx} className="mb-4 p-4 border rounded">
          {/* Question text */}
          <p
            className="font-semibold"
            dangerouslySetInnerHTML={{ __html: `${idx + 1}. ${q.question}` }}
          />

          {/* User's Answer */}
          <p>
            <strong>Your answer:</strong>{" "}
            <span
              className={
                answers[idx] === q.correct_answer
                  ? "text-green-600" // Correct
                  : answers[idx]
                  ? "text-red-600" // Wrong
                  : "text-gray-600" // Not answered
              }
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: answers[idx] || "Not answered"
                }}
              />
            </span>
          </p>

          {/* Correct Answer */}
          <p>
            <strong>Correct answer:</strong>{" "}
            <span
              className="text-green-600"
              dangerouslySetInnerHTML={{ __html: q.correct_answer }}
            />
          </p>
        </div>
      ))}
    </div>
  );
}
