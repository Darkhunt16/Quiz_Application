export async function fetchQuestionsData() {
  const API_URL = "https://opentdb.com/api.php?amount=15";

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    // If API returned valid questions
    if (
      data.response_code === 0 &&
      Array.isArray(data.results) &&
      data.results.length > 0
    ) {
      return data.results;
    } else {
      console.warn("API returned no questions, using local fallback");
      return await fetchLocalQuestions();
    }
  } catch (err) {
    console.warn(
      "Error fetching from API:",
      err.message,
      "Using local fallback"
    );
    return await fetchLocalQuestions();
  }
}

async function fetchLocalQuestions() {
  const res = await fetch("/questions.json");
  const data = await res.json();
  return data.results;
}
