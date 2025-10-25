
import React from 'react';
import { quizQuestions } from '../../services/api';

interface QuizProps {
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const Quiz: React.FC<QuizProps> = ({ answers, setAnswers }) => {
  
  const handleAnswerChange = (questionId: string, optionKey: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  return (
    <div className="space-y-6">
      {quizQuestions.map((q) => (
        <div key={q.id}>
          <p className="font-semibold mb-2 text-gray-700">{q.text}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(q.options).map(([key, value]) => (
              <button
                type="button"
                key={key}
                onClick={() => handleAnswerChange(q.id, key)}
                className={`text-left p-3 rounded-lg border-2 transition-colors ${answers[q.id] === key ? 'bg-primary/20 border-primary' : 'bg-white border-gray-300 hover:border-primary/50'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Quiz;
