import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  constructor() { }

  ngOnInit() {

  }

  selected(id) {
    // if (id !== 2) {
      const elements = document.getElementsByClassName('nav-link');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 1 ; i <= elements.length; i++) {
        if (i !== id) {
          document.getElementsByClassName('nav-link')[i].classList.remove('active');
        } else {
          document.getElementsByClassName('nav-link')[i].classList.add('active');
        }
      }
    //}
  }

}
