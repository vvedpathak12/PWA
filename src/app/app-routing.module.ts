import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleComponent } from './sample/sample.component';
import { Sample2Component } from './sample2/sample2.component';

const routes: Routes = [
  {
    path: '',
    component: SampleComponent
  },
  {
    path: 'sample1',
    component: SampleComponent
  },
  {
    path: 'sample2',
    component: Sample2Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
