//Global vars
let score = 0;
let questions = [];
let wins = localStorage.getItem("wins");
let losses = localStorage.getItem("losses");
let totalPlays = localStorage.getItem("plays");

//Event listeners
document.querySelector("#startQuiz").addEventListener("click", startQuiz);
document.querySelector("#submitBtn").addEventListener("click", checkAnswers);
document.querySelector("#restartBtn").addEventListener("click", restartQuiz);

//==============================

function welcome(){
	hideQuiz();
}

function initializeQuiz(){
	document.querySelector("#quiz").style.display = "inline";
	document.querySelector("#submitBtn").style.display="inline";
	score = 0;
	addQuestions();
	for(let i=0;i<questions.length;i++){
		questions[i].displayQuestion(document.querySelector("#question"+(i+1)),i+1);
	}
}

function hideQuiz(){
	document.querySelector("#quiz").style.display = "none";
	document.querySelector("#submitBtn").style.display="none";
}

function startQuiz(){
	document.querySelector("#welcome").style.display = "none";
	document.querySelector("#startQuiz").style.display = "none";
	document.querySelector("#goodScoreMsg").style.display="none";
	
	document.querySelector("#quiz").style.display = "inline";
	document.querySelector("#submitBtn").style.display="inline";
}

function restartQuiz(){
	location.reload();
}

function finishGame(){
	if(score >= 80){
		wins++;
	}else{
		losses++;
	}
	
	totalPlays++;
	localStorage.setItem("wins", wins);
	localStorage.setItem("losses", losses);
	localStorage.setItem("plays", totalPlays);
	
	
	document.querySelector("#score").style.display="inline";
	document.querySelector("#scoreLabel").textContent = score+"/100";
	if(score > 80){
		document.querySelector("#goodScoreMsg").style.display="inline";
	}
}

function checkAnswers(){
	document.querySelector("#submitBtn").style.display="none";
	for(let i=0;i<questions.length;i++){
		if(questions[i].checkCorrect("question"+(i+1), i+1)){
			score += 10;
		}
	}
	
	finishGame();
}

class DropdownQuestion {
	constructor(question, answers){
		this.question = question;
		this.answers = answers;
		this.scrambleAnswers();
	}
	
	checkCorrect(id, num){
		let selections = document.getElementsByName(id);
		let val = parseInt(selections[0].value);
		if(val < 0) return false;
		return this.answers[val].isCorrect;
	}
	
	scrambleAnswers(){
		for(let i=0;i<10;i++){
			let rand = Math.floor(Math.random()*3)+1;
			[this.answers[0], this.answers[rand]]=[this.answers[rand], this.answers[0]]
		}
	}
	
	displayQuestion(container, number){
		container.innerHTML = `
		<h5>Question ${number}</h5>
		<h4>${this.question}</h4>
		<form>
			<div class = "row">
				<select name="question${number}" id="question${number}>
					<option value="-1"></option>
					<option value="0">${this.answers[0].text}</option>
					<option value="1">${this.answers[1].text}</option>
					<option value="2">${this.answers[2].text}</option>
					<option value="3">${this.answers[3].text}</option>
					<option value="3">${this.answers[4].text}</option>
				</select>
				<label id="feedback${number}" class="hidden text-warning"></label>
			</div>
		</form>`;
	}
}

class CheckboxQuestion {
	constructor(question, answers){
		this.question = question;
		this.answers = answers;
		this.scrambleAnswers();
	}
	
	checkCorrect(id, num){
		let selections = document.getElementsByName(id);
		let wrongAnswers = 0;
		for(let i=0;i<selections.length;i++){
			selections[i].disabled = true;
			let feedback = document.querySelector("#feedback"+num+"-"+i)
			feedback.style.display="inline";
			if(this.answers[i].isCorrect){
				if(selections[i].checked){
					feedback.textContent = this.answers[i].feedback;
					continue;
				}
				feedback.textContent = "Wrong.";
				wrongAnswers++;
			console.log("#feedback"+num+"-"+i);
			}else{
				if(selections[i].checked){
					wrongAnswers++;
					feedback.textContent = "Wrong.";
					console.log("#feedback"+num+"-"+i);
				}
				feedback.textContent = "Correct."
			}
		}
		
		return wrongAnswers < 1 ? true : false;
	}
	
	
	scrambleAnswers(){
		for(let i=0;i<10;i++){
			let rand = Math.floor(Math.random()*3)+1;
			[this.answers[0], this.answers[rand]]=[this.answers[rand], this.answers[0]]
		}
	}
	
