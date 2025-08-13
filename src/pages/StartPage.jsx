import { useState } from "react"; // Import useState hook for managing local state
import { useNavigate } from "react-router-dom"; // Import navigation hook for route changes

export default function StartPage() {
  const [email, setEmail] = useState(""); // State to store email input
  const navigate = useNavigate(); // Hook to navigate to another page

  const startQuiz = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic regex for email validation

    if (!email) { // If email is empty
      alert("Please enter your email");
      return;
    }

    if (!emailPattern.test(email)) { // If email format is invalid
      alert("Please enter a valid email address");
      return;
    }

    localStorage.setItem("quizEmail", email); // Save email in local storage
    navigate("/quiz"); // Redirect user to quiz page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">Welcome to the Quiz</h1>

      {/* Email input field */}
      <input
        type="email" // Email type for basic browser validation
        placeholder="Enter your email" // Placeholder text
        className="border border-gray-300 rounded-lg px-4 py-2 w-80 mb-4" // Styling
        value={email} // Bind input value to state
        onChange={(e) => setEmail(e.target.value)} // Update state on input change
      />

      {/* Start Quiz button */}
      <button
        onClick={startQuiz} // Trigger startQuiz function on click
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg" // Styling
      >
        Start Quiz
      </button>
    </div>
  );
}
