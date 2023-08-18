// get elements
let indecators = document.querySelector(".indecators"),
  startExam = document.querySelector(".start-exam"),
  examBox = document.querySelector(".exam-box"),
  timeLeft = document.querySelector(".time"),
  next = document.querySelector(".controls .next"),
  answers = document.querySelectorAll(".answers .answer"),
  theQuestion = document.querySelector(".question span"),
  result = document.querySelector(".result");

let interval;
// fetch json
fetch("./questions.json")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    let randomQuesNum,
      finalResult = data.math.length;

    // start(show) exam button function
    startExam.onclick = () => {
      startExam.remove();
      examBox.classList.add("show");
      //set Indecators fun
      setIndecators(data);
      // get Questions from json
      getQuestions(data);
    };

    // get Questions from json
    let doneIndecator = 0;

    function getQuestions(e) {
      randomQuesNum = Math.floor(Math.random() * e.math.length);
      clearInterval(interval);

      // add done effect on bullets
      let indecatorSpan = document.querySelectorAll(".indecators span");
      indecatorSpan.forEach((e, ind) => {
        if (doneIndecator == ind) {
          e.classList.add("done");
        }
      });
      doneIndecator++;

      // empty question
      theQuestion.innerHTML = "";
      // // set time
      timeLeft.innerHTML = 3;
      // append the question
      theQuestion.innerHTML = e.math[randomQuesNum].question;
      // call answers fun
      getAnswers(e, randomQuesNum);
      // compaire answer with user selection
      currectAnswer(e, correct, randomQuesNum, finalResult);
      // prevent enter on next button when questions finish
      if (data.math.length == 1) {
        next.classList.add("end");
      }
    }

    // on select answer
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("answer")) {
        removeSelectedClass();
        e.target.parentElement.classList.add("selected");
      }
    });

    //next button
    let correct = 0;
    next.onclick = () => {
      answers.forEach((answer) => {
        if (answer.parentElement.classList.contains("selected")) {
          if (answer.innerHTML == data.math[randomQuesNum].curAnswer) {
            correct++;
          }
        }
      });
      removeSelectedClass();
      data.math.splice(randomQuesNum, 1);
      getQuestions(data);
    };
  });

// get Answers from json
function getAnswers(e, numberOfQuestion) {
  let count = 1;

  // empty answers span and set answers
  answers.forEach((answer) => {
    answer.innerHTML = e.math[numberOfQuestion][`answer${count}`];
    count++;
  });
}

//set Indecators fun
function setIndecators(e) {
  for (let i = 1; i <= e.math.length; i++) {
    let span = document.createElement("span");
    indecators.appendChild(span);
  }
}

// remove select class from all fun
function removeSelectedClass() {
  answers.forEach((answer) => {
    answer.parentElement.classList.remove("selected");
  });
}

function currectAnswer(e, correctAnswers, no, questionCount) {
  interval = setInterval(() => {
    timeLeft.innerHTML--;
    if (timeLeft.innerHTML < "0") {
      clearInterval(interval);
      answers.forEach((answer) => {
        if (answer.parentElement.classList.contains("selected")) {
          if (answer.innerHTML == e.math[no].curAnswer) {
            correctAnswers++;
          }
        }
      });
      if (e.math.length == "1") {
        result.innerHTML = `Your Result: ${correctAnswers} of ${questionCount}`;
        result.classList.add("show");
        examBox.classList.remove("show");
        document.body.className = "finish";
      }
      if (e.math.length > "1") {
        next.click();
      }
    }
  }, 1000);
}