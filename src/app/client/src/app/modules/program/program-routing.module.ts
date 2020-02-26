import { ProgramsService } from '@sunbird/core';
import { ListAllProgramsComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent, CreateProgramComponent } from './components';

const routes: Routes = [{
  path: '', component: ListAllProgramsComponent, canActivate: [ProgramsService],
  data: {
    telemetry: {
      env: 'contribute', pageid: 'programs-list', type: 'view', subtype: 'paginate'
    }
  }
},
{
  path: 'program/:programId', component: ProgramComponent,
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  }
},
{
  path: 'program/create', component: CreateProgramComponent,
  data: {
  }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
