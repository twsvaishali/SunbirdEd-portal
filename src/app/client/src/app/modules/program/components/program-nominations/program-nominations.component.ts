import { ResourceService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { ProgramsService, PublicDataService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ListNominationsComponent } from '../list-nominations/list-nominations.component';

import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-program-nominations',
  templateUrl: './program-nominations.component.html',
  styleUrls: ['./program-nominations.component.scss']
})
export class ProgramNominationsComponent implements OnInit, AfterViewInit {
  component = ListNominationsComponent;
  inputs = {
    nominations: [{"contributor_id":"1234", "contributor_name": "Pratham", "type": "Organisation", "website": "www.pratham.org"}, {"contributor_id":"1245", "contributor_name": "Mahesh", "type": "Individual"}, {"contributor_id":"hhd_898", "contributor_name": "John", "type": "Individual"}],
  };
  outputs = {
    onApprove: (nomination) => console.log("onApprove", nomination),
    onReject: (nomination) => console.log("onReject", nomination),
  };

  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private config: ConfigService, private publicDataService: PublicDataService,
    private activatedRoute: ActivatedRoute, private router: Router, private navigationHelperService: NavigationHelperService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
}
