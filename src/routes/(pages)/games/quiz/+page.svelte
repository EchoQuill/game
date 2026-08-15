<script lang="ts">
    import { userStore } from "$lib/store.svelte";
    import { coinImages } from "$lib/images";
    import { BookOpenCheck, BrainCircuit } from "@lucide/svelte";

    import rawQuizJson from "$lib/assets/quiz/quiz.json";

    interface QuizQuestion {
        id: number;
        question: string;
        options: string[];
        answer: string;
    }

    interface QuizData {
        easy: QuizQuestion[];
        medium: QuizQuestion[];
        difficult: QuizQuestion[];
    }

    const quizData = rawQuizJson as QuizData;

    let resultMessage = $state<string | null>(null);
    let lastOutcome = $state<"win" | "lose" | null>(null);
    let curQuiz = $state<FetchedQuizQuestion | null>(null);
    let isAnswering = $state(false);

    function shuffle<T>(array: T[]): T[] {
        return [...array].sort(() => Math.random() - 0.5);
    }

    interface FetchedQuizQuestion {
        id: number;
        question: string;
        answer: string;
        options: string[];
        difficulty: string;
    }

    function getQuiz(): FetchedQuizQuestion {
        const difficulties = Object.keys(quizData) as (keyof QuizData)[];
        const chosenDifficulty =
            difficulties[Math.floor(Math.random() * difficulties.length)];

        const selectedQuestions = quizData[chosenDifficulty] ?? [];
        const randomQuestion =
            selectedQuestions[
                Math.floor(Math.random() * selectedQuestions.length)
            ];

        return {
            id: randomQuestion.id,
            question: randomQuestion.question,
            answer: randomQuestion.answer,
            options: shuffle([
                randomQuestion.answer,
                ...randomQuestion.options,
            ]),
            difficulty: chosenDifficulty,
        };
    }

    async function playQuiz() {
        resultMessage = null;
        lastOutcome = null;

        // Validations
        if (!userStore.loggedIn) {
            resultMessage = "You must be logged in to play!";
            return;
        }

        curQuiz = getQuiz();
    }

    async function updateBal(selectedOption: string) {
        if (!curQuiz || isAnswering) return;
        isAnswering = true;

        const isCorrect = selectedOption === curQuiz.answer;

        if (isCorrect) {
            /* Setup how much to pay */
            let payout = 0;

            switch (curQuiz.difficulty) {
                // Oh we need break for case, like c++
                case "easy":
                    payout = 2;
                    break;
                case "medium":
                    payout = 4;
                    break;
                case "difficult":
                    payout = 8;
                    break;
                default:
                    // ?? Shouldn't happen.
                    payout = 1;
            }

            await userStore.add_balance(payout);

            lastOutcome = "win";
            resultMessage = `🎉 Correct! You earned ${payout} points!`;
        } else {
            lastOutcome = "lose";
            resultMessage = `😢 Wrong! The correct answer was: ${curQuiz.answer}`;
        }

        // Reset quiz state so the user can play again
        curQuiz = null;
        isAnswering = false;
    }
</script>

<div
    class="w-full max-w-2xl mx-auto flex flex-col gap-4 sm:gap-6 h-full p-3 px-4 sm:px-0"
