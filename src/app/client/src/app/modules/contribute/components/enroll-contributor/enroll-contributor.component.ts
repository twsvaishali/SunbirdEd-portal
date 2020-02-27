import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enroll-contributor',
  templateUrl: './enroll-contributor.component.html',
  styleUrls: ['./enroll-contributor.component.scss']
})
export class EnrollContributorComponent implements OnInit {
  contributorType = 'individual';

  constructor() { }

  ngOnInit(): void {
  }

}
