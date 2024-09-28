import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';

const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'add-user',
        loadChildren: () =>
          import('./adduser/adduser.module').then((m) => m.AdduserModule),
      },
      {
        path: 'user-lists',
        loadChildren: () =>
          import('./userlists/userlists.module').then((m) => m.UserlistsModule),
      },
      {
        path: 'user-privilege',
        loadChildren: () =>
          import('./user-privilege/user-privilege.module').then((m) => m.UserPrivilegeModule),
      },
      {
        path: 'update-profile',
        loadChildren: () =>
          import('./updateprofile/updateprofile.module').then((m) => m.UpdateprofileModule),
      },
      {
        path: 'add-vehicle',
        loadChildren: () =>
          import('./managevehicles/managevehicles.module').then((m) => m.ManagevehiclesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
