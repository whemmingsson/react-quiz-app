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

    public getQuizById(id: string):Quiz | null {
        const quiz = this.quizzes.find(q => q.id === id);
        if(quiz){
            return quiz;
        }
        return null;
      }
    
}

export default QuizService;