>
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-base-100 p-4 sm:p-6 rounded-2xl shadow-sm border border-base-content/10"
    >
        <div class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div
                class="p-2 sm:p-3 bg-primary/20 text-primary rounded-xl shrink-0"
            >
                <BookOpenCheck class="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
                <h1
                    class="text-xl sm:text-3xl font-extrabold text-base-content leading-tight"
                >
                    Quiz!
                </h1>
                <p class="text-base-content/60 text-xs sm:text-sm mt-0.5">
                    Test your knowledge and earn free coins!
                </p>
            </div>
        </div>

        <!-- Live Wallet View -->
        {#if userStore.loggedIn}
            <div
                class="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 bg-base-200 px-4 py-2.5 rounded-xl border border-base-content/5 shadow-inner"
            >
                <span
                    class="text-xs font-bold uppercase tracking-wider text-base-content/60"
                    >Balance</span
                >
                <div
                    class="flex items-center gap-1.5 text-lg sm:text-xl font-black text-warning"
                >
                    <img
                        src={coinImages.point_coin}
                        alt="Coins"
                        class="w-5 h-5 sm:w-6 sm:h-6"
                    />
                    {userStore.points}
                </div>
            </div>
        {/if}
    </div>

    <!-- Main Game Arena -->
    <div
        class="bg-base-100 rounded-3xl p-5 sm:p-10 border border-base-content/10 shadow-md flex flex-col items-center justify-center gap-6 sm:gap-8 relative overflow-hidden"
    >
        <!-- Result / Outcome Alert Banner -->
        {#if resultMessage}
            <div
                class="alert shadow-lg max-w-md w-full animate-bounce duration-300 p-3 sm:p-4
                {lastOutcome === 'win'
                    ? 'bg-success/20 border-success text-success-content'
                    : lastOutcome === 'lose'
                      ? 'bg-error/20 border-error text-error-content'
                      : 'bg-base-200'}"
            >
                <span class="font-bold text-center w-full text-sm sm:text-base">
                    {resultMessage}
                </span>
            </div>
        {/if}

        {#if !userStore.loggedIn}
            <div class="flex flex-col items-center gap-3 text-center">
                <p class="text-sm sm:text-base text-base-content/70">
                    You need to log in to play and earn coins.
                </p>
                <a href="#/login" class="btn btn-primary px-8">Log In Now</a>
            </div>
        {:else}
            <!-- Main quiz area -->
            <div
                class="w-full flex flex-col items-center justify-center min-h-62.5"
            >
                <!-- No quiz selected yet -->
                {#if !curQuiz}
                    <div class="flex flex-col items-center gap-4 text-center">
                        <div
                            class="p-6 bg-base-200 rounded-full text-base-content/40 mb-2"
                        >
                            <BrainCircuit size={64} />
                        </div>
                        <h2 class="text-xl sm:text-2xl font-bold">
                            Ready for a question?
                        </h2>
                        <p class="text-base-content/60 text-sm max-w-xs mb-2">
                            Questions are picked at random. Harder questions
                            reward more points!
                        </p>
                        <button
                            class="btn btn-primary btn-lg font-bold shadow-lg px-10"
                            onclick={playQuiz}
                        >
                            Start Quiz
                        </button>
                    </div>
                {/if}

                <!-- A quiz question been selected -->
                {#if curQuiz}
                    <div
                        class="w-full max-w-xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                        <!-- Show the question -->
                        <div
                            class="flex flex-col gap-3 text-center sm:text-left"
                        >
                            <div
                                class="flex items-center justify-center sm:justify-start gap-2"
                            >
                                <span
                                    class="badge badge-sm uppercase font-bold
                                    {curQuiz.difficulty === 'easy'
                                        ? 'badge-success'
                                        : curQuiz.difficulty === 'medium'
                                          ? 'badge-warning'
                                          : 'badge-error'}"
                                >
                                    {curQuiz.difficulty}
                                </span>
                                <span
                                    class="text-xs text-base-content/50 font-semibold tracking-wider"
                                >
                                    QUESTION #{curQuiz.id}
                                </span>
                            </div>
                            <h2
                                class="text-xl sm:text-2xl font-black text-base-content leading-snug"
                            >
                                {curQuiz.question}
                            </h2>
                        </div>

                        <!-- Answer Options Grid -->
                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2"
                        >
                            {#each curQuiz.options as option}
                                <button
                                    class="btn btn-outline h-auto py-4 px-6 text-sm sm:text-base font-semibold border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all text-left justify-start whitespace-normal"
                                    onclick={() => updateBal(option)}
                                    disabled={isAnswering}
                                >
                                    {option}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>
