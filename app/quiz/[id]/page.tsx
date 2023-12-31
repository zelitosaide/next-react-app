import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function Quiz({ id }: { id: string }) {
  // const quiz = await  sql`SELECT * FROM quizzes WHERE id = ${id}`;
  const answers = await sql`
    SELECT
      q.id AS quiz_id,
      q.title AS quiz_title,
      q.description AS quiz_description,
      q.question_text AS quiz_question,
      a.id AS answer_id,
      a.answer_text,
      a.is_correct
    FROM quizzes AS q
    JOIN answers AS a ON q.id = a.quiz_id
    WHERE q.id = ${id}
  `;
  
  return (
    <div>
      {/* <h1>{quiz[0].title}</h1> */}
      <h1 className="text-2xl">{answers[0].quiz_title}</h1>
      <h1 className="text-2xl text-gray-700">{answers[0].quiz_description}</h1>
      <h1 className="text-xl my-4">{answers[0].quiz_question}</h1>
      <ul>
        {answers.map((answer) => (
          <li key={answer.answer_id}>
            <p>{answer.answer_text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function QuizPage({ params }: { params: { id: string }}) {
  return (
    <section>
      <Quiz id={params.id} />
    </section>
  );
}