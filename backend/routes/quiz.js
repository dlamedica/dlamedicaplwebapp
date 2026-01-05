const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');
const { validate, schemas } = require('../middleware/validation');
const { quizLimiter } = require('../middleware/rateLimiter');
const { validateUUID } = require('../middleware/inputValidation');

// Sample quiz data
const quizData = {
  'quiz-1-1': {
    id: 'quiz-1-1',
    moduleId: '1-module-1',
    title: 'Test z anatomii układu krążenia',
    description: 'Sprawdź swoją wiedzę na temat budowy serca i naczyń krwionośnych',
    timeLimit: 20, // minutes
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        type: 'single_choice',
        question: 'Ile komór ma serce człowieka?',
        options: ['2', '3', '4', '5'],
        correctAnswer: '4',
        explanation: 'Serce człowieka składa się z czterech komór: dwóch przedsionków i dwóch komór.',
        points: 1
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'Które z poniższych należą do układu przewodzącego serca?',
        options: ['Węzeł zatokowy', 'Pęczek Hisa', 'Zastawka mitralna', 'Włókna Purkinjego'],
        correctAnswers: ['Węzeł zatokowy', 'Pęczek Hisa', 'Włókna Purkinjego'],
        explanation: 'Układ przewodzący składa się z węzła zatokowego, węzła AV, pęczka Hisa i włókien Purkinjego.',
        points: 2
      },
      {
        id: 'q3',
        type: 'image_question',
        question: 'Wskaż prawą komorę na przedstawionym obrazie serca',
        imageUrl: '/images/heart-diagram.jpg',
        correctArea: { x: 120, y: 150, radius: 30 },
        explanation: 'Prawa komora znajduje się w dolnej prawej części serca.',
        points: 2
      },
      {
        id: 'q4',
        type: 'fill_blank',
        question: 'Zastawka łącząca lewy przedsionek z lewą komorą nazywa się zastawką _____.',
        correctAnswer: 'mitralną',
        alternatives: ['mitralnej', 'dwudzielnej'],
        explanation: 'Zastawka mitralna (dwudzielna) znajduje się między lewym przedsionkiem a lewą komorą.',
        points: 1
      },
      {
        id: 'q5',
        type: 'drag_drop',
        question: 'Przyporządkuj części serca do odpowiednich funkcji',
        items: [
          { id: 'prawy_przedsionek', text: 'Prawy przedsionek' },
          { id: 'lewa_komora', text: 'Lewa komora' },
          { id: 'prawa_komora', text: 'Prawa komora' },
          { id: 'lewy_przedsionek', text: 'Lewy przedsionek' }
        ],
        targets: [
          { id: 'krew_zylna', text: 'Odbiera krew żylną z ciała' },
          { id: 'pompuje_cialo', text: 'Pompuje krew do ciała' },
          { id: 'pompuje_pluca', text: 'Pompuje krew do płuc' },
          { id: 'krew_plucna', text: 'Odbiera krew z płuc' }
        ],
        correctPairs: [
          { item: 'prawy_przedsionek', target: 'krew_zylna' },
          { item: 'lewa_komora', target: 'pompuje_cialo' },
          { item: 'prawa_komora', target: 'pompuje_pluca' },
          { item: 'lewy_przedsionek', target: 'krew_plucna' }
        ],
        points: 3
      }
    ]
  },
  'quiz-cardio-1': {
    id: 'quiz-cardio-1',
    moduleId: '11-module-1',
    title: 'Quiz - Fizjologia serca',
    description: 'Test wiedzy o cyklu sercowym i hemodynamice',
    timeLimit: 15,
    passingScore: 75,
    questions: [
      {
        id: 'qc1',
        type: 'single_choice',
        question: 'Ile trwa normalny cykl sercowy przy częstości 70/min?',
        options: ['0.6 sekundy', '0.8 sekundy', '0.86 sekundy', '1.0 sekunda'],
        correctAnswer: '0.86 sekundy',
        explanation: 'Przy częstości 70/min cykl sercowy trwa około 0.86 sekundy (60s ÷ 70 = 0.86s).',
        points: 1
      },
      {
        id: 'qc2',
        type: 'case_study',
        question: 'Pacjent ma bradykardię 45/min. Oblicz czas trwania jego cyklu sercowego.',
        patientData: {
          heartRate: 45,
          symptoms: ['zmęczenie', 'zawroty głowy']
        },
        correctAnswer: '1.33 sekundy',
        explanation: '60 sekund ÷ 45 uderzeń = 1.33 sekundy na cykl.',
        points: 2
      }
    ]
  },
  'quiz-ekg-1': {
    id: 'quiz-ekg-1',
    moduleId: '101-module-1',
    title: 'Quiz - Podstawy EKG',
    description: 'Test z interpretacji podstawowych zapisów EKG',
    timeLimit: 25,
    passingScore: 80,
    questions: [
      {
        id: 'qe1',
        type: 'ekg_interpretation',
        question: 'Określ rytm przedstawiony na EKG',
        ekgUrl: '/images/ekg-normal-sinus.jpg',
        options: ['Rytm zatokowy', 'Migotanie przedsionków', 'Blok AV III°', 'Tachykardia komorowa'],
        correctAnswer: 'Rytm zatokowy',
        explanation: 'Widoczne są regularne zespoły QRS poprzedzone załamkami P.',
        points: 2
      },
      {
        id: 'qe2',
        type: 'measurement',
        question: 'Zmierz częstość rytmu na przedstawionym EKG',
        ekgUrl: '/images/ekg-bradycardia.jpg',
        correctRange: { min: 48, max: 52 },
        unit: '/min',
        explanation: 'Częstość można obliczyć metodą 300/liczba dużych kratek między zespołami QRS.',
        points: 2
      }
    ]
  }
};

