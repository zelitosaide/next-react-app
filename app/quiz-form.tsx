import { revalidatePath } from "next/cache";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

function Answer({ id }: { id: number }) {
  return (
    <label>
      Answer {id}:
      <input
        type="text"
        name={`answer-${id}`}
        className="bg-gray-50 border border-gray-200 rounded p-1"
      />
      <input type="checkbox" name={`check-${id}`} />
    </label>
  );
}

export default function QuizForm() {
  async function createQuiz(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const question = formData.get("question") as string;
    const answers = [1, 2, 3].map((id) => {
      return {
        answer: formData.get(`answer-${id}`) as string,
        isCorrect: formData.get(`check-${id}`) === "on",
      }
    });

    await sql`
      WITH new_quiz AS (
        INSERT INTO quizzes(title, description, question_text, created_at)
        VALUES(${title}, ${description}, ${question}, NOW())
        RETURNING id
      )

      INSERT INTO answers(quiz_id, answer_text, is_correct)
      VALUES 
        ((SELECT id FROM new_quiz), ${answers[0].answer}, ${answers[0].isCorrect}),
        ((SELECT id FROM new_quiz), ${answers[1].answer}, ${answers[1].isCorrect}),
        ((SELECT id FROM new_quiz), ${answers[2].answer}, ${answers[2].isCorrect})
    `;

    revalidatePath("/");
  }

  return (
    <form className="flex flex-col mt-8 max-w-xs" action={createQuiz}>
      <h3 className="text-lg font-semibold">Create Quiz</h3>
      <label>
        Title
        <input
          type="text"
          name="title"
          className="bg-gray-50 border border-gray-200 rounded p-1"
        />
      </label>
      <label>
        Description
        <input
          type="text"
          name="description"
          className="bg-gray-50 border border-gray-200 rounded p-1"
        />
      </label>
      <label>
        Question
        <input
          type="text"
          name="question"
          className="bg-gray-50 border border-gray-200 rounded p-1"
        />
      </label>
      <div className="my-4" />
      <Answer id={1} />
      <Answer id={2} />
      <Answer id={3} />
      <button type="submit" className="bg-gray-200 p-2 m-2 rounded hover:bg-gray-300 transition-all">
        Create Quiz
      </button>
    </form>
  );
}