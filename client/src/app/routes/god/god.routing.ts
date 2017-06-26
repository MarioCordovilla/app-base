import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GodHomeComponent } from 'app/routes/god/god-home/god-home.component';
import { GodOrganizationsComponent } from 'app/routes/god/god-organizations/god-organizations.component';
import { GodBigbangComponent } from 'app/routes/god/god-bigbang/bigbang.component';
import { UsersComponent } from 'app/routes/god/users/users.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'organizations',
    pathMatch: 'full'
  },
  {
    path: 'bigbang',
    component: GodBigbangComponent
  },
  {
    path: 'organizations',
    component: GodOrganizationsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GodRoutingModule { }