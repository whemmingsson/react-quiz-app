import Quiz from "@common/Quiz";
import  generateSampleQuizzes  from "../utils/generateSampleQuizzes.js";

class QuizService {
    quizzes: Quiz[];
    /**
     *
     */
    constructor() {
        this.quizzes = generateSampleQuizzes();
    }

    public getAllQuizzes(): Quiz[] {
        return this.quizzes;   
    }
    
}

export default QuizService;