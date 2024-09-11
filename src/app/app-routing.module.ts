import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./core-component/core-component.module').then(
  //       (m) => m.CoreComponentModule
  //     ),
  // },
  {
    path: '',
    loadChildren: () =>
      import('./view/view.module').then(
        (m) => m.ViewModule
      ),
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./view/customers/home-page/home-page.module').then((m) => m.HomePageModule),
  }
  // {
  //   path: '**',
  //   redirectTo: 'errorpages/error404',
  //   pathMatch: 'full',
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
