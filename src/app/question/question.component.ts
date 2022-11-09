import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

import { QuestionServiceService } from '../service/question-service.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public questionList : any = [];
  public currentQuestion : number = 0;
  public  points : number =0;
  public counter:  number = 60;
  public name:string ="";
  correctanswer : number =0;
  incorrectanswer : number =0;
  interval$:any;
  progress:string ="0";
  isQuizCompleted: boolean =false;
  constructor(private questionService : QuestionServiceService) { 

  }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionJson().subscribe(res=>{
      this.questionList = res.questions;
    })

  }

  nextQuestion() {
    this.currentQuestion ++;


  }
  previousQuestion()
  {
    this.currentQuestion --;

  }

  answer(currentQno:number, option:any){
    if( currentQno === this.questionList.length)
    {
      this.isQuizCompleted = true;
      this.stopCounter();
    }
    if(option.correct){
      this.points +=10;    
      this.correctanswer ++; 
      setTimeout(() => {    
        this.currentQuestion++;
        this.resetCounter();
        this.getprogressPercent();
      }, 1000);
     
    } else {      
 setTimeout(() => {
  this.currentQuestion ++;
 this.incorrectanswer ++;
 this.resetCounter();
 this.getprogressPercent();
 }, 1000);
 this.points -= 10;
    }
  }
  startCounter()
  {
    this.interval$ = interval(1000).subscribe(val =>{
      this.counter --;
      if( this.counter ==-0){
        this.currentQuestion ++;
        this.counter =60;
        this.points -=10;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);

  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter =0;
  }
  resetCounter(){
this.stopCounter();
this.counter = 60;
this.startCounter();
this.progress="0";
  }
  resetQuiz(){
   this.resetCounter();
   this.getAllQuestions();
   this.points =0;
   this.counter =60;
   this.currentQuestion =0;
  }
  getprogressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length) * 100).toString();
    return this.progress;
  }
}