	displayQuestion(container, number){
		container.innerHTML = `
		<h5>Question ${number}</h5>
		<h4>${this.question}</h4>
		<form>
			<div class="row">
				<label><input type="checkbox" name="question${number}" value="0"> ${this.answers[0].text}<label id="feedback${number}-0" class="hidden text-warning">${this.answers[0].feedback}</label></label>
				<label><input type="checkbox" name="question${number}" value="1"> ${this.answers[1].text}<label id="feedback${number}-1" class="hidden text-warning">${this.answers[1].feedback}</label></label>
				<label><input type="checkbox" name="question${number}" value="2"> ${this.answers[2].text}<label id="feedback${number}-2" class="hidden text-warning">${this.answers[2].feedback}</label></label>
				<label><input type="checkbox" name="question${number}" value="3"> ${this.answers[3].text}<label id="feedback${number}-3" class="hidden text-warning">${this.answers[3].feedback}</label></label>
				<label><input type="checkbox" name="question${number}" value="4"> ${this.answers[4].text}<label id="feedback${number}-4" class="hidden text-warning">${this.answers[4].feedback}</label></label>
				<label><input type="checkbox" name="question${number}" value="5"> ${this.answers[5].text}<label id="feedback${number}-5" class="hidden text-warning">${this.answers[5].feedback}</label></label>
			</div>
		</form>`;
	}
}

class RangeQuestion {
	constructor(question, answer, feedback){
		this.question = question;
		this.answer = answer;
		this.feedback = feedback;
	}
	
	checkCorrect(id, num){
		let range = document.getElementsByName(id);
		let feedback = document.querySelector("#feedback"+num);
		let val = range[0].value;
		feedback.textContent = val === this.answer.text ? this.answer.feedback : this.feedback;
		feedback.style.display="inline";
		range[0].disabled = true;
		return val === this.answer.text;
	}
	
	displayQuestion(container, number){
		container.innerHTML = `
		<h5>Question ${number}</h5>
		<h4>${this.question}</h4>
		<form>
			<div class = "row">
				<blockquote id="rangeVal">0</blockquote>
				<label><input type="range" step=1 min=0 max=100 value=0 name="question${number}"></label>
				<label id="feedback${number}" class="hidden text-warning"></label>
			</div>
		</form>`;
		
		let sliders = document.getElementsByName("question"+number);
		let slider = sliders[0];
		let rangeVal = document.querySelector("#rangeVal");
		
		slider.addEventListener("input", () => {rangeVal.textContent = slider.value});
	}
}

class TextQuestion {
	constructor(question, answer, feedback){
		this.question = question;
		this.answer = answer;
		this.feedback = feedback;
	}
	
	checkCorrect(id, num){
		let selected = document.getElementsByName(id);
		let val = selected[0].value;
		selected[0].disabled = true;
		let feedback = document.querySelector("#feedback"+num);
		
		let finalAnswer = val.toLowerCase() === this.answer.text.toLowerCase();
		
		feedback.textContent = finalAnswer ? this.answer.feedback : this.feedback;
		feedback.style.display = "inline";
		return finalAnswer;
	}
	
	displayQuestion(container, number){
		container.innerHTML = `
		<h5>Question ${number}</h5>
		<h4>${this.question}</h4>
		<form>
			<div class = "row">
				<label><input type="text" id="question${number}" name="question${number}"></label>
				<label id="feedback${number}" class="hidden text-warning"></label>
			</div>
		</form>`;
	}
}

class NumberQuestion {
	constructor(question, answer, feedback){
		this.question = question;
		this.answer = answer;
		this.feedback = feedback;
	}
	
	checkCorrect(id, number){
		let selected = document.getElementsByName(id);
		let val = selected[0]["value"];
		let feedback = document.querySelector("#feedback"+number);
		feedback.textContent = val == this.answer ? this.answer.feedback : this.feedback;
		feedback.style.display = "inline";
		
		selected.disabled = true;
		return val == this.answer;
	}
	
	displayQuestion(container, number){
		container.innerHTML = `
		<h5>Question ${number}</h5>
		<h4>${this.question}</h4>
		<form>
			<div class = "row">
				<label><input type="number" min=0 max=100 value=0 name="question${number}"></label>
				<label id="feedback${number}" class="hidden text-warning"></label>
			</div>
		</form>`;
	}
}

class Question {
	constructor(question, answer1, answer2, answer3, answer4){
		this.question = question;
		this.answers = [answer1,answer2,answer3,answer4];
		this.scrambleAnswers();
	}
	
	scrambleAnswers(){
		for(let i=0;i<10;i++){
			let rand = Math.floor(Math.random()*3)+1;
			[this.answers[0], this.answers[rand]]=[this.answers[rand], this.answers[0]]
		}
	}
	
	checkCorrect(id, number){
		
		let radios = document.getElementsByName(id);
		let desiredVal = 0;
		for(let i=0;i<radios.length;i++){
			radios[i].disabled = true;
			if(radios[i].checked){
				desiredVal = i-1;
				continue;
			}
		}
		if(desiredVal < 0) return false;
		let feedback = document.querySelector("#feedback"+number+"-"+desiredVal);
		feedback.textContent = this.answers[desiredVal].feedback;
		feedback.style.display="inline";
		
		return this.answers[desiredVal].isCorrect;
	}
	
