import type { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import { TodoItem } from './components/Todo';
import { TodoForm } from './components/TodoForm';
import { UserAvatar } from './components/UserAvatar';

type TechnologyCardProps = {
    name: string;
    description: string;
    documentation: string;
};

const Home: NextPage = () => {
    let { data: session } = useSession();
    const todoList = trpc.useQuery(['todos.getAll']);
    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="zorastodo" content="ZorasTodo" />
                <link rel="icon" href="/logo_partial.png" />
            </Head>

            <div className="min-h-screen bg-slate-800">
                <nav className="bg-slate-700 flex">
                    <img src="./logo_full.png" className=" pt-4 pl-4" />
                    {!session && (
                        <button onClick={() => signIn()}>SignIn</button>
                    )}
                    <div className="flex-grow"></div>
                    {session?.user?.image && (
                        <UserAvatar image={session.user.image} />
                    )}
                </nav>
                <h1 className="mb-10 pt-10 text-6xl font-extrabold tracking-wider text-center text-cyan-400">
                    Todos
                </h1>
                <div className="flex justify-center">
                    <TodoForm />
                </div>
                <ul className="flex flex-col px-6 py-6 space-y-8">
                    {todoList.data?.length === 0 && (
                        <div className="pt-10 text-3xl text-center text-white">
                            No todos
                        </div>
                    )}
                    {todoList.data?.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))}
                </ul>
            </div>
        </>
    );
};

const TechnologyCard = ({
    name,
    description,
    documentation,
}: TechnologyCardProps) => {
    return (
        <section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
            <h2 className="text-lg text-gray-700">{name}</h2>
            <p className="text-sm text-gray-600">{description}</p>
            <a
                className="mt-3 text-sm underline text-violet-500 decoration-dotted underline-offset-2"
                href={documentation}
                target="_blank"
                rel="noreferrer"
            >
                Documentation
            </a>
        </section>
    );
};

export default Home;
