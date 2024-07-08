import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import {AppComponent} from '../app.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  user =''
  constructor(private route:ActivatedRoute) { }

  message = 'some welcome message'
  ngOnInit(): void {
    this.user = this.route.snapshot.params['name']
  }
    

}

export class class1{

}
export class class2{

}