	displayQuestion(container, number){
		container.innerHTML = `
		<h5>Question ${number}</h5>
		<h4>${this.question}</h4>
		<form>
			<div class = "row">
				<label><input type="radio" name="question${number}" value="-1" class="hidden" checked="checked"></label>
				<label><input type="radio" name="question${number}" value="0"> ${this.answers[0].text}
				<label id="feedback${number}-0" class="hidden text-warning"></label>
				</label>
				<label><input type="radio" name="question${number}" value="1"> ${this.answers[1].text}
				<label id="feedback${number}-1" class="hidden text-warning"></label>
				</label>
				<label><input type="radio" name="question${number}" value="2"> ${this.answers[2].text}
				<label id="feedback${number}-2" class="hidden text-warning"></label>
				</label>
				<label><input type="radio" name="question${number}" value="3"> ${this.answers[3].text}
				<label id="feedback${number}-3" class="hidden text-warning"></label>
				</label>
				<label id="feedback${number}-4" class="hidden text-warning"></label>
			</div>
		</form>`;
	}
}

class Answer {
	constructor(text, feedback, isCorrect=false){
		this.text = text;
		this.feedback = feedback;
		this.isCorrect = isCorrect;
	}
}

//Questions
function addQuestions(){
	questions.push(
			new Question(
			"Which state has the largest surface area?",
			new Answer("Alaska", "Correct! Alaska is 665,384 sq. miles. While the the second biggest is Texas at 268,596 sq. miles.", true),
			new Answer("Texas", "Wrong. Texas is at 268,596 sq. miles, which is behind the first place, Alaska, at 665,384 sq. miles."),
			new Answer("California", "Wrong. California is at 163,696 sq. miles while Alaska is at 665,384 sq. miles."),
			new Answer("Florida", "Wrong. Florida is at 65,758 sq miles, while the largest, Alaska, is at 665,384 sq. miles.")
			),
			new Question(
			"Which state is the White House located in?",
			new Answer("None", "Correct! While it's within Maryland and borders Virginia, it is in fact a stateless location as it is a federal district.", true),
			new Answer("Virginia", "Wrong. The white house is located in Washington, D.C., which is a federal district and is not a part of any state."),
			new Answer("Maryland", "Wrong. The white house is located in Washington, D.C., which is a federal district and is not a part of any state."),
			new Answer("Washington", "Wrong. You might've confused the state of Washington for the federal district Washington, D.C. The white house is located in Washington, D.C., which is a federal district and is not a part of any state.")
			),
			new Question(
			"Which state is the Grand Canyon located?",
			new Answer("Arizona", "Correct! The Grand Canyon is indeed located here!", true),
			new Answer("Utah", "Wrong. While it is close, it being near the southern border of Utah. The correct answer is Arizona."),
			new Answer("Texas", "Wrong. While Texas is dry state and features rocky locations on it's Western edge, it is not where it is located. The correct answer is Arizona."),
			new Answer("Michigan", "Wrong. Michigan is well known for being near the Great Lakes, not the Grand Canyon. The correct answer is Arizona.")
			),
			new Question(
			"The longest river in the US is the ______ River.",
			new Answer("Missouri","Correct! It is the longest river at 2,540 miles long.",true),
			new Answer("Mississippi","Wrong. You are close, but the river is 2,340 miles long, that being 200 miles shorter than the answer, Missouri."),
			new Answer("Wisconsin", "Wrong. The Wisconsin River is 430 miles, where the answer, Missouri, is at 2,540 miles long."),
			new Answer("Rhode Island", "Wrong. There is not Rhode Island river, but the longest river there is the Blackstone River at 48 miles long. The answer is Missouri at 2,540 miles.")),
			new Question(
			"Which state has the highest population of people?",
			new Answer("California", "Correct! California is the largest in population size, containing about 12% of the American population.", true),
			new Answer("Texas", "Wrong. Texas contains about 9% of the US population, that's 3% less than the answer, California."),
			new Answer("Florida", "Wrong. Florida contains about 7% of the US population, that's 5% less than the answer, California."),
			new Answer("New York", "Wrong. Florida contains about 6% of the US population, about half of the answer, California.")),
			new NumberQuestion(
			"How many states are there in the US?",
			"50",
			"Wrong. There are 50 states in the US."),
			new CheckboxQuestion(
			"Which of these states are in the east coast of the US?",
			[new Answer("Rhode Island", "Correct!",true),
			new Answer("California", "Wrong."),
			new Answer("Georgia", "Correct!",true),
			new Answer("New York", "Correct!",true),
			new Answer("North Dakota", "Wrong."),
			new Answer("Louisiana", "Wrong.")]
			),
			new DropdownQuestion(
			"Which state produces the most oil in the US?",
			[new Answer("Texas", "Correct!", true),
			new Answer("California", "Wrong. The answer is Texas."),
			new Answer("Alaska", "Wrong. The answer is Texas."),
			new Answer("West Virginia", "Wrong. The answer is Texas."),
			new Answer("Oklahoma", "Wrong. The answer is Texas.")]
			),
			new TextQuestion(
			"What state has has the capital city of Sacramento?",
			new Answer("California", "Correct!", true),
			"Wrong. The answer is California."
			),
			new RangeQuestion(
			"How many of the original colonies formed the United States?",
			new Answer("13", "Correct!", true),
			"Wrong. The answer are the 13 Colonies.")
	);
}

initializeQuiz();
welcome();