// GET /api/quiz/:id - pobierz quiz
router.get('/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const quizId = req.params.id;
      const quiz = quizData[quizId];
      
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Get user's previous attempts
      const attemptsResult = await db.query(
        'SELECT * FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2 ORDER BY created_at DESC',
        [req.user.id, quizId]
      );
      const attempts = attemptsResult.rows;

      // Remove correct answers from questions (security)
      const quizForClient = {
        ...quiz,
        questions: quiz.questions.map(q => {
          const { correctAnswer, correctAnswers, correctArea, correctPairs, ...questionWithoutAnswers } = q;
          return questionWithoutAnswers;
        })
      };

      res.json({
        quiz: quizForClient,
        userAttempts: attempts?.map(attempt => ({
          id: attempt.id,
          score: attempt.score,
          passed: attempt.passed,
          completedAt: attempt.created_at,
          timeSpent: attempt.time_spent
        })) || [],
        maxAttempts: 3,
        remainingAttempts: Math.max(0, 3 - (attempts?.length || 0))
      });
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ error: 'Failed to fetch quiz' });
    }
  }
);

// POST /api/quiz/:id/submit - prześlij odpowiedzi
router.post('/:id/submit',
  authenticateToken,
  quizLimiter, // 🔒 Rate limiting dla quiz submissions
  validate(schemas.quizSubmission),
  async (req, res) => {
    try {
      const quizId = req.params.id;
      const { answers, startTime, endTime } = req.validatedData;
      
      const quiz = quizData[quizId];
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Check attempt limit
      const attemptsCheckResult = await db.query(
        'SELECT id FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2',
        [req.user.id, quizId]
      );

      if (attemptsCheckResult.rows.length >= 3) {
        return res.status(400).json({ error: 'Maximum attempts exceeded' });
      }

      // Calculate score
      const results = calculateQuizScore(quiz, answers);
      const timeSpent = Math.round((new Date(endTime) - new Date(startTime)) / 1000); // seconds
      const passed = results.score >= quiz.passingScore;

      // Save attempt
      const attemptResult = await db.query(
        `INSERT INTO quiz_attempts (user_id, quiz_id, module_id, answers, score, max_score, passed, time_spent, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
        [req.user.id, quizId, quiz.moduleId, JSON.stringify(answers), results.score, results.maxScore, passed, timeSpent]
      );
      const attempt = attemptResult.rows[0];

      if (!attempt) {
        return res.status(500).json({ error: 'Failed to save quiz attempt' });
      }

      // Update module progress if quiz passed
      if (passed) {
        await db.query(
          `UPDATE user_progress SET quiz_completed = true, last_accessed = NOW()
           WHERE user_id = $1 AND module_id = $2`,
          [req.user.id, quiz.moduleId]
        );
      }

      res.json({
        attemptId: attempt.id,
        score: results.score,
        maxScore: results.maxScore,
        percentage: Math.round((results.score / results.maxScore) * 100),
        passed,
        timeSpent,
        results: results.questionResults,
        feedback: generateQuizFeedback(results.score, quiz.passingScore, passed)
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ error: 'Failed to submit quiz' });
    }
  }
);

// GET /api/quiz/:id/results/:attemptId - wyniki próby
router.get('/:id/results/:attemptId',
  authenticateToken,
  validateUUID('attemptId'), // 🔒 Walidacja UUID
  async (req, res) => {
    try {
      const { id: quizId, attemptId } = req.params;
      
      const attemptResult = await db.query(
        'SELECT * FROM quiz_attempts WHERE id = $1 AND user_id = $2 AND quiz_id = $3 LIMIT 1',
        [attemptId, req.user.id, quizId]
      );
      const attempt = attemptResult.rows[0];

      if (!attempt) {
        return res.status(404).json({ error: 'Quiz attempt not found' });
      }

      const quiz = quizData[quizId];
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Generate detailed results with explanations
      const detailedResults = generateDetailedResults(quiz, attempt.answers);

      res.json({
        attempt: {
          id: attempt.id,
          score: attempt.score,
          maxScore: attempt.max_score,
          percentage: Math.round((attempt.score / attempt.max_score) * 100),
          passed: attempt.passed,
          timeSpent: attempt.time_spent,
          completedAt: attempt.created_at
        },
        results: detailedResults,
        feedback: generateQuizFeedback(attempt.score, quiz.passingScore, attempt.passed)
      });
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      res.status(500).json({ error: 'Failed to fetch quiz results' });
    }
  }
);

// Helper function to calculate quiz score
function calculateQuizScore(quiz, userAnswers) {
  let totalScore = 0;
  let maxScore = 0;
  const questionResults = [];

  quiz.questions.forEach(question => {
    const userAnswer = userAnswers.find(a => a.questionId === question.id);
    maxScore += question.points;
    
    let questionScore = 0;
    let isCorrect = false;

    if (userAnswer) {
      switch (question.type) {
        case 'single_choice':
          isCorrect = userAnswer.answer === question.correctAnswer;
          questionScore = isCorrect ? question.points : 0;
          break;
        
        case 'multiple_choice':
          const userAnswerArray = Array.isArray(userAnswer.answer) ? userAnswer.answer : [userAnswer.answer];
          const correctSet = new Set(question.correctAnswers);
          const userSet = new Set(userAnswerArray);
          
          isCorrect = correctSet.size === userSet.size && 
                     [...correctSet].every(x => userSet.has(x));
          questionScore = isCorrect ? question.points : 0;
          break;
        
        case 'fill_blank':
          const normalizedAnswer = userAnswer.answer.toLowerCase().trim();
          const normalizedCorrect = question.correctAnswer.toLowerCase();
          const alternatives = question.alternatives?.map(alt => alt.toLowerCase()) || [];
          
          isCorrect = normalizedAnswer === normalizedCorrect || 
                     alternatives.includes(normalizedAnswer);
          questionScore = isCorrect ? question.points : 0;
          break;
        
        case 'drag_drop':
          const userPairs = userAnswer.answer;
          let correctPairs = 0;
          
          question.correctPairs.forEach(correctPair => {
            const userPair = userPairs.find(up => 
              up.item === correctPair.item && up.target === correctPair.target
            );
            if (userPair) correctPairs++;
          });
          
          questionScore = (correctPairs / question.correctPairs.length) * question.points;
          isCorrect = correctPairs === question.correctPairs.length;
          break;
        
        default:
          questionScore = 0;
      }
    }

    totalScore += questionScore;
    questionResults.push({
      questionId: question.id,
      score: questionScore,
      maxScore: question.points,
      isCorrect,
      userAnswer: userAnswer?.answer
    });
  });

  return {
    score: Math.round(totalScore * 100) / 100,
    maxScore,
    questionResults
  };
}

// Helper function to generate detailed results
function generateDetailedResults(quiz, userAnswers) {
  return quiz.questions.map(question => {
    const userAnswer = userAnswers.find(a => a.questionId === question.id);
    
    return {
      questionId: question.id,
      question: question.question,
      type: question.type,
      userAnswer: userAnswer?.answer,
      correctAnswer: question.correctAnswer || question.correctAnswers,
      explanation: question.explanation,
      points: question.points,
      imageUrl: question.imageUrl,
      ekgUrl: question.ekgUrl
    };
  });
}

// Helper function to generate feedback
function generateQuizFeedback(score, passingScore, passed) {
  const percentage = Math.round((score / 100) * 100);
  
  if (passed) {
    if (percentage >= 90) {
      return {
        level: 'excellent',
        message: 'Doskonały wynik! Masz bardzo dobrą znajomość tematu.',
        recommendations: ['Możesz przejść do kolejnego modułu', 'Rozważ podjęcie bardziej zaawansowanych tematów']
      };
    } else if (percentage >= 80) {
      return {
        level: 'good',
        message: 'Bardzo dobry wynik! Opanowałeś większość materiału.',
        recommendations: ['Przejrzyj pytania, na które odpowiedziałeś niepoprawnie', 'Możesz kontynuować dalszą naukę']
      };
    } else {
      return {
        level: 'pass',
        message: 'Gratulacje! Zdałeś quiz.',
        recommendations: ['Powtórz materiał z pytań, które sprawiły Ci trudność', 'Upewnij się, że rozumiesz wszystkie zagadnienia']
      };
    }
  } else {
    return {
      level: 'fail',
      message: 'Nie osiągnąłeś wymaganego minimum punktowego. Nie poddawaj się!',
      recommendations: [
        'Przeczytaj ponownie materiały z modułu',
        'Zwróć szczególną uwagę na zagadnienia z pytań, które sprawiły Ci trudność',
        'Spróbuj ponownie za kilka dni'
      ]
    };
  }
}

module.exports = router;