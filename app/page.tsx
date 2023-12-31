import Link from "next/link";
import postgres from "postgres";
import { Suspense } from "react";
import QuizForm from "./quiz-form";

const sql = postgres(process.env.DATABASE_URL!);

type Quiz = {
  id: number;
  title: string;
}

async function Quizzes() {
  const quizzes: Quiz[] = await sql`SELECT * FROM quizzes`;
  return (
    <ul>
      {quizzes.map((quiz) => (
        <li key={quiz.id} className="underline">
          <Link href={`/quiz/${quiz.id}`}>{quiz.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">All Quizzes</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Quizzes />
      </Suspense>
      <QuizForm />
    </section>
  );
